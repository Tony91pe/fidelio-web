import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCustomerFromRequest, corsHeaders } from '@/lib/customerAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getCustomerFromRequest(req)
  if (result.error) return result.error

  const { customer } = result

  const customers = await db.customer.findMany({ where: { email: customer.email } })
  const activeCustomers = customers.filter(c => c.shopId !== null)
  const shopIds = [...new Set(activeCustomers.map(c => c.shopId as string))]
  const shops = await db.shop.findMany({ where: { id: { in: shopIds } } })
  const shopMap = new Map(shops.map(s => [s.id, s]))

  const result2 = await Promise.all(activeCustomers.map(async (c) => {
    const shop = shopMap.get(c.shopId as string)
    if (!shop) return null

    const nextReward = await db.reward.findFirst({
      where: { shopId: shop.id, active: true, pointsCost: { gt: c.points } },
      orderBy: { pointsCost: 'asc' },
    })

    return {
      shopId: c.shopId,
      shopName: shop.name,
      category: shop.category,
      points: c.points,
      totalVisits: c.totalVisits,
      nextRewardPoints: nextReward?.pointsCost || shop.rewardThreshold,
      rewardDescription: nextReward?.description || shop.rewardDescription,
    }
  }))

  return NextResponse.json(result2.filter(Boolean), { headers: corsHeaders })
}
