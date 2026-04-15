import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET() {
  const shops = await db.shop.findMany({
    where: { approved: true, suspended: false },
    select: {
      id: true, name: true, category: true, city: true, address: true,
      phone: true, description: true, logo: true, lat: true, lng: true,
      pointsPerVisit: true, rewardThreshold: true, rewardDescription: true,
    }
  })
  return NextResponse.json(shops, { headers: corsHeaders })
}
