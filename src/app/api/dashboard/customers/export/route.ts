import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const customers = await db.customer.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
    select: { name: true, email: true, phone: true, points: true, totalVisits: true, lastVisitAt: true, birthday: true, createdAt: true },
  })

  const header = ['Nome', 'Email', 'Telefono', 'Punti', 'Visite', 'Ultima visita', 'Compleanno', 'Registrato il']
  const rows = customers.map(c => [
    c.name,
    c.email,
    c.phone ?? '',
    c.points,
    c.totalVisits,
    c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString('it-IT') : '',
    c.birthday ? new Date(c.birthday).toLocaleDateString('it-IT') : '',
    new Date(c.createdAt).toLocaleDateString('it-IT'),
  ])

  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const BOM = '\uFEFF'

  return new NextResponse(BOM + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="clienti-${shop.name.replace(/\s+/g, '-')}.csv"`,
    },
  })
}
