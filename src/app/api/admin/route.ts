import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function GET() {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const [shops, totalCustomers, totalVisits] = await Promise.all([
    db.shop.findMany({
      include: {
        _count: { select: { customers: true, visits: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.customer.count(),
    db.visit.count(),
  ])
  return NextResponse.json({ shops, totalCustomers, totalVisits })
}
