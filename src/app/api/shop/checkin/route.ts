import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendPushNotification } from '@/lib/push'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { customerCode, amount } = await req.json()

  if (!customerCode) {
    return NextResponse.json({ error: 'Codice cliente richiesto' }, { status: 400, headers: corsHeaders })
  }

  const customer = await db.customer.findFirst({
    where: { code: customerCode, shopId: shop.id },
  })
  if (!customer) {
    return NextResponse.json({ error: 'Cliente non trovato in questo negozio' }, { status: 404, headers: corsHeaders })
  }

  // Calcola punti in base al sistema configurato
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

  if (points <= 0) points = 1

  await db.$transaction([
    db.visit.create({
      data: {
        points,
        customerId: customer.id,
        shopId: shop.id,
        amount: amount || null,
        note: 'Timbro PWA',
      },
    }),
    db.customer.update({
      where: { id: customer.id },
      data: {
        points: { increment: points },
        totalVisits: { increment: 1 },
        lastVisitAt: new Date(),
      },
    }),
  ])

  const newPoints = customer.points + points

  // Notifiche push al cliente
  const subscriptions = await db.pushSubscription.findMany({
    where: { email: customer.email },
  })
  for (const sub of subscriptions) {
    const isRewardReady = newPoints >= shop.rewardThreshold
    await sendPushNotification(sub, {
      title: isRewardReady ? '🎉 Premio disponibile!' : `+${points} punti da ${shop.name}`,
      body: isRewardReady
        ? `Hai raggiunto ${newPoints} punti! Ritira: ${shop.rewardDescription}`
        : `Hai ora ${newPoints} punti. Ancora ${Math.max(shop.rewardThreshold - newPoints, 0)} al premio.`,
      icon: '/icons/icon-192x192.png',
    })
  }

  return NextResponse.json({
    customerName: customer.name,
    customerCode: customer.code,
    pointsAdded: points,
    totalPoints: newPoints,
  }, { headers: corsHeaders })
}
