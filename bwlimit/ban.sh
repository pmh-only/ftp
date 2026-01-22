#!/bin/bash
set -eu

NETFLOW_DIR="${NETFLOW_DIR:-/data}"
THRESHOLD_BYTES="${THRESHOLD_BYTES:-5368709120}" # 5 GiB
INTERVAL_SEC="${INTERVAL_SEC:-60}"
IPSET_NAME="${IPSET_NAME:-ban_egress_dst}"      # base name; script will create ${IPSET_NAME}4 and ${IPSET_NAME}6
STATE_DIR="${STATE_DIR:-/var/lib/netflow-ban}"

IPSET_V4="${IPSET_NAME}4"
IPSET_V6="${IPSET_NAME}6"

mkdir -p "$STATE_DIR"

# Create IPv4 + IPv6 sets
ipset create "$IPSET_V4" hash:ip family inet  -exist
ipset create "$IPSET_V6" hash:ip family inet6 -exist

ensure_rule_v4() {
  local chain="$1"
  # If chain doesn't exist, skip quietly
  iptables -S "$chain" >/dev/null 2>&1 || return 0

  iptables -C "$chain" -m set --match-set "$IPSET_V4" dst -j DROP 2>/dev/null || \
    iptables -I "$chain" 1 -m set --match-set "$IPSET_V4" dst -j DROP
}

ensure_rule_v6() {
  local chain="$1"
  # If chain doesn't exist, skip quietly
  ip6tables -S "$chain" >/dev/null 2>&1 || return 0

  ip6tables -C "$chain" -m set --match-set "$IPSET_V6" dst -j DROP 2>/dev/null || \
    ip6tables -I "$chain" 1 -m set --match-set "$IPSET_V6" dst -j DROP
}

# Kube-router chains (IPv4 + IPv6)
ensure_rule_v4 KUBE-ROUTER-FORWARD
ensure_rule_v4 KUBE-ROUTER-OUTPUT
ensure_rule_v6 KUBE-ROUTER-FORWARD
ensure_rule_v6 KUBE-ROUTER-OUTPUT

last_day="$(date +%Y%m%d)"

echo "[ban] start threshold=${THRESHOLD_BYTES}B per-day interval=${INTERVAL_SEC}s dir=${NETFLOW_DIR} ipset4=${IPSET_V4} ipset6=${IPSET_V6} state=${STATE_DIR} (auto-unban at midnight)"

cleanup_old_files() {
  local current_day="$(date +%Y%m%d)"

  find "$STATE_DIR" -name "stats_*.txt" -type f | while read -r file; do
    local fname
    fname=$(basename "$file")
    local file_day="${fname:6:8}"

    if [ "$file_day" != "$current_day" ]; then
      rm -f "$file"
      echo "removed old state file: $file"
    fi
  done
}

cleanup_netflow_files() {
  local cutoff_time
  cutoff_time=$(($(date +%s) - ${INTERVAL_SEC}))

  find "$NETFLOW_DIR" -type f -name "nfcapd.*" ! -name "*current*" | while read -r file; do
    local file_mtime
    file_mtime=$(stat -c %Y "$file" 2>/dev/null || echo 0)

    if [ "$file_mtime" -lt "$cutoff_time" ]; then
      rm -f "$file"
      echo "removed old netflow file: $file"
    fi
  done
}

get_state_file() {
  local current_day="$(date +%Y%m%d)"
  echo "${STATE_DIR}/stats_${current_day}.txt"
}

