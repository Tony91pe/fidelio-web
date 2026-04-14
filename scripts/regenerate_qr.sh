#!/bin/bash
set -e

STORE_ID=$1

if [ -z "$STORE_ID" ]; then
  echo "Usage: $0 <store_id>"
  exit 1
fi

echo "Regenerating QR code for store $STORE_ID..."

curl -s -X POST http://localhost:3000/api/admin/regenerate-qr \
  -H "Content-Type: application/json" \
  -d "{\"storeId\":\"$STORE_ID\"}" | jq .

echo "✓ QR code regenerated"
