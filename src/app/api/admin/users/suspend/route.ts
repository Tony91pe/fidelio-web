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

  const { userId: targetId, suspend } = await req.json()
  const shop = await db.shop.findUnique({ where: { id: targetId } })
  if (!shop) return NextResponse.json({ error: 'Non trovato' }, { status: 404 })

  await db.shop.update({ where: { id: targetId }, data: { suspended: suspend } })
  await logEvent({ eventType: 'ACCOUNT_SUSPENDED', userId, action: `Suspended: ${suspend}`, metadata: { targetId } })

  return NextResponse.json({ success: true })
}
