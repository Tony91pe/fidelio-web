import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { geocodeAddress } from '@/lib/geocode'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  return NextResponse.json({
    id: shop.id, name: shop.name, logo: shop.logo ?? null, phone: shop.phone ?? '',
    address: shop.address, city: shop.city,
    lat: shop.lat, lng: shop.lng,
    pointsSystem: shop.pointsSystem, pointsPerVisit: shop.pointsPerVisit,
    pointsPerEuro: shop.pointsPerEuro, rewardThreshold: shop.rewardThreshold,
    rewardDescription: shop.rewardDescription, welcomePoints: shop.welcomePoints,
    primaryColor: shop.primaryColor ?? '#7C3AED',
    winbackDays: shop.winbackDays,
    plan: shop.plan,
  })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { name, phone, address, city, pointsSystem, pointsPerVisit, pointsPerEuro, rewardThreshold, rewardDescription, welcomePoints, primaryColor, winbackDays } = await req.json()
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  // Geocoding automatico se l'indirizzo o la città cambia
  let coords: { lat: number; lng: number } | null = null
  const newAddress = address ?? shop.address
  const newCity = city ?? shop.city
  if ((address && address !== shop.address) || (city && city !== shop.city)) {
    coords = await geocodeAddress(newAddress, newCity)
  }
  // Se il negozio non ha ancora coordinate, prova comunque
  if (!shop.lat && !shop.lng && newAddress && newCity) {
    coords = await geocodeAddress(newAddress, newCity)
  }

  const updated = await db.shop.update({
    where: { id: shop.id },
    data: {
      name, phone, address, city,
      ...(coords && { lat: coords.lat, lng: coords.lng }),
      pointsSystem, pointsPerVisit, pointsPerEuro,
      rewardThreshold, rewardDescription, welcomePoints,
      ...(primaryColor && { primaryColor }),
      ...(winbackDays && { winbackDays: parseInt(winbackDays) }),
    }
  })
  return NextResponse.json(updated)
}