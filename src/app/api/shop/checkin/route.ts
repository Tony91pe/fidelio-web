import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendPushNotification } from '@/lib/push'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'
import { logEvent } from '@/lib/logging'

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

  // Cerca il cliente globalmente (qualunque negozio Fidelio)
  const customer = await db.customer.findUnique({ where: { code: customerCode } })
  if (!customer) {
    return NextResponse.json({ error: 'Cliente non trovato. Il codice non è registrato su Fidelio.' }, { status: 404, headers: corsHeaders })
  }

  // Controlla se è la prima visita in questo negozio
  const previousVisits = await db.visit.count({
    where: { customerId: customer.id, shopId: shop.id },
  })
  const isFirstVisit = previousVisits === 0

  let points: number
  let note: string

  if (isFirstVisit) {
    points = shop.welcomePoints
    note = 'Benvenuto!'
  } else {
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
    note = 'Timbro PWA'
  }

  await db.$transaction([
    db.visit.create({
      data: { points, customerId: customer.id, shopId: shop.id, amount: amount || null, note },
    }),
    db.customer.update({
      where: { id: customer.id },
      data: { points: { increment: points }, totalVisits: { increment: 1 }, lastVisitAt: new Date() },
    }),
  ])

  const newPoints = customer.points + points

  // Notifiche push al cliente
  const subscriptions = await db.pushSubscription.findMany({ where: { email: customer.email } })
  for (const sub of subscriptions) {
    const isRewardReady = newPoints >= shop.rewardThreshold
    await sendPushNotification(sub, {
      title: isFirstVisit
        ? `🎉 Benvenuto da ${shop.name}!`
        : isRewardReady
          ? '🎉 Premio disponibile!'
          : `+${points} punti da ${shop.name}`,
      body: isFirstVisit
        ? `Hai ricevuto ${points} punti di benvenuto. Inizia ad accumulare!`
        : isRewardReady
          ? `Hai raggiunto ${newPoints} punti! Ritira: ${shop.rewardDescription}`
          : `Hai ora ${newPoints} punti. Ancora ${Math.max(shop.rewardThreshold - newPoints, 0)} al premio.`,
      icon: '/icons/icon-192x192.png',
    })
  }

  await logEvent({
    eventType: 'CHECKIN',
    shopId: shop.id,
    customerId: customer.id,
    action: `${isFirstVisit ? 'Prima visita' : 'Timbro'}: +${points} punti a ${customer.name ?? customer.email}`,
    metadata: { points, totalPoints: newPoints, isFirstVisit, amount: amount || null },
  })

  return NextResponse.json({
    customerName: customer.name,
    customerCode: customer.code,
    pointsAdded: points,
    totalPoints: newPoints,
    isFirstVisit,
  }, { headers: corsHeaders })
}
