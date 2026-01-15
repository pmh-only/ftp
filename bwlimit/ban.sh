#!/bin/bash
set -eu

NETFLOW_DIR="${NETFLOW_DIR:-/data}"
THRESHOLD_BYTES="${THRESHOLD_BYTES:-5368709120}" # 5 GiB
INTERVAL_SEC="${INTERVAL_SEC:-10}"
IPSET_NAME="${IPSET_NAME:-ban_egress_dst}"

ipset create "$IPSET_NAME" hash:ip -exist

iptables -C KUBE-ROUTER-FORWARD -m set --match-set "$IPSET_NAME" dst -j DROP 2>/dev/null || \
  iptables -I KUBE-ROUTER-FORWARD 1 -m set --match-set "$IPSET_NAME" dst -j DROP

iptables -C KUBE-ROUTER-OUTPUT  -m set --match-set "$IPSET_NAME" dst -j DROP 2>/dev/null || \
  iptables -I KUBE-ROUTER-OUTPUT 1 -m set --match-set "$IPSET_NAME" dst -j DROP


last_day="$(date +%Y%m%d)"

echo "[ban] start threshold=${THRESHOLD_BYTES}B interval=${INTERVAL_SEC}s dir=${NETFLOW_DIR} ipset=${IPSET_NAME} (auto-unban at midnight)"

while true; do
  day="$(date +%Y%m%d)"
  if [ "$day" != "$last_day" ]; then
    ipset flush "$IPSET_NAME" || true
    echo "[ban] $(date -Is) midnight rollover: flushed ipset=${IPSET_NAME}"
    last_day="$day"
  fi

  start="$(date +%Y/%m/%d.00:00)"
  end="$(date +%Y/%m/%d.%H:%M)"

  out="$(nfdump -R "$NETFLOW_DIR" -t "${start}-${end}" -s dstip -n 0 -o csv 2>/dev/null | awk -F, '{if (NR>1 && NF>=10) print $5, $10}' || true)"
  
  printf '%s\n' "$out" | {
    while read -r itemstr; do
      items=($itemstr)
      ip=${items[0]}
      bytes=${items[1]}
      
      [ -z "$ip" ] && continue
      [ -z "$bytes" ] && continue

      if [ "$bytes" -ge "$THRESHOLD_BYTES" ]; then
        if ! ipset test "$IPSET_NAME" "$ip" 2>/dev/null; then
          ipset add "$IPSET_NAME" "$ip" -exist
          conntrack -D -d "$ip" 2>/dev/null || true
          echo "[ban] $(date -Is) added dst=${ip} bytes_today=${bytes}"
        fi
      fi
    done
  }

  sleep "$INTERVAL_SEC"
done