is_ipv4() {
  # Strict-enough IPv4 format check
  [[ "$1" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]
}

is_ipv6() {
  # Accept common IPv6 textual forms (including :: compression and v4-mapped)
  [[ "$1" == *:* ]]
}

update_minute_stats() {
  local state_file
  state_file=$(get_state_file)

  # Skip if no netflow files exist
  if ! find "$NETFLOW_DIR" -type f -name "nfcapd.*" ! -name "*current*" -print -quit | grep -q .; then
    echo "no netflow files found, skipping"
    return 0
  fi

  local end start
  end="$(date +%Y/%m/%d.%H:%M)"
  start="$(date -d "${INTERVAL_SEC} seconds ago" +%Y/%m/%d.%H:%M)"

  echo "querying nfdump from $start to $end"

  # Expect: dstip in column 5, bytes in column 10 (per your original script)
  local out
  out="$(nfdump -R "$NETFLOW_DIR" -t "${start}-${end}" -s dstip -n 0 -o csv 2>/dev/null | awk -F, '{if (NR>1 && NF>=10) print $5, $10}' || true)"

  declare -A current_bytes

  while read -r itemstr; do
    [ -z "$itemstr" ] && continue

    items=($itemstr)
    ip=${items[0]:-}
    bytes=${items[1]:-}

    [ -z "$ip" ] && continue
    [ -z "$bytes" ] && continue
    [[ ! "$bytes" =~ ^[0-9]+$ ]] && continue

    # Keep only things that look like IPs (v4 or v6)
    if ! is_ipv4 "$ip" && ! is_ipv6 "$ip"; then
      continue
    fi

    current_bytes["$ip"]=$bytes
  done < <(printf '%s\n' "$out")

  set +u
  local num_ips=${#current_bytes[@]}
  set -u

  echo "found $num_ips unique IPs in current interval"

  > "${state_file}.tmp"

  # Merge with existing state
  if [ -f "$state_file" ]; then
    echo "merging with existing state ($(wc -l < "$state_file") entries)"

    set +u
    while IFS=',' read -r ip cumulative_bytes; do
      [ -z "$ip" ] && continue
      [[ ! "$cumulative_bytes" =~ ^[0-9]+$ ]] && continue

      if [ $num_ips -gt 0 ] && [[ -n "${current_bytes[$ip]+isset}" ]]; then
        cumulative_bytes=$((cumulative_bytes + current_bytes["$ip"]))
        unset current_bytes["$ip"]
      fi

      echo "${ip},${cumulative_bytes}"
    done < "$state_file" >> "${state_file}.tmp"
    set -u
  fi

  # Add any new IPs from current interval
  if [ $num_ips -gt 0 ]; then
    set +u
    for ip in "${!current_bytes[@]}"; do
      echo "${ip},${current_bytes[$ip]}"
    done >> "${state_file}.tmp"
    set -u
  fi

  mv "${state_file}.tmp" "$state_file"

  echo "state file now has $(wc -l < "$state_file") entries"
}

ban_ip() {
  local ip="$1"
  local cumulative_bytes="$2"

  if is_ipv6 "$ip"; then
    if ! ipset test "$IPSET_V6" "$ip" 2>/dev/null; then
      ipset add "$IPSET_V6" "$ip" -exist
      conntrack -f ipv6 -D -d "$ip" 2>/dev/null || true
      echo "[ban] $(date -Is) added dst=${ip} (ipv6) cumulative_bytes=${cumulative_bytes}"
    fi
  else
    # treat everything else as IPv4 (after basic validation upstream)
    if ! ipset test "$IPSET_V4" "$ip" 2>/dev/null; then
      ipset add "$IPSET_V4" "$ip" -exist
      conntrack -f ipv4 -D -d "$ip" 2>/dev/null || true
      echo "[ban] $(date -Is) added dst=${ip} (ipv4) cumulative_bytes=${cumulative_bytes}"
    fi
  fi
}

check_and_ban() {
  local state_file
  state_file=$(get_state_file)

  [ ! -f "$state_file" ] && return

  while IFS=',' read -r ip cumulative_bytes; do
    [ -z "$ip" ] && continue
    [ -z "$cumulative_bytes" ] && continue
    [[ ! "$cumulative_bytes" =~ ^[0-9]+$ ]] && continue

    # Only act on valid-ish IP strings
    if ! is_ipv4 "$ip" && ! is_ipv6 "$ip"; then
      continue
    fi

    if [ "$cumulative_bytes" -ge "$THRESHOLD_BYTES" ]; then
      ban_ip "$ip" "$cumulative_bytes"
    fi
  done < "$state_file"
}

while true; do
  day="$(date +%Y%m%d)"
  if [ "$day" != "$last_day" ]; then
    ipset flush "$IPSET_V4" || true
    ipset flush "$IPSET_V6" || true
    cleanup_old_files
    echo "[ban] $(date -Is) midnight rollover: flushed ipset4=${IPSET_V4} ipset6=${IPSET_V6}"
    last_day="$day"
  fi

  update_minute_stats
  check_and_ban
  cleanup_netflow_files

  sleep "$INTERVAL_SEC"
done
