import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { geocodeAddress } from '@/lib/geocode'

function toSlug(name: string): string {
  return name.toLowerCase().trim()
    .replace(/[àáâã]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõ]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60)
}

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
    emailNotificationsEnabled: shop.emailNotificationsEnabled,
    pushNotificationsEnabled: shop.pushNotificationsEnabled,
    birthdayEmailEnabled: shop.birthdayEmailEnabled,
    winbackEmailEnabled: shop.winbackEmailEnabled,
    onboardingCompleted: shop.onboardingCompleted,
    googleReviewUrl: shop.googleReviewUrl ?? '',
    googleReviewEnabled: shop.googleReviewEnabled,
    googleReviewMinVisits: shop.googleReviewMinVisits ?? 3,
  })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { name, phone, address, city, pointsSystem, pointsPerVisit, pointsPerEuro, rewardThreshold, rewardDescription, welcomePoints, primaryColor, winbackDays, emailNotificationsEnabled, pushNotificationsEnabled, birthdayEmailEnabled, winbackEmailEnabled, googleReviewUrl, googleReviewEnabled, googleReviewMinVisits } = await req.json()
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

  // Genera slug se non esiste ancora o se il nome è cambiato
  let slug = shop.slug
  if (!slug && (name ?? shop.name)) {
    const base = toSlug(name ?? shop.name)
    slug = base
    let suffix = 1
    while (await db.shop.findFirst({ where: { slug, NOT: { id: shop.id } } })) {
      slug = `${base}-${suffix++}`
    }
  }

  const updated = await db.shop.update({
    where: { id: shop.id },
    data: {
      name, phone, address, city,
      ...(slug && !shop.slug ? { slug } : {}),
      ...(coords && { lat: coords.lat, lng: coords.lng }),
      pointsSystem, pointsPerVisit, pointsPerEuro,
      rewardThreshold, rewardDescription, welcomePoints,
      ...(primaryColor && { primaryColor }),
      ...(winbackDays && { winbackDays: parseInt(winbackDays) }),
      ...(emailNotificationsEnabled !== undefined && { emailNotificationsEnabled }),
      ...(pushNotificationsEnabled !== undefined && { pushNotificationsEnabled }),
      ...(birthdayEmailEnabled !== undefined && { birthdayEmailEnabled }),
      ...(winbackEmailEnabled !== undefined && { winbackEmailEnabled }),
      ...(googleReviewUrl !== undefined && { googleReviewUrl: googleReviewUrl || null }),
      ...(googleReviewEnabled !== undefined && { googleReviewEnabled }),
      ...(googleReviewMinVisits !== undefined && { googleReviewMinVisits: parseInt(googleReviewMinVisits) }),
    }
  })
  return NextResponse.json(updated)
}