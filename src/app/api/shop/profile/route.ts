import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function PATCH(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const body = await req.json()

  const {
    name,
    address,
    city,
    phone,
    category,
    rewardThreshold,
    rewardDescription,
    pointsSystem,
    pointsPerVisit,
    pointsPerEuro,
    welcomePoints,
  } = body

  const updated = await db.shop.update({
    where: { id: shop.id },
    data: {
      ...(name !== undefined && { name }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(phone !== undefined && { phone }),
      ...(category !== undefined && { category }),
      ...(rewardThreshold !== undefined && { rewardThreshold }),
      ...(rewardDescription !== undefined && { rewardDescription }),
      ...(pointsSystem !== undefined && { pointsSystem }),
      ...(pointsPerVisit !== undefined && { pointsPerVisit }),
      ...(pointsPerEuro !== undefined && { pointsPerEuro }),
      ...(welcomePoints !== undefined && { welcomePoints }),
    },
  })

  return NextResponse.json({
    shop: {
      id: updated.id,
      name: updated.name,
      category: updated.category,
      address: updated.address,
      city: updated.city,
      phone: updated.phone,
      rewardThreshold: updated.rewardThreshold,
      rewardDescription: updated.rewardDescription,
      pointsSystem: updated.pointsSystem,
      pointsPerVisit: updated.pointsPerVisit,
      pointsPerEuro: updated.pointsPerEuro,
      welcomePoints: updated.welcomePoints,
    },
  }, { headers: corsHeaders })
}
