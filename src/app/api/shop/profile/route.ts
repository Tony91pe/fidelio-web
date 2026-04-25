import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

async function geocodeAddress(address: string, city: string) {
  try {
    const q = encodeURIComponent(`${address}, ${city}, Italy`)
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, {
      headers: { 'User-Agent': 'Fidelio/1.0' },
    })
    const data = await res.json()
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    return null
  } catch { return null }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function PATCH(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const body = await req.json()

  const {
    name, address, city, phone, category,
    rewardThreshold, rewardDescription, pointsSystem,
    pointsPerVisit, pointsPerEuro, welcomePoints,
  } = body

  // Geocoding automatico se cambia indirizzo o città
  let coordsUpdate: { lat?: number; lng?: number } = {}
  if (address !== undefined || city !== undefined) {
    const fullAddress = address ?? shop.address
    const fullCity = city ?? shop.city
    if (fullAddress && fullCity) {
      const coords = await geocodeAddress(fullAddress, fullCity)
      if (coords) coordsUpdate = { lat: coords.lat, lng: coords.lng }
    }
  }

  const effectiveName = name ?? shop.name
  const effectiveAddress = address ?? shop.address
  const effectiveCity = city ?? shop.city
  const effectiveCategory = category ?? shop.category
  const profileComplete = !!(effectiveName && effectiveAddress && effectiveCity && effectiveCategory)

  const updated = await db.shop.update({
    where: { id: shop.id },
    data: {
      ...(name !== undefined && { name }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(phone !== undefined && { phone }),
      ...(category !== undefined && { category }),
      ...(rewardThreshold !== undefined && { rewardThreshold }),
      ...(rewardDescription !== undefined && { rewardDescription }),
      ...(pointsSystem !== undefined && { pointsSystem }),
      ...(pointsPerVisit !== undefined && { pointsPerVisit }),
      ...(pointsPerEuro !== undefined && { pointsPerEuro }),
      ...(welcomePoints !== undefined && { welcomePoints }),
      ...coordsUpdate,
      ...(profileComplete && !shop.approved && { approved: true }),
    },
  })

  return NextResponse.json({
    shop: {
      id: updated.id,
      name: updated.name,
      category: updated.category,
      address: updated.address,
      city: updated.city,
      phone: updated.phone,
      logo: updated.logo,
      rewardThreshold: updated.rewardThreshold,
      rewardDescription: updated.rewardDescription,
      pointsSystem: updated.pointsSystem,
      pointsPerVisit: updated.pointsPerVisit,
      pointsPerEuro: updated.pointsPerEuro,
      welcomePoints: updated.welcomePoints,
    },
  }, { headers: corsHeaders })
}
