#!/bin/bash
set -e

STORE_ID=$1

if [ -z "$STORE_ID" ]; then
  echo "Usage: $0 <store_id>"
  exit 1
fi

echo "Deactivating plan for store $STORE_ID..."

npx prisma db execute --stdin << PRISMA_EOF
UPDATE "Shop" 
SET plan = 'STARTER', "planExpiresAt" = NULL, "stripeId" = NULL
WHERE id = '$STORE_ID';
PRISMA_EOF

echo "✓ Plan deactivated for store $STORE_ID"
