import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })

  const customers = await db.customer.findMany({
    where: { email },
    select: {
      id: true,
      shopId: true,
      shop: { select: { id: true, name: true, category: true } },
      visits: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, points: true, note: true, createdAt: true, amount: true },
      },
    },
  })

  const visits = customers
    .flatMap(c => c.visits.map(v => ({
      id: v.id,
      shopName: c.shop?.name ?? 'Negozio sconosciuto',
      shopCategory: c.shop?.category ?? 'other',
      points: v.points,
      note: v.note,
      amount: v.amount,
      createdAt: v.createdAt,
    })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50)

  return NextResponse.json({ visits })
}
