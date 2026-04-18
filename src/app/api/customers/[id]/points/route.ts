import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const customer = await db.customer.findUnique({ where: { id } })
  if (!customer || customer.shopId !== shop.id) {
    return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })
  }

  const { points, note } = await req.json()
  if (!points || typeof points !== 'number') {
    return NextResponse.json({ error: 'Punti non validi' }, { status: 400 })
  }

  await db.$transaction([
    db.visit.create({ data: { points, note: note || null, customerId: id, shopId: shop.id } }),
    db.customer.update({ where: { id }, data: { points: { increment: points }, totalVisits: { increment: 1 }, lastVisitAt: new Date() } }),
  ])

  return NextResponse.json({ success: true })
}
