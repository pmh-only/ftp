#!/bin/bash
set -eu

NETFLOW_DIR="${NETFLOW_DIR:-/data}"
THRESHOLD_BYTES="${THRESHOLD_BYTES:-5368709120}" # 5 GiB
INTERVAL_SEC="${INTERVAL_SEC:-60}"
IPSET_NAME="${IPSET_NAME:-ban_egress_dst}"
STATE_DIR="${STATE_DIR:-/var/lib/netflow-ban}"
DEBUG="${DEBUG:-0}"

mkdir -p "$STATE_DIR"

ipset create "$IPSET_NAME" hash:ip -exist

iptables -C KUBE-ROUTER-FORWARD -m set --match-set "$IPSET_NAME" dst -j DROP 2>/dev/null || \
  iptables -I KUBE-ROUTER-FORWARD 1 -m set --match-set "$IPSET_NAME" dst -j DROP

iptables -C KUBE-ROUTER-OUTPUT  -m set --match-set "$IPSET_NAME" dst -j DROP 2>/dev/null || \
  iptables -I KUBE-ROUTER-OUTPUT 1 -m set --match-set "$IPSET_NAME" dst -j DROP

last_day="$(date +%Y%m%d)"

echo "[ban] start threshold=${THRESHOLD_BYTES}B per-day interval=${INTERVAL_SEC}s dir=${NETFLOW_DIR} ipset=${IPSET_NAME} state=${STATE_DIR} (auto-unban at midnight)"

cleanup_old_files() {
  local current_day="$(date +%Y%m%d)"
  
  find "$STATE_DIR" -name "stats_*.txt" -type f | while read -r file; do
    local fname=$(basename "$file")
    local file_day="${fname:6:8}"
    
    if [ "$file_day" != "$current_day" ]; then
      rm -f "$file"
      [ "$DEBUG" = "1" ] && echo "[debug] removed old state file: $file"
    fi
  done
}

cleanup_netflow_files() {
  local cutoff_time=$(($(date +%s) - ${INTERVAL_SEC}))
  
  find "$NETFLOW_DIR" -type f -name "nfcapd.*" ! -name "*current*" | while read -r file; do
    local file_mtime=$(stat -c %Y "$file" 2>/dev/null || echo 0)
    
    if [ "$file_mtime" -lt "$cutoff_time" ]; then
      rm -f "$file"
      [ "$DEBUG" = "1" ] && echo "[debug] removed old netflow file: $file"
    fi
  done
}

get_state_file() {
  local current_day="$(date +%Y%m%d)"
  echo "${STATE_DIR}/stats_${current_day}.txt"
}

update_minute_stats() {
  local state_file=$(get_state_file)
  
  # Skip if no netflow files exist
  if ! find "$NETFLOW_DIR" -type f -name "nfcapd.*" ! -name "*current*" -print -quit | grep -q .; then
    [ "$DEBUG" = "1" ] && echo "[debug] no netflow files found, skipping"
    return 0
  fi
  
  local end="$(date +%Y/%m/%d.%H:%M)"
  local start="$(date -d "${INTERVAL_SEC} seconds ago" +%Y/%m/%d.%H:%M)"

  [ "$DEBUG" = "1" ] && echo "[debug] querying nfdump from $start to $end"

  local out="$(nfdump -R "$NETFLOW_DIR" -t "${start}-${end}" -s dstip -n 0 -o csv 2>/dev/null | awk -F, '{if (NR>1 && NF>=10) print $5, $10}' || true)"

  declare -A current_bytes

  # Use process substitution to avoid subshell scope issues
  while read -r itemstr; do
    [ -z "$itemstr" ] && continue
    
    items=($itemstr)
    ip=${items[0]:-}
    bytes=${items[1]:-}

    [ -z "$ip" ] && continue
    [ -z "$bytes" ] && continue
    [[ ! "$bytes" =~ ^[0-9]+$ ]] && continue

    current_bytes["$ip"]=$bytes
  done < <(printf '%s\n' "$out")

  # Temporarily disable unbound variable checking for array operations
  set +u
  local num_ips=${#current_bytes[@]}
  set -u
  
  [ "$DEBUG" = "1" ] && echo "[debug] found $num_ips unique IPs in current interval"

  # Create/clear temp file
  > "${state_file}.tmp"
  
  # Merge with existing state
  if [ -f "$state_file" ]; then
    [ "$DEBUG" = "1" ] && echo "[debug] merging with existing state ($(wc -l < "$state_file") entries)"
    
    set +u  # Disable for array checks
    while IFS=',' read -r ip cumulative_bytes; do
      [ -z "$ip" ] && continue
      [[ ! "$cumulative_bytes" =~ ^[0-9]+$ ]] && continue
      
      if [ $num_ips -gt 0 ] && [ -v current_bytes["$ip"] ]; then
        cumulative_bytes=$((cumulative_bytes + current_bytes["$ip"]))
        [ "$DEBUG" = "1" ] && echo "[debug] updated $ip: new total=$cumulative_bytes"
        unset current_bytes["$ip"]
      fi
      
      echo "${ip},${cumulative_bytes}"
    done < "$state_file" >> "${state_file}.tmp"
    set -u  # Re-enable
  fi

  # Add any new IPs from current interval
  if [ $num_ips -gt 0 ]; then
    set +u
    for ip in "${!current_bytes[@]}"; do
      [ "$DEBUG" = "1" ] && echo "[debug] new IP $ip: ${current_bytes[$ip]} bytes"
      echo "${ip},${current_bytes[$ip]}"
    done >> "${state_file}.tmp"
    set -u
  fi

  mv "${state_file}.tmp" "$state_file"
  
  [ "$DEBUG" = "1" ] && echo "[debug] state file now has $(wc -l < "$state_file") entries"
}

check_and_ban() {
  local state_file=$(get_state_file)

  [ ! -f "$state_file" ] && return

  while IFS=',' read -r ip cumulative_bytes; do
    [ -z "$ip" ] && continue
    [ -z "$cumulative_bytes" ] && continue
    [[ ! "$cumulative_bytes" =~ ^[0-9]+$ ]] && continue

    if [ "$cumulative_bytes" -ge "$THRESHOLD_BYTES" ]; then
      if ! ipset test "$IPSET_NAME" "$ip" 2>/dev/null; then
        ipset add "$IPSET_NAME" "$ip" -exist
        conntrack -D -d "$ip" 2>/dev/null || true
        echo "[ban] $(date -Is) added dst=${ip} cumulative_bytes=${cumulative_bytes}"
      fi
    elif [ "$DEBUG" = "1" ]; then
      echo "[debug] $ip at ${cumulative_bytes} bytes (threshold: ${THRESHOLD_BYTES})"
    fi
  done < "$state_file"
}

while true; do
  day="$(date +%Y%m%d)"
  if [ "$day" != "$last_day" ]; then
    ipset flush "$IPSET_NAME" || true
    cleanup_old_files
    echo "[ban] $(date -Is) midnight rollover: flushed ipset=${IPSET_NAME}"
    last_day="$day"
  fi

  update_minute_stats
  check_and_ban
  cleanup_netflow_files

  sleep "$INTERVAL_SEC"
done
