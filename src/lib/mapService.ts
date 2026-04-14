import { db } from '@/lib/db'

const CACHE_TTL = 5 * 60 * 1000

interface BoundingBox {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

interface ShopWithDistance {
  id: string
  name: string
  lat: number
  lng: number
  distance: number
  category: string
  pointsPerVisit: number
}

let mapCache: { shops: ShopWithDistance[]; expiresAt: number } | null = null

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function getShopsInBoundingBox(bbox: BoundingBox, userLat: number, userLng: number) {
  if (mapCache && mapCache.expiresAt > Date.now()) {
    return mapCache.shops
  }

  const shops = await db.shop.findMany({
    where: {
      lat: { gte: bbox.minLat, lte: bbox.maxLat },
      lng: { gte: bbox.minLng, lte: bbox.maxLng },
      approved: true,
      suspended: false,
    },
    select: { id: true, name: true, lat: true, lng: true, category: true, pointsPerVisit: true },
  })

  const withDistance = shops.map((shop) => ({
    ...shop,
    distance: calculateDistance(userLat, userLng, shop.lat || 0, shop.lng || 0),
  })).filter((shop) => shop.lat !== null && shop.lng !== null && shop.distance < 50) as ShopWithDistance[]

  mapCache = { shops: withDistance, expiresAt: Date.now() + CACHE_TTL }
  return withDistance
}

export async function getShopDetail(shopId: string) {
  const shop = await db.shop.findUnique({
    where: { id: shopId },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      logo: true,
      address: true,
      city: true,
      phone: true,
      website: true,
      pointsPerVisit: true,
      rewards: { take: 5, orderBy: { createdAt: 'desc' } },
    },
  })
  return shop
}

export function clearMapCache() {
  mapCache = null
}
