import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const shopId = searchParams.get('shopId')

  if (!email) return NextResponse.json({ error: 'Email richiesta' }, { status: 400, headers: corsHeaders })

  const customer = await db.customer.findFirst({
    where: shopId ? { email, shopId } : { email },
    select: { id: true },
  })

  if (!customer) return NextResponse.json({ visits: [] }, { headers: corsHeaders })

  const visits = await db.visit.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      points: true,
      amount: true,
      note: true,
      createdAt: true,
      shop: { select: { id: true, name: true, category: true } },
    },
  })

  return NextResponse.json({ visits }, { headers: corsHeaders })
}
