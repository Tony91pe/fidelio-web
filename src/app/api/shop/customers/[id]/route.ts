import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { id } = await params

  const customer = await db.customer.findFirst({
    where: { id, shopId: shop.id },
    include: {
      visits: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, points: true, amount: true, createdAt: true },
      },
    },
  })

  if (!customer) {
    return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404, headers: corsHeaders })
  }

  return NextResponse.json({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      code: customer.code,
      points: customer.points,
      totalVisits: customer.totalVisits,
      lastVisitAt: customer.lastVisitAt,
    },
    checkins: customer.visits.map((v) => ({
      id: v.id,
      points: v.points,
      amount: v.amount,
      createdAt: v.createdAt.toISOString(),
    })),
  }, { headers: corsHeaders })
}
