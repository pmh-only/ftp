#!/usr/bin/env bash
set -e

SYNC_MODE=${SYNC_MODE:-"normal"}
INTERVAL=3600


if [[ $SYNC_MODE == "initsync" ]]; then
  if [[ -f "/data/initsync.lck" ]]; then
    echo "syncrepo executed in initsync mode but initsync is already finished. exit."
    exit 0
  fi

  /app/syncrepo.sh
  touch /data/initsync.lck
fi

if [[ $SYNC_MODE == "normal" ]]; then
  echo "running in normal sync mode"
  sleep $(($INTERVAL - $(date +%s) % $INTERVAL))

  while true; do
    sleep $((RANDOM % $INTERVAL))

    /app/syncrepo.sh

    sleep $(($INTERVAL - $(date +%s) % $INTERVAL))
  done
fi
