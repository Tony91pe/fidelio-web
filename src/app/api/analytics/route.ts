import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ totalCustomers: 0, totalPoints: 0, totalRedeemed: 0, recentVisits: 0 })

  const now = new Date()
  const ago7   = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000)
  const ago30  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const ago60  = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  const ago90  = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  // Ultimi 6 mesi per trend acquisizione
  const months: { label: string; start: Date; end: Date }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    months.push({ label: d.toLocaleDateString('it-IT', { month: 'short' }), start: d, end })
  }

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
    totalRedeemed,
    topCustomers,
    visitsByDayRaw,
    topRewardsRaw,
    churnedCustomers,
    allVisitDates,
    monthlyCountsRaw,
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
    // Riscatti reali
    db.redemption.count({
      where: { customer: { shopId: shop.id } }
    }),
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
    // Top premi riscattati
    db.redemption.groupBy({
      by: ['rewardId'],
      where: { customer: { shopId: shop.id } },
      _count: { rewardId: true },
      orderBy: { _count: { rewardId: 'desc' } },
      take: 5,
    }),
    // Churn: attivi 31-90gg fa, non attivi negli ultimi 30gg
    db.customer.count({
      where: {
        shopId: shop.id,
        lastVisitAt: { gte: ago90, lt: ago30 },
      },
    }),
    // Per calcolare frequenza media tra visite
    db.visit.findMany({
      where: { shopId: shop.id },
      select: { customerId: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    // Trend mensile acquisizione
    Promise.all(months.map(m =>
      db.customer.count({ where: { shopId: shop.id, createdAt: { gte: m.start, lt: m.end } } })
    )),
  ])

  // Giorno della settimana
  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  const dayCount = Array(7).fill(0)
  visitsByDayRaw.forEach(v => { dayCount[new Date(v.createdAt).getDay()]++ })
  const visitsByDay = dayLabels.map((label, i) => ({ label, count: dayCount[i] }))

  // Trend nuovi clienti
  const newCustomersTrend = newCustomers60 > 0
    ? Math.round(((newCustomers30 - newCustomers60) / newCustomers60) * 100)
    : newCustomers30 > 0 ? 100 : 0

  // Retention rate (clienti con ≥2 visite)
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

  // Churn rate (%)
  const churnRate = (activeCustomers + churnedCustomers) > 0
    ? Math.round((churnedCustomers / (activeCustomers + churnedCustomers)) * 100)
    : 0

  // Frequenza media (giorni tra visite consecutive per stesso cliente)
  const visitsByCustomer: Record<string, Date[]> = {}
  allVisitDates.forEach(v => {
    if (!visitsByCustomer[v.customerId]) visitsByCustomer[v.customerId] = []
    visitsByCustomer[v.customerId].push(new Date(v.createdAt))
  })
  let totalGaps = 0, gapCount = 0
  Object.values(visitsByCustomer).forEach(dates => {
    if (dates.length < 2) return
    for (let i = 1; i < dates.length; i++) {
      totalGaps += (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      gapCount++
    }
  })
  const avgDaysBetweenVisits = gapCount > 0 ? Math.round(totalGaps / gapCount) : null

  // Top premi con nome
  const topRewards = await Promise.all(
    topRewardsRaw.map(async r => {
      const reward = await db.reward.findUnique({ where: { id: r.rewardId }, select: { title: true } })
      return { title: reward?.title ?? 'Premio eliminato', count: r._count.rewardId }
    })
  )

  // Trend mensile
  const monthlyTrend = months.map((m, i) => ({ label: m.label, count: monthlyCountsRaw[i] }))

  return NextResponse.json({
    totalCustomers,
    activeCustomers,
    atRiskCustomers,
    newCustomers30,
    newCustomersTrend,
    totalPoints: pointsAgg._sum.points ?? 0,
    avgPoints: Math.round(pointsAgg._avg.points ?? 0),
    totalRedeemed,
    recentVisits,
    weekVisits,
    allVisits,
    retentionRate,
    avgVisits,
    loyalCustomers,
    churnRate,
    avgDaysBetweenVisits,
    topCustomers,
    topRewards,
    visitsByDay,
    monthlyTrend,
  })
}
