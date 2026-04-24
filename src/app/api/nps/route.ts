import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { score, feedback, shopId, customerId } = await req.json()

  if (!shopId || typeof score !== 'number' || score < 1 || score > 10) {
    return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
  }

  await db.npsResponse.create({
    data: { score, feedback: feedback ?? null, shopId, customerId: customerId ?? null },
  })

  const shop = await db.shop.findUnique({
    where: { id: shopId },
    select: { googleReviewUrl: true, googleReviewEnabled: true },
  })

  // Solo punteggi alti (9-10) vengono indirizzati a Google
  const sendToGoogle = score >= 9 && shop?.googleReviewEnabled && shop?.googleReviewUrl

  return NextResponse.json({
    ok: true,
    googleReviewUrl: sendToGoogle ? shop!.googleReviewUrl : null,
  })
}
