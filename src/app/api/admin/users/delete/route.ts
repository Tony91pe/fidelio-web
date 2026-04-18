import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { userId: targetId, type } = await req.json()

  try {
    if (type === 'MERCHANT') {
      await db.shop.delete({ where: { id: targetId } })
    } else if (type === 'CUSTOMER') {
      await db.customer.delete({ where: { id: targetId } })
    }
    await logEvent({ eventType: 'ACCOUNT_DELETED', userId, action: `Deleted ${type}`, metadata: { targetId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Eliminazione fallita' }, { status: 400 })
  }
}
