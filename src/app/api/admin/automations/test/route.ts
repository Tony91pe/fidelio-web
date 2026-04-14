import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId, automationId } = body

  await logEvent({
    eventType: 'AUTOMATION_TEST',
    userId,
    action: 'Test automation sent',
    metadata: { shopId, automationId },
  })

  return NextResponse.json({ success: true })
}
