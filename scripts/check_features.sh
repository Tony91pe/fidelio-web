#!/bin/bash
set -e

STORE_ID=$1

if [ -z "$STORE_ID" ]; then
  echo "Usage: $0 <store_id>"
  exit 1
fi

echo "Checking features for store $STORE_ID..."

npx prisma db execute --stdin << PRISMA_EOF
SELECT id, name, plan, "planExpiresAt" FROM "Shop" WHERE id = '$STORE_ID';
PRISMA_EOF

echo "✓ Features retrieved"
