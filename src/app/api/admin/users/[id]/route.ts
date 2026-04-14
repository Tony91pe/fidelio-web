import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params

  const shop = await db.shop.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      ownerId: true,
      suspended: true,
      approved: true,
      createdAt: true,
      updatedAt: true,
      plan: true,
      customers: { select: { id: true } },
    },
  })

  if (shop) {
    return NextResponse.json({
      id: shop.id,
      type: 'MERCHANT',
      name: shop.name,
      ownerId: shop.ownerId,
      suspended: shop.suspended,
      approved: shop.approved,
      createdAt: shop.createdAt,
      updatedAt: shop.updatedAt,
      plan: shop.plan,
      customerCount: shop.customers.length,
    })
  }

  const customer = await db.customer.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      points: true,
      totalVisits: true,
      createdAt: true,
      lastVisitAt: true,
      shopId: true,
    },
  })

  if (customer) {
    return NextResponse.json({
      id: customer.id,
      type: 'CUSTOMER',
      name: customer.name,
      email: customer.email,
      points: customer.points,
      totalVisits: customer.totalVisits,
      createdAt: customer.createdAt,
      lastVisitAt: customer.lastVisitAt,
      shopId: customer.shopId,
    })
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 })
}
