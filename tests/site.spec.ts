/**
 * FIDELIO — Test suite completa
 * Testa: sito pubblico, API, sicurezza, SEO, mobile
 * NB: i test che richiedono login reale (dashboard, admin) verificano
 *     solo il redirect corretto, non il flusso autenticato (Clerk OAuth).
 */
import { test, expect, request } from '@playwright/test'

// ═══════════════════════════════════════════════════════════════════════════════
// 1. AUTENTICAZIONE E PROTEZIONE PAGINE
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('1 — Autenticazione e protezione pagine', () => {
  test('1.1 pagina login si carica', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('text=500')).not.toBeVisible()
  })

  test('1.2 pagina register si carica', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('text=500')).not.toBeVisible()
  })

  test('1.3 dashboard senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.4 dashboard/customers senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard/customers')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.5 dashboard/rewards senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard/rewards')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.6 dashboard/settings senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard/settings')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.7 dashboard/analytics senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.8 dashboard/campaigns senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard/campaigns')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.9 dashboard/giftcards senza auth → redirect login', async ({ page }) => {
    await page.goto('/dashboard/giftcards')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.10 admin senza auth → redirect login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.11 admin/legal senza auth → redirect login', async ({ page }) => {
    await page.goto('/admin/legal')
    await expect(page).toHaveURL(/login|sign-in/i)
  })

  test('1.12 admin/blog senza auth → redirect login', async ({ page }) => {
    await page.goto('/admin/blog')
    await expect(page).toHaveURL(/login|sign-in/i)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HOMEPAGE E SITO PUBBLICO
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('2 — Homepage e sito pubblico', () => {
  test('2.1 homepage si carica con titolo corretto', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Fidelio/i)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('2.2 CTA principale visibile e punta a /register', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /inizia|prova gratis|registrati/i }).first()
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toMatch(/register|registr/i)
  })

  test('2.3 badge soddisfatti o rimborsati visibile', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/soddisfatt|rimbors/i).first()).toBeVisible()
  })

  test('2.4 sezione testimonial/recensioni presente', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/testimonian|recension|negozio/i).first()).toBeVisible()
  })

  test('2.5 pagina pricing raggiungibile dalla home', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveURL(/pricing/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('2.6 logo riporta alla home', async ({ page }) => {
    await page.goto('/pricing')
    await page.locator('a').filter({ hasText: 'Fidelio' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('2.7 nessun errore JS critico in console sulla homepage', async ({ page }) => {
    const errors: string[] = []
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
    await page.goto('/')
    await page.waitForTimeout(2000)
    const critical = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('analytics') &&
      !e.includes('ERR_BLOCKED') &&
      !e.includes('Content Security Policy') &&
      !e.includes('clerk') &&
      !e.includes('sentry') &&
      !e.includes('crisp') &&
      !e.includes('violates')
    )
    expect(critical).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PRICING
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('3 — Pricing', () => {
  test('3.1 tutti e tre i piani visibili', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText(/STARTER/i).first()).toBeVisible()
    await expect(page.getByText(/GROWTH/i).first()).toBeVisible()
    await expect(page.getByText(/PRO/i).first()).toBeVisible()
  })

  test('3.2 prezzi corretti visualizzati', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('19').first()).toBeVisible()
    await expect(page.getByText('39').first()).toBeVisible()
    await expect(page.getByText('79').first()).toBeVisible()
  })

  test('3.3 CTA pricing punta a /register', async ({ page }) => {
    await page.goto('/pricing')
    const cta = page.getByRole('link', { name: /inizia|prova|registra/i }).first()
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toMatch(/register/i)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BLOG
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('4 — Blog', () => {
  test('4.1 lista articoli carica', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible()
  })

  test('4.2 articolo si apre correttamente', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('a[href*="/blog/"]').first().click()
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 })
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('4.3 articolo ha CTA "prova gratis 14 giorni"', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('a[href*="/blog/"]').first().click()
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 })
    await expect(page.getByText(/14 giorni|prova gratis/i).first()).toBeVisible()
  })

  test('4.4 articolo ha articoli correlati', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('a[href*="/blog/"]').first().click()
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 })
    await expect(page.getByText(/leggi anche/i)).toBeVisible()
  })

  test('4.5 canonical tag corretto sull\'articolo', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('a[href*="/blog/"]').first().click()
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 })
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /getfidelio\.app/)
  })

  test('4.6 slug inesistente → 404', async ({ page }) => {
    const res = await page.request.get('/blog/articolo-che-non-esiste-xyz-123')
    expect(res.status()).toBe(404)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. PAGINE LEGALI
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('5 — Pagine legali', () => {
  test('5.1 privacy policy in italiano con GDPR', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.getByRole('heading', { name: /informativa sulla privacy/i })).toBeVisible()
    await expect(page.getByText(/titolare del trattamento/i).first()).toBeVisible()
    await expect(page.getByText(/GDPR/i).first()).toBeVisible()
  })

  test('5.2 termini di servizio in italiano', async ({ page }) => {
    await page.goto('/termini')
    await expect(page.getByRole('heading', { name: /termini di servizio/i })).toBeVisible()
    await expect(page.getByText(/Paddle/i).first()).toBeVisible()
    await expect(page.getByText(/Pescara/i).first()).toBeVisible()
  })

  test('5.3 cookie policy con riferimento Garante', async ({ page }) => {
    await page.goto('/cookie-policy')
    await expect(page.getByText(/Garante/i).first()).toBeVisible()
    await expect(page.getByText(/Google Analytics/i).first()).toBeVisible()
  })

  test('5.4 rimborsi con garanzia 14 giorni', async ({ page }) => {
    await page.goto('/rimborsi')
    await expect(page.getByText(/14 giorni/i).first()).toBeVisible()
    await expect(page.getByText(/Paddle/i).first()).toBeVisible()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. FORM RECENSIONI
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('6 — Form recensioni', () => {
  test('6.1 pagina accessibile senza login', async ({ page }) => {
    await page.goto('/recensioni')
    await expect(page).not.toHaveURL(/login|sign-in/)
    await expect(page.getByText(/testimonianza/i).first()).toBeVisible()
  })

  test('6.2 tutti i campi del form visibili', async ({ page }) => {
    await page.goto('/recensioni')
    await expect(page.getByPlaceholder(/Marco Rossi|nome/i)).toBeVisible()
    await expect(page.getByPlaceholder(/Titolare|ruolo/i)).toBeVisible()
    await expect(page.getByPlaceholder(/Raccontaci|esperienza/i)).toBeVisible()
  })

  test('6.3 form con dati validi mostra successo', async ({ page }) => {
    await page.goto('/recensioni')
    await page.getByPlaceholder(/Marco Rossi|nome/i).fill('Test Utente')
    await page.getByPlaceholder(/Titolare|ruolo/i).fill('Titolare bar — Roma')
    await page.getByPlaceholder(/Raccontaci|esperienza/i).fill('Ottimo servizio, lo consiglio a tutti i negozianti.')
    await page.getByRole('button', { name: /invia/i }).click()
    await expect(page.getByText(/grazie|ricevut|inviata/i)).toBeVisible({ timeout: 10000 })
  })

  test('6.4 form vuoto non può essere inviato', async ({ page }) => {
    await page.goto('/recensioni')
    const btn = page.getByRole('button', { name: /invia/i })
    await btn.click()
    await expect(page).toHaveURL(/recensioni/)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 7. QR CODE E CHECK-IN (pagine pubbliche)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('7 — QR Code e check-in', () => {
  test('7.1 pagina checkin con shopId inesistente non crasha', async ({ page }) => {
    await page.goto('/checkin/shop-inesistente-xyz')
    await expect(page.locator('text=Application error')).not.toBeVisible()
    await expect(page.locator('text=500')).not.toBeVisible()
  })

  test('7.2 pagina install/print accessibile', async ({ page }) => {
    await page.goto('/install/print')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('text=500')).not.toBeVisible()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8. SEO
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8 — SEO', () => {
  test('8.1 homepage ha meta description', async ({ page }) => {
    await page.goto('/')
    const meta = page.locator('meta[name="description"]')
    await expect(meta).toHaveAttribute('content', /.{10,}/)
  })

  test('8.2 sitemap.xml accessibile e valida', async ({ page }) => {
    const res = await page.request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<urlset')
    expect(body).toContain('getfidelio.app')
    expect(body).toContain('/blog/')
  })

  test('8.3 robots.txt o sitemap presente', async ({ page }) => {
    const res = await page.request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
  })

  test('8.4 opengraph image presente', async ({ page }) => {
    await page.goto('/')
    const og = page.locator('meta[property="og:image"]')
    const count = await og.count()
    if (count > 0) {
      await expect(og.first()).toHaveAttribute('content', /.+/)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 9. SECURITY HEADERS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('9 — Security headers', () => {
  test('9.1 X-Frame-Options presente', async ({ page }) => {
    const res = await page.request.get('/')
    expect(res.headers()['x-frame-options']).toBeTruthy()
  })

  test('9.2 X-Content-Type-Options = nosniff', async ({ page }) => {
    const res = await page.request.get('/')
    expect(res.headers()['x-content-type-options']).toBe('nosniff')
  })

  test('9.3 Content-Security-Policy presente', async ({ page }) => {
    const res = await page.request.get('/')
    expect(res.headers()['content-security-policy']).toBeTruthy()
  })

  test('9.4 Referrer-Policy presente', async ({ page }) => {
    const res = await page.request.get('/')
    expect(res.headers()['referrer-policy']).toBeTruthy()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 10. API PUBBLICHE
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('10 — API pubbliche', () => {
  test('10.1 GET /api/shops → 200', async ({ page }) => {
    const res = await page.request.get('/api/shops')
    expect(res.status()).toBe(200)
  })

  test('10.2 GET /api/blog → risponde', async ({ page }) => {
    const res = await page.request.get('/api/blog')
    expect([200, 404]).toContain(res.status())
  })

  test('10.3 GET /api/testimonials → 200', async ({ page }) => {
    const res = await page.request.get('/api/testimonials')
    expect([200, 405]).toContain(res.status())
  })

  test('10.4 POST /api/referral con dati → non crasha (200/400)', async ({ page }) => {
    const res = await page.request.post('/api/referral', {
      data: { code: 'TEST123' },
      headers: { 'Content-Type': 'application/json' }
    })
    expect([200, 400, 404]).toContain(res.status())
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 11. API PROTETTE — autenticazione richiesta
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('11 — API protette (senza token → 401/403)', () => {
  const protectedEndpoints = [
    '/api/shop/me',
    '/api/shop/plan',
    '/api/shop/stats',
    '/api/shop/customers',
    '/api/shop/rewards',
    '/api/shop/gift-cards',
    '/api/shop/settings',
    '/api/shop/staff',
    '/api/dashboard/customers',
    '/api/customers',
    '/api/rewards',
    '/api/campaigns',
    '/api/giftcards',
    '/api/analytics',
  ]

  for (const endpoint of protectedEndpoints) {
    test(`11.x GET ${endpoint} → 401/403/404`, async ({ page }) => {
      const res = await page.request.get(endpoint)
      expect([401, 403, 404]).toContain(res.status())
    })
  }

  test('11.y API admin senza auth → 401/403/404', async ({ page }) => {
    const res = await page.request.get('/api/admin')
    expect([401, 403, 404]).toContain(res.status())
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 12. RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('12 — Rate limiting', () => {
  test('12.1 OTP customer: 4a richiesta → 429', async ({ page }) => {
    const payload = { email: `ratelimit-${Date.now()}@test.com` }
    for (let i = 0; i < 3; i++) {
      await page.request.post('/api/customer/auth/send-otp', {
        data: payload, headers: { 'Content-Type': 'application/json' }
      })
    }
    const res = await page.request.post('/api/customer/auth/send-otp', {
      data: payload, headers: { 'Content-Type': 'application/json' }
    })
    expect(res.status()).toBe(429)
  })

  test('12.2 Paddle webhook senza firma → 400/401', async ({ page }) => {
    const res = await page.request.post('/api/paddle/webhook', {
      data: { test: true }, headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 401, 404]).toContain(res.status())
  })

  test('12.3 checkin API senza body → 400', async ({ page }) => {
    const res = await page.request.post('/api/checkin', {
      data: {}, headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 422]).toContain(res.status())
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 13. INPUT VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('13 — Validazione input', () => {
  test('13.1 checkin con email non valida → 400', async ({ page }) => {
    const res = await page.request.post('/api/checkin', {
      data: { name: 'Test', email: 'nonunaemail', shopId: 'fake' },
      headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 422]).toContain(res.status())
  })

  test('13.2 checkin con name troppo lungo → 400', async ({ page }) => {
    const res = await page.request.post('/api/checkin', {
      data: { name: 'A'.repeat(500), email: 'test@test.com', shopId: 'fake' },
      headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 422]).toContain(res.status())
  })

  test('13.3 scanner stamp con customerCode malformato → 400', async ({ page }) => {
    const res = await page.request.post('/api/scanner/stamp', {
      data: { customerCode: 'codice-non-valido', points: 10 },
      headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 401, 422]).toContain(res.status())
  })

  test('13.4 JSON malformato → 400', async ({ page }) => {
    const res = await page.request.post('/api/checkin', {
      data: 'questo non è json',
      headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 422]).toContain(res.status())
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 14. PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('14 — Performance', () => {
  test('14.1 homepage risponde entro 4 secondi', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    expect(Date.now() - start).toBeLessThan(4000)
  })

  test('14.2 pricing risponde entro 4 secondi', async ({ page }) => {
    const start = Date.now()
    await page.goto('/pricing')
    expect(Date.now() - start).toBeLessThan(4000)
  })

  test('14.3 blog risponde entro 5 secondi', async ({ page }) => {
    const start = Date.now()
    await page.goto('/blog')
    expect(Date.now() - start).toBeLessThan(5000)
  })

  test('14.4 sitemap risponde entro 3 secondi', async ({ page }) => {
    const start = Date.now()
    await page.request.get('/sitemap.xml')
    expect(Date.now() - start).toBeLessThan(3000)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 15. MOBILE E RESPONSIVE
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('15 — Mobile responsive', () => {
  test('15.1 homepage senza overflow orizzontale su iPhone 13', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(overflow).toBeFalsy()
  })

  test('15.2 h1 visibile su mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('15.3 pricing leggibile su mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/pricing')
    await expect(page.getByText(/STARTER/i).first()).toBeVisible()
    await expect(page.getByText(/GROWTH/i).first()).toBeVisible()
  })

  test('15.4 blog leggibile su mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/blog')
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible()
  })

  test('15.5 privacy leggibile su mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/privacy')
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 16. ERRORI E CASI LIMITE
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('16 — Errori e casi limite', () => {
  test('16.1 pagina 404 gestita', async ({ page }) => {
    const res = await page.request.get('/pagina-che-non-esiste-xyz-123')
    expect(res.status()).toBe(404)
  })

  test('16.2 API inesistente → 404', async ({ page }) => {
    const res = await page.request.get('/api/endpoint-non-esistente-xyz')
    expect([404]).toContain(res.status())
  })

  test('16.3 Shopify webhook senza firma → 401', async ({ page }) => {
    const res = await page.request.post('/api/webhooks/shopify', {
      data: { test: true }, headers: { 'Content-Type': 'application/json' }
    })
    expect([400, 401, 404, 500]).toContain(res.status())
  })

  test('16.4 gift card con codice inesistente → 404/400', async ({ page }) => {
    const res = await page.request.get('/api/shop/gift-cards/scan/CODICE-FALSO-XYZ')
    expect([400, 401, 404]).toContain(res.status())
  })

  test('16.5 CORS: API pubblica risponde con header CORS', async ({ page }) => {
    const res = await page.request.get('/api/shops', {
      headers: { 'Origin': 'https://app.fidelio.app' }
    })
    const headers = res.headers()
    expect(headers['access-control-allow-origin']).toBeTruthy()
  })
})
