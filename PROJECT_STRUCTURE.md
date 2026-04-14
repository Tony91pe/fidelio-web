# PROJECT STRUCTURE - FIDELIO WEB

## 1) STRUTTURA COMPLETA
### Backend: src/app/api/admin/
- users/ (suspend, delete)
- password-reset/
- force-logout/
- plans/ (change, trial, history)
- gift-plan/
- shops/ (update, stats, coordinates)
- qr/ (regenerate, scans)
- automations/ (toggle, test)
- notifications/ (send, test)
- images/ (delete, regenerate)
- security/ (iplimit)
- logs/
- check-plan/
- upgrade-plan/

### Admin Frontend: src/app/admin/
- layout.tsx (sidebar, navigation, 12-item menu)
- dashboard/page.tsx
- users/page.tsx (suspend, delete, search)
- plans/page.tsx (change plan, gift plan modal)
- shops/page.tsx (update coords, stats)
- qr/page.tsx (regenerate, logs)
- automations/page.tsx (toggle, test)
- notifications/page.tsx (send, test)
- images/page.tsx (delete, regenerate)
- map/page.tsx (manage shops, cache)
- logs/page.tsx (audit trail)
- security/page.tsx (IP blocking)
- legal/page.tsx (privacy, terms, DPA, cookie)
- password-management/page.tsx (reset, logout)

### Core Services: src/lib/
- db.ts (Prisma client)
- email.ts (sendEmail, sendWelcome, sendWinback)
- push.ts (Web push)
- plans.ts (FEATURES_BY_PLAN, hasFeature)
- checkPlan.ts (Plan validation middleware)
- roles.ts (Role enum, PERMISSIONS)
- logging.ts (logEvent, getLogsForShop)
- notifications.ts (notifyUser, getNotificationTypeByPlan)
- imageHandler.ts (uploadImage, deleteImage - Vercel Blob)
- qr.ts (generateQRCode, validateQRCode, logQRScan)
- security.ts (rate limiters, validation)
- mapService.ts (getShopsInBoundingBox, clearMapCache, caching)
- passwordManagement.ts (resetPassword, forceLogout, generateTemporaryPassword, invalidateSessions)
- giftPlan.ts (giftPlan function with months & plan selection)
- planManagement.ts (upgradeDowngradePlan, checkPlanExpiry, activateFounderTrial)

### Components: src/components/admin/
- AdminPasswordManager.tsx (password reset, force logout modal)
- GiftPlanModal.tsx (dropdown piani, input mesi, gift button)

### Database: prisma/
- schema.prisma (Shop, Customer, Log, Visit, Reward, etc.)
- migration_logs.sql

### Legal: public/legal/
- PRIVACY_POLICY.md (GDPR compliant)
- TERMS_OF_SERVICE.md
- COOKIE_POLICY.md
- GDPR_NOTICE.md
- DPA.md (Data Processing Agreement)
- APP_STORE_TEXTS.md
- EMAIL_TEMPLATES.md
- COOKIE_BANNER.md
- ONBOARDING_LEGAL.md

### Scripts: scripts/
- activate_plan.sh, deactivate_plan.sh, update_plan.sh
- check_features.sh, reset_password.sh, force_logout.sh
- regenerate_qr.sh, clear_map_cache.sh
- log_event.sh, check_role.sh
- list_stores_on_map.sh, get_store_details.sh
- reset_password_admin.sh, force_logout_admin.sh

---

## 2) DOVE MODIFICARE - FUNZIONI CHIAVE

### Reset Password
File: src/lib/passwordManagement.ts
Funzione: resetPassword(userId, adminUserId)
API: POST /api/admin/password-reset
Log: EVENT_TYPE = 'PASSWORD_RESET'

### Forza Logout
File: src/lib/passwordManagement.ts
Funzione: forceLogout(userId, adminUserId)
API: POST /api/admin/force-logout
Log: EVENT_TYPE = 'FORCE_LOGOUT'

### Gestione Ruoli
File: src/lib/roles.ts
Enum: Role (ADMIN, MERCHANT, STAFF, CUSTOMER)
Object: PERMISSIONS mapping
Funzioni: hasPermission(), canAccess()

### Piani (upgrade/downgrade/trial)
File: src/lib/planManagement.ts
Funzioni: upgradeDowngradePlan(), checkPlanExpiry(), activateFounderTrial()
API: POST /api/admin/plans/change, POST /api/admin/plans/trial
DB: Shop.plan, Shop.planExpiresAt

### Regalo Piani con Scelta
File: src/lib/giftPlan.ts + src/components/admin/GiftPlanModal.tsx
Funzione: giftPlan(shopId, plan, months, adminUserId)
API: POST /api/admin/gift-plan
Frontend: Dropdown (STARTER, GROWTH, PRO), input mesi (1-60)

### QR Codes
File: src/lib/qr.ts
Funzioni: generateQRCode(), validateQRCode(), generateSecureQRCode(), logQRScan()
API: POST /api/admin/qr/regenerate, GET /api/admin/qr/scans
Log: EVENT_TYPE = 'QR_SCANNED', 'QR_REGENERATED'

