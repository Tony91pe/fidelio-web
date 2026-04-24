import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'

function verifySignature(body: string, signature: string, secret: string): boolean {
  const digest = createHmac('sha256', secret).update(body).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

const PLAN_ACTIVE_STATUSES = ['active', 'trialing']

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('x-signature') ?? ''

  if (!verifySignature(body, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Firma non valida' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any
  try { event = JSON.parse(body) } catch {
    return NextResponse.json({ error: 'Payload non valido' }, { status: 400 })
  }

  const eventName: string = event?.meta?.event_name ?? ''
  const custom = event?.meta?.custom_data ?? {}
  const attrs = event?.data?.attributes ?? {}
  const { shopId, plan } = custom

  // Abbonamento attivato o aggiornato
  if (['subscription_created', 'subscription_updated', 'subscription_resumed', 'subscription_plan_changed'].includes(eventName)) {
    if (!shopId || !plan) return NextResponse.json({ ok: true })

    const status: string = attrs.status ?? ''
    const isActive = PLAN_ACTIVE_STATUSES.includes(status)
    const resolvedPlan = isActive ? (plan as 'STARTER' | 'GROWTH' | 'PRO') : 'STARTER'
    const isGrowthOrPro = resolvedPlan === 'GROWTH' || resolvedPlan === 'PRO'

    await db.shop.update({
      where: { id: shopId },
      data: {
        plan: resolvedPlan,
        lsCustomerId: String(attrs.customer_id ?? ''),
        lsSubscriptionId: String(event.data.id ?? ''),
        billingPortalUrl: attrs.urls?.customer_portal ?? null,
        planExpiresAt: null,
        ...(isGrowthOrPro ? {
          emailNotificationsEnabled: true,
          pushNotificationsEnabled: true,
          birthdayEmailEnabled: true,
          winbackEmailEnabled: true,
        } : {}),
      },
    })
  }

  // Abbonamento cancellato o scaduto
  if (['subscription_cancelled', 'subscription_expired', 'subscription_paused'].includes(eventName)) {
    if (!shopId) return NextResponse.json({ ok: true })

    await db.shop.update({
      where: { id: shopId },
      data: {
        plan: 'STARTER',
        lsCustomerId: null,
        lsSubscriptionId: null,
        billingPortalUrl: null,
        planExpiresAt: null,
        emailNotificationsEnabled: false,
        pushNotificationsEnabled: false,
        birthdayEmailEnabled: false,
        winbackEmailEnabled: false,
      },
    })
  }

  return NextResponse.json({ ok: true })
}
