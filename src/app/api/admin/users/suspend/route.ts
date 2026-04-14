import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { userId: targetId, suspend } = body

  const shop = await db.shop.findUnique({ where: { id: targetId } })
  if (!shop) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.shop.update({ where: { id: targetId }, data: { suspended: suspend } })
  await logEvent({ eventType: 'ACCOUNT_SUSPENDED', userId, action: `Suspended: ${suspend}`, metadata: { targetId } })

  return NextResponse.json({ success: true })
}
