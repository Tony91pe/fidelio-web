import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendPushNotification } from '@/lib/push'
import { sendPointsEmail, sendNearRewardEmail } from '@/lib/email'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  let body: { customerCode?: unknown; amount?: unknown; shopId?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 }) }
  const { customerCode, amount, shopId } = body

  const shop = (typeof shopId === 'string' && shopId)
    ? await db.shop.findFirst({ where: { id: shopId, ownerId: userId } })
    : await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  if (typeof customerCode !== 'string' || customerCode.trim().length < 4 || customerCode.trim().length > 60)
    return NextResponse.json({ error: 'Codice cliente non valido' }, { status: 400 })
  if (amount !== undefined && amount !== null && (typeof amount !== 'number' || amount < 0 || amount > 100_000))
    return NextResponse.json({ error: 'Importo non valido' }, { status: 400 })

  const customer = await db.customer.findUnique({ where: { code: customerCode } })
  if (!customer) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })

  let points = 0
  if (shop.pointsSystem === 'per_visit') {
    points = shop.pointsPerVisit
  } else if (shop.pointsSystem === 'per_euro' && amount) {
    points = Math.floor(amount * shop.pointsPerEuro)
  } else if (shop.pointsSystem === 'combined') {
    points = shop.pointsPerVisit + (amount ? Math.floor(amount * shop.pointsPerEuro) : 0)
  } else {
    points = shop.pointsPerVisit
  }

  await db.$transaction([
    db.visit.create({
      data: { points, customerId: customer.id, shopId: shop.id, amount: amount || null, note: 'Timbro' }
    }),
    db.customer.update({
      where: { id: customer.id },
      data: { points: { increment: points }, totalVisits: { increment: 1 }, lastVisitAt: new Date() }
    })
  ])

  const newPoints = customer.points + points
  const isRewardReady = newPoints >= shop.rewardThreshold
  const isNearReward = !isRewardReady && newPoints >= shop.rewardThreshold * 0.8

  // Push al cliente (se abilitato dal negozio)
  if (shop.pushNotificationsEnabled) {
    const subscriptions = await db.pushSubscription.findMany({ where: { email: customer.email } })
    for (const sub of subscriptions) {
      await sendPushNotification(sub, {
        title: isRewardReady ? '🎉 Premio disponibile!' : `+${points} punti da ${shop.name}`,
        body: isRewardReady
          ? `Hai raggiunto ${newPoints} punti! Ritira il tuo premio: ${shop.rewardDescription}`
          : `Hai ora ${newPoints} punti. Ti mancano ${Math.max(shop.rewardThreshold - newPoints, 0)} punti al prossimo premio.`,
        icon: '/icons/icon-192x192.png',
      })
    }
  }

  // Email transazionale al cliente (se abilitato e ha email)
  if (shop.emailNotificationsEnabled && customer.email) {
    try {
      if (isNearReward) {
        await sendNearRewardEmail(
          customer.email, customer.name ?? 'Cliente', shop.name,
          newPoints, shop.rewardThreshold, shop.rewardDescription
        )
      } else {
        await sendPointsEmail(
          customer.email, customer.name ?? 'Cliente', shop.name,
          points, newPoints, shop.rewardThreshold
        )
      }
    } catch { /* non bloccare il timbro se l'email fallisce */ }
  }

  await logEvent({
    eventType: 'CHECKIN',
    userId,
    shopId: shop.id,
    customerId: customer.id,
    action: `Timbro: +${points} punti a ${customer.name ?? customer.email}`,
    metadata: { points, totalPoints: customer.points + points, amount: amount || null },
  })

  return NextResponse.json({ ok: true, pointsAdded: points })
}