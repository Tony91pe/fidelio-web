import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const shops = await db.shop.findMany({
    select: { id:true, name:true, category:true, city:true, address:true }
  })
  return NextResponse.json(shops)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { name, category, address, city, phone } = await req.json()
  const shop = await db.shop.create({
    data: { name, category, address, city, phone, ownerId: userId }
  })
  return NextResponse.json(shop)
}
