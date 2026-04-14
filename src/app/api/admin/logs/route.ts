import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getLogsForShop } from '@/lib/logging'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '100')

  const logs = await getLogsForShop(shop.id, limit)
  return NextResponse.json({ logs, count: logs.length })
}
