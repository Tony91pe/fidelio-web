import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prezzi — Fidelio',
  description: 'Piani Fidelio da €19/mese. Starter, Growth e Pro per negozi di ogni dimensione. Nessun costo nascosto, garanzia rimborso 14 giorni.',
  alternates: { canonical: 'https://www.getfidelio.app/pricing' },
}

const plans = [
  {
    name: 'Starter', price: '19', color: '#6b7280', featured: false,
    cta: 'Inizia con Starter',
    features: ['1 negozio', 'QR code statico', 'Raccolta punti base', '1 premio attivo', 'Email di benvenuto', 'Dashboard base', 'Storico clienti', 'Supporto via email'],
  },
  {
    name: 'Growth', price: '39', color: '#7C3AED', featured: true,
    cta: 'Inizia con Growth',
    features: ['Tutto di Starter', 'QR dinamico anti-frode', 'Premi illimitati', 'Gift card digitali', 'Email automatiche (compleanno, winback)', 'Notifiche push clienti', 'Statistiche avanzate', 'Segmentazione clienti', 'Offerte speciali', 'Ruoli staff', 'Branding personalizzato', 'Supporto prioritario'],
  },
  {
    name: 'Pro', price: '79', color: '#f97316', featured: false,
    cta: 'Inizia con Pro',
    features: ['Tutto di Growth', 'Multi-negozio', 'Campagne marketing SMS', 'AI Insights predittivi', 'Export dati GDPR', 'Accesso API', 'Report settimanali automatici', 'Automazioni avanzate', 'Supporto dedicato', 'Onboarding assistito'],
  },
]

const compare = [
  { feature: 'QR code cliente', starter: '✓', growth: '✓', pro: '✓' },
  { feature: 'Raccolta punti', starter: '✓', growth: '✓', pro: '✓' },
  { feature: 'Email di benvenuto', starter: '✓', growth: '✓', pro: '✓' },
  { feature: 'Dashboard analytics', starter: 'Base', growth: 'Avanzata', pro: 'Completa' },
  { feature: 'Premi attivi', starter: '1', growth: 'Illimitati', pro: 'Illimitati' },
  { feature: 'QR anti-frode', starter: '—', growth: '✓', pro: '✓' },
  { feature: 'Gift card digitali', starter: '—', growth: '✓', pro: '✓' },
  { feature: 'Email compleanno & winback', starter: '—', growth: '✓', pro: '✓' },
  { feature: 'Notifiche push', starter: '—', growth: '✓', pro: '✓' },
  { feature: 'Ruoli staff', starter: '—', growth: '✓', pro: '✓' },
  { feature: 'Campagne SMS', starter: '—', growth: '—', pro: '✓' },
  { feature: 'Multi-negozio', starter: '—', growth: '—', pro: '✓' },
  { feature: 'AI Insights', starter: '—', growth: '—', pro: '✓' },
  { feature: 'Accesso API', starter: '—', growth: '—', pro: '✓' },
]

