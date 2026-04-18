import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'
import { logEvent } from '@/lib/logging'

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

  try {
    const updated = await db.$transaction(async (tx) => {
      const card = await tx.giftCard.findFirst({ where: { id, shopId: shop.id } })
      if (!card) throw new Error('NOT_FOUND')
      if (card.used) throw new Error('ALREADY_USED')

      const totalValue = card.value ?? card.points
      const currentRemaining = card.remainingValue ?? totalValue
      const usedAmount = amount ?? currentRemaining

      if (usedAmount <= 0 || usedAmount > currentRemaining) throw new Error('INVALID_AMOUNT:' + currentRemaining)

      const newRemaining = Math.round((currentRemaining - usedAmount) * 100) / 100
      const isFullyUsed = newRemaining <= 0

      return tx.giftCard.update({
        where: { id },
        data: { remainingValue: newRemaining, used: isFullyUsed, usedAt: isFullyUsed ? new Date() : null },
      })
    })

    await logEvent({
      eventType: 'GIFTCARD_USED',
      shopId: shop.id,
      action: `Gift card ${id.slice(0, 8)} usata${updated.used ? ' — esaurita' : ''}`,
      metadata: { cardId: id, amountUsed: amount, remainingValue: updated.remainingValue, fullyUsed: updated.used },
    })

    return NextResponse.json({
      success: true,
      remainingValue: updated.remainingValue,
      fullyUsed: updated.used,
    }, { headers: corsHeaders })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'NOT_FOUND') return NextResponse.json({ error: 'Gift card non trovata' }, { status: 404, headers: corsHeaders })
    if (msg === 'ALREADY_USED') return NextResponse.json({ error: 'Gift card già esaurita' }, { status: 400, headers: corsHeaders })
    if (msg.startsWith('INVALID_AMOUNT:')) {
      const rem = msg.split(':')[1]
      return NextResponse.json({ error: `Importo non valido. Saldo: €${rem}` }, { status: 400, headers: corsHeaders })
    }
    return NextResponse.json({ error: 'Errore interno' }, { status: 500, headers: corsHeaders })
  }
}
