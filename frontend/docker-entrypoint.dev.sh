#!/bin/sh
set -e
cd /app

LOCK_FILE="package-lock.json"
STAMP="node_modules/.docker-lock-sha256"

if [ ! -f "$LOCK_FILE" ]; then
  echo "[docker-entrypoint] warning: $LOCK_FILE not found"
else
  CURRENT="$(sha256sum "$LOCK_FILE" | awk '{print $1}')"
  if [ ! -f "$STAMP" ] || [ "$(cat "$STAMP")" != "$CURRENT" ]; then
    echo "[docker-entrypoint] dependencies out of sync with package-lock.json, running npm install..."
    npm install
    mkdir -p "$(dirname "$STAMP")"
    printf '%s' "$CURRENT" > "$STAMP"
  fi
fi

exec "$@"
