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

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { shopId } = await req.json()
  if (!shopId) return NextResponse.json({ error: 'shopId mancante' }, { status: 400 })

  // Verifica che la sede appartenga all'utente e che NON sia la principale (la prima creata)
  const shops = await db.shop.findMany({ where: { ownerId: userId }, orderBy: { createdAt: 'asc' } })
  if (shops.length === 0) return NextResponse.json({ error: 'Nessun negozio trovato' }, { status: 404 })
  if (shops[0].id === shopId) return NextResponse.json({ error: 'Non puoi eliminare la sede principale' }, { status: 400 })

  const branch = shops.find(s => s.id === shopId)
  if (!branch) return NextResponse.json({ error: 'Sede non trovata' }, { status: 404 })

  const customers = await db.customer.findMany({ where: { shopId }, select: { id: true } })
  const customerIds = customers.map(c => c.id)

  await db.$transaction([
    db.redemption.deleteMany({ where: { customerId: { in: customerIds } } }),
    db.visit.deleteMany({ where: { shopId } }),
    db.customer.deleteMany({ where: { shopId } }),
    db.reward.deleteMany({ where: { shopId } }),
    db.campaign.deleteMany({ where: { shopId } }),
    db.giftCard.deleteMany({ where: { shopId } }),
    db.offer.deleteMany({ where: { shopId } }),
    db.shop.delete({ where: { id: shopId } }),
  ])

  return NextResponse.json({ ok: true })
}
