import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { upgradeDowngradePlan } from '@/lib/planManagement'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { newPlan } = body

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })

  try {
    const result = await upgradeDowngradePlan(shop.id, newPlan)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
