'use client'
import { useEffect, useState } from 'react'

type IntegrationData = {
  shopId: string
  woocommerceWebhookUrl: string
  woocommerceWebhookSecret: string
  prestashopWebhookUrl: string
  prestashopWebhookSecret: string
  widgetSnippet: string
  pointsPerEuro: number
  website: string | null
}

function CopyBox({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', fontWeight: '600' }}>{label}</p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <code style={{
          flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: mono ? '0.78rem' : '0.85rem',
          fontFamily: mono ? 'monospace' : 'inherit', color: '#A78BFA', wordBreak: 'break-all',
          whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.5',
        }}>{value}</code>
        <button onClick={copy} style={{
          padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)',
          background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
          color: copied ? '#10B981' : 'rgba(255,255,255,0.6)', fontSize: '0.78rem',
          cursor: 'pointer', flexShrink: 0, fontWeight: '600',
        }}>
          {copied ? '✓ Copiato' : 'Copia'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, icon, children, locked }: { title: string; icon: string; children: React.ReactNode; locked?: boolean }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', opacity: locked ? 0.5 : 1 }}>
      {locked && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 2, flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Disponibile dal piano GROWTH</span>
        </div>
      )}
      <h2 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  )
}

export default function IntegrationsPage() {
  const [data, setData] = useState<IntegrationData | null>(null)
  const [plan, setPlan] = useState('STARTER')

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/integrations').then(r => r.json()).then(setData)
  }, [])

  const isGrowth = plan === 'GROWTH' || plan === 'PRO'

  return (
    <div style={{ padding: '2rem', maxWidth: '720px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Integrazioni</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Collega Fidelio al tuo sito web o e-commerce per assegnare punti automaticamente.
      </p>

      {/* Widget Embeddable */}
      <Section title="Widget Embeddabile" icon="🧩">
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
          Incolla questo snippet HTML nel tuo sito web per mostrare il form di iscrizione al programma fedeltà direttamente nella tua pagina.
        </p>
        {data ? (
          <>
            <CopyBox label="Snippet da incollare nel tuo sito" value={data.widgetSnippet} />
            <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                💡 <strong style={{ color: 'white' }}>Come usarlo:</strong> incolla il codice dove vuoi che appaia il form. Funziona su WordPress, Wix, Shopify, HTML statico — qualsiasi piattaforma che supporti codice personalizzato.
              </p>
            </div>
          </>
        ) : (
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
        )}
      </Section>

      {/* WooCommerce */}
      <Section title="WooCommerce" icon="🛒" locked={!isGrowth}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
          Assegna punti automaticamente quando un cliente completa un acquisto sul tuo shop WooCommerce. Richiede che il cliente sia iscritto a Fidelio con la stessa email usata per l'ordine.
        </p>
        {data && (
          <>
            <CopyBox label="URL Webhook da inserire in WooCommerce" value={data.woocommerceWebhookUrl} />
            <CopyBox label="Segreto Webhook" value={data.woocommerceWebhookSecret || '(configura WOOCOMMERCE_WEBHOOK_SECRET in env)'} />
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'white', marginBottom: '0.6rem' }}>📋 Istruzioni WooCommerce:</p>
              <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  'Vai su WooCommerce → Impostazioni → Avanzate → Webhook',
                  'Clicca "Aggiungi Webhook"',
                  'Nome: Fidelio Punti | Stato: Attivo',
                  'Argomento: Ordine creato + Ordine aggiornato',
                  'URL consegna: incolla l\'URL sopra',
                  'Segreto: incolla il segreto sopra',
                  'Assicurati che il tuo sito sia salvato nel campo "Sito web" delle Impostazioni negozio Fidelio',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{s}</li>
                ))}
              </ol>
            </div>
          </>
        )}
      </Section>

      {/* PrestaShop */}
      <Section title="PrestaShop" icon="🔧" locked={!isGrowth}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
          Integrazione con PrestaShop tramite modulo webhook. Assegna punti ad ogni ordine completato.
        </p>
        {data && (
          <>
            <CopyBox label="URL Webhook PrestaShop" value={data.prestashopWebhookUrl} />
            <CopyBox label="Token di autenticazione" value={data.prestashopWebhookSecret || '(configura PRESTASHOP_WEBHOOK_SECRET in env)'} />
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'white', marginBottom: '0.6rem' }}>📋 Istruzioni PrestaShop:</p>
              <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  'Installa un modulo webhook per PrestaShop (es. "Webkul Webhook" o "ActionWebhook")',
                  'Crea un nuovo webhook per l\'evento "Order Payment Accepted"',
                  'URL: incolla l\'URL sopra',
                  'Aggiungi header: x-prestashop-token → il tuo token',
                  'Oppure aggiungi ?token=... all\'URL direttamente',
                  'Assicurati che il dominio del tuo shop sia nel campo "Sito web" delle impostazioni Fidelio',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{s}</li>
                ))}
              </ol>
            </div>
          </>
        )}
      </Section>

      {/* Punti per euro */}
      <Section title="Configurazione punti e-commerce" icon="⚙️" locked={!isGrowth}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '1rem' }}>
          Quanti punti assegnare per ogni euro speso online. Valore attuale: <strong style={{ color: '#A78BFA' }}>{data?.pointsPerEuro ?? 1} punto/€</strong>.
        </p>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.5' }}>
          Per modificarlo vai su <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Impostazioni → Negozio</strong> e aggiorna il campo "Punti per euro (e-commerce)".
        </p>
      </Section>
    </div>
  )
}
