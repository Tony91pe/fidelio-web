import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shops = await db.shop.findMany({
    where: { ownerId: userId },
    include: { _count: { select: { customers: true, visits: true } } },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(shops.map(s => ({
    id: s.id,
    name: s.name,
    address: s.address,
    city: s.city,
    plan: s.plan,
    customers: s._count.customers,
    visits: s._count.visits,
    approved: s.approved,
    createdAt: s.createdAt,
  })))
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const primary = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!primary) return NextResponse.json({ error: 'Negozio principale non trovato' }, { status: 404 })
  if (primary.plan !== 'PRO') return NextResponse.json({ error: 'Richiede piano PRO' }, { status: 403 })

  const { name, address, city, category } = await req.json()
  if (!name || !address || !city) return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })

  const branch = await db.shop.create({
    data: {
      name,
      address,
      city,
      category: category ?? primary.category,
      ownerId: userId,
      ownerEmail: primary.ownerEmail,
      plan: 'PRO',
      approved: true,
    },
  })

  return NextResponse.json(branch, { status: 201 })
}
