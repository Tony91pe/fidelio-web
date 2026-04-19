'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Item = { id: string; text: string; priority: 'alta' | 'media' | 'bassa' }
type Section = { id: string; title: string; icon: string; items: Item[] }

const ROADMAP: Section[] = [
  {
    id: 'dashboard',
    title: 'Dashboard negozi',
    icon: '🖥️',
    items: [
      { id: 'd1',  text: 'Sistema livelli VIP clienti (Bronzo / Argento / Oro) con benefici diversi per livello', priority: 'alta' },
      { id: 'd2',  text: 'Integrazione Google Wallet e Apple Wallet — tessera fedeltà digitale nel portafoglio del cliente', priority: 'alta' },
      { id: 'd3',  text: 'Notifiche push ai clienti direttamente dalla dashboard (es. "offerta del giorno")', priority: 'alta' },
      { id: 'd4',  text: 'Segmentazione avanzata clienti — filtri per visite, punti, ultima visita, compleanno', priority: 'alta' },
      { id: 'd5',  text: 'Referral cliente-cliente — i clienti possono invitare amici e guadagnare punti bonus', priority: 'alta' },
      { id: 'd6',  text: 'Importazione clienti da CSV/Excel — per negozi che passano da un sistema precedente', priority: 'alta' },
      { id: 'd7',  text: 'Integrazione Google Reviews — chiedi recensione automatica dopo X visite', priority: 'alta' },
      { id: 'd8',  text: 'Integrazione POS — assegnazione punti automatica alla cassa senza QR', priority: 'media' },
      { id: 'd9',  text: 'Integrazione Shopify — sincronizzazione acquisti online con punti fedeltà', priority: 'media' },
      { id: 'd10', text: 'Integrazione WooCommerce — stesso concetto di Shopify per WordPress', priority: 'media' },
      { id: 'd11', text: 'Campagne SMS — invio messaggi di testo ai clienti oltre alle email', priority: 'media' },
      { id: 'd12', text: 'Campagne WhatsApp Business — messaggi WhatsApp automatici ai clienti', priority: 'media' },
      { id: 'd13', text: 'Sfide / Challenge — "visita 5 volte in un mese e guadagna 100 punti bonus"', priority: 'media' },
      { id: 'd14', text: 'Analisi coorte — visualizzare la retention nel tempo per gruppo di clienti', priority: 'media' },
      { id: 'd15', text: 'Customer Lifetime Value (CLV) — quanto vale ogni cliente nel tempo', priority: 'media' },
      { id: 'd16', text: 'Integrazione Zapier — connetti Fidelio con 5000+ app senza codice', priority: 'media' },
      { id: 'd17', text: 'Tag personalizzati sui clienti — es. "VIP", "Allergie", "Preferisce mattina"', priority: 'media' },
      { id: 'd18', text: 'Note interne su ogni cliente — visibili solo al negozio', priority: 'media' },
      { id: 'd19', text: 'Premi a tempo limitato — flash reward che scadono in 24-48h', priority: 'media' },
      { id: 'd20', text: 'Template email personalizzabili con editor drag & drop', priority: 'media' },
      { id: 'd21', text: 'Calendario promozioni — pianifica offerte future con data di attivazione', priority: 'media' },
      { id: 'd22', text: 'Obiettivi mensili con alert — es. "Hai raggiunto 100 nuovi clienti!"', priority: 'media' },
      { id: 'd23', text: 'QR code personalizzabile — con logo e colori del negozio', priority: 'media' },
      { id: 'd24', text: 'Modalità kiosk per tablet alla cassa — senza login, solo scanner', priority: 'media' },
      { id: 'd25', text: 'Log completo azioni staff — chi ha fatto cosa e quando', priority: 'media' },
      { id: 'd26', text: 'Confronto performance — mese corrente vs mese precedente con variazione %', priority: 'media' },
      { id: 'd27', text: 'Sondaggi NPS ai clienti — chiedere feedback dopo la visita con punteggio', priority: 'media' },
      { id: 'd28', text: 'Previsioni AI — quanti clienti torneranno il mese prossimo', priority: 'media' },
      { id: 'd29', text: 'A/B testing campagne email — testare oggetti e contenuti diversi', priority: 'bassa' },
      { id: 'd30', text: 'Report PDF mensile scaricabile — da inviare a soci o commercialista', priority: 'bassa' },
      { id: 'd31', text: 'Prenotazioni integrate — sistema di booking semplice collegato ai punti', priority: 'bassa' },
      { id: 'd32', text: 'Opzione white-label — dashboard brandizzata con logo del negozio (piano Enterprise)', priority: 'bassa' },
      { id: 'd33', text: 'Gestione multi-valuta — per negozi che operano in più paesi', priority: 'bassa' },
    ],
  },
  {
    id: 'pwa',
    title: 'PWA clienti (app.fidelio.app)',
    icon: '📱',
    items: [
      { id: 'p1',  text: 'Notifiche push — offerte, punti assegnati, premi disponibili direttamente sullo schermo', priority: 'alta' },
      { id: 'p2',  text: 'Sezione "Amici" — invita amici e guadagna punti quando si registrano', priority: 'alta' },
      { id: 'p3',  text: 'Schermata negozio migliorata — foto, orari, indirizzo, link Google Maps', priority: 'alta' },
      { id: 'p4',  text: 'QR code personale scaricabile — il cliente lo salva e lo mostra alla cassa', priority: 'alta' },
      { id: 'p5',  text: 'Streak visite consecutive — "5 visite di fila = 50 punti bonus"', priority: 'alta' },
      { id: 'p6',  text: 'Notifiche push geolocalizzate — alert quando sei vicino a un negozio Fidelio', priority: 'media' },
      { id: 'p7',  text: 'Mappa negozi vicini — scopri altri negozi Fidelio nella tua zona', priority: 'media' },
      { id: 'p8',  text: 'Badge e achievements — gamification per motivare le visite', priority: 'media' },
      { id: 'p9',  text: 'Sfide attive — visualizzare le challenge del negozio e il proprio progresso', priority: 'media' },
      { id: 'p10', text: 'Storico gift card — visualizzare le gift card ricevute e usate', priority: 'media' },
      { id: 'p11', text: 'Widget livello VIP — mostrare il livello raggiunto (Bronzo/Argento/Oro) nella home', priority: 'media' },
      { id: 'p12', text: 'Coupon a sorpresa one-time — il negozio può inviare un coupon speciale al cliente', priority: 'media' },
      { id: 'p13', text: 'Lista negozi preferiti — salva i tuoi negozi preferiti per accedervi velocemente', priority: 'media' },
      { id: 'p14', text: 'Widget iOS/Android — punti attuali visibili nella home del telefono', priority: 'media' },
      { id: 'p15', text: 'Valutazione negozio — lasciare stelle al negozio dopo la visita', priority: 'media' },
      { id: 'p16', text: 'Condivisione social — "Ho guadagnato il mio premio da [Negozio]!" su Instagram/WhatsApp', priority: 'bassa' },
      { id: 'p17', text: 'Modalità offline — funzionamento base senza connessione internet', priority: 'bassa' },
      { id: 'p18', text: 'Dark/Light mode — tema chiaro opzionale', priority: 'bassa' },
      { id: 'p19', text: 'Foto profilo cliente — personalizzazione account PWA', priority: 'bassa' },
    ],
  },
  {
    id: 'sito',
    title: 'Sito pubblico (getfidelio.app)',
    icon: '🌐',
    items: [
      { id: 's1',  text: 'Video demo — screencast della dashboard in azione nella homepage e nel blog', priority: 'alta' },
      { id: 's2',  text: 'Pagina casi di studio — storie reali di negozi con dati concreti (es. "+40% clienti in 3 mesi")', priority: 'alta' },
      { id: 's3',  text: 'Calcolatore ROI interattivo — "inserisci i tuoi clienti → calcola quanto puoi guadagnare"', priority: 'alta' },
      { id: 's4',  text: 'Comparazione concorrenti — tabella Fidelio vs Stamp Me vs Loyverse vs Square Loyalty', priority: 'media' },
      { id: 's5',  text: 'Newsletter per negozianti — consigli mensili sulla fidelizzazione', priority: 'media' },
      { id: 's6',  text: 'Pagina "Come funziona" dettagliata — step by step per negoziante e per il cliente', priority: 'media' },
      { id: 's7',  text: 'Pagina integrazioni — lista completa sistemi compatibili (POS, e-commerce, ecc.)', priority: 'media' },
      { id: 's8',  text: 'Pagina partner/affiliati pubblica — form di candidatura per chi vuole promuovere Fidelio', priority: 'media' },
      { id: 's9',  text: 'Changelog pubblico — "Novità di questa settimana" per mostrare evoluzione continua', priority: 'media' },
      { id: 's10', text: 'Academy gratuita — mini-corso "Come fidelizzare i clienti del tuo negozio"', priority: 'bassa' },
      { id: 's11', text: 'Community forum — spazio dove i negozianti si scambiano consigli', priority: 'bassa' },
      { id: 's12', text: 'Multilingua — versione inglese e spagnola per espansione europea', priority: 'bassa' },
      { id: 's13', text: 'Tool gratuito — "Quanto ti costa perdere un cliente?" per acquisire lead', priority: 'bassa' },
    ],
  },
  {
    id: 'infra',
    title: 'Infrastruttura e tecnico',
    icon: '⚙️',
    items: [
      { id: 'i1', text: 'API pubblica documentata — integrazioni custom per negozi PRO', priority: 'media' },
      { id: 'i2', text: 'Webhook in uscita — notificare sistemi esterni su visita, premio, check-in', priority: 'media' },
      { id: 'i3', text: 'Dashboard analytics interna — metriche di prodotto (MAU, churn, NPS negozi)', priority: 'alta' },
      { id: 'i4', text: 'Backup esportazione automatico — CSV mensile automatico per ogni negozio', priority: 'media' },
      { id: 'i5', text: 'Test automatici CI — suite di test per evitare regressioni nei deploy', priority: 'media' },
      { id: 'i6', text: 'SSO con Google — accesso dashboard con account Google', priority: 'bassa' },
      { id: 'i7', text: 'CDN immagini ottimizzata — compressione automatica loghi e foto negozio', priority: 'bassa' },
    ],
  },
]

const PRIORITY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  alta:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Alta' },
  media: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'Media' },
  bassa: { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', label: 'Bassa' },
}

const CADENCE = [
  {
    icon: '⚡',
    freq: 'Ogni settimana',
    color: '#10b981',
    items: [
      'Bug fix e miglioramenti minori segnalati dai negozi',
      'Nuovi articoli blog (1-2 a settimana per SEO)',
      'Aggiornamenti testi e contenuti del sito',
      'Ottimizzazioni performance e velocità',
    ],
  },
  {
    icon: '🚀',
    freq: 'Ogni mese',
    color: '#6c3df4',
    items: [
      '1-2 funzionalità nuove dalla roadmap (priorità alta)',
      'Miglioramenti UX basati su feedback negozi',
      'Aggiornamento dipendenze e sicurezza',
      'Email ai negozi con le novità del mese',
      'Review metriche: MRR, churn, nuovi iscritti',
    ],
  },
  {
    icon: '🏆',
    freq: 'Ogni 3 mesi',
    color: '#f59e0b',
    items: [
      'Feature major (es. Google Wallet, livelli VIP, SMS)',
      'Revisione prezzi e piani se necessario',
      'Analisi churn — capire perché i negozi se ne vanno',
      'Aggiornamento roadmap con nuove priorità',
      'Eventuale nuovo piano o add-on',
    ],
  },
  {
    icon: '🌍',
    freq: 'Ogni anno',
    color: '#06b6d4',
    items: [
      'Review completa della strategia prodotto',
      'Valutazione espansione geografica (ES, FR, DE)',
      'Eventuale nuovo tier di pricing (Enterprise)',
      'Aggiornamento documenti legali (privacy, termini)',
      'Analisi competitiva approfondita',
    ],
  },
]

