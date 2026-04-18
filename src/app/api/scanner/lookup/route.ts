import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const { customerCode } = await req.json()
  if (!customerCode) return NextResponse.json({ error: 'Codice mancante' }, { status: 400 })

  const customer = await db.customer.findFirst({
    where: { code: customerCode, shopId: shop.id },
  })
  if (!customer) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })

  return NextResponse.json({
    code: customer.code,
    name: customer.name,
    email: customer.email,
    points: customer.points,
    totalVisits: customer.totalVisits,
    rewardThreshold: shop.rewardThreshold,
    rewardDescription: shop.rewardDescription,
  })
}
