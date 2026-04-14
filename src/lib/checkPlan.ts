import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hasFeature, Feature } from '@/lib/plans'

export async function checkPlan(feature: Feature) {
  const { userId } = await auth()
  if (!userId) return { error: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 }) }

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return { error: NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 }) }
  if (!shop.approved) return { error: NextResponse.json({ error: 'In attesa di approvazione' }, { status: 403 }) }
  if (shop.suspended) return { error: NextResponse.json({ error: 'Account sospeso' }, { status: 403 }) }

  if (!hasFeature(shop.plan, feature)) {
    return { error: NextResponse.json({ error: 'Upgrade richiesto', upgrade: true }, { status: 403 }) }
  }

  return { shop }
}
