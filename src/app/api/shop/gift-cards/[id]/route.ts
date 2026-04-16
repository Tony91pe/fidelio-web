import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { id } = await params

  const card = await db.giftCard.findFirst({ where: { id, shopId: shop.id } })
  if (!card) {
    return NextResponse.json({ error: 'Gift card non trovata' }, { status: 404, headers: corsHeaders })
  }

  await db.giftCard.delete({ where: { id } })
  return NextResponse.json({ success: true }, { headers: corsHeaders })
}