### Automazioni
Files: src/app/api/admin/automations/toggle/route.ts, /test/route.ts
API: POST /api/admin/automations/toggle, POST /api/admin/automations/test
Log: EVENT_TYPE = 'AUTOMATION_TOGGLED', 'AUTOMATION_TEST'

### Notifiche Email/Push
Files: src/lib/email.ts, src/lib/push.ts, src/lib/notifications.ts
Functions: sendEmail(), notifyUser(), getNotificationTypeByPlan()
API: POST /api/admin/notifications/send, POST /api/admin/notifications/test
Log: EVENT_TYPE = 'NOTIFICATION_SENT', 'NOTIFICATION_TEST'

### Mappa Scopri
File: src/lib/mapService.ts
Funzioni: getShopsInBoundingBox(), calculateDistance(), clearMapCache()
API: GET /api/app/stores-map?lat=X&lng=Y&radius=Z
Cache: 5 minuti TTL in mapCache variable

### Gestione Immagini
File: src/lib/imageHandler.ts
Funzioni: uploadImage(file, shopId), deleteImage(filename)
Storage: Vercel Blob (put, del)
API: POST /api/admin/images/delete, POST /api/admin/images/regenerate

### Sicurezza (Rate Limit, Brute Force)
File: src/lib/security.ts, src/middleware.ts
Rate Limits:
- Login: 5 tentativi per 15 minuti
- API: 100 richieste per minuto
- ResetPassword: 3 tentativi per ora
Security Headers: nosniff, DENY, CSP

### Log & Audit
File: src/lib/logging.ts
Funzioni: logEvent(event), getLogsForShop(shopId), getAuditTrail(shopId, startDate, endDate)
DB Model: Log (id, eventType, userId, shopId, action, metadata, createdAt)
API: GET /api/admin/logs?shopId=X&limit=100
Admin Page: src/app/admin/logs/page.tsx

### Testi Legali
Files: public/legal/*.md
Pages: src/app/admin/legal/page.tsx
Testi: Privacy, Terms, Cookie, GDPR Notice, DPA, App Store Texts, Email Templates

---

## 3) OPERAZIONI FUTURE

### Aggiungere nuova API
1. Creare: src/app/api/[route]/route.ts
2. Implementare POST/GET/PUT
3. Auth check (const { userId } = await auth())
4. logEvent() per audit
5. Return NextResponse.json()

### Aggiungere nuova Notifica
1. src/lib/email.ts - nuova funzione send*Email()
2. src/lib/notifications.ts - add to notifyUser()
3. Test: POST /api/admin/notifications/test

### Aggiungere nuova Automazione
1. src/lib/automations.ts - create service
2. Trigger logic
3. logEvent() for tracking
4. API endpoint toggle

### Aggiungere nuovo Piano
1. prisma/schema.prisma - add enum Plan
2. src/lib/plans.ts - FEATURES_BY_PLAN
3. src/lib/planManagement.ts - pricing
4. src/components/admin/GiftPlanModal.tsx - dropdown

### Aggiungere sezione Admin
1. src/app/admin/[section]/page.tsx
2. src/app/api/admin/[section]/route.ts
3. src/components/admin/[Section].tsx
4. Update src/app/admin/layout.tsx menuItems

---

## 4) DEBUG

### Log Sistem
- GET /api/admin/logs?shopId=[id]
- SELECT * FROM "Log" WHERE eventType = '...'
- src/app/admin/logs/page.tsx

### Backend Errors
- npm run dev → terminal
- Browser DevTools → Network/Console
- Vercel Dashboard → Data/Logs
- logEvent() for tracking

### Admin Frontend Errors
- DevTools Console
- Network tab
- src/components/admin/*.tsx
- src/app/admin/*/page.tsx

### Automazioni Errors
- eventType: AUTOMATION_TOGGLED, AUTOMATION_TEST, AUTOMATION_TRIGGERED
- Log database query

### Notifiche Errors
- eventType: NOTIFICATION_SENT, NOTIFICATION_TEST
- resend.com dashboard
- src/lib/email.ts, src/lib/push.ts

### QR Errors
- eventType: QR_SCANNED, QR_REGENERATED
- src/lib/qr.ts
- GET /api/admin/qr/scans

---

## 5) DEPLOY

### Pre-Deploy
✓ src/lib/email.ts - exports sendEmail
✓ src/lib/imageHandler.ts - imports (put, del)
✓ prisma/schema.prisma - syntax
✓ .env - all variables
✓ npm run build - success

### Environment
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
RESEND_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_APP_URL=...
VERCEL_BLOB_TOKEN=...

### Build & Deploy
npm run build
git push origin main
Vercel auto-deploy

### Post-Deploy
npx prisma migrate deploy
POST /api/admin/clear-cache
Force logout users
Health check: GET /api/admin/users

### Maintenance
DELETE FROM "Log" WHERE "createdAt" < NOW() - INTERVAL '30 days'
Clear cache
Clean sessions

---

## 6) STACK

- Frontend: Next.js 16, React 19, Tailwind, shadcn/ui
- Backend: Next.js API Routes
- Auth: Clerk
- Database: PostgreSQL + Neon + Prisma
- Email: Resend
- Push: Web Push API
- Payment: Stripe
- Storage: Vercel Blob
- QR: qrcode, @zxing/library

---

Generated: 2026-04-14
Last Updated: Commit 440f9e0
