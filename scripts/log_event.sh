#!/bin/bash
set -e

EVENT_TYPE=$1
USER_ID=$2
METADATA=$3

if [ -z "$EVENT_TYPE" ] || [ -z "$USER_ID" ]; then
  echo "Usage: $0 <event_type> <user_id> [metadata_json]"
  exit 1
fi

METADATA=${METADATA:-"{}"}

echo "Logging event $EVENT_TYPE for user $USER_ID..."

curl -s -X POST http://localhost:3000/api/admin/log \
  -H "Content-Type: application/json" \
  -d "{\"eventType\":\"$EVENT_TYPE\",\"userId\":\"$USER_ID\",\"metadata\":$METADATA}" | jq .

echo "✓ Event logged"
