import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { userId: targetId, type } = body

  try {
    if (type === 'MERCHANT') {
      await db.shop.delete({ where: { id: targetId } })
    } else if (type === 'CUSTOMER') {
      await db.customer.delete({ where: { id: targetId } })
    }

    await logEvent({ eventType: 'ACCOUNT_DELETED', userId, action: `Deleted ${type}`, metadata: { targetId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 })
  }
}
