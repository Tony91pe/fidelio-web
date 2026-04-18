import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'
import { logEvent } from '@/lib/logging'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'FID-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: 'Nome ed email obbligatori' }, { status: 400 })
  }

  const { name, email, phone, birthday } = body

  const existing = await db.customer.findFirst({ where: { email, shopId: shop.id } })
  if (existing) return NextResponse.json({ error: 'Cliente già esistente' }, { status: 409 })

  let code = generateCode()
  for (let i = 0; i < 10; i++) {
    const exists = await db.customer.findUnique({ where: { code } })
    if (!exists) break
    code = generateCode()
  }

  const welcomePoints = shop.welcomePoints ?? 50

  const customer = await db.customer.create({
    data: {
      name, email, phone: phone || null, shopId: shop.id, code, points: welcomePoints,
      ...(birthday && { birthday: new Date(birthday) }),
    },
  })

  await db.visit.create({
    data: { points: welcomePoints, customerId: customer.id, shopId: shop.id, note: 'Benvenuto!' },
  })

  try { await sendWelcomeEmail(email, name, shop.name, welcomePoints) } catch {}

  await logEvent({
    eventType: 'CUSTOMER_CREATED',
    userId,
    shopId: shop.id,
    customerId: customer.id,
    action: `Cliente creato manualmente: ${name} (${email})`,
    metadata: { email, welcomePoints },
  })

  return NextResponse.json(customer)
}
