#!/bin/bash
set -e

USER_ID=$1

if [ -z "$USER_ID" ]; then
  echo "Usage: $0 <user_id>"
  exit 1
fi

echo "Checking role for user $USER_ID..."

curl -s http://localhost:3000/api/admin/check-role?userId=$USER_ID | jq .

echo "✓ Role retrieved"
