import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  try {
    const { email, subscription } = await req.json()
    if (!email || !subscription) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400, headers: corsHeaders })
    }
    await db.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        email,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      update: {
        email,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    })
    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Errore server' }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json()
    if (!endpoint) return NextResponse.json({ error: 'Endpoint mancante' }, { status: 400, headers: corsHeaders })
    await db.pushSubscription.deleteMany({ where: { endpoint } })
    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Errore server' }, { status: 500, headers: corsHeaders })
  }
}
