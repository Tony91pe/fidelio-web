import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'

function generateCustomerCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'FID-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export async function POST(req: Request) {
  const { name, email, shopId } = await req.json()
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  const WELCOME = 50
  const existing = await db.customer.findFirst({ where: { email, shopId } })
  if (existing) {
    await db.$transaction([
      db.visit.create({ data: { points:1, customerId:existing.id, shopId, note:'Check-in' } }),
      db.customer.update({ where: { id:existing.id }, data: { points:{increment:1}, totalVisits:{increment:1}, lastVisitAt:new Date() } })
    ])
    return NextResponse.json({ pointsEarned: 1, isNew: false, customerCode: existing.code })
  }
  let code = generateCustomerCode()
  let attempts = 0
  while (attempts < 10) {
    const exists = await db.customer.findUnique({ where: { code } })
    if (!exists) break
    code = generateCustomerCode()
    attempts++
  }
  const customer = await db.customer.create({
    data: { name, email, shopId, points: WELCOME, code }
  })
  await db.visit.create({
    data: { points: WELCOME, customerId: customer.id, shopId, note: 'Benvenuto!' }
  })
  try {
    await sendWelcomeEmail(email, name, shop.name, WELCOME)
  } catch {}
  return NextResponse.json({ pointsEarned: WELCOME, isNew: true, customerCode: customer.code })
}
