import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim()

  const customers = await db.customer.findMany({
    where: {
      shopId: shop.id,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { lastVisitAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      code: true,
      points: true,
      totalVisits: true,
      lastVisitAt: true,
    },
  })

  return NextResponse.json(customers, { headers: corsHeaders })
}
