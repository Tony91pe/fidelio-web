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
  const shopId = shop.id

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalCustomers,
    totalPointsAgg,
    totalVisitsToday,
    totalVisitsWeek,
    totalVisitsMonth,
    recentVisits,
  ] = await Promise.all([
    db.customer.count({ where: { shopId } }),
    db.visit.aggregate({ where: { shopId }, _sum: { points: true } }),
    db.visit.count({ where: { shopId, createdAt: { gte: startOfDay } } }),
    db.visit.count({ where: { shopId, createdAt: { gte: startOfWeek } } }),
    db.visit.count({ where: { shopId, createdAt: { gte: startOfMonth } } }),
    db.visit.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { customer: { select: { name: true, code: true } } },
    }),
  ])

  const recentCheckins = recentVisits.map((v) => ({
    id: v.id,
    customerName: v.customer.name,
    customerCode: v.customer.code,
    points: v.points,
    amount: v.amount,
    createdAt: v.createdAt.toISOString(),
  }))

  return NextResponse.json({
    totalCustomers,
    totalPointsIssued: totalPointsAgg._sum.points ?? 0,
    totalVisitsToday,
    totalVisitsWeek,
    totalVisitsMonth,
    recentCheckins,
  }, { headers: corsHeaders })
}
