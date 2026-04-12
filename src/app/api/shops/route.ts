import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function geocodeAddress(address: string, city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${address}, ${city}, Italy`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { 'User-Agent': 'Fidelio/1.0' } }
    )
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null
  } catch {
    return null
  }
}

export async function GET() {
  const shops = await db.shop.findMany({
    select: { id: true, name: true, category: true, city: true, address: true }
  })
  return NextResponse.json(shops)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { name, category, address, city, phone } = await req.json()

  const coords = await geocodeAddress(address, city)

  const shop = await db.shop.create({
    data: {
      name,
      category,
      address,
      city,
      phone,
      ownerId: userId,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    }
  })

  return NextResponse.json(shop)
}