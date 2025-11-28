#!/bin/bash
set -euo pipefail

echo "Starting backend (Node.js)..."
node src/server.js &
NODE_PID=$!

echo "Starting Nginx reverse proxy..."
nginx -g 'daemon off;' &
NGINX_PID=$!

cleanup() {
  echo "Shutting down services..."
  kill -TERM "$NODE_PID" 2>/dev/null || true
  kill -TERM "$NGINX_PID" 2>/dev/null || true
}

trap cleanup SIGTERM SIGINT

wait -n "$NODE_PID" "$NGINX_PID"
exit $?
