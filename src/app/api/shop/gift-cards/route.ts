import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'
import { hasFeature } from '@/lib/planFeatures'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result

  if (!hasFeature(shop.plan, 'giftCards')) {
    return NextResponse.json([], { headers: corsHeaders })
  }

  const cards = await db.giftCard.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(cards.map((c) => ({
    id: c.id,
    code: c.code,
    value: c.value ?? c.points,
    remainingValue: c.remainingValue ?? c.value ?? c.points,
    description: c.description,
    customerName: c.customerName,
    customerEmail: c.customerEmail,
    usedAt: c.usedAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
  })), { headers: corsHeaders })
}

export async function POST(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  if (!hasFeature(shop.plan, 'giftCards')) {
    return NextResponse.json({ error: 'Le gift card richiedono il piano Growth o superiore.', planRequired: 'GROWTH', currentPlan: shop.plan }, { status: 403, headers: corsHeaders })
  }

  const { value, description, customerEmail } = await req.json()

  if (!value || value <= 0) {
    return NextResponse.json({ error: 'Valore non valido' }, { status: 400, headers: corsHeaders })
  }

  // Genera codice univoco GC-XXXXXXXX
  const code = `GC-${randomBytes(4).toString('hex').toUpperCase()}`

  // Cerca nome cliente se email fornita
  let customerName: string | null = null
  if (customerEmail) {
    const customer = await db.customer.findFirst({
      where: { email: customerEmail, shopId: shop.id },
      select: { name: true },
    })
    customerName = customer?.name ?? null
  }

  const card = await db.giftCard.create({
    data: {
      code,
      value,
      points: Math.round(value),
      description: description || null,
      customerEmail: customerEmail || null,
      customerName,
      shopId: shop.id,
    },
  })

  return NextResponse.json({
    id: card.id,
    code: card.code,
    value: card.value ?? card.points,
    remainingValue: card.value ?? card.points,
    description: card.description,
    customerName: card.customerName,
    customerEmail: card.customerEmail,
    usedAt: null,
    createdAt: card.createdAt.toISOString(),
  }, { status: 201, headers: corsHeaders })
}
