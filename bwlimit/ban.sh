#!/bin/bash
set -eu

NETFLOW_DIR="${NETFLOW_DIR:-/data}"
THRESHOLD_BYTES="${THRESHOLD_BYTES:-5368709120}" # 5 GiB
INTERVAL_SEC="${INTERVAL_SEC:-10}"
IPSET_NAME="${IPSET_NAME:-ban_egress_dst}"

ipset create "$IPSET_NAME" hash:ip -exist

iptables -C FORWARD -m set --match-set "$IPSET_NAME" dst -j DROP 2>/dev/null || \
  iptables -I FORWARD 1 -m set --match-set "$IPSET_NAME" dst -j DROP

iptables -C OUTPUT -m set --match-set "$IPSET_NAME" dst -j DROP 2>/dev/null || \
  iptables -I OUTPUT 1 -m set --match-set "$IPSET_NAME" dst -j DROP

parse_bytes() {
    local value="$1"
    local unit x
    
    # Remove parenthetical content
    value="${value%(*}"
    
    # Extract last character (unit)
    unit="${value##*[0-9.]}"
    
    # Remove unit to get number
    x="${value%$unit}"
    
    case "$unit" in
        G) echo "$x" | awk '{printf "%.0f", $1 * 1024 * 1024 * 1024}' ;;
        M) echo "$x" | awk '{printf "%.0f", $1 * 1024 * 1024}' ;;
        K) echo "$x" | awk '{printf "%.0f", $1 * 1024}' ;;
        *) echo "$value" ;;
    esac
}

last_day="$(date +%Y%m%d)"

echo "[ban] start threshold=${THRESHOLD_BYTES}B interval=${INTERVAL_SEC}s dir=${NETFLOW_DIR} ipset=${IPSET_NAME} (auto-unban at midnight)"

while true; do
  day="$(date +%Y%m%d)"
  if [ "$day" != "$last_day" ]; then
    # Midnight rollover (Asia/Seoul). Flush all bans.
    ipset flush "$IPSET_NAME" || true
    echo "[ban] $(date -Is) midnight rollover: flushed ipset=${IPSET_NAME}"
    last_day="$day"
  fi

  start="$(date +%Y/%m/%d.00:00)"
  end="$(date +%Y/%m/%d.%H:%M)"

  out="$(nfdump -R "$NETFLOW_DIR" -t "${start}-${end}" -s dstip/bytes -n 0 -q 2>/dev/null || true)"

  printf '%s\n' "$out" | while read -r line; do
    [ -z "$line" ] && continue
    
    # Extract IP: the word that comes after "any"
    ip=$(echo "$line" | grep -oP 'any\s+\K[0-9.]+' | head -1)
    
    # Extract bytes: find the field with format like "16.2 G" or "51.3 M"
    bytes_raw=$(echo "$line" | grep -oP '[0-9]+\.[0-9]+\s+[GMK](?=[\(\s])')
    
    [ -z "$ip" ] && continue
    [ -z "$bytes_raw" ] && continue
    
    # Remove space between number and unit
    bytes_field="${bytes_raw// /}"
    
    # Parse to numeric
    bytes=$(parse_bytes "$bytes_field")

    if [ "$bytes" -ge "$THRESHOLD_BYTES" ]; then
      if ! ipset test "$IPSET_NAME" "$ip" 2>/dev/null; then
        ipset add "$IPSET_NAME" "$ip" -exist
        echo "[ban] $(date -Is) added dst=${ip} bytes_today=${bytes}"
      fi
    fi
  done

  sleep "$INTERVAL_SEC"
done
