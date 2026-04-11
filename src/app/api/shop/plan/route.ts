import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ plan: 'STARTER' })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  return NextResponse.json({ plan: shop?.plan ?? 'STARTER' })
}
