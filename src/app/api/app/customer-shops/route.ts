import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json([], { headers: corsHeaders })

  const customers = await db.customer.findMany({
    where: { email },
    include: { shop: true }
  })

  const result = await Promise.all(customers.map(async (c) => {
    const nextReward = await db.reward.findFirst({
      where: { shopId: c.shopId, active: true, pointsCost: { gt: c.points } },
      orderBy: { pointsCost: 'asc' }
    })

    return {
      shopId: c.shopId,
      shopName: c.shop.name,
      category: c.shop.category,
      points: c.points,
      totalVisits: c.totalVisits,
      nextRewardPoints: nextReward?.pointsCost || c.shop.rewardThreshold,
      rewardDescription: nextReward?.description || c.shop.rewardDescription,
    }
  }))

  return NextResponse.json(result, { headers: corsHeaders })
}