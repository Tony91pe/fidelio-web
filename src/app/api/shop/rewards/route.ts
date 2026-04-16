import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result

  const rewards = await db.reward.findMany({
    where: { shopId: shop.id },
    orderBy: { pointsCost: 'asc' },
  })

  // Mappa: title → description, pointsCost → pointsRequired (per compatibilità PWA)
  return NextResponse.json(rewards.map((r) => ({
    id: r.id,
    shopId: r.shopId,
    description: r.title,
    pointsRequired: r.pointsCost,
    active: r.active,
    createdAt: r.createdAt.toISOString(),
  })), { headers: corsHeaders })
}

export async function POST(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { description, pointsRequired } = await req.json()

  if (!description?.trim()) {
    return NextResponse.json({ error: 'Descrizione richiesta' }, { status: 400, headers: corsHeaders })
  }
  if (!pointsRequired || pointsRequired <= 0) {
    return NextResponse.json({ error: 'Punti richiesti non validi' }, { status: 400, headers: corsHeaders })
  }

  const reward = await db.reward.create({
    data: { title: description, pointsCost: pointsRequired, shopId: shop.id },
  })

  return NextResponse.json({
    id: reward.id,
    shopId: reward.shopId,
    description: reward.title,
    pointsRequired: reward.pointsCost,
    active: reward.active,
    createdAt: reward.createdAt.toISOString(),
  }, { status: 201, headers: corsHeaders })
}
