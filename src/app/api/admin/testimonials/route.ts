import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function checkAdmin() {
  const { userId } = await auth()
  return userId && userId === process.env.ADMIN_USER_ID
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const all = await db.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(all)
}

export async function PATCH(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { id, approved } = await req.json()
  await db.testimonial.update({ where: { id }, data: { approved } })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { id } = await req.json()
  await db.testimonial.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
