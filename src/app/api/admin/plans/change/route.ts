import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { upgradeDowngradePlan } from '@/lib/planManagement'
import { logEvent } from '@/lib/logging'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { shopId, newPlan } = await req.json()

  try {
    const result = await upgradeDowngradePlan(shopId, newPlan)
    await logEvent({ eventType: 'PLAN_CHANGED_ADMIN', userId, action: `Changed to ${newPlan}`, metadata: { shopId } })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
