import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId }, select: { plan: true, billingPortalUrl: true } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  return NextResponse.json({
    plan: shop.plan,
    billingPortalUrl: shop.billingPortalUrl ?? null,
  })
}
