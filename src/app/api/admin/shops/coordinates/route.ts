import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { geocodeAddress } from '@/lib/geocode'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId, lat, lng, geocodeAll } = body

  // Modalità: geocodifica automatica di tutti i negozi senza coordinate
  if (geocodeAll && userId === ADMIN_USER_ID) {
    const shops = await db.shop.findMany({
      where: { OR: [{ lat: null }, { lng: null }] },
      select: { id: true, address: true, city: true },
    })

    let updated = 0
    let failed = 0
    for (const shop of shops) {
      if (!shop.address || !shop.city) { failed++; continue }
      const coords = await geocodeAddress(shop.address, shop.city)
      if (coords) {
        await db.shop.update({ where: { id: shop.id }, data: { lat: coords.lat, lng: coords.lng } })
        updated++
        // Rispetta il rate limit di Nominatim (1 req/s)
        await new Promise(r => setTimeout(r, 1100))
      } else {
        failed++
      }
    }
    return NextResponse.json({ ok: true, updated, failed, total: shops.length })
  }

  // Modalità: aggiorna coordinate manualmente per un singolo negozio
  const updated = await db.shop.update({
    where: { id: shopId },
    data: { lat, lng },
  })
  return NextResponse.json(updated)
}