export default function RoadmapPage() {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [filter, setFilter] = useState<'all' | 'alta' | 'media' | 'bassa' | 'todo'>('all')
  const [tab, setTab] = useState<'roadmap' | 'cadence'>('roadmap')

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
          {totalItems} idee future · spunta quelle completate · aggiungi le tue in fondo
        </p>
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {([['roadmap', '🗺️ Funzionalità'], ['cadence', '📅 Frequenza aggiornamenti']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ background: tab === t ? '#7c3aed' : 'rgba(255,255,255,0.05)', color: tab === t ? 'white' : 'rgba(255,255,255,0.5)', border: `1px solid ${tab === t ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            {label}
          </button>
        ))}
      </div>

      {/* TAB ROADMAP */}
      {tab === 'roadmap' && (
        <>
          {/* Progresso */}
          <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: 14, padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a78bfa' }}>{totalDone}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/{totalItems}</span></div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>funzionalità completate</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalDone === 0 ? 0 : (totalDone / totalItems) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: 3, transition: 'width 0.4s' }} />
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
                      <div key={item.id} onClick={() => toggleDone(item.id)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: isDone ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, cursor: 'pointer', opacity: isDone ? 0.5 : 1 }}>
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
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder={'- Idea 1: ...\n- Idea 2: ...\n- Idea 3: ...'}
              style={{ width: '100%', minHeight: 180, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '1rem', color: 'white', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'system-ui', lineHeight: '1.7', boxSizing: 'border-box' }} />
            <button onClick={saveNote}
              style={{ marginTop: '0.75rem', background: noteSaved ? 'rgba(16,185,129,0.2)' : '#7c3aed', color: noteSaved ? '#10b981' : 'white', border: noteSaved ? '1px solid rgba(16,185,129,0.3)' : 'none', borderRadius: 10, padding: '9px 22px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
              {noteSaved ? '✓ Salvato' : 'Salva idee'}
            </button>
          </div>
        </>
      )}

      {/* TAB FREQUENZA */}
      {tab === 'cadence' && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            Piano di rilascio aggiornamenti Fidelio. All'inizio conviene aggiornare spesso — pochi utenti, massima flessibilità.
            Man mano che cresci, stabilizzi la cadenza per non destabilizzare chi dipende dal prodotto.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {CADENCE.map(c => (
              <div key={c.freq} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ background: `${c.color}15`, borderBottom: `1px solid ${c.color}25`, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: c.color }}>{c.freq}</p>
                  </div>
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
                    {c.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.87rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                        <span style={{ color: c.color, flexShrink: 0, marginTop: 2 }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: 14, padding: '1.25rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>💡 Regola pratica</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
              {[
                '0–10 negozi: aggiorna ogni volta che hai qualcosa di utile, anche 2 volte a settimana',
                '10–50 negozi: stabilizza a aggiornamenti mensili comunicati via email',
                '50–200 negozi: introduci un changelog pubblico e cicli di rilascio prevedibili',
                '200+ negozi: versioning semantico, beta testing con negozi volontari prima del rilascio generale',
              ].map((r, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.87rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5' }}>
                  <span style={{ color: '#a78bfa', flexShrink: 0 }}>•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
        Roadmap interna Fidelio · {totalItems} idee in {ROADMAP.length} sezioni · Le spunte vengono salvate nel browser
      </div>
    </div>
  )
}
