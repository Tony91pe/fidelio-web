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
