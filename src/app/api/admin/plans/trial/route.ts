import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { activateFounderTrial } from '@/lib/planManagement'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId } = body

  try {
    const result = await activateFounderTrial(shopId)
    await logEvent({ eventType: 'TRIAL_ACTIVATED', userId, action: 'Trial activated', metadata: { shopId } })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
