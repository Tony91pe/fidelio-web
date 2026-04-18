import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'
import { hasFeature } from '@/lib/planFeatures'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result

  if (!hasFeature(shop.plan, 'offers')) {
    return NextResponse.json([], { headers: corsHeaders })
  }

  const offers = await db.offer.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(offers.map((o) => ({
    id: o.id,
    shopId: o.shopId,
    title: o.title,
    description: o.description,
    expiresAt: o.expiresAt?.toISOString() ?? null,
    active: o.active,
    createdAt: o.createdAt.toISOString(),
  })), { headers: corsHeaders })
}

export async function POST(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { title, description, expiresAt } = await req.json()

  if (!hasFeature(shop.plan, 'offers')) {
    return NextResponse.json({ error: 'Le offerte richiedono il piano Growth o superiore.', planRequired: 'GROWTH', currentPlan: shop.plan }, { status: 403, headers: corsHeaders })
  }

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Titolo richiesto' }, { status: 400, headers: corsHeaders })
  }
  if (!description?.trim()) {
    return NextResponse.json({ error: 'Descrizione richiesta' }, { status: 400, headers: corsHeaders })
  }

  const offer = await db.offer.create({
    data: {
      title,
      description,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      shopId: shop.id,
    },
  })

  return NextResponse.json({
    id: offer.id,
    shopId: offer.shopId,
    title: offer.title,
    description: offer.description,
    expiresAt: offer.expiresAt?.toISOString() ?? null,
    active: offer.active,
    createdAt: offer.createdAt.toISOString(),
  }, { status: 201, headers: corsHeaders })
}
