import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { name, email, shopId, points, birthday } = await req.json()

  if (!name || !email || !shopId) {
    return NextResponse.json({ error: 'Campi obbligatori: nome, email, negozio' }, { status: 400 })
  }

  // Controlla che il negozio esista
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) {
    return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  }

  // Controlla duplicato email per questo negozio
  const existing = await db.customer.findFirst({ where: { email, shopId } })
  if (existing) {
    return NextResponse.json({ error: `Cliente con email ${email} già registrato in questo negozio` }, { status: 400 })
  }

  const code = randomBytes(4).toString('hex').toUpperCase()

  const customer = await db.customer.create({
    data: {
      name,
      email,
      shopId,
      code,
      points: points ?? 0,
      ...(birthday && { birthday: new Date(birthday) }),
    },
  })

  return NextResponse.json({ ok: true, customer })
}
