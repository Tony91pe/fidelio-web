import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  return NextResponse.json({
    id: shop.id, name: shop.name, phone: shop.phone ?? '',
    address: shop.address, city: shop.city,
    lat: shop.lat, lng: shop.lng,
    pointsSystem: shop.pointsSystem, pointsPerVisit: shop.pointsPerVisit,
    pointsPerEuro: shop.pointsPerEuro, rewardThreshold: shop.rewardThreshold,
    rewardDescription: shop.rewardDescription, welcomePoints: shop.welcomePoints,
  })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { name, phone, address, city, lat, lng, pointsSystem, pointsPerVisit, pointsPerEuro, rewardThreshold, rewardDescription, welcomePoints } = await req.json()
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  const updated = await db.shop.update({
    where: { id: shop.id },
    data: { name, phone, address, city, lat: lat ?? null, lng: lng ?? null, pointsSystem, pointsPerVisit, pointsPerEuro, rewardThreshold, rewardDescription, welcomePoints }
  })
  return NextResponse.json(updated)
}