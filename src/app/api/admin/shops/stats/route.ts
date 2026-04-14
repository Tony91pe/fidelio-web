import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const shopId = searchParams.get('shopId')

  if (!shopId) return NextResponse.json({ error: 'Missing shopId' }, { status: 400 })

  const shop = await db.shop.findUnique({
    where: { id: shopId },
    include: {
      customers: true,
      rewards: true,
      visits: true,
      campaigns: true,
    },
  })

  if (!shop) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    totalCustomers: shop.customers.length,
    totalVisits: shop.visits.length,
    activeRewards: shop.rewards.filter(r => r.active).length,
    totalRewards: shop.rewards.length,
    activeCampaigns: shop.campaigns.length,
  })
}
