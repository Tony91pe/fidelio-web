import { NextResponse } from 'next/server'
import { getShopsInBoundingBox } from '@/lib/mapService'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const radius = parseInt(searchParams.get('radius') || '50')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 }, { headers: corsHeaders })
  }

  const bbox = {
    minLat: lat - 0.5,
    maxLat: lat + 0.5,
    minLng: lng - 0.5,
    maxLng: lng + 0.5,
  }

  const shops = await getShopsInBoundingBox(bbox, lat, lng)
  
  return NextResponse.json({
    shops: shops.filter(s => s.distance <= radius, { headers: corsHeaders }),
    center: { lat, lng },
    count: shops.length,
  })
}
