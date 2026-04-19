import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation — Fidelio',
  description: 'Documentazione API per integrare Fidelio nel tuo negozio, e-commerce o sistema POS.',
}

const S = {
  page: { background: '#0D0D1A', color: '#fff', minHeight: '100vh', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" } as React.CSSProperties,
  nav: { background: 'rgba(13,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky' as const, top: 0, backdropFilter: 'blur(12px)', zIndex: 100 },
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 6rem' },
  h1: { fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #A78BFA, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as React.CSSProperties,
  lead: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', lineHeight: 1.6 },
  h2: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } as React.CSSProperties,
  h3: { fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' } as React.CSSProperties,
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' } as React.CSSProperties,
  pre: { background: '#0a0a14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.25rem', fontSize: '0.82rem', overflowX: 'auto', lineHeight: 1.65, margin: '0.75rem 0' } as React.CSSProperties,
  badge: (color: string) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginRight: '0.5rem', background: color === 'GET' ? 'rgba(16,185,129,0.15)' : color === 'POST' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)', color: color === 'GET' ? '#10B981' : color === 'POST' ? '#818CF8' : '#F59E0B' } as React.CSSProperties),
  endpoint: { fontFamily: 'monospace', fontSize: '0.95rem', color: '#E2E8F0', fontWeight: 600 } as React.CSSProperties,
  param: { fontFamily: 'monospace', fontSize: '0.82rem', color: '#A78BFA', background: 'rgba(167,139,250,0.1)', padding: '1px 6px', borderRadius: '4px' } as React.CSSProperties,
  pill: (c: string) => ({ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: c, color: '#fff', marginLeft: '0.5rem' } as React.CSSProperties),
  divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.75rem 0' } as React.CSSProperties,
}

function Method({ method }: { method: string }) {
  return <span style={S.badge(method)}>{method}</span>
}

function Endpoint({ method, path }: { method: string; path: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
      <Method method={method} />
      <span style={S.endpoint}>{path}</span>
    </div>
  )
}

function Code({ children }: { children: string }) {
  return <pre style={S.pre}><code style={{ color: '#CBD5E1' }}>{children}</code></pre>
}

function Param({ name, type, required, desc }: { name: string; type: string; required?: boolean; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ minWidth: '160px' }}>
        <code style={{ ...S.param }}>{name}</code>
        {required && <span style={S.pill('#EF4444')}>req</span>}
      </div>
      <span style={{ fontSize: '0.8rem', color: '#60A5FA', minWidth: '60px' }}>{type}</span>
      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', flex: 1 }}>{desc}</span>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px' }}>F</div>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>Fidelio</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>API Docs</span>
        </div>
        <a href="https://www.getfidelio.app" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>← Torna al sito</a>
      </nav>

      <div style={S.wrap}>
        {/* Header */}
        <h1 style={S.h1}>Fidelio API</h1>
        <p style={S.lead}>
          Integra il programma fedeltà Fidelio nel tuo sito, e-commerce o sistema POS.<br />
          Base URL: <code style={{ color: '#A78BFA', background: 'rgba(167,139,250,0.1)', padding: '2px 8px', borderRadius: '5px', fontSize: '0.9rem' }}>https://www.getfidelio.app/api</code>
        </p>

        {/* Versione e piani */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            { label: 'Versione', value: 'v1', color: '#10B981' },
            { label: 'Formato', value: 'JSON', color: '#60A5FA' },
            { label: 'Piano richiesto', value: 'PRO', color: '#A78BFA' },
            { label: 'Rate limit', value: '60 req/min', color: '#F59E0B' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{label}</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── AUTENTICAZIONE ── */}
        <h2 style={S.h2}>🔑 Autenticazione</h2>
        <div style={S.card}>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 1rem' }}>
            Tutte le richieste API richiedono un token di autenticazione nell&apos;header <code style={{ ...S.param }}>Authorization</code>.
            Esistono due modalità di autenticazione:
          </p>

          <h3 style={S.h3}>1. API Key (piano PRO)</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
            Ottieni la tua API key da <strong style={{ color: '#fff' }}>Dashboard → Impostazioni → API</strong>.
            Inizia sempre con <code style={S.param}>fid_live_</code>.
          </p>
          <Code>{`Authorization: Bearer fid_live_abc123...`}</Code>

          <hr style={S.divider} />

          <h3 style={S.h3}>2. Token OTP (scanner e POS)</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
            Per scanner standalone e casse POS, autenticati tramite OTP email e ottieni un JWT valido 30 giorni.
          </p>
          <Code>{`// Step 1 — richiedi OTP
POST /api/shop/auth/send-otp
{ "email": "tuonegozio@example.com" }

// Step 2 — verifica OTP, ricevi token
POST /api/shop/auth/verify-otp
{ "email": "tuonegozio@example.com", "code": "123456" }
// → { "token": "eyJ...", "shop": { ... } }

// Step 3 — usa il token
Authorization: Bearer eyJ...`}</Code>
        </div>

        {/* ── CHECK-IN CLIENTE ── */}
        <h2 style={S.h2}>📲 Check-in cliente</h2>
        <div style={S.card}>
          <Endpoint method="POST" path="/api/shop/checkin" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Registra una visita e assegna punti al cliente. Il cliente viene identificato tramite il suo codice Fidelio
            (presente nel QR della PWA cliente). Il numero di punti è calcolato automaticamente in base alle impostazioni
            del tuo negozio (per visita / per euro / combinato).
          </p>

          <h3 style={S.h3}>Body</h3>
          <Param name="customerCode" type="string" required desc="Codice univoco del cliente (es. FID-XXXXX). Leggibile dal QR." />
          <Param name="amount" type="number" desc="Importo in euro della transazione. Obbligatorio se il sistema punti è 'per_euro' o 'combined'." />

          <h3 style={{ ...S.h3, marginTop: '1rem' }}>Risposta</h3>
          <Code>{`{
  "customerName": "Mario Rossi",
  "customerCode": "FID-AB12C",
  "pointsAdded": 10,
  "totalPoints": 120,
  "isFirstVisit": false
}`}</Code>

          <h3 style={{ ...S.h3, marginTop: '1rem' }}>Esempio cURL</h3>
          <Code>{`curl -X POST https://www.getfidelio.app/api/shop/checkin \\
  -H "Authorization: Bearer fid_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"customerCode":"FID-AB12C","amount":25.50}'`}</Code>

          <h3 style={{ ...S.h3, marginTop: '1rem' }}>Errori possibili</h3>
          <Code>{`400  { "error": "Codice cliente richiesto" }
404  { "error": "Cliente non trovato. Il codice non è registrato su Fidelio." }
401  { "error": "Non autorizzato" }
403  { "error": "Account sospeso" }`}</Code>
        </div>

        {/* ── LOOKUP CLIENTE ── */}
        <h2 style={S.h2}>🔍 Lookup cliente</h2>
        <div style={S.card}>
          <Endpoint method="GET" path="/api/scanner/lookup?code=FID-XXXXX" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Recupera le informazioni di un cliente prima di effettuare il check-in. Utile per mostrare nome e punti
            all&apos;operatore prima di confermare la visita.
          </p>

          <h3 style={S.h3}>Query params</h3>
          <Param name="code" type="string" required desc="Codice cliente Fidelio (es. FID-AB12C)" />

          <h3 style={{ ...S.h3, marginTop: '1rem' }}>Risposta</h3>
          <Code>{`{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "code": "FID-AB12C",
  "points": 120,
  "totalVisits": 8,
  "lastVisitAt": "2026-04-10T14:30:00Z"
}`}</Code>
        </div>

        {/* ── TIMBRO MANUALE ── */}
        <h2 style={S.h2}>🏷️ Timbro manuale</h2>
        <div style={S.card}>
          <Endpoint method="POST" path="/api/scanner/stamp" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Assegna punti a un cliente specificando manualmente il numero (utile per premi speciali o correzioni).
          </p>

          <h3 style={S.h3}>Body</h3>
          <Param name="customerCode" type="string" required desc="Codice cliente Fidelio" />
          <Param name="points" type="number" required desc="Numero di punti da assegnare" />
          <Param name="note" type="string" desc="Nota interna (es. 'Premio speciale')" />
        </div>

        {/* ── PREMI ── */}
        <h2 style={S.h2}>🏆 Premi</h2>
        <div style={S.card}>
          <Endpoint method="GET" path="/api/shop/rewards" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Restituisce tutti i premi attivi del negozio autenticato.
          </p>
          <Code>{`[
  {
    "id": "clxxx...",
    "title": "Caffè gratis",
    "description": "Un caffè a scelta",
    "pointsRequired": 100,
    "active": true
  }
]`}</Code>
        </div>

        {/* ── STATISTICHE ── */}
        <h2 style={S.h2}>📊 Statistiche</h2>
        <div style={S.card}>
          <Endpoint method="GET" path="/api/shop/stats" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Statistiche aggregate del negozio: clienti totali, visite, punti distribuiti.
          </p>
          <Code>{`{
  "totalCustomers": 284,
  "totalVisits": 1420,
  "totalPoints": 14200,
  "activeCustomers": 98,
  "avgVisitsPerCustomer": 5.0
}`}</Code>
        </div>

        {/* ── WEBHOOKS ── */}
        <h2 style={S.h2}>🔗 Webhook</h2>
        <div style={S.card}>
          <h3 style={S.h3}>Shopify — orders/paid</h3>
          <Endpoint method="POST" path="/api/webhooks/shopify" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Assegna punti automaticamente ad ogni ordine pagato su Shopify. Il cliente viene
            identificato tramite l&apos;email dell&apos;ordine. Configura il webhook in{' '}
            <strong style={{ color: '#fff' }}>Shopify Admin → Impostazioni → Notifiche → Webhook</strong>.
          </p>
          <Code>{`// URL da inserire in Shopify:
https://www.getfidelio.app/api/webhooks/shopify

// Header richiesto:
X-Shopify-Shop-Domain: il-tuo-negozio.myshopify.com

// Body automatico (Shopify lo invia):
{
  "email": "cliente@example.com",
  "total_price": "49.90",
  "line_items": [...]
}`}</Code>

          <hr style={{ ...S.divider, margin: '1.25rem 0' }} />

          <h3 style={S.h3}>WooCommerce — woocommerce_order_status_completed</h3>
          <Endpoint method="POST" path="/api/webhooks/woocommerce" />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Integra Fidelio con WooCommerce per assegnare punti automaticamente. Configura il webhook in{' '}
            <strong style={{ color: '#fff' }}>WooCommerce → Impostazioni → Avanzate → Webhook</strong>.
          </p>
          <Code>{`// URL webhook:
https://www.getfidelio.app/api/webhooks/woocommerce

// Header autenticazione:
X-Fidelio-Shop-Id: il-tuo-shop-id
X-Fidelio-Api-Key: fid_live_...`}</Code>
        </div>

        {/* ── AUTENTICAZIONE OTP CLIENTI ── */}
        <h2 style={S.h2}>👤 Autenticazione clienti (PWA)</h2>
        <div style={S.card}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Questi endpoint gestiscono l&apos;autenticazione dei clienti finali nella PWA Fidelio. Utili se vuoi integrare
            il profilo fedeltà nel tuo sito o app.
          </p>

          <h3 style={S.h3}>Richiedi OTP</h3>
          <Endpoint method="POST" path="/api/customer/auth/send-otp" />
          <Code>{`// Body
{ "email": "cliente@example.com" }
// → { "ok": true }`}</Code>

          <h3 style={{ ...S.h3, marginTop: '1rem' }}>Verifica OTP</h3>
          <Endpoint method="POST" path="/api/customer/auth/verify-otp" />
          <Code>{`// Body
{ "email": "cliente@example.com", "code": "123456" }

// Risposta
{
  "token": "eyJ...",
  "customer": {
    "email": "cliente@example.com",
    "name": "Mario Rossi",
    "code": "FID-AB12C"
  }
}`}</Code>
        </div>

        {/* ── SDK / LIBRERIE ── */}
        <h2 style={S.h2}>📦 Integrazione rapida</h2>
        <div style={S.card}>
          <h3 style={S.h3}>JavaScript / Node.js</h3>
          <Code>{`// Installa axios o usa fetch nativo
const FIDELIO_API = 'https://www.getfidelio.app/api'
const TOKEN = 'fid_live_...'

async function checkin(customerCode, amount) {
  const res = await fetch(\`\${FIDELIO_API}/shop/checkin\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${TOKEN}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerCode, amount }),
  })
  return res.json()
}

// Esempio di utilizzo
const result = await checkin('FID-AB12C', 25.50)
console.log(\`+\${result.pointsAdded} punti a \${result.customerName}\`)`}</Code>

          <hr style={S.divider} />

          <h3 style={S.h3}>PHP (WooCommerce / WordPress)</h3>
          <Code>{`<?php
function fidelio_checkin($customer_code, $amount = null) {
  $token = get_option('fidelio_api_key'); // salva in wp-admin
  $response = wp_remote_post('https://www.getfidelio.app/api/shop/checkin', [
    'headers' => [
      'Authorization' => 'Bearer ' . $token,
      'Content-Type'  => 'application/json',
    ],
    'body' => json_encode([
      'customerCode' => $customer_code,
      'amount'       => $amount,
    ]),
  ]);
  return json_decode(wp_remote_retrieve_body($response), true);
}`}</Code>
        </div>

        {/* ── CODICI ERRORE ── */}
        <h2 style={S.h2}>⚠️ Codici di errore</h2>
        <div style={S.card}>
          {[
            { code: '200', label: 'OK', desc: 'Richiesta completata con successo' },
            { code: '400', label: 'Bad Request', desc: 'Parametri mancanti o non validi' },
            { code: '401', label: 'Unauthorized', desc: 'Token mancante o non valido' },
            { code: '403', label: 'Forbidden', desc: 'Account sospeso o piano insufficiente' },
            { code: '404', label: 'Not Found', desc: 'Risorsa non trovata (cliente, negozio, ecc.)' },
            { code: '429', label: 'Too Many Requests', desc: 'Limite di 60 richieste/minuto superato' },
            { code: '500', label: 'Server Error', desc: 'Errore interno. Riprova tra qualche secondo.' },
          ].map(({ code, label, desc }) => (
            <div key={code} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
              <code style={{ minWidth: '48px', fontWeight: 700, color: Number(code) >= 400 ? '#EF4444' : '#10B981', fontFamily: 'monospace' }}>{code}</code>
              <span style={{ minWidth: '130px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* ── SUPPORTO ── */}
        <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: '16px', padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Hai bisogno di aiuto?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
            Apri una chat dal vivo dalla tua dashboard o scrivici via email.<br />
            Rispondiamo entro poche ore.
          </p>
          <a
            href="mailto:support@getfidelio.app"
            style={{ display: 'inline-block', background: '#7C3AED', color: '#fff', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}
          >
            support@getfidelio.app
          </a>
        </div>
      </div>
    </div>
  )
}
