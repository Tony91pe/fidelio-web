import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logging'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({ blockedIPs: [] })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { ip, action } = body

  await logEvent({
    eventType: 'IP_BLOCKED',
    userId,
    action: `IP ${action}`,
    metadata: { ip },
  })

  return NextResponse.json({ success: true })
}
