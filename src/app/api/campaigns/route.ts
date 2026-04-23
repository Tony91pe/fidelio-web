import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getResendClient } from '@/lib/email'

const resend = getResendClient()

const SEGMENTS = ['all', 'active', 'atrisk', 'nearreward', 'top', 'birthday'] as const
type Segment = typeof SEGMENTS[number]

async function getCustomers(shopId: string, segment: Segment, rewardThreshold: number) {
  const ago30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const thisMonth = now.getMonth() + 1

  switch (segment) {
    case 'active':
      return db.customer.findMany({ where: { shopId, lastVisitAt: { gte: ago30 } } })
    case 'atrisk':
      return db.customer.findMany({ where: { shopId, lastVisitAt: { lt: ago30 } } })
    case 'nearreward':
      return db.customer.findMany({ where: { shopId, points: { gte: Math.floor(rewardThreshold * 0.7) } } })
    case 'top':
      return db.customer.findMany({ where: { shopId }, orderBy: { totalVisits: 'desc' }, take: 50 })
    case 'birthday':
      return db.customer.findMany({ where: { shopId, birthday: { not: null } } }).then(cs =>
        cs.filter(c => c.birthday && new Date(c.birthday).getMonth() + 1 === thisMonth)
      )
    default:
      return db.customer.findMany({ where: { shopId } })
  }
}

// GET — conta clienti per segmento (anteprima)
export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const counts = await Promise.all(
    SEGMENTS.map(async seg => ({
      segment: seg,
      count: (await getCustomers(shop.id, seg, shop.rewardThreshold)).length,
    }))
  )
  return NextResponse.json(counts)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  if (shop.plan !== 'PRO') {
    return NextResponse.json({ error: 'Le campagne richiedono il piano PRO', planRequired: 'PRO' }, { status: 403 })
  }

  const { subject, body, segment } = await req.json()
  if (!subject?.trim() || !body?.trim() || !SEGMENTS.includes(segment)) {
    return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 })
  }

  const customers = await getCustomers(shop.id, segment as Segment, shop.rewardThreshold)
  let sent = 0

  for (const c of customers) {
    try {
      await resend.emails.send({
        from: `${shop.name} via Fidelio <noreply@getfidelio.app>`,
        to: c.email,
        subject,
        html: `<!DOCTYPE html>
<html lang="it">
<body style="margin:0;padding:0;background:#0D0D1A;font-family:system-ui,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:linear-gradient(135deg,#4A1FB8,#6C3DF4);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center">
  <span style="font-size:22px;font-weight:900;color:white">${shop.name}</span><br>
  <span style="color:rgba(255,255,255,0.6);font-size:13px">via Fidelio</span>
</td></tr>
<tr><td style="background:#161628;border-radius:0 0 16px 16px;padding:32px 40px">
  <p style="font-size:16px;color:rgba(255,255,255,0.85);line-height:1.7;margin:0 0 16px">Ciao <strong style="color:white">${c.name}</strong>!</p>
  <div style="font-size:15px;color:rgba(255,255,255,0.7);line-height:1.75;margin-bottom:24px">${body.replace(/\n/g, '<br>')}</div>
  <div style="background:rgba(108,61,244,0.12);border:1px solid rgba(108,61,244,0.25);border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center">
    <span style="color:rgba(255,255,255,0.5);font-size:13px">I tuoi punti attuali</span><br>
    <span style="font-size:32px;font-weight:900;color:#A78BFA">${c.points}</span>
    <span style="color:rgba(255,255,255,0.4);font-size:13px"> / ${shop.rewardThreshold} per il premio</span>
  </div>
  <p style="font-size:11px;color:rgba(255,255,255,0.2);text-align:center;margin:0">
    Programma fedeltà gestito con <a href="https://www.getfidelio.app" style="color:#A78BFA;text-decoration:none">Fidelio</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
      })
      sent++
    } catch (err) {
      console.error(`Campaign email failed for ${c.email}:`, err)
    }
  }

  return NextResponse.json({ sent, total: customers.length })
}
