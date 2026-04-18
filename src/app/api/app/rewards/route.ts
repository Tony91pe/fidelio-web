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

  const customers = await db.customer.findMany({
    where: { email: customer.email, shopId: { not: null } },
    select: { shopId: true, points: true },
  })

  const shopIds = customers.map(c => c.shopId as string)
  if (shopIds.length === 0) return NextResponse.json([], { headers: corsHeaders })

  const [shops, allRewards] = await Promise.all([
    db.shop.findMany({ where: { id: { in: shopIds } }, select: { id: true, name: true, category: true } }),
    db.reward.findMany({ where: { shopId: { in: shopIds }, active: true } }),
  ])

  const shopMap = new Map(shops.map(s => [s.id, s]))
  const pointsMap = new Map(customers.map(c => [c.shopId as string, c.points]))

  const rewards = allRewards.map(r => {
    const shop = shopMap.get(r.shopId)
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      pointsCost: r.pointsCost,
      shopName: shop?.name ?? '',
      shopCategory: shop?.category ?? '',
      customerPoints: pointsMap.get(r.shopId) ?? 0,
    }
  })

  return NextResponse.json(rewards, { headers: corsHeaders })
}
