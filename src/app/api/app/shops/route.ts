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

export async function GET() {
  const shops = await db.shop.findMany({
    select: { id: true, name: true, category: true, city: true, address: true, lat: true, lng: true }
  })
  return NextResponse.json(shops, { headers: corsHeaders })
}