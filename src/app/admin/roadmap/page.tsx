'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Item = { id: string; text: string; priority: 'alta' | 'media' | 'bassa'; done: boolean }
type Section = { id: string; title: string; icon: string; items: Item[] }

const ROADMAP: Section[] = [
  {
    id: 'dashboard',
    title: 'Dashboard negozi',
    icon: '🖥️',
    items: [
      { id: 'd1', text: 'Sistema livelli VIP clienti (Bronzo / Argento / Oro) con benefici diversi per livello', priority: 'alta', done: false },
      { id: 'd2', text: 'Integrazione Google Wallet e Apple Wallet — tessera fedeltà digitale nel portafoglio del cliente', priority: 'alta', done: false },
      { id: 'd3', text: 'Notifiche push ai clienti direttamente dalla dashboard (es. "offerta del giorno")', priority: 'alta', done: false },
      { id: 'd4', text: 'Integrazione POS — assegnazione punti automatica alla cassa senza QR', priority: 'media', done: false },
      { id: 'd5', text: 'Integrazione Shopify — sincronizzazione acquisti online con punti fedeltà', priority: 'media', done: false },
      { id: 'd6', text: 'Integrazione WooCommerce — stesso concetto di Shopify per WordPress', priority: 'media', done: false },
      { id: 'd7', text: 'Campagne SMS — invio messaggi di testo ai clienti oltre alle email', priority: 'media', done: false },
      { id: 'd8', text: 'Campagne WhatsApp Business — messaggi WhatsApp automatici', priority: 'media', done: false },
      { id: 'd9', text: 'Segmentazione avanzata clienti — filtri per visite, punti, ultima visita, compleanno', priority: 'alta', done: false },
      { id: 'd10', text: 'A/B testing campagne email — testare oggetti e contenuti diversi', priority: 'bassa', done: false },
      { id: 'd11', text: 'Analisi coorte — visualizzare la retention nel tempo per gruppo di clienti', priority: 'media', done: false },
      { id: 'd12', text: 'Customer Lifetime Value (CLV) per cliente — quanto vale ogni cliente nel tempo', priority: 'media', done: false },
      { id: 'd13', text: 'Sfide / Challenge per clienti — "visita 5 volte in un mese e guadagna 100 punti bonus"', priority: 'media', done: false },
      { id: 'd14', text: 'Prenotazioni integrate — sistema di booking semplice collegato ai punti', priority: 'bassa', done: false },
      { id: 'd15', text: 'Integrazione Zapier — connetti Fidelio con 5000+ app senza codice', priority: 'media', done: false },
      { id: 'd16', text: 'Opzione white-label — dashboard brandizzata con logo del negozio', priority: 'bassa', done: false },
      { id: 'd17', text: 'Report PDF scaricabile — riepilogo mensile da inviare ai partner o soci', priority: 'bassa', done: false },
      { id: 'd18', text: 'Gestione multi-valuta — per negozi che operano in più paesi', priority: 'bassa', done: false },
      { id: 'd19', text: 'Sondaggi ai clienti — chiedere feedback dopo la visita con punteggio NPS', priority: 'media', done: false },
      { id: 'd20', text: 'Referral cliente-cliente — i clienti possono invitare amici e guadagnare punti', priority: 'alta', done: false },
    ],
  },
  {
    id: 'pwa',
    title: 'PWA clienti (app.fidelio.app)',
    icon: '📱',
    items: [
      { id: 'p1', text: 'Notifiche push — offerte, punti assegnati, premi disponibili direttamente sullo schermo', priority: 'alta', done: false },
      { id: 'p2', text: 'Sezione "Amici" — invita amici e guadagna punti quando si registrano', priority: 'alta', done: false },
      { id: 'p3', text: 'Mappa negozi vicini — scopri altri negozi Fidelio nella tua zona', priority: 'media', done: false },
      { id: 'p4', text: 'Badge e achievements — gamification per motivare le visite (es. "Cliente del mese")', priority: 'media', done: false },
      { id: 'p5', text: 'Sfide attive — visualizzare le challenge del negozio e il progresso', priority: 'media', done: false },
      { id: 'p6', text: 'Storico gift card — visualizzare le gift card ricevute e usate', priority: 'media', done: false },
      { id: 'p7', text: 'Schermata negozio migliorata — foto, orari, indirizzo, link Google Maps', priority: 'alta', done: false },
      { id: 'p8', text: 'Widget livello VIP — mostrare il livello raggiunto (Bronzo/Argento/Oro) nella home', priority: 'media', done: false },
      { id: 'p9', text: 'Modalità offline — funzionamento base senza connessione internet', priority: 'bassa', done: false },
      { id: 'p10', text: 'Condivisione social — "Ho guadagnato il mio premio da [Negozio]!" su Instagram/WhatsApp', priority: 'bassa', done: false },
      { id: 'p11', text: 'Dark/Light mode — tema chiaro opzionale per chi preferisce', priority: 'bassa', done: false },
      { id: 'p12', text: 'Valutazione negozio — lasciare una stella al negozio dopo la visita', priority: 'media', done: false },
    ],
  },
  {
    id: 'sito',
    title: 'Sito pubblico (getfidelio.app)',
    icon: '🌐',
    items: [
      { id: 's1', text: 'Pagina casi di studio — storie reali di negozi che usano Fidelio con dati', priority: 'alta', done: false },
      { id: 's2', text: 'Comparazione con concorrenti — tabella vs Stamp Me, Loyverse, Square Loyalty', priority: 'media', done: false },
      { id: 's3', text: 'Video demo — screencast della dashboard in azione (homepage e blog)', priority: 'alta', done: false },
      { id: 's4', text: 'Pagina "Come funziona" dettagliata — step by step per negoziante e cliente', priority: 'media', done: false },
      { id: 's5', text: 'Calcolatore ROI interattivo — "inserisci i tuoi clienti → calcola quanto puoi guadagnare"', priority: 'media', done: false },
      { id: 's6', text: 'Pagina integrazioni — lista di tutti i sistemi compatibili (POS, e-commerce, ecc.)', priority: 'bassa', done: false },
      { id: 's7', text: 'Newsletter — iscrizione per negozianti con consigli sulla fidelizzazione', priority: 'media', done: false },
      { id: 's8', text: 'Pagina partner/affiliati pubblica — form di candidatura per affiliati', priority: 'media', done: false },
      { id: 's9', text: 'Changelog pubblico — cosa c\'è di nuovo in Fidelio ogni settimana', priority: 'bassa', done: false },
      { id: 's10', text: 'Multilingua — versione inglese e spagnola del sito per espansione europea', priority: 'bassa', done: false },
    ],
  },
  {
    id: 'infra',
    title: 'Infrastruttura e tecnico',
    icon: '⚙️',
    items: [
      { id: 'i1', text: 'API pubblica documentata — permettere integrazioni custom per negozi PRO', priority: 'media', done: false },
      { id: 'i2', text: 'Webhook in uscita — notificare sistemi esterni quando avviene una visita o un premio', priority: 'media', done: false },
      { id: 'i3', text: 'SSO (Single Sign-On) — accesso con Google per i negozi', priority: 'bassa', done: false },
      { id: 'i4', text: 'Dashboard analytics interna Fidelio — metriche di prodotto (MAU, churn, NPS)', priority: 'alta', done: false },
      { id: 'i5', text: 'Backup esportazione dati automatico — ogni mese file CSV dei dati del negozio', priority: 'media', done: false },
      { id: 'i6', text: 'Test automatici (CI) — suite di test per evitare regressioni nei deploy', priority: 'media', done: false },
    ],
  },
]

const PRIORITY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  alta:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Alta' },
  media: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'Media' },
  bassa: { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', label: 'Bassa' },
}

export default function RoadmapPage() {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [filter, setFilter] = useState<'all' | 'alta' | 'media' | 'bassa' | 'todo'>('all')

  useEffect(() => {
    try {
      const d = localStorage.getItem('fidelio_roadmap_done')
      if (d) setDone(new Set(JSON.parse(d)))
      const n = localStorage.getItem('fidelio_roadmap_note')
      if (n) setNote(n)
    } catch {}
  }, [])

  function toggleDone(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('fidelio_roadmap_done', JSON.stringify([...next]))
      return next
    })
  }

  function saveNote() {
    localStorage.setItem('fidelio_roadmap_note', note)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const totalItems = ROADMAP.reduce((a, s) => a + s.items.length, 0)
  const totalDone = done.size

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', fontFamily: 'system-ui', padding: '2rem', maxWidth: 900 }}>
      <Link href="/admin" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.85rem' }}>← Admin</Link>

      <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>🗺️ Roadmap Fidelio</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          Idee e funzionalità future — spunta quelle completate, aggiungi le tue idee in fondo
        </p>
      </div>

      {/* Progresso */}
      <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: 14, padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a78bfa' }}>{totalDone}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/{totalItems}</span></div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>funzionalità completate</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(totalDone / totalItems) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>{Math.round((totalDone / totalItems) * 100)}% completato</div>
        </div>
      </div>

      {/* Filtri */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {(['all', 'alta', 'media', 'bassa', 'todo'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? '#7c3aed' : 'rgba(255,255,255,0.05)', color: filter === f ? 'white' : 'rgba(255,255,255,0.5)', border: `1px solid ${filter === f ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
            {f === 'all' ? 'Tutte' : f === 'todo' ? 'Da fare' : `Priorità ${f}`}
          </button>
        ))}
      </div>

      {/* Sezioni */}
      {ROADMAP.map(section => {
        const visible = section.items.filter(item => {
          if (filter === 'todo') return !done.has(item.id)
          if (filter === 'all') return true
          return item.priority === filter
        })
        if (visible.length === 0) return null
        const sectionDone = section.items.filter(i => done.has(i.id)).length

        return (
          <div key={section.id} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{section.icon}</span>
              <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{section.title}</h2>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
                {sectionDone}/{section.items.length} completate
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {visible.map(item => {
                const isDone = done.has(item.id)
                const p = PRIORITY_STYLE[item.priority]
                return (
                  <div key={item.id}
                    onClick={() => toggleDone(item.id)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: isDone ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', opacity: isDone ? 0.55 : 1 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${isDone ? '#10b981' : 'rgba(255,255,255,0.2)'}`, background: isDone ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {isDone && <span style={{ fontSize: 11, color: 'white', fontWeight: 800 }}>✓</span>}
                    </div>
                    <span style={{ flex: 1, fontSize: '0.88rem', color: isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)', textDecoration: isDone ? 'line-through' : 'none', lineHeight: '1.5' }}>
                      {item.text}
                    </span>
                    <span style={{ background: p.bg, color: p.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100, flexShrink: 0, alignSelf: 'center' }}>
                      {p.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Note personali */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem' }}>📝 Le mie idee</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: '1rem' }}>
          Scrivi qui le tue idee — vengono salvate localmente nel browser
        </p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={'- Idea 1: ...\n- Idea 2: ...\n- Idea 3: ...'}
          style={{ width: '100%', minHeight: 180, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '1rem', color: 'white', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'system-ui', lineHeight: '1.7', boxSizing: 'border-box' }}
        />
        <button onClick={saveNote}
          style={{ marginTop: '0.75rem', background: noteSaved ? 'rgba(16,185,129,0.2)' : '#7c3aed', color: noteSaved ? '#10b981' : 'white', border: noteSaved ? '1px solid rgba(16,185,129,0.3)' : 'none', borderRadius: 10, padding: '9px 22px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
          {noteSaved ? '✓ Salvato' : 'Salva idee'}
        </button>
      </div>

      <div style={{ marginTop: '3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
        Roadmap interna Fidelio — aggiornata al 19 aprile 2026 · Le spunte vengono salvate nel browser
      </div>
    </div>
  )
}
