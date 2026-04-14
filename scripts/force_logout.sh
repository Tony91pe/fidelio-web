#!/bin/bash
set -e

USER_ID=$1

if [ -z "$USER_ID" ]; then
  echo "Usage: $0 <user_id>"
  exit 1
fi

echo "Forcing logout for user $USER_ID..."

curl -s -X POST http://localhost:3000/api/admin/force-logout \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\"}" | jq .

echo "✓ User logged out"
