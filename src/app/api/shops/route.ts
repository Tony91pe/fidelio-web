import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const body = await req.json()
  const { name, category, address, city, phone } = body

  const shop = await db.shop.create({
    data: { name, category, address, city, phone, ownerId: userId },
  })

  return NextResponse.json(shop)
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shops = await db.shop.findMany({ where: { ownerId: userId } })
  return NextResponse.json(shops)
}
