import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

const EMOJI: Record<string, string> = {
  bar: '☕', restaurant: '🍕', hair: '✂️', beauty: '💅',
  gym: '💪', bakery: '🍰', clothing: '👗', bio: '🌿', other: '🏪',
}

const CATEGORY_LABEL: Record<string, string> = {
  bar: 'Bar & Caffetteria', restaurant: 'Ristorante & Pizzeria', hair: 'Salone & Barbiere',
  beauty: 'Centro Estetico', gym: 'Palestra & Fitness', bakery: 'Panetteria & Pasticceria',
  clothing: 'Negozio di Abbigliamento', bio: 'Negozio Bio & Naturale', other: 'Negozio',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const shop = await db.shop.findUnique({ where: { slug } })
  if (!shop) return { title: 'Negozio non trovato' }
  return {
    title: `${shop.name} — Programma Fedeltà con Fidelio`,
    description: shop.description ?? `Iscriviti al programma fedeltà di ${shop.name} e accumula punti ad ogni visita.`,
    openGraph: { title: shop.name, description: `Iscriviti al programma fedeltà di ${shop.name}` },
  }
}

export default async function NegozioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const shop = await db.shop.findUnique({
    where: { slug },
    include: {
      rewards: { where: { active: true }, take: 5 },
      _count: { select: { customers: true } },
    },
  })

  if (!shop || !shop.approved) notFound()

  const emoji = EMOJI[shop.category] ?? '🏪'
  const category = CATEGORY_LABEL[shop.category] ?? 'Negozio'
  const checkinUrl = `/checkin/${shop.id}`

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: 'white', fontFamily: 'system-ui' }}>
      {/* Nav */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ background: 'rgba(108,61,244,0.2)', borderRadius: '8px', padding: '6px 10px', fontSize: '16px', fontWeight: 900, color: '#A78BFA' }}>F</div>
          <span style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Fidelio</span>
        </Link>
        <Link href={checkinUrl} style={{ background: '#6C3DF4', color: 'white', padding: '8px 18px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
          Iscriviti →
        </Link>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem' }}>{shop.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>{category}</p>
          {shop.address && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              📍 {shop.address}, {shop.city}
            </p>
          )}
          {shop.description && (
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '480px', margin: '1rem auto 0' }}>
              {shop.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Clienti fedeli', value: shop._count.customers.toLocaleString('it-IT'), icon: '👥' },
            { label: 'Punti benvenuto', value: shop.welcomePoints.toString(), icon: '🎁' },
            { label: 'Premi disponibili', value: shop.rewards.length.toString(), icon: '🏆' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A78BFA' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Come funziona */}
        <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>Come funziona</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { n: '1', text: 'Registrati una volta sola con nome e email' },
              { n: '2', text: `Accumuli ${shop.pointsPerVisit} punti ad ogni visita` },
              { n: '3', text: `Raggiungi ${shop.rewardThreshold} punti e riscatta il premio` },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6C3DF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>{s.n}</div>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premi */}
        {shop.rewards.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>🏆 Premi disponibili</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {shop.rewards.map(r => (
                <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{r.title}</span>
                  <span style={{ fontSize: '0.82rem', color: '#A78BFA', fontWeight: 700 }}>{r.pointsCost} pt</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href={checkinUrl} style={{
            display: 'inline-block', background: 'linear-gradient(135deg,#6C3DF4,#8B5CF6)',
            color: 'white', padding: '16px 40px', borderRadius: '14px', fontWeight: 800,
            textDecoration: 'none', fontSize: '1.05rem', boxShadow: '0 0 32px rgba(108,61,244,0.35)',
          }}>
            Iscriviti gratis →
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
            Nessuna app richiesta — solo nome e email
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
            Programma fedeltà gestito con{' '}
            <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none' }}>Fidelio</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
