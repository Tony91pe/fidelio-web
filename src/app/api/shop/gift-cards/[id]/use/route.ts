import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const amount: number | undefined = body.amount ? parseFloat(body.amount) : undefined

  const card = await db.giftCard.findFirst({ where: { id, shopId: shop.id } })
  if (!card) {
    return NextResponse.json({ error: 'Gift card non trovata' }, { status: 404, headers: corsHeaders })
  }
  if (card.used) {
    return NextResponse.json({ error: 'Gift card già esaurita' }, { status: 400, headers: corsHeaders })
  }

  const totalValue = card.value ?? card.points
  const currentRemaining = card.remainingValue ?? totalValue
  const usedAmount = amount ?? currentRemaining

  if (usedAmount <= 0 || usedAmount > currentRemaining) {
    return NextResponse.json(
      { error: 'Importo non valido. Saldo disponibile: €' + currentRemaining.toFixed(2) },
      { status: 400, headers: corsHeaders }
    )
  }

  const newRemaining = Math.round((currentRemaining - usedAmount) * 100) / 100
  const isFullyUsed = newRemaining <= 0

  await db.giftCard.update({
    where: { id },
    data: {
      remainingValue: newRemaining,
      used: isFullyUsed,
      usedAt: isFullyUsed ? new Date() : null,
    },
  })

  return NextResponse.json({
    success: true,
    remainingValue: newRemaining,
    fullyUsed: isFullyUsed,
    usedAmount,
  }, { headers: corsHeaders })
}
