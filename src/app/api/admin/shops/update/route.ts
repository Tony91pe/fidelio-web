import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

const ALLOWED_FIELDS = ['name', 'description', 'address', 'city', 'phone', 'website', 'category']

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { shopId, data } = await req.json()

  const safeData = Object.fromEntries(
    Object.entries(data ?? {}).filter(([k]) => ALLOWED_FIELDS.includes(k))
  )

  try {
    const updated = await db.shop.update({ where: { id: shopId }, data: safeData })
    await logEvent({ eventType: 'SHOP_UPDATED', userId, action: 'Shop data updated', metadata: { shopId } })
    return NextResponse.json({ id: updated.id, name: updated.name })
  } catch {
    return NextResponse.json({ error: 'Aggiornamento fallito' }, { status: 400 })
  }
}
