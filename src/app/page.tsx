import type { Metadata } from 'next'
import Link from 'next/link'
import { features } from './features-data'
import { FounderCounter } from './FounderCounter'
import { CrispButton } from './CrispButton'
import { db } from '@/lib/db'
import { FidelioLogo } from '@/components/FidelioLogo/FidelioLogo'

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
    cta: 'Abbonati', featured: true,
  },
  {
    name: 'PRO', price: '79', period: 'mese',
    features: ['Tutto di GROWTH', 'Multi-sede (multi-store)', 'Dashboard centralizzata', 'Ruoli avanzati e permessi granulari', 'Automazioni avanzate (trigger complessi)', 'API access', 'Reportistica avanzata', 'Supporto dedicato', 'Onboarding assistito'],
    cta: 'Abbonati', featured: false,
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
  let stats = { shops: 0, customers: 0, visits: 0 }
  try {
    const real = await db.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' }, take: 6 })
    if (real.length >= 2) testimonials = real
  } catch {}
  try {
    const [shops, customers, visits] = await Promise.all([
      db.shop.count({ where: { approved: true } }),
      db.customer.count(),
      db.visit.count(),
    ])
    stats = { shops, customers, visits }
  } catch {}

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(108,61,244,0.7), 0 0 16px rgba(108,61,244,0.4); transform: scale(1); }
          50% { box-shadow: 0 0 0 8px rgba(108,61,244,0), 0 0 32px rgba(108,61,244,0.7); transform: scale(1.03); }
        }
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,26,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 2rem', overflow: 'hidden' }}>
        {/* marginRight negativo compensa l'overflow DOM invisibile causato da transformOrigin:left sul scale */}
        <a href="/" style={{ textDecoration: 'none', display: 'block', flexShrink: 0, marginRight: '-100px' }}>
          <FidelioLogo size="sm" tagline={true} animate={true} />
        </a>
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
          <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.9rem 2rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', animation: 'navPulse 2s ease-in-out infinite' }}>
            Inizia ora
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '1rem' }}>
          Setup in 10 minuti · Trial gratuito 14 giorni · Nessuna carta di credito
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '100px', padding: '0.4rem 1rem', marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem' }}>🛡️</span>
          <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700' }}>Soddisfatti o rimborsati entro 14 giorni</span>
        </div>
      </div>

      {/* Stats reali */}
      {stats.shops > 0 && (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { value: stats.shops, label: 'negozi attivi', suffix: '+' },
              { value: stats.customers, label: 'clienti fidelizzati', suffix: '+' },
              { value: stats.visits, label: 'visite registrate', suffix: '+' },
            ].map(({ value, label, suffix }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg,#A78BFA,#60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties}>
                  {value.toLocaleString('it-IT')}{suffix}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <Link href="/register" style={{ display: 'block', background: '#6C3DF4', color: 'white', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', animation: 'ctaPulse 2s ease-in-out infinite' }}>
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

      {/* Perché fidarsi */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.3rem 1rem', borderRadius: '100px', fontSize: '0.8rem', color: '#10B981', fontWeight: '600', marginBottom: '1rem' }}>
            La nostra promessa
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Perché fidarsi di Fidelio</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Costruito per i negozi italiani, con trasparenza totale su prezzi e dati.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem' }}>
          {[
            { icon: '🔒', title: 'Dati al sicuro', desc: 'Server in Europa, GDPR compliant. I dati dei tuoi clienti non vengono mai condivisi o venduti a terzi.' },
            { icon: '🇮🇹', title: 'Made in Italy', desc: 'Supporto in italiano, capisce le esigenze dei negozi italiani. Non un tool americano tradotto.' },
            { icon: '💸', title: 'Nessuna commissione', desc: 'Paghi solo l\'abbonamento mensile. Zero commissioni sulle vendite, zero costi nascosti.' },
            { icon: '🔄', title: 'Annulli quando vuoi', desc: 'Nessun contratto a lungo termine. Disdici online in un click, senza penali e senza telefonate.' },
            { icon: '💬', title: 'Supporto umano', desc: 'Rispondiamo entro 24h via chat o email. Una persona reale, non un bot, pronta ad aiutarti.' },
            { icon: '⚡', title: 'Sempre aggiornato', desc: 'Nuove funzionalità ogni mese, incluse nel tuo piano. Non paghi mai un aggiornamento extra.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.4rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.6rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.3rem', color: '#fff' }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: '1.6' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Domande frequenti</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: '3rem', fontSize: '0.95rem' }}>Hai altre domande? <CrispButton style={{ background: 'none', border: 'none', color: '#A78BFA', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', padding: 0 }}>Scrivici in chat →</CrispButton></p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { q: 'I clienti devono scaricare un\'app?', a: 'No. I clienti scansionano il QR code con la fotocamera del telefono e accedono alla PWA direttamente dal browser. Zero installazioni.' },
            { q: 'Come funziona il trial di 14 giorni?', a: 'Registri il negozio, vieni approvato (entro 24h) e hai 14 giorni gratuiti per provare tutte le funzionalità del piano GROWTH. Nessuna carta di credito richiesta.' },
            { q: 'Posso personalizzare i premi?', a: 'Sì. Puoi creare qualsiasi tipo di premio: uno sconto, un prodotto gratuito, un servizio omaggio. Tu decidi quanti punti servono per ottenerlo.' },
            { q: 'Funziona per qualsiasi tipo di negozio?', a: 'Sì — bar, ristoranti, parrucchieri, palestre, panetterie, negozi di abbigliamento e molto altro. Se hai clienti abituali, Fidelio fa al caso tuo.' },
            { q: 'Posso integrarlo con il mio e-commerce?', a: 'Sì, con il piano PRO hai accesso alle API e ai webhook per Shopify e WooCommerce. I punti vengono assegnati automaticamente ad ogni ordine.' },
            { q: 'Cosa succede se annullo?', a: 'Puoi annullare in qualsiasi momento. I dati dei tuoi clienti rimangono disponibili per 30 giorni, poi vengono eliminati su richiesta.' },
            { q: 'Il QR code cambia nel tempo?', a: 'Con il piano GROWTH e PRO hai il QR dinamico: puoi aggiornare le impostazioni del negozio senza dover ristampare nulla.' },
          ].map(({ q, a }, i) => (
            <details key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <summary style={{ fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                {q}
                <span style={{ color: '#A78BFA', flexShrink: 0, fontSize: '1.1rem' }}>+</span>
              </summary>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: '1.7', marginTop: '0.75rem', marginBottom: 0 }}>{a}</p>
            </details>
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
        <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '1rem 2.5rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 0 40px rgba(108,61,244,0.5)', display: 'inline-block', animation: 'ctaPulse 2s ease-in-out infinite' }}>
          Inizia ora →
        </Link>
        {/* Badge garanzia */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          {[
            { icon: '🛡️', text: 'Soddisfatti o rimborsati 14 giorni' },
            { icon: '🔓', text: 'Nessun contratto' },
            { icon: '⚡', text: 'Setup in 10 minuti' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '0.35rem 0.9rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{icon}</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: '600' }}>{text}</span>
            </div>
          ))}
        </div>
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
          <Link href="/rimborsi" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Rimborsi</Link>
          <Link href="/dpa" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>DPA</Link>
          <a href="mailto:support@getfidelio.app" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Contatti</a>
        </nav>
        <p style={{ marginTop: '1rem' }}>© 2026 Fidelio. Tutti i diritti riservati.</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>Fidelio è un servizio di Antonio Piersante · support@getfidelio.app</p>
      </footer>
    </div>
  )
}
