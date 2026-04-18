import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  const customers = await db.customer.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, points: true, totalVisits: true, lastVisitAt: true, createdAt: true },
  })
  return NextResponse.json(customers)
}
