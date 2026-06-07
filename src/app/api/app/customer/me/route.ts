import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fidelio-secret'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

function getCustomerFromToken(req: Request): { customerId: string; email: string } | null {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { customerId: string; email: string }
    return payload
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const payload = getCustomerFromToken(req)
  if (!payload) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401, headers: corsHeaders })

  const { searchParams } = new URL(req.url)

  if (searchParams.get('format') === 'export') {
    // GDPR art. 20 — portabilità dati: restituisce tutti i dati del cliente in JSON
    const customers = await db.customer.findMany({
      where: { email: payload.email },
      include: {
        visits: {
          include: { shop: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        redemptions: {
          include: {
            reward: { select: { title: true, description: true } },
            customer: { include: { shop: { select: { name: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
        shop: { select: { name: true, city: true, category: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const exportData = {
      exportDate: new Date().toISOString(),
      email: payload.email,
      shops: customers.map((c) => ({
        shopName: c.shop?.name ?? 'Globale',
        shopCity: c.shop?.city ?? null,
        points: c.points,
        totalVisits: c.totalVisits,
        joinedAt: c.createdAt,
        visits: c.visits.map((v) => ({
          date: v.createdAt,
          points: v.points,
          amount: v.amount,
          note: v.note,
          shop: v.shop.name,
        })),
        redemptions: c.redemptions.map((r) => ({
          date: r.createdAt,
          points: r.points,
          reward: r.reward.title,
          shop: r.customer.shop?.name ?? null,
        })),
      })),
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="fidelio-dati-personali-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    })
  }

  const customer = await db.customer.findUnique({
    where: { id: payload.customerId },
    select: { id: true, email: true, name: true, birthday: true, code: true },
  })
  if (!customer) return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404, headers: corsHeaders })

  return NextResponse.json(customer, { headers: corsHeaders })
}

// GDPR: cancellazione completa dell'account cliente
export async function DELETE(req: Request) {
  const payload = getCustomerFromToken(req)
  if (!payload) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401, headers: corsHeaders })

  const { email } = payload

  // Recupera tutti gli id Customer con questa email (globale + per-shop)
  const customers = await db.customer.findMany({
    where: { email },
    select: { id: true },
  })
  const ids = customers.map((c) => c.id)

  if (ids.length === 0) {
    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  }

  // Elimina in ordine per rispettare le FK (no cascade nel schema)
  await db.$transaction([
    db.redemption.deleteMany({ where: { customerId: { in: ids } } }),
    db.visit.deleteMany({ where: { customerId: { in: ids } } }),
    db.customer.deleteMany({ where: { id: { in: ids } } }),
    db.otpCode.deleteMany({ where: { email } }),
    db.pushSubscription.deleteMany({ where: { email } }),
    // Anonimizza le NpsResponse (rimuove il collegamento ma conserva il dato statistico)
    db.npsResponse.updateMany({ where: { customerId: { in: ids } }, data: { customerId: null } }),
  ])

  return NextResponse.json({ ok: true, deleted: ids.length }, { headers: corsHeaders })
}
