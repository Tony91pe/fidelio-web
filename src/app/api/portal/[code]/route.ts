import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  const customer = await db.customer.findUnique({
    where: { code },
    select: {
      id: true, name: true, points: true, totalVisits: true,
      lastVisitAt: true, referralCode: true, createdAt: true,
      shopId: true,
      shop: {
        select: {
          id: true, name: true, logo: true, primaryColor: true,
          category: true, city: true, welcomePoints: true,
          rewards: {
            where: { active: true },
            select: { id: true, title: true, description: true, pointsCost: true },
            orderBy: { pointsCost: 'asc' },
          },
        },
      },
      visits: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { points: true, note: true, createdAt: true, amount: true },
      },
    },
  })

  if (!customer || !customer.shop) {
    return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })
  }

  if (!customer.referralCode) {
    await db.customer.update({
      where: { code },
      data: { referralCode: Math.random().toString(36).slice(2, 10).toUpperCase() },
    })
  }

  const refreshed = customer.referralCode
    ? customer
    : await db.customer.findUnique({ where: { code }, select: { referralCode: true } })

  return NextResponse.json({
    customer: {
      name: customer.name,
      points: customer.points,
      totalVisits: customer.totalVisits,
      lastVisitAt: customer.lastVisitAt,
      referralCode: refreshed?.referralCode ?? customer.referralCode,
      createdAt: customer.createdAt,
    },
    shop: {
      id: customer.shop.id,
      name: customer.shop.name,
      logo: customer.shop.logo,
      primaryColor: customer.shop.primaryColor ?? '#7C3AED',
      category: customer.shop.category,
      city: customer.shop.city,
      rewards: customer.shop.rewards,
    },
    visits: customer.visits,
  })
}
