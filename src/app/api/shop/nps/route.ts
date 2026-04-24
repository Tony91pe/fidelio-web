import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId }, select: { id: true } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const responses = await db.npsResponse.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { score: true, feedback: true, createdAt: true },
  })

  if (responses.length === 0) return NextResponse.json({ total: 0, avg: null, nps: null, responses: [] })

  const avg = responses.reduce((s, r) => s + r.score, 0) / responses.length
  const promoters = responses.filter(r => r.score >= 9).length
  const detractors = responses.filter(r => r.score <= 6).length
  const nps = Math.round(((promoters - detractors) / responses.length) * 100)

  return NextResponse.json({ total: responses.length, avg: +avg.toFixed(1), nps, responses })
}
