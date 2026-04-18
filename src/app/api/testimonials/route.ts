import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const testimonials = await db.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { id: true, name: true, role: true, text: true },
  })
  return NextResponse.json(testimonials)
}

export async function POST(req: Request) {
  const { name, role, text } = await req.json()
  if (!name?.trim() || !role?.trim() || !text?.trim()) {
    return NextResponse.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 })
  }
  if (text.length > 500) {
    return NextResponse.json({ error: 'Testo troppo lungo (max 500 caratteri)' }, { status: 400 })
  }
  await db.testimonial.create({ data: { name: name.trim(), role: role.trim(), text: text.trim() } })
  return NextResponse.json({ ok: true })
}
