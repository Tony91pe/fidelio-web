import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ status: 'no-shop' })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ status: 'no-shop' })
  if (!shop.approved) return NextResponse.json({ status: 'pending' })
  return NextResponse.json({ status: 'approved' })
}
