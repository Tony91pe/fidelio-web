import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const shopId = searchParams.get('shopId')

  if (!email) return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })

  const customer = await db.customer.findFirst({
    where: shopId ? { email, shopId } : { email },
    select: { id: true },
  })

  if (!customer) return NextResponse.json({ visits: [] })

  const visits = await db.visit.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      points: true,
      amount: true,
      note: true,
      createdAt: true,
      shop: { select: { id: true, name: true, category: true } },
    },
  })

  return NextResponse.json({ visits })
}
