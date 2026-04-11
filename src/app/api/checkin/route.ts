import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  const { name, email, shopId } = await req.json()
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  
  const WELCOME = 50
  const existing = await db.customer.findFirst({ where: { email, shopId } })
  
  if (existing) {
    await db.$transaction([
      db.visit.create({ data: { points:1, customerId:existing.id, shopId, note:'Check-in' } }),
      db.customer.update({ where: { id:existing.id },
        data: { points:{increment:1}, totalVisits:{increment:1}, lastVisitAt:new Date() }
      })
    ])
    return NextResponse.json({ pointsEarned: 1, isNew: false })
  }

  const customer = await db.customer.create({
    data: { name, email, shopId, points: WELCOME }
  })
  await db.visit.create({
    data: { points: WELCOME, customerId: customer.id, shopId, note: 'Benvenuto!' }
  })

  try {
    await sendWelcomeEmail(email, name, shop.name, WELCOME)
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error)
  }

  return NextResponse.json({ pointsEarned: WELCOME, isNew: true })
}