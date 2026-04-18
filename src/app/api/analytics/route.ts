import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ totalCustomers: 0, totalPoints: 0, totalRedeemed: 0, recentVisits: 0 })

  const ago30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const ago60 = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  const ago7  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000)

  const [
    totalCustomers,
    activeCustomers,
    atRiskCustomers,
    newCustomers30,
    newCustomers60,
    pointsAgg,
    recentVisits,
    weekVisits,
    allVisits,
    topCustomers,
    visitsByDay,
  ] = await Promise.all([
    db.customer.count({ where: { shopId: shop.id } }),
    db.customer.count({ where: { shopId: shop.id, lastVisitAt: { gte: ago30 } } }),
    db.customer.count({ where: { shopId: shop.id, lastVisitAt: { lt: ago30, not: null } } }),
    db.customer.count({ where: { shopId: shop.id, createdAt: { gte: ago30 } } }),
    db.customer.count({ where: { shopId: shop.id, createdAt: { gte: ago60, lt: ago30 } } }),
    db.customer.aggregate({ where: { shopId: shop.id }, _sum: { points: true }, _avg: { points: true } }),
    db.visit.count({ where: { shopId: shop.id, createdAt: { gte: ago30 } } }),
    db.visit.count({ where: { shopId: shop.id, createdAt: { gte: ago7 } } }),
    db.visit.count({ where: { shopId: shop.id } }),
    db.customer.findMany({
      where: { shopId: shop.id },
      orderBy: { points: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, points: true, totalVisits: true, lastVisitAt: true },
    }),
    db.visit.findMany({
      where: { shopId: shop.id, createdAt: { gte: ago30 } },
      select: { createdAt: true },
    }),
  ])

  // Calcola visite per giorno della settimana
  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  const dayCount = Array(7).fill(0)
  visitsByDay.forEach(v => { dayCount[new Date(v.createdAt).getDay()]++ })
  const visitsByDayData = dayLabels.map((label, i) => ({ label, count: dayCount[i] }))

  // Trend nuovi clienti
  const newCustomersTrend = newCustomers60 > 0
    ? Math.round(((newCustomers30 - newCustomers60) / newCustomers60) * 100)
    : newCustomers30 > 0 ? 100 : 0

  // Retention rate (clienti che hanno visitato almeno 2 volte)
  const loyalCustomers = await db.customer.count({
    where: { shopId: shop.id, totalVisits: { gte: 2 } }
  })
  const retentionRate = totalCustomers > 0
    ? Math.round((loyalCustomers / totalCustomers) * 100)
    : 0

  // Media visite per cliente
  const avgVisits = totalCustomers > 0
    ? Math.round((allVisits / totalCustomers) * 10) / 10
    : 0

  return NextResponse.json({
    totalCustomers,
    activeCustomers,
    atRiskCustomers,
    newCustomers30,
    newCustomersTrend,
    totalPoints: pointsAgg._sum.points ?? 0,
    avgPoints: Math.round(pointsAgg._avg.points ?? 0),
    totalRedeemed: 0,
    recentVisits,
    weekVisits,
    allVisits,
    retentionRate,
    avgVisits,
    loyalCustomers,
    topCustomers,
    visitsByDay: visitsByDayData,
  })
}