export default function PricingPage() {
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href="/" style={{ fontSize: '1.3rem', fontWeight: '800', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/favicon.svg" alt="Fidelio" width={26} height={26} style={{ borderRadius: 6 }} />
          Fidelio
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>Accedi</Link>
          <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            Inizia ora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: '6rem', paddingBottom: '3rem', textAlign: 'center', background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108,61,244,0.25) 0%, transparent 70%)', padding: '7rem 1.5rem 3rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: '800', marginBottom: '0.75rem' }}>
          Prezzi semplici e trasparenti
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', maxWidth: '460px', margin: '0 auto 0.75rem', lineHeight: '1.6' }}>
          Nessun costo nascosto. Disdici quando vuoi.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem' }}>
          <span>✓ IVA inclusa</span>
          <span>✓ Pagamento mensile</span>
          <span>✓ Garanzia rimborso 14 giorni</span>
          <span>✓ Nessun contratto</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
        {plans.map(plan => (
          <div key={plan.name} style={{
            background: plan.featured ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${plan.featured ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '20px', padding: '2rem', position: 'relative',
            transform: plan.featured ? 'scale(1.03)' : 'none',
          }}>
            {plan.featured && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#7C3AED', color: 'white', padding: '3px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
                PIÙ SCELTO
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: plan.color }} />
              <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{plan.name}</span>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800' }}>€{plan.price}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>/mese</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10B981', flexShrink: 0, marginTop: '1px' }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '0.8rem', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', background: plan.featured ? '#7C3AED' : 'transparent', color: 'white', border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Tabella comparativa */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Confronto completo delle funzionalità</h2>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 100px)', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Funzionalità</div>
            {['Starter', 'Growth', 'Pro'].map((p, i) => (
              <div key={p} style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: '800', color: i === 1 ? '#A78BFA' : 'rgba(255,255,255,0.7)' }}>{p}</div>
            ))}
          </div>
          {compare.map((row, i) => (
            <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 100px)', gap: 0, padding: '0.65rem 1.25rem', borderBottom: i < compare.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{row.feature}</div>
              {[row.starter, row.growth, row.pro].map((val, j) => (
                <div key={j} style={{ textAlign: 'center', fontSize: '0.875rem', color: val === '✓' ? '#10B981' : val === '—' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)', fontWeight: val === '✓' || val === '—' ? '700' : '500' }}>
                  {val}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {[
            { num: '+23%', label: 'frequenza media dei clienti' },
            { num: '14 gg', label: 'garanzia rimborso' },
            { num: '10 min', label: 'per il setup completo' },
          ].map(s => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#A78BFA' }}>{s.num}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            &ldquo;In 3 mesi ho visto tornare clienti che non vedevo da un anno. Il winback automatico è la funzione che mi ha convinto.&rdquo;
          </p>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>Marco T. · Titolare bar, Milano</div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Domande frequenti</h2>
        {[
          { q: 'C\'è una prova gratuita?', a: 'Non abbiamo un piano gratuito, ma offriamo una garanzia rimborso di 14 giorni. Se non sei soddisfatto restituiamo tutto, senza domande.' },
          { q: 'Posso cambiare piano in qualsiasi momento?', a: 'Sì, puoi passare a un piano superiore o inferiore in qualsiasi momento dalla dashboard. Il credito del piano precedente viene scalato proporzionalmente.' },
          { q: 'I miei clienti devono scaricare un\'app?', a: 'No. I clienti inquadrano il QR con la fotocamera del telefono e si registrano in 10 secondi dal browser. Nessuna app da installare.' },
          { q: 'Come vengono gestiti i pagamenti?', a: 'I pagamenti sono gestiti da Paddle, che si occupa di IVA, fatturazione e sicurezza. Accettiamo tutte le carte di credito principali.' },
          { q: 'Posso disdire quando voglio?', a: 'Sì. Nessun contratto, nessuna penale. Disdici dalla dashboard e il piano rimane attivo fino alla fine del periodo già pagato.' },
          { q: 'Quanti negozi posso gestire?', a: 'Starter e Growth gestiscono un singolo negozio. Con Pro puoi gestire più punti vendita da un\'unica dashboard centralizzata.' },
        ].map(item => (
          <div key={item.q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 0' }}>
            <p style={{ fontWeight: '700', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{item.q}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: '1.6' }}>{item.a}</p>
          </div>
        ))}
      </div>

      {/* CTA finale */}
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem 5rem', background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(108,61,244,0.15) 0%, transparent 70%)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: '800', marginBottom: '0.75rem' }}>Inizia oggi — rimborso garantito 14 giorni</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>Setup in 10 minuti. Nessun tecnico necessario.</p>
        <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.9rem 2.5rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', boxShadow: '0 0 30px rgba(108,61,244,0.4)', display: 'inline-block' }}>
          Scegli il tuo piano →
        </Link>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy Policy</Link>
        <Link href="/termini" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Termini di Servizio</Link>
        <Link href="/rimborsi" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Rimborsi</Link>
        <span>© 2026 Fidelio</span>
      </div>
    </div>
  )
}
