import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'

function generateCustomerCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'FID-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/

export async function POST(req: Request) {
  let body: { name?: unknown; email?: unknown; birthday?: unknown; shopId?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 }) }

  const { name, email, birthday, shopId } = body
  if (typeof name !== 'string' || !name.trim() || name.length > 100)
    return NextResponse.json({ error: 'Nome non valido' }, { status: 400 })
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200)
    return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
  if (typeof shopId !== 'string' || !shopId.trim())
    return NextResponse.json({ error: 'Negozio non valido' }, { status: 400 })
  if (birthday !== undefined && birthday !== null && (typeof birthday !== 'string' || isNaN(Date.parse(birthday as string))))
    return NextResponse.json({ error: 'Data di nascita non valida' }, { status: 400 })

  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  const WELCOME = shop.welcomePoints ?? 50
  const existing = await db.customer.findFirst({ where: { email, shopId } })
  if (existing) {
    return NextResponse.json(
      { error: 'Sei già iscritto a questo negozio', alreadyRegistered: true, customerCode: existing.code },
      { status: 400 }
    )
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
    data: { name, email, shopId, points: WELCOME, code, ...(birthday && { birthday: new Date(birthday) }) }
  })
  await db.visit.create({
    data: { points: WELCOME, customerId: customer.id, shopId, note: 'Benvenuto!' }
  })
  try {
    await sendWelcomeEmail(email, name, shop.name, WELCOME)
  } catch {}
  return NextResponse.json({ pointsEarned: WELCOME, isNew: true, customerCode: customer.code })
}
