import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId }, select: { id: true } })
  if (!shop) return NextResponse.json({ notifications: [] })

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [recentVisits, recentRedemptions] = await Promise.all([
    db.visit.findMany({
      where: { shopId: shop.id, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true, points: true, createdAt: true, note: true,
        customer: { select: { name: true, email: true } },
      },
    }),
    db.redemption.findMany({
      where: { reward: { shopId: shop.id }, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true, createdAt: true,
        reward: { select: { title: true } },
        customer: { select: { name: true } },
      },
    }),
  ])

  const notifications = [
    ...recentVisits.map(v => ({
      id: `visit-${v.id}`,
      type: 'visit' as const,
      title: v.note === 'Benvenuto!' ? `Nuovo cliente: ${v.customer?.name ?? v.customer?.email}` : `+${v.points} punti a ${v.customer?.name ?? v.customer?.email}`,
      subtitle: v.note === 'Benvenuto!' ? 'Prima visita' : `${v.points} punti`,
      icon: v.note === 'Benvenuto!' ? '🎉' : '⭐',
      createdAt: v.createdAt,
    })),
    ...recentRedemptions.map(r => ({
      id: `redemption-${r.id}`,
      type: 'redemption' as const,
      title: `${r.customer?.name} ha riscattato un premio`,
      subtitle: r.reward?.title ?? 'Premio',
      icon: '🏆',
      createdAt: r.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15)

  return NextResponse.json({ notifications })
}
