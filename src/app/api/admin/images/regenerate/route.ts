import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId } = body

  await logEvent({ eventType: 'THUMBNAILS_REGENERATED', userId, action: 'Thumbnails regenerated', metadata: { shopId } })

  return NextResponse.json({ success: true })
}
