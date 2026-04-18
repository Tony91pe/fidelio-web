import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const MAX_FOUNDERS = 50

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato. Completa prima la registrazione del negozio.' }, { status: 404 })

  if (shop.isFounder) return NextResponse.json({ error: 'Hai già il piano fondatore attivato.' }, { status: 409 })

  if (shop.plan !== 'STARTER') return NextResponse.json({ error: 'Il piano fondatore è disponibile solo per i nuovi account.' }, { status: 409 })

  const founderCount = await db.shop.count({ where: { isFounder: true } })
  if (founderCount >= MAX_FOUNDERS) return NextResponse.json({ error: 'Tutti i posti da fondatore sono esauriti.' }, { status: 409 })

  const planExpiresAt = new Date()
  planExpiresAt.setMonth(planExpiresAt.getMonth() + 6)

  await db.shop.update({
    where: { id: shop.id },
    data: { plan: 'GROWTH', planExpiresAt, isFounder: true },
  })

  return NextResponse.json({ ok: true, spotsLeft: MAX_FOUNDERS - founderCount - 1 })
}

export async function GET() {
  const founderCount = await db.shop.count({ where: { isFounder: true } })
  return NextResponse.json({ founderCount, spotsLeft: Math.max(MAX_FOUNDERS - founderCount, 0) })
}
