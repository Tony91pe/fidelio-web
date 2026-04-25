import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'
import { logEvent } from '@/lib/logging'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result

  let body: { customerCode?: unknown; rewardId?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400, headers: corsHeaders }) }
  const { customerCode, rewardId } = body

  if (typeof customerCode !== 'string' || customerCode.trim().length < 4) {
    return NextResponse.json({ error: 'Codice cliente non valido' }, { status: 400, headers: corsHeaders })
  }

  const customer = await db.customer.findUnique({ where: { code: customerCode } })
  if (!customer) {
    return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404, headers: corsHeaders })
  }

  let pointsToDeduct: number
  let rewardDesc: string
  let rewardRecord: { id: string; title: string; pointsCost: number } | null = null

  if (typeof rewardId === 'string' && rewardId) {
    rewardRecord = await db.reward.findFirst({
      where: { id: rewardId, shopId: shop.id, active: true },
    })
    if (!rewardRecord) {
      return NextResponse.json({ error: 'Premio non trovato' }, { status: 404, headers: corsHeaders })
    }
    pointsToDeduct = rewardRecord.pointsCost
    rewardDesc = rewardRecord.title
  } else {
    pointsToDeduct = shop.rewardThreshold
    rewardDesc = shop.rewardDescription
  }

  if (customer.points < pointsToDeduct) {
    return NextResponse.json({ error: 'Punti insufficienti per riscattare il premio' }, { status: 400, headers: corsHeaders })
  }

  const newPoints = customer.points - pointsToDeduct

  // Cerca il record per-negozio per aggiornare i punti visibili nella PWA cliente
  const perShopCustomer = await db.customer.findFirst({
    where: { email: customer.email, shopId: shop.id },
  })

  await db.$transaction(async (tx) => {
    await tx.customer.update({
      where: { id: customer.id },
      data: { points: { decrement: pointsToDeduct } },
    })

    if (perShopCustomer && perShopCustomer.points >= pointsToDeduct) {
      await tx.customer.update({
        where: { id: perShopCustomer.id },
        data: { points: { decrement: pointsToDeduct } },
      })
    }

    if (rewardRecord) {
      await tx.redemption.create({
        data: {
          points: pointsToDeduct,
          customerId: customer.id,
          rewardId: rewardRecord.id,
        },
      })
    }
  })

  await logEvent({
    eventType: 'REWARD_REDEEMED',
    shopId: shop.id,
    customerId: customer.id,
    action: `Premio riscattato: "${rewardDesc}" da ${customer.name ?? customer.email} (-${pointsToDeduct} punti)`,
    metadata: { pointsDeducted: pointsToDeduct, remainingPoints: newPoints, rewardId: rewardRecord?.id ?? null },
  })

  return NextResponse.json({
    success: true,
    customerName: customer.name,
    rewardDescription: rewardDesc,
    pointsDeducted: pointsToDeduct,
    remainingPoints: newPoints,
  }, { headers: corsHeaders })
}
