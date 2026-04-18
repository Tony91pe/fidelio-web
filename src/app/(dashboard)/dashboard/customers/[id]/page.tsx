import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import AddPointsForm from './AddPointsForm'
import Link from 'next/link'

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) redirect('/dashboard')

  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      visits: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!customer || customer.shopId !== shop.id) redirect('/dashboard/customers')

  const initials = customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/customers" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Torna ai clienti
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C3DF4,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700' }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '700' }}>{customer.name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{customer.email}</p>
              {customer.phone && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{customer.phone}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#A78BFA' }}>{customer.points}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Punti</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#10B981' }}>{customer.totalVisits}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Visite</div>
            </div>
          </div>
          {customer.birthday && (
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
              🎂 {new Date(customer.birthday).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
            </p>
          )}
        </div>

        <AddPointsForm customerId={customer.id} currentPoints={customer.points} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Ultime visite</h3>
        {customer.visits.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Nessuna visita ancora</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {customer.visits.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div>
                  <span style={{ color: '#A78BFA', fontWeight: '700' }}>+{v.points} punti</span>
                  {v.note && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{v.note}</span>}
                  {v.amount && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>€{Number(v.amount).toFixed(2)}</span>}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                  {new Date(v.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
