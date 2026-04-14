#!/bin/bash
DB="postgresql://neondb_owner:npg_mHCr4GE9UjSe@ep-nameless-rice-anyf280z-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

activate_plan() {
  # Uso: activate_plan GROWTH 3 <shopId>
  DATABASE_URL="$DB" npx prisma db execute --stdin <<SQL
UPDATE "Shop" SET plan='$1', "planExpiresAt"=NOW() + INTERVAL '$2 months' WHERE id='$3';
SQL
}

founder_trial() {
  # Uso: founder_trial <shopId>
  DATABASE_URL="$DB" npx prisma db execute --stdin <<SQL
UPDATE "Shop" SET plan='GROWTH', "planExpiresAt"=NOW() + INTERVAL '6 months' WHERE id='$1';
SQL
}

check_features() {
  # Uso: check_features <shopId>
  DATABASE_URL="$DB" npx prisma db execute --stdin <<SQL
SELECT id, name, plan, "planExpiresAt", suspended, approved FROM "Shop" WHERE id='$1';
SQL
}

downgrade() {
  # Uso: downgrade <shopId>
  DATABASE_URL="$DB" npx prisma db execute --stdin <<SQL
UPDATE "Shop" SET plan='STARTER', "planExpiresAt"=NULL WHERE id='$1';
SQL
}

"$@"
