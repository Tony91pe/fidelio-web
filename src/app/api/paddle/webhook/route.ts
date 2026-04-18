import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { db } from '@/lib/db'

function verifySignature(body: string, signature: string, secret: string): boolean {
  const parts: Record<string, string> = {}
  signature.split(';').forEach(part => {
    const idx = part.indexOf('=')
    if (idx !== -1) parts[part.slice(0, idx)] = part.slice(idx + 1)
  })
  const { ts, h1 } = parts
  if (!ts || !h1) return false
  const expected = createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex')
  return expected === h1
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('paddle-signature') ?? ''

  if (!verifySignature(body, signature, process.env.PADDLE_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Firma non valida' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const { event_type, data } = event

  if (event_type === 'subscription.activated' || event_type === 'transaction.completed') {
    const customData = data?.custom_data ?? data?.subscription?.custom_data
    const { shopId, plan } = customData ?? {}
    const customerId = data?.customer_id

    if (shopId && plan) {
      await db.shop.update({
        where: { id: shopId },
        data: {
          plan: plan as 'STARTER' | 'GROWTH' | 'PRO',
          stripeId: customerId ?? null,
          planExpiresAt: null, // abbonamento attivo: rimuove la scadenza trial fondatore
        },
      })
    }
  }

  if (event_type === 'subscription.canceled' || event_type === 'subscription.paused') {
    const customData = data?.custom_data
    const { shopId } = customData ?? {}
    if (shopId) {
      await db.shop.update({
        where: { id: shopId },
        data: { plan: 'STARTER', stripeId: null, planExpiresAt: null },
      })
    }
  }

  return NextResponse.json({ ok: true })
}
