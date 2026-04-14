import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getLogsForShop } from '@/lib/logging'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const shopId = searchParams.get('shopId')

  if (!shopId) return NextResponse.json({ error: 'Missing shopId' }, { status: 400 })

  const logs = await getLogsForShop(shopId, 1000)
  const planLogs = logs.filter(l => l.eventType.includes('PLAN'))

  return NextResponse.json({ logs: planLogs })
}
