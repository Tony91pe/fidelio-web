import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId, lat, lng } = body

  const updated = await db.shop.update({
    where: { id: shopId },
    data: { lat, lng },
  })

  return NextResponse.json(updated)
}
