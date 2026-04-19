import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Non configurato' }, { status: 500 })

  const body = await req.text()
  const hmac = req.headers.get('x-shopify-hmac-sha256') ?? ''
  const expected = createHmac('sha256', secret).update(body).digest('base64')

  let valid = false
  try { valid = timingSafeEqual(Buffer.from(expected), Buffer.from(hmac)) } catch {}
  if (!valid) {
    return NextResponse.json({ error: 'Firma non valida' }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic')
  const shopDomain = req.headers.get('x-shopify-shop-domain')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any
  try { data = JSON.parse(body) } catch { return NextResponse.json({ error: 'Payload non valido' }, { status: 400 }) }

  if (topic === 'orders/paid') {
    const customerEmail = data.customer?.email
    const orderTotal = parseFloat(data.total_price || '0')

    if (customerEmail && shopDomain) {
      const shop = await db.shop.findFirst({
        where: { website: { contains: shopDomain } },
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
                note: `Ordine Shopify #${data.order_number}`,
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
              eventType: 'SHOPIFY_ORDER',
              shopId: shop.id,
              customerId: customer.id,
              action: 'points_awarded',
              metadata: { orderNumber: data.order_number, amount: orderTotal, points },
            })
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true })
}
