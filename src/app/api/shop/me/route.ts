import { NextResponse } from 'next/server'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop, payload } = result

  return NextResponse.json({
    shopUser: {
      id: shop.ownerId,
      shopId: shop.id,
      email: payload.email,
      name: shop.name,
      role: 'owner',
    },
    shop: {
      id: shop.id,
      name: shop.name,
      category: shop.category,
      address: shop.address,
      city: shop.city,
      phone: shop.phone,
      logo: shop.logo,
      plan: shop.plan,
      rewardThreshold: shop.rewardThreshold,
      rewardDescription: shop.rewardDescription,
      pointsSystem: shop.pointsSystem,
      pointsPerVisit: shop.pointsPerVisit,
      pointsPerEuro: shop.pointsPerEuro,
      welcomePoints: shop.welcomePoints,
    },
  }, { headers: corsHeaders })
}
