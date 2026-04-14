import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { upgradeDowngradePlan } from '@/lib/planManagement'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId, newPlan } = body

  try {
    const result = await upgradeDowngradePlan(shopId, newPlan)
    await logEvent({ eventType: 'PLAN_CHANGED_ADMIN', userId, action: `Changed to ${newPlan}`, metadata: { shopId } })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
