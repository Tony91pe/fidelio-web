import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })
  const customer = await db.customer.findFirst({
    where: { email },
    select: { code: true, points: true, totalVisits: true, name: true }
  })
  if (!customer) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 })
  return NextResponse.json(customer)
}
