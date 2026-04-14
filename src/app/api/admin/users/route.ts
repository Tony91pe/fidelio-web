import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '50')

  const shops = await db.shop.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
    select: { id: true, name: true, ownerId: true, suspended: true, createdAt: true, updatedAt: true },
    take: limit,
  })

  const customers = await db.customer.findMany({
    where: search ? { email: { contains: search, mode: 'insensitive' } } : {},
    select: { id: true, email: true, name: true, createdAt: true, lastVisitAt: true },
    take: limit,
  })

  return NextResponse.json({
    users: [
      ...shops.map(s => ({
        id: s.id,
        type: 'MERCHANT',
        name: s.name,
        email: s.ownerId,
        suspended: s.suspended,
        createdAt: s.createdAt,
        lastActivityAt: s.updatedAt,
      })),
      ...customers.map(c => ({
        id: c.id,
        type: 'CUSTOMER',
        name: c.name,
        email: c.email,
        suspended: false,
        createdAt: c.createdAt,
        lastActivityAt: c.lastVisitAt,
      })),
    ],
    count: shops.length + customers.length,
  })
}
