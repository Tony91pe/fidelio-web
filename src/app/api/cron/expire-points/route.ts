import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getResendClient } from '@/lib/email'
import { logEvent } from '@/lib/logging'

const FROM = 'Fidelio <noreply@getfidelio.app>'

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const now = new Date()
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const resend = getResendClient()
  let expired = 0
  let warned = 0

  try { await db.$connect() } catch {}

  // Scade punti scaduti
  const toExpire = await db.customer.findMany({
    where: { pointsExpiresAt: { lte: now }, points: { gt: 0 } },
    select: { id: true, email: true, name: true, shopId: true, shop: { select: { name: true } } },
  })

  for (const c of toExpire) {
    await db.customer.update({
      where: { id: c.id },
      data: { points: 0, pointsExpiresAt: null },
    })
    await logEvent({ eventType: 'POINTS_EXPIRED', shopId: c.shopId ?? undefined, customerId: c.id, action: 'expired' })

    try {
      await resend.emails.send({
        from: FROM,
        to: c.email,
        subject: `I tuoi punti da ${c.shop?.name} sono scaduti`,
        html: `<p>Ciao ${c.name}, i tuoi punti fedeltà da <strong>${c.shop?.name}</strong> sono scaduti. Torna a trovarci per ricominciare ad accumulare!</p>`,
      })
    } catch {}
    expired++
  }

  // Avviso 7 giorni prima della scadenza
  const toWarn = await db.customer.findMany({
    where: {
      pointsExpiresAt: { gte: now, lte: in7Days },
      points: { gt: 0 },
      unsubscribed: false,
    },
    select: { id: true, email: true, name: true, points: true, pointsExpiresAt: true, shop: { select: { name: true } } },
  })

  for (const c of toWarn) {
    const daysLeft = Math.ceil((c.pointsExpiresAt!.getTime() - now.getTime()) / 86400000)
    try {
      await resend.emails.send({
        from: FROM,
        to: c.email,
        subject: `⏰ I tuoi ${c.points} punti scadono tra ${daysLeft} giorni`,
        html: `<p>Ciao ${c.name}! I tuoi <strong>${c.points} punti</strong> da <strong>${c.shop?.name}</strong> scadono tra <strong>${daysLeft} giorni</strong>. Vieni a trovarci e usali prima che svaniscano!</p>`,
      })
      warned++
    } catch {}
  }

  return NextResponse.json({ ok: true, expired, warned })
}
