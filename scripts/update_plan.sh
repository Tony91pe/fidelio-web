#!/bin/bash
set -e

STORE_ID=$1
NEW_PLAN=$2

if [ -z "$STORE_ID" ] || [ -z "$NEW_PLAN" ]; then
  echo "Usage: $0 <store_id> <new_plan>"
  exit 1
fi

if ! [[ "$NEW_PLAN" =~ ^(STARTER|GROWTH|PRO)$ ]]; then
  echo "Invalid plan: $NEW_PLAN"
  exit 1
fi

echo "Updating plan to $NEW_PLAN for store $STORE_ID..."

npx prisma db execute --stdin << PRISMA_EOF
UPDATE "Shop" 
SET plan = '$NEW_PLAN', "planExpiresAt" = CURRENT_TIMESTAMP + INTERVAL '30 days'
WHERE id = '$STORE_ID';
PRISMA_EOF

echo "✓ Plan updated to $NEW_PLAN for store $STORE_ID"
