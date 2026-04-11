import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const shops = await db.shop.findMany({
    select: { id:true, name:true, category:true, city:true, address:true }
  })
  return NextResponse.json(shops)
}
