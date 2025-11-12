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

  find "/data/static" -name '.~tmp~' -exec rm -r {} +
  curl "$INDEXER_URL/gen?path=@" || echo

  touch /data/initsync.lck
fi

if [[ $SYNC_MODE == "debug" ]]; then
  echo "DEBUG! running in debug sync mode"

  mkdir /data/reports || echo
  export REPORT_PATH="/data/reports/$(date +"%Y-%m-%d.%H.%M.%S")"
  /app/syncrepo.sh &

  child=$! 
  wait "$child"  

  curl "$INDEXER_URL/gen?path=$REPORT_PATH" || echo
fi

if [[ $SYNC_MODE == "normal" ]]; then
  echo "running in normal sync mode"
  sleep $(($INTERVAL - $(date +%s) % $INTERVAL))

  while true; do
    sleep $((RANDOM % $INTERVAL))

    mkdir /data/reports || echo
    export REPORT_PATH="/data/reports/$(date +"%Y-%m-%d.%H.%M.%S")"
    
    /app/syncrepo.sh &

    child=$! 
    wait "$child"  

    find "/data/static" -name '.~tmp~' -exec rm -r {} +
    curl "$INDEXER_URL/gen?path=$REPORT_PATH" || echo

    sleep $(($INTERVAL - $(date +%s) % $INTERVAL))
  done
fi
