#!/bin/bash
set -e

STORE_ID=$1

if [ -z "$STORE_ID" ]; then
  echo "Usage: $0 <store_id>"
  exit 1
fi

echo "Getting details for store $STORE_ID..."

curl -s "http://localhost:3000/api/app/stores/$STORE_ID" | jq .

echo "✓ Details retrieved"
