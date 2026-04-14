import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId, data } = body

  try {
    const updated = await db.shop.update({
      where: { id: shopId },
      data: { ...data },
    })

    await logEvent({ eventType: 'SHOP_UPDATED', userId, action: 'Shop data updated', metadata: { shopId } })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
