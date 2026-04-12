import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email richiesta' }, { status: 400, headers: corsHeaders })

  const customer = await db.customer.findFirst({ where: { email } })
  if (!customer) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404, headers: corsHeaders })

  return NextResponse.json({ code: customer.code }, { headers: corsHeaders })
}