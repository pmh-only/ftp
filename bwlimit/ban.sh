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

  printf '%s\n' "$out" | grep -oP 'any\s+\K[0-9.]+' | {
    while read -r ip; do
      [ -z "$ip" ] && continue
      
      bytes=$(printf '%s\n' "$out" | grep "any[[:space:]]*$ip" | awk '
      {
        for (i=1; i<=NF; i++) {
          if ($i ~ /^[0-9]+\.[0-9]+[KMGTP]/) {
            v = $i
            gsub(/\(.*/, "", v)
            gsub(/ /, "", v)
            
            u = substr(v, length(v), 1)
            if (u ~ /[KMGTP]/) {
              x = substr(v, 1, length(v)-1)
            } else {
              x = v
              u = ""
            }
            
            m = 1
            if (u == "K") m = 1024
            else if (u == "M") m = 1024 * 1024
            else if (u == "G") m = 1024 * 1024 * 1024
            else if (u == "T") m = 1024 * 1024 * 1024 * 1024
            else if (u == "P") m = 1024 * 1024 * 1024 * 1024 * 1024
            
            printf "%.0f", x * m
            break
          }
        }
      }')
      
      [ -z "$bytes" ] && continue

      if [ "$bytes" -ge "$THRESHOLD_BYTES" ]; then
        if ! ipset test "$IPSET_NAME" "$ip" 2>/dev/null; then
          ipset add "$IPSET_NAME" "$ip" -exist
          echo "[ban] $(date -Is) added dst=${ip} bytes_today=${bytes}"
        fi
      fi
    done
  }

  sleep "$INTERVAL_SEC"
done
