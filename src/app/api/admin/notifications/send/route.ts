import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { notifyUser } from '@/lib/notifications'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { email, subject, template, data } = body

  try {
    await notifyUser({ email, subject, template, data, type: 'both' })
    await logEvent({ eventType: 'NOTIFICATION_SENT', userId, action: 'Admin notification sent', metadata: { email } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
