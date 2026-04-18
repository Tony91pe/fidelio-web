import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  if (shop.plan !== 'PRO') return NextResponse.json({ error: 'Richiede piano PRO' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'visits') {
    const visits = await db.visit.findMany({
      where: { shopId: shop.id },
      include: { customer: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const rows = [
      ['Data', 'Cliente', 'Email', 'Punti', 'Importo (€)', 'Note'],
      ...visits.map(v => [
        new Date(v.createdAt).toLocaleDateString('it-IT'),
        v.customer.name,
        v.customer.email,
        String(v.points),
        v.amount != null ? v.amount.toFixed(2) : '',
        v.note ?? '',
      ]),
    ]

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="visite-${shop.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  // Default: export clienti
  const customers = await db.customer.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  })

  const rows = [
    ['Nome', 'Email', 'Telefono', 'Data nascita', 'Punti', 'Visite totali', 'Ultima visita', 'Registrato il'],
    ...customers.map(c => [
      c.name,
      c.email,
      c.phone ?? '',
      c.birthday ? new Date(c.birthday).toLocaleDateString('it-IT') : '',
      String(c.points),
      String(c.totalVisits),
      c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString('it-IT') : '',
      new Date(c.createdAt).toLocaleDateString('it-IT'),
    ]),
  ]

  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="clienti-${shop.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
