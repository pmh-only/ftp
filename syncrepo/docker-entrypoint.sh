#!/usr/bin/env bash
set -e

SYNC_MODE=${SYNC_MODE:-"normal"}
INTERVAL=3600

_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM SIGINT


if [[ $SYNC_MODE == "initsync" ]]; then
  if [[ -f "/data/initsync.lck" ]]; then
    echo "syncrepo executed in initsync mode but initsync is already finished. exit."
    exit 0
  fi

  /app/syncrepo.sh initsync &

  child=$! 
  wait "$child"

  touch /data/initsync.lck
fi

if [[ $SYNC_MODE == "normal" ]]; then
  echo "running in normal sync mode"
  sleep $(($INTERVAL - $(date +%s) % $INTERVAL))

  while true; do
    sleep $((RANDOM % $INTERVAL))

    /app/syncrepo.sh &    

    child=$! 
    wait "$child"  

    sleep $(($INTERVAL - $(date +%s) % $INTERVAL))
  done
fi
