import { NextRequest, NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/', '/login(.*)', '/register(.*)', '/pricing', '/privacy', '/termini',
  '/rimborsi', '/cookie-policy', '/fondatore', '/docs', '/checkin/(.*)', '/recensioni', '/blog', '/blog/(.*)',
  '/api/app/(.*)', '/api/customer/(.*)', '/api/checkin',
  '/api/scanner/(.*)', '/api/shops', '/api/webhooks/(.*)',
  '/api/unsubscribe', '/api/referral', '/api/cron/(.*)', '/api/testimonials', '/api/shop/apply-founder',
  '/status', '/sitemap.xml', '/opengraph-image',
])

const rateLimitMap = new Map<string, { count: number; reset: number }>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/customer/auth/send-otp':         { max: 3,  windowMs: 60_000 },
  '/api/scanner/stamp':                  { max: 30, windowMs: 60_000 },
  '/api/scanner/lookup':                 { max: 60, windowMs: 60_000 },
  '/api/checkin':                        { max: 30, windowMs: 60_000 },
  '/api/shop/auth/send-otp':             { max: 3,  windowMs: 60_000 },
  '/api/shop/checkin':                   { max: 30, windowMs: 60_000 },
  '/api/paddle/webhook':                 { max: 20, windowMs: 60_000 },
  '/api/dashboard/customers/export':     { max: 5,  windowMs: 60_000 },
  '/api/shop/export':                    { max: 5,  windowMs: 60_000 },
  '/api/admin/contact-shop':             { max: 10, windowMs: 60_000 },
}

function getRateLimit(pathname: string) {
  for (const [path, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path)) return limit
  }
  return null
}

function checkRateLimit(key: string, limit: { max: number; windowMs: number }): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + limit.windowMs })
    return true
  }
  if (entry.count >= limit.max) return false
  entry.count++
  return true
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl

  const limit = getRateLimit(pathname)
  if (limit) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const key = `${ip}:${pathname}`
    if (!checkRateLimit(key, limit)) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra un momento.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)'],
}
