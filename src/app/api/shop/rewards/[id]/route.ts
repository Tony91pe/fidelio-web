import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { id } = await params
  const { description, pointsRequired, active } = await req.json()

  const existing = await db.reward.findFirst({ where: { id, shopId: shop.id } })
  if (!existing) {
    return NextResponse.json({ error: 'Premio non trovato' }, { status: 404, headers: corsHeaders })
  }

  const updated = await db.reward.update({
    where: { id },
    data: {
      ...(description !== undefined && { title: description }),
      ...(pointsRequired !== undefined && { pointsCost: pointsRequired }),
      ...(active !== undefined && { active }),
    },
  })

  return NextResponse.json({
    id: updated.id,
    shopId: updated.shopId,
    description: updated.title,
    pointsRequired: updated.pointsCost,
    active: updated.active,
    createdAt: updated.createdAt.toISOString(),
  }, { headers: corsHeaders })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { id } = await params

  const existing = await db.reward.findFirst({ where: { id, shopId: shop.id } })
  if (!existing) {
    return NextResponse.json({ error: 'Premio non trovato' }, { status: 404, headers: corsHeaders })
  }

  await db.reward.delete({ where: { id } })
  return NextResponse.json({ success: true }, { headers: corsHeaders })
}
