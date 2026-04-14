#!/bin/bash
set -e

STORE_ID=$1
PLAN=$2

if [ -z "$STORE_ID" ] || [ -z "$PLAN" ]; then
  echo "Usage: $0 <store_id> <plan>"
  exit 1
fi

if ! [[ "$PLAN" =~ ^(STARTER|GROWTH|PRO)$ ]]; then
  echo "Invalid plan: $PLAN"
  exit 1
fi

echo "Activating $PLAN for store $STORE_ID..."

npx prisma db execute --stdin << PRISMA_EOF
UPDATE "Shop" 
SET plan = '$PLAN', "planExpiresAt" = CURRENT_TIMESTAMP + INTERVAL '30 days'
WHERE id = '$STORE_ID';
PRISMA_EOF

echo "✓ Plan $PLAN activated for store $STORE_ID"
