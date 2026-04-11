import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ totalCustomers:0, totalPoints:0, totalRedeemed:0, recentVisits:0 })
  const ago30 = new Date(Date.now()-30*24*60*60*1000)
  const [totalCustomers, totalPoints, totalRedeemed, recentVisits] = await Promise.all([
    db.customer.count({ where: { shopId: shop.id } }),
    db.customer.aggregate({ where: { shopId: shop.id }, _sum: { points: true } }),
    Promise.resolve({ _sum: { pointsRedeemed: 0 } }),
    db.visit.count({ where: { shopId: shop.id, createdAt: { gte: ago30 } } }),
  ])
  return NextResponse.json({
    totalCustomers,
    totalPoints: totalPoints._sum.points ?? 0,
    totalRedeemed: totalRedeemed._sum.pointsRedeemed ?? 0,
    recentVisits,
  })
}
