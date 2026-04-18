import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getFeatures } from '@/lib/planFeatures'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json([])
  return NextResponse.json(await db.reward.findMany({
    where: { shopId: shop.id, active: true }, orderBy: { pointsCost: 'asc' }
  }))
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  const features = getFeatures(shop.plan)
  if (features.maxRewards !== Infinity) {
    const count = await db.reward.count({ where: { shopId: shop.id, active: true } })
    if (count >= features.maxRewards) {
      return NextResponse.json(
        { error: `Piano ${shop.plan}: massimo ${features.maxRewards} premi attivi. Aggiorna a Growth per premi illimitati.`, planLimit: true, currentPlan: shop.plan },
        { status: 403 }
      )
    }
  }
  const { title, description, pointsCost } = await req.json()
  return NextResponse.json(await db.reward.create({
    data: { title, description, pointsCost, shopId: shop.id }
  }))
}
