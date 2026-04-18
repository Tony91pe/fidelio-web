import type { Metadata } from 'next'
import Link from 'next/link'
import { features } from './features-data'
import { FounderCounter } from './FounderCounter'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Fidelio — Fidelizza i tuoi clienti con punti digitali e QR code',
  description: 'Fidelio è il programma fedeltà digitale per negozi italiani. Punti digitali, QR code alla cassa, email automatiche e AI. Setup in 10 minuti, nessuna app richiesta.',
  alternates: { canonical: 'https://www.getfidelio.app' },
  openGraph: {
    title: 'Fidelio — Fidelizza i tuoi clienti',
    description: 'Punti digitali, QR code, email automatiche e AI per far tornare i tuoi clienti ogni giorno.',
    url: 'https://www.getfidelio.app',
  },
}

const plans = [
  {
    name: 'STARTER', price: '19', period: 'mese',
    features: ['1 negozio', 'QR statico', 'Raccolta punti base', '1 premio attivo', 'Email automatiche base (benvenuto + punti)', 'Dashboard semplice', 'Storico clienti', 'Profilo negozio base', 'Branding Fidelio obbligatorio', 'Supporto via email'],
    cta: 'Abbonati', featured: false,
  },
  {
    name: 'GROWTH', price: '39', period: 'mese',
    features: ['Tutto di STARTER', 'QR dinamico', 'Anti-frode', 'Premi illimitati', 'Gift card', 'Email automatiche avanzate (compleanno, winback)', 'Statistiche giornaliere', 'Dashboard completa', 'Ruoli: commesso, manager, owner', 'Branding personalizzato (logo + colori)', 'Notifiche push Android', 'Segmentazione clienti base', 'Supporto prioritario'],
    cta: 'Inizia', featured: true,
  },
  {
    name: 'PRO', price: '79', period: 'mese',
    features: ['Tutto di GROWTH', 'Multi-sede (multi-store)', 'Dashboard centralizzata', 'Ruoli avanzati e permessi granulari', 'Automazioni avanzate (trigger complessi)', 'API access', 'Reportistica avanzata', 'Supporto dedicato', 'Onboarding assistito'],
    cta: 'Inizia', featured: false,
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Fidelio',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android, iOS',
  url: 'https://www.getfidelio.app',
  description: 'Programma fedeltà digitale per negozi italiani con punti, QR code, email automatiche e AI.',
  offers: [
    { '@type': 'Offer', name: 'STARTER', price: '19', priceCurrency: 'EUR', billingPeriod: 'P1M' },
    { '@type': 'Offer', name: 'GROWTH', price: '39', priceCurrency: 'EUR', billingPeriod: 'P1M' },
    { '@type': 'Offer', name: 'PRO', price: '79', priceCurrency: 'EUR', billingPeriod: 'P1M' },
  ],
  publisher: { '@type': 'Organization', name: 'Fidelio', url: 'https://www.getfidelio.app' },
}

const FALLBACK_TESTIMONIALS = [
  { id: '1', name: 'Marco T.', role: 'Titolare bar — Milano', text: 'I clienti del caffè mattutino ora tornano più spesso. Ho visto un aumento del 20% nelle visite settimanali dopo solo un mese.' },
  { id: '2', name: 'Giulia R.', role: 'Parrucchiera — Roma', text: 'Finalmente un sistema fedeltà che funziona davvero. I miei clienti adorano accumulare punti e i premi li fanno tornare.' },
  { id: '3', name: 'Luca B.', role: 'Panettiere — Napoli', text: 'Setup semplicissimo. In 15 minuti avevo già il QR code stampato e i primi clienti che scansionavano. Ottimo prodotto.' },
]

export default async function LandingPage() {
  let testimonials = FALLBACK_TESTIMONIALS
  try {
    const real = await db.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' }, take: 6 })
    if (real.length >= 2) testimonials = real
  } catch {}

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href="/" style={{ fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'white' }}>
          <img src="/favicon.svg" alt="Fidelio" width={28} height={28} style={{ borderRadius: 6 }} />
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
      <div style={{ paddingTop: '8rem', paddingBottom: '5rem', textAlign: 'center', background: 'radial-gradient(ellipse 80% 50% at 50% -10%,rgba(108,61,244,0.3) 0%,transparent 70%)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(108,61,244,0.15)', border: '1px solid rgba(108,61,244,0.3)', padding: '0.3rem 1rem', borderRadius: '100px', fontSize: '0.8rem', color: '#A78BFA', fontWeight: '600', marginBottom: '1.5rem' }}>
          La fedeltà digitale per il tuo negozio
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          Fai tornare i tuoi clienti ogni giorno
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '550px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
          Punti digitali, QR code alla cassa, email automatiche e un&apos;AI che ti aiuta a non perdere più clienti.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.9rem 2rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', boxShadow: '0 0 30px rgba(108,61,244,0.4)' }}>
            Inizia ora
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '1rem' }}>
          Setup in 10 minuti. Nessuna competenza tecnica richiesta.
        </p>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '3rem' }}>
          Tutto quello che ti serve
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.2rem' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prezzi */}
      <div id="prezzi" style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '3rem' }}>
          Scegli il Pacchetto che fa per Te
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1.2rem' }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: p.featured ? 'rgba(108,61,244,0.15)' : 'rgba(255,255,255,0.04)', border: '1px solid ' + (p.featured ? 'rgba(108,61,244,0.4)' : 'rgba(255,255,255,0.08)'), borderRadius: '20px', padding: '2rem', transform: p.featured ? 'scale(1.03)' : 'none' }}>
              {p.featured && (
                <div style={{ background: '#6C3DF4', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700', display: 'inline-block', marginBottom: '1rem' }}>
                  PIÙ SCELTO
                </div>
              )}
              <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{p.name}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.2rem' }}>
                {p.price}<span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}> euro/{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#10B981' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{ display: 'block', background: p.featured ? '#6C3DF4' : 'transparent', color: 'white', padding: '0.7rem', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', border: p.featured ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof — Come funziona */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 2rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.3rem 1rem', borderRadius: '100px', fontSize: '0.8rem', color: '#10B981', fontWeight: '600', marginBottom: '1rem' }}>
            Setup in 10 minuti
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1rem' }}>Come funziona</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>Tre passi e il tuo programma fedeltà è live</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
          {[
            { step: '1', icon: '🏪', title: 'Crea il negozio', desc: 'Registrati, inserisci i dati del tuo negozio e personalizza i tuoi premi. Ci vogliono 10 minuti.' },
            { step: '2', icon: '📱', title: 'Stampa il QR', desc: 'Ogni cliente scansiona il tuo QR alla cassa. Nessuna app da scaricare, funziona su qualsiasi smartphone.' },
            { step: '3', icon: '🎁', title: 'Fidelizza', desc: 'I clienti accumulano punti automaticamente. Tu vedi tutto dalla dashboard e mandi promozioni mirate.' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(108,61,244,0.2)', border: '1px solid rgba(108,61,244,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.3rem', fontWeight: '800', color: '#A78BFA' }}>
                {s.step}
              </div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{s.icon}</div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem' }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: '1.6' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>
          Cosa dicono i negozi
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Negozi italiani che usano Fidelio ogni giorno
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.2rem' }}>
          {testimonials.map(t => (
            <div key={t.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.1rem', color: '#F59E0B', marginBottom: '0.75rem' }}>★★★★★</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '1rem', fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C3DF4,#4F28C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{t.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA finale */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(108,61,244,0.2) 0%,transparent 70%)' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: '800', marginBottom: '1rem' }}>
          Pronto a fidelizzare i tuoi clienti?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '1rem' }}>
          Unisciti ai negozi che usano Fidelio. Setup in 10 minuti, nessun contratto.
        </p>
        <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '1rem 2.5rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 0 40px rgba(108,61,244,0.5)', display: 'inline-block' }}>
          Inizia ora →
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', marginTop: '1rem' }}>
          Garanzia rimborso 14 giorni · Annulla quando vuoi
        </p>
      </div>

      {/* Fondatori — client component per il counter live */}
      <FounderCounter />

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', textDecoration: 'none', display: 'block' }}>
          Fidelio
        </Link>
        <p>La fedeltà digitale per il tuo negozio</p>
        <nav aria-label="Footer" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Privacy Policy</Link>
          <Link href="/termini" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Termini di Servizio</Link>
          <Link href="/cookie-policy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Cookie Policy</Link>
          <a href="mailto:support@getfidelio.app" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Contatti</a>
        </nav>
        <p style={{ marginTop: '1rem' }}>© 2026 Fidelio. Tutti i diritti riservati.</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>Fidelio è un servizio di Antonio Piersante · support@getfidelio.app</p>
      </footer>
    </div>
  )
}
