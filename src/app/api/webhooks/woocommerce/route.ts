import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Non configurato' }, { status: 500 })

  const body = await req.text()
  const signature = req.headers.get('x-wc-webhook-signature') ?? ''
  const expected = createHmac('sha256', secret).update(body).digest('base64')

  let valid = false
  try { valid = timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) } catch {}
  if (!valid) {
    return NextResponse.json({ error: 'Firma non valida' }, { status: 401 })
  }

  const topic = req.headers.get('x-wc-webhook-topic')
  const source = req.headers.get('x-wc-webhook-source') ?? ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any
  try { data = JSON.parse(body) } catch { return NextResponse.json({ error: 'Payload non valido' }, { status: 400 }) }

  const isOrderPaid = (topic === 'order.created' || topic === 'order.updated') &&
    (data.status === 'completed' || data.status === 'processing')

  if (isOrderPaid) {
    const customerEmail = data.billing?.email
    const orderTotal = parseFloat(data.total || '0')
    const orderNumber = data.number ?? data.id

    if (customerEmail && source) {
      const sourceDomain = new URL(source).hostname

      const shop = await db.shop.findFirst({
        where: { website: { contains: sourceDomain } },
      })

      if (shop) {
        const customer = await db.customer.findFirst({
          where: { email: customerEmail, shopId: shop.id },
        })

        if (customer) {
          const points = Math.floor(orderTotal * (shop.pointsPerEuro || 1))
          if (points > 0) {
            await db.visit.create({
              data: {
                customerId: customer.id,
                shopId: shop.id,
                points,
                amount: orderTotal,
                note: `Ordine WooCommerce #${orderNumber}`,
              },
            })
            await db.customer.update({
              where: { id: customer.id },
              data: {
                points: { increment: points },
                totalVisits: { increment: 1 },
                lastVisitAt: new Date(),
              },
            })
            await logEvent({
              eventType: 'WOOCOMMERCE_ORDER',
              shopId: shop.id,
              customerId: customer.id,
              action: 'points_awarded',
              metadata: { orderNumber, amount: orderTotal, points },
            })
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true })
}
