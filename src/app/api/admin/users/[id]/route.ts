import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { id } = await params
  const shop = await db.shop.findUnique({
    where: { id },
    select: { id: true, name: true, ownerId: true, suspended: true, approved: true, plan: true, createdAt: true, _count: { select: { customers: true } } }
  })
  if (!shop) return NextResponse.json({ error: 'Non trovato' }, { status: 404 })
  return NextResponse.json({ ...shop, type: 'shop', customerCount: shop._count.customers })
}
