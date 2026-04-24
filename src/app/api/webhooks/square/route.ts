import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const secret = process.env.SQUARE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Non configurato' }, { status: 500 })

  const body = await req.text()
  const signature = req.headers.get('x-square-hmacsha256-signature') ?? ''
  const url = `https://www.getfidelio.app/api/webhooks/square`
  const expected = createHmac('sha256', secret).update(url + body).digest('base64')

  let valid = false
  try { valid = timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) } catch {}
  if (!valid) return NextResponse.json({ error: 'Firma non valida' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any
  try { data = JSON.parse(body) } catch { return NextResponse.json({ error: 'Payload non valido' }, { status: 400 }) }

  const eventType = data?.type
  if (eventType !== 'payment.completed') return NextResponse.json({ ok: true })

  const payment = data?.data?.object?.payment
  if (!payment) return NextResponse.json({ ok: true })

  const customerEmail = payment?.buyer_email_address
  const merchantId = data?.merchant_id
  const orderTotal = (payment?.amount_money?.amount ?? 0) / 100

  if (!customerEmail || !merchantId) return NextResponse.json({ ok: true })

  const shop = await db.shop.findFirst({ where: { website: { contains: merchantId } } })
  if (!shop) return NextResponse.json({ ok: true })

  const customer = await db.customer.findFirst({ where: { email: customerEmail, shopId: shop.id } })
  if (!customer) return NextResponse.json({ ok: true })

  const points = Math.floor(orderTotal * (shop.pointsPerEuro ?? 1))
  if (points <= 0) return NextResponse.json({ ok: true })

  await db.visit.create({
    data: { customerId: customer.id, shopId: shop.id, points, amount: orderTotal, note: `Pagamento Square` },
  })
  await db.customer.update({
    where: { id: customer.id },
    data: { points: { increment: points }, totalVisits: { increment: 1 }, lastVisitAt: new Date() },
  })
  await logEvent({
    eventType: 'SQUARE_PAYMENT',
    shopId: shop.id,
    customerId: customer.id,
    action: 'points_awarded',
    metadata: { amount: orderTotal, points },
  })

  return NextResponse.json({ ok: true })
}
