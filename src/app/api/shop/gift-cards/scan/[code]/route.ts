import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { code } = await params

  const card = await db.giftCard.findFirst({
    where: { code, shopId: shop.id },
  })

  if (!card) {
    return NextResponse.json(
      { error: 'Gift card non trovata o non appartiene a questo negozio' },
      { status: 404, headers: corsHeaders }
    )
  }

  return NextResponse.json({
    id: card.id,
    code: card.code,
    value: card.value ?? card.points,
    description: card.description,
    customerName: card.customerName,
    customerEmail: card.customerEmail,
    usedAt: card.usedAt?.toISOString() ?? null,
    createdAt: card.createdAt.toISOString(),
  }, { headers: corsHeaders })
}
