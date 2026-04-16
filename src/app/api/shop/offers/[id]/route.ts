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
  const { title, description, expiresAt, active } = await req.json()

  const existing = await db.offer.findFirst({ where: { id, shopId: shop.id } })
  if (!existing) {
    return NextResponse.json({ error: 'Offerta non trovata' }, { status: 404, headers: corsHeaders })
  }

  const updated = await db.offer.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(active !== undefined && { active }),
    },
  })

  return NextResponse.json({
    id: updated.id,
    shopId: updated.shopId,
    title: updated.title,
    description: updated.description,
    expiresAt: updated.expiresAt?.toISOString() ?? null,
    active: updated.active,
    createdAt: updated.createdAt.toISOString(),
  }, { headers: corsHeaders })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { id } = await params

  const existing = await db.offer.findFirst({ where: { id, shopId: shop.id } })
  if (!existing) {
    return NextResponse.json({ error: 'Offerta non trovata' }, { status: 404, headers: corsHeaders })
  }

  await db.offer.delete({ where: { id } })
  return NextResponse.json({ success: true }, { headers: corsHeaders })
}
