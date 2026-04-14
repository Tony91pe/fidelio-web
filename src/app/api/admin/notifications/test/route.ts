import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { email } = body

  await logEvent({ eventType: 'NOTIFICATION_TEST', userId, action: 'Test notification sent', metadata: { email } })

  return NextResponse.json({ success: true })
}
