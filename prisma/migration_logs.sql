-- Create Log table for audit trail
CREATE TABLE "Log" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "eventType" TEXT NOT NULL,
  "userId" TEXT,
  "shopId" TEXT,
  "customerId" TEXT,
  "action" TEXT NOT NULL,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Log_shopId_idx" ON "Log"("shopId");
CREATE INDEX "Log_userId_idx" ON "Log"("userId");
CREATE INDEX "Log_createdAt_idx" ON "Log"("createdAt");
CREATE INDEX "Log_eventType_idx" ON "Log"("eventType");

-- Update Shop schema to add staff role column if needed
ALTER TABLE "Shop" ADD COLUMN IF NOT EXISTS "staffRole" TEXT DEFAULT 'MERCHANT';
