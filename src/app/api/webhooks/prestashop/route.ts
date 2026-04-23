import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const token = req.headers.get('x-prestashop-token') ?? new URL(req.url).searchParams.get('token')
  const secret = process.env.PRESTASHOP_WEBHOOK_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any
  try { data = await req.json() } catch {
    return NextResponse.json({ error: 'Payload non valido' }, { status: 400 })
  }

  // Supporta sia il formato ActionWebhook che webhook personalizzati Prestashop
  const order = data.order ?? data
  const customerEmail: string | undefined =
    order.customer?.email ?? order.billing?.email ?? order.email
  const orderTotal: number = parseFloat(order.total_paid ?? order.total ?? order.amount ?? '0')
  const orderRef: string = order.reference ?? order.id_order ?? order.id ?? 'N/A'
  const sourceDomain: string | undefined = order.shop_domain ?? req.headers.get('x-prestashop-source') ?? undefined

  if (!customerEmail || orderTotal <= 0) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Trova il negozio per dominio o email cliente
  let shop = null
  if (sourceDomain) {
    shop = await db.shop.findFirst({ where: { website: { contains: sourceDomain } } })
  }
  if (!shop) return NextResponse.json({ ok: true, skipped: true, reason: 'shop not found' })

  const customer = await db.customer.findFirst({
    where: { email: customerEmail, shopId: shop.id },
  })
  if (!customer) return NextResponse.json({ ok: true, skipped: true, reason: 'customer not registered' })

  const points = Math.floor(orderTotal * (shop.pointsPerEuro ?? 1))
  if (points <= 0) return NextResponse.json({ ok: true, skipped: true })

  await db.visit.create({
    data: {
      customerId: customer.id,
      shopId: shop.id,
      points,
      amount: orderTotal,
      note: `Ordine PrestaShop #${orderRef}`,
    },
  })
  await db.customer.update({
    where: { id: customer.id },
    data: { points: { increment: points }, totalVisits: { increment: 1 }, lastVisitAt: new Date() },
  })

  return NextResponse.json({ ok: true, points })
}
