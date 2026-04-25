import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const shop = await db.shop.findUnique({
    where: { id, approved: true, suspended: false },
    select: {
      id: true, name: true, category: true, description: true, logo: true,
      address: true, city: true, phone: true, website: true, lat: true, lng: true,
      pointsPerVisit: true, rewardThreshold: true, rewardDescription: true,
      rewards: { where: { active: true }, select: { id: true, title: true, pointsCost: true } },
    }
  })
  if (!shop) return NextResponse.json({ error: 'Non trovato' }, { status: 404, headers: corsHeaders })
  return NextResponse.json(shop, { headers: corsHeaders })
}
