import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const shop = await db.shop.findUnique({
    where: { id, approved: true, suspended: false },
    select: {
      id: true, name: true, category: true, description: true, logo: true,
      address: true, city: true, phone: true, website: true, lat: true, lng: true,
      pointsPerVisit: true, rewardThreshold: true, rewardDescription: true,
      rewards: { select: { id: true, name: true, pointsCost: true } },
    }
  })
  if (!shop) return NextResponse.json({ error: 'Non trovato' }, { status: 404 })
  return NextResponse.json(shop)
}
