import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyCronSecret } from '@/lib/cronAuth'

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const now = new Date()

  // Trova tutti i negozi con piano scaduto (non STARTER, planExpiresAt nel passato)
  const expired = await db.shop.findMany({
    where: {
      plan: { not: 'STARTER' },
      planExpiresAt: { lt: now },
      stripeId: null, // solo chi non ha già un abbonamento Stripe attivo
    },
    select: { id: true, plan: true, planExpiresAt: true, ownerEmail: true, name: true },
  })

  if (expired.length === 0) {
    return NextResponse.json({ ok: true, downgraded: 0 })
  }

  // Downgrade a STARTER
  await db.shop.updateMany({
    where: { id: { in: expired.map(s => s.id) } },
    data: { plan: 'STARTER', planExpiresAt: null },
  })

  console.log(`[cron/expire-plans] Downgraded ${expired.length} shop(s):`, expired.map(s => s.name))

  return NextResponse.json({ ok: true, downgraded: expired.length, shops: expired.map(s => s.name) })
}
