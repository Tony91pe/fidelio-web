import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

// GET /api/referral?code=XXXX — lookup referral code
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Codice mancante' }, { status: 400 })

  const referrer = await db.customer.findFirst({
    where: { referralCode: code },
    select: { id: true, name: true, shopId: true, shop: { select: { name: true } } },
  })

  if (!referrer) return NextResponse.json({ error: 'Codice non valido' }, { status: 404 })
  return NextResponse.json({ referrer: { name: referrer.name, shopName: referrer.shop?.name } })
}

// POST /api/referral — apply referral during registration
export async function POST(req: Request) {
  const { newCustomerId, referralCode } = await req.json()
  if (!newCustomerId || !referralCode) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  const referrer = await db.customer.findFirst({
    where: { referralCode },
    select: { id: true, shopId: true, shop: { select: { welcomePoints: true } } },
  })

  if (!referrer) return NextResponse.json({ error: 'Codice non valido' }, { status: 404 })

  const bonusPoints = Math.floor((referrer.shop?.welcomePoints || 50) * 0.5)

  await db.$transaction([
    db.customer.update({
      where: { id: newCustomerId },
      data: { referredBy: referralCode },
    }),
    db.customer.update({
      where: { id: referrer.id },
      data: { points: { increment: bonusPoints } },
    }),
    db.visit.create({
      data: {
        customerId: referrer.id,
        shopId: referrer.shopId!,
        points: bonusPoints,
        note: 'Bonus referral',
      },
    }),
  ])

  await logEvent({
    eventType: 'REFERRAL',
    customerId: referrer.id,
    shopId: referrer.shopId ?? undefined,
    action: 'referral_bonus',
    metadata: { newCustomerId, bonusPoints },
  })

  return NextResponse.json({ ok: true, bonusPoints })
}
