import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendWinbackEmail } from '@/lib/email'
import { verifyCronSecret } from '@/lib/cronAuth'

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const shops = await db.shop.findMany({
    where: { plan: { in: ['GROWTH', 'PRO'] } },
    select: { id: true, name: true, winbackDays: true },
  })

  let sent = 0
  for (const shop of shops) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - shop.winbackDays)

    const inactive = await db.customer.findMany({
      where: {
        shopId: shop.id,
        points: { gt: 0 },
        lastVisitAt: { lt: cutoff, not: null },
      },
      select: { email: true, name: true, points: true, lastVisitAt: true },
    })

    for (const customer of inactive) {
      try {
        const daysSince = Math.floor(
          (Date.now() - new Date(customer.lastVisitAt!).getTime()) / (1000 * 60 * 60 * 24)
        )
        await sendWinbackEmail(customer.email, customer.name, shop.name, customer.points, daysSince)
        sent++
      } catch {}
    }
  }

  return NextResponse.json({ ok: true, sent })
}
