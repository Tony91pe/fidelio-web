import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  if (shop.plan === 'STARTER') return NextResponse.json({ error: 'Richiede piano GROWTH' }, { status: 403 })
  const staff = await db.staffMember.findMany({ where: { shopId: shop.id }, orderBy: { createdAt: 'asc' } })
  return NextResponse.json(staff)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  if (shop.plan === 'STARTER') return NextResponse.json({ error: 'Richiede piano GROWTH' }, { status: 403 })
  const { name, email, role } = await req.json()
  if (!name || !email) return NextResponse.json({ error: 'Nome ed email obbligatori' }, { status: 400 })
  try {
    const member = await db.staffMember.create({ data: { shopId: shop.id, name, email, role: role ?? 'COMMESSO' } })
    return NextResponse.json(member, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Email già presente nello staff' }, { status: 409 })
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { id } = await req.json()
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  await db.staffMember.deleteMany({ where: { id, shopId: shop.id } })
  return NextResponse.json({ ok: true })
}
