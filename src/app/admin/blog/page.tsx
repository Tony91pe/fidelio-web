'use client'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  content: string
  published: boolean
  publishedAt: string | null
  createdAt: string
}

const CATEGORIES = ['Bar & Caffetterie', 'Ristorazione', 'Saloni & Barbieri', 'Negozi', 'Strategia', 'Guide', 'Case Study', 'Marketing', 'Stagionale', 'Tecnologia']

const IDEAS = [
  // --- Strategia ---
  { title: 'Come aumentare le visite nel weekend: 5 strategie per negozi', category: 'Strategia' },
  { title: 'Gift card digitali: perché i negozi moderni le usano', category: 'Strategia' },
  { title: 'Come recuperare i clienti persi con il winback automatico', category: 'Strategia' },
  { title: 'Come scegliere i premi giusti per il tuo programma fedeltà', category: 'Strategia' },
  { title: 'Punti fedeltà vs sconti: cosa funziona meglio?', category: 'Strategia' },
  { title: 'I 5 errori che i negozi fanno con la fidelizzazione (e come evitarli)', category: 'Strategia' },
  { title: 'Come costruire una base clienti fidelizzata da zero in 90 giorni', category: 'Strategia' },
  { title: 'Perché i clienti smettono di tornare (e come fermarlo)', category: 'Strategia' },
  { title: 'Programma fedeltà: come comunicarlo ai clienti per la prima volta', category: 'Strategia' },
  { title: 'Come usare i dati dei clienti per vendere di più senza spendere in pubblicità', category: 'Strategia' },
  { title: 'Referral marketing per negozi: fai portare nuovi clienti dai tuoi già fidelizzati', category: 'Strategia' },
  { title: 'Quanto vale davvero un cliente fedele? Il calcolo del Customer Lifetime Value', category: 'Strategia' },
  { title: 'Come far sentire speciali i clienti top (senza abbassare i prezzi)', category: 'Strategia' },
  { title: 'Perché il 80% dei tuoi profitti viene dal 20% dei clienti (e come sfruttarlo)', category: 'Strategia' },
  { title: 'Come trasformare un cliente occasionale in un cliente abituale in 4 passaggi', category: 'Strategia' },
  { title: 'Fidelizzazione vs acquisizione: dove investire il tuo budget nel 2026', category: 'Strategia' },
  { title: 'Come creare un programma fedeltà che i clienti usano davvero (non solo si iscrivono)', category: 'Strategia' },
  { title: 'I livelli VIP funzionano? Bronzo, Argento, Oro per negozi italiani', category: 'Strategia' },
  { title: 'Come usare le offerte a scadenza per creare urgenza senza svalutare il brand', category: 'Strategia' },
  { title: 'Programma fedeltà: quanti punti dare per visita e quanti per il premio?', category: 'Strategia' },
  { title: 'Come misurare se il tuo programma fedeltà sta funzionando (le 5 metriche chiave)', category: 'Strategia' },
  { title: 'Il momento perfetto per chiedere una recensione al cliente fidelizzato', category: 'Strategia' },
  { title: 'Come usare i compleanni per aumentare il fatturato mensile del 10%', category: 'Strategia' },
  { title: 'Perché dovresti smettere di fare sconti e iniziare a fare punti', category: 'Strategia' },
  { title: 'Come comunicare un aumento di prezzi senza perdere clienti fidelizzati', category: 'Strategia' },
  { title: 'La psicologia della fidelizzazione: perché i clienti tornano (spiegato semplice)', category: 'Strategia' },
  { title: 'Programma fedeltà per negozi con più sedi: come gestirlo', category: 'Strategia' },
  { title: 'Come usare le gift card per acquisire nuovi clienti (non solo fidelizzare)', category: 'Strategia' },
  { title: 'Winback email: quante mandarne e con quale frequenza prima di mollare', category: 'Strategia' },
  // --- Guide ---
  { title: 'Il momento migliore per inviare un\'email ai clienti (con dati reali)', category: 'Guide' },
  { title: 'QR code alla cassa: come posizionarlo per massimizzare le scansioni', category: 'Guide' },
  { title: 'Email di compleanno: perché è la campagna con il ROI più alto', category: 'Guide' },
  { title: 'GDPR e programmi fedeltà: cosa devi sapere come negoziante', category: 'Guide' },
  { title: 'Come far scansionare il QR ai clienti più anziani (senza stress)', category: 'Guide' },
  { title: 'Come usare le notifiche push per portare clienti in negozio', category: 'Guide' },
  { title: 'Guida alle campagne email per negozi: welcome, winback e compleanno spiegate semplice', category: 'Guide' },
  { title: 'Come scrivere un\'email ai clienti che non apre mai (soggetti che funzionano)', category: 'Guide' },
  { title: 'Tutto quello che devi sapere sulle gift card digitali prima di attivarle', category: 'Guide' },
  { title: 'Come impostare i punti fedeltà: per visita o per euro speso?', category: 'Guide' },
  { title: 'Dashboard analytics per negozi: quali numeri guardare ogni settimana', category: 'Guide' },
  { title: 'Come formare il personale all\'uso del programma fedeltà (senza rallentare la cassa)', category: 'Guide' },
  { title: 'Guida al QR code per negozi: formati, dimensioni e dove stamparlo', category: 'Guide' },
  { title: 'Come segmentare i tuoi clienti in 4 gruppi e comunicare in modo diverso con ognuno', category: 'Guide' },
  { title: 'Email marketing per negozi: tutto quello che devi sapere per iniziare', category: 'Guide' },
  { title: 'Come impostare il winback automatico: tempi, messaggi e incentivi', category: 'Guide' },
  { title: 'Come usare le statistiche del programma fedeltà per prendere decisioni migliori', category: 'Guide' },
  { title: 'Guida pratica alla scadenza dei punti: pro, contro e come comunicarla ai clienti', category: 'Guide' },
  { title: 'Come passare dalla tessera cartacea al digitale senza perdere i clienti vecchi', category: 'Guide' },
  { title: 'Checklist: tutto quello che serve per lanciare un programma fedeltà in una settimana', category: 'Guide' },
  { title: 'Come rispondere alle domande dei clienti sul programma fedeltà (script pronti)', category: 'Guide' },
  { title: 'Guida alla privacy: cosa puoi e non puoi fare con i dati dei clienti del tuo negozio', category: 'Guide' },
  { title: 'Come creare il primo premio fedeltà irresistibile per il tuo tipo di negozio', category: 'Guide' },
  { title: 'Notifiche push vs email: quale canale usare e quando', category: 'Guide' },
  // --- Negozi specifici ---
  { title: 'Programma fedeltà per panetterie e pasticcerie: guida pratica', category: 'Negozi' },
  { title: 'Programma fedeltà per palestre e centri fitness', category: 'Negozi' },
  { title: 'Fidelizzare clienti di un\'edicola o tabaccheria', category: 'Negozi' },
  { title: 'Programma fedeltà per negozi di abbigliamento', category: 'Negozi' },
  { title: 'Fidelizzazione per farmacia e parafarmacia: casi d\'uso pratici', category: 'Negozi' },
  { title: 'Programma fedeltà per negozi di ottica', category: 'Negozi' },
  { title: 'Come fidelizzare i clienti di un negozio di animali', category: 'Negozi' },
  { title: 'Punti fedeltà per librerie indipendenti: idee e strategie', category: 'Negozi' },
  { title: 'Fidelizzazione per negozi di alimentari e gastronomie', category: 'Negozi' },
  { title: 'Come usare un programma fedeltà in un mercato settimanale o stand', category: 'Negozi' },
  { title: 'Programma fedeltà per negozi di scarpe e accessori', category: 'Negozi' },
  { title: 'Fidelizzazione per fioristi e garden center', category: 'Negozi' },
  { title: 'Programma punti per negozi di elettronica e telefonia', category: 'Negozi' },
  { title: 'Come fidelizzare i clienti di una lavanderia o tintoria', category: 'Negozi' },
  { title: 'Fidelizzazione per negozi di giocattoli e articoli per bambini', category: 'Negozi' },
  { title: 'Programma fedeltà per pescherie e macellerie', category: 'Negozi' },
  { title: 'Come fidelizzare i clienti di un negozio di sport e outdoor', category: 'Negozi' },
  { title: 'Punti fedeltà per negozi di arredamento e casalinghi', category: 'Negozi' },
  { title: 'Fidelizzazione per erboristerie e negozi bio', category: 'Negozi' },
  { title: 'Come usare Fidelio in un negozio di fotografia o sviluppo foto', category: 'Negozi' },
  { title: 'Programma fedeltà per negozi di cancelleria e cartolerie', category: 'Negozi' },
  { title: 'Fidelizzazione per gioiellerie e oreficerie: strategie su acquisti rari', category: 'Negozi' },
  { title: 'Come fidelizzare i clienti di una profumeria o beauty store', category: 'Negozi' },
  { title: 'Programma fedeltà per autofficine e gommisti', category: 'Negozi' },
  { title: 'Fidelizzazione per negozi di musica e strumenti musicali', category: 'Negozi' },
  // --- Ristorazione ---
  { title: 'Come fidelizzare i clienti di una pizzeria', category: 'Ristorazione' },
  { title: 'Programma fedeltà per ristoranti: cosa offrire oltre lo sconto', category: 'Ristorazione' },
  { title: 'Come aumentare il ritorno dei clienti nel tuo ristorante del 30%', category: 'Ristorazione' },
  { title: 'Fidelizzazione per sushi e cucina etnica: esempi e strategie', category: 'Ristorazione' },
  { title: 'Come usare le offerte a tempo per riempire i tavoli nelle ore vuote', category: 'Ristorazione' },
  { title: 'Programma fedeltà per trattorie e osterie: autenticità e punti digitali', category: 'Ristorazione' },
  { title: 'Come fidelizzare i clienti di una piadineria o take away', category: 'Ristorazione' },
  { title: 'Fidelizzazione per pasticcerie e gelaterie: premi golosi che funzionano', category: 'Ristorazione' },
  { title: 'Come aumentare le prenotazioni serali con un programma fedeltà', category: 'Ristorazione' },
  { title: 'Winback per ristoranti: come riportare i clienti che non vengono da 60 giorni', category: 'Ristorazione' },
  { title: 'Programma fedeltà per street food e food truck', category: 'Ristorazione' },
  { title: 'Come gestire il programma fedeltà durante le feste (Natale, Ferragosto, Pasqua)', category: 'Ristorazione' },
  { title: 'Fidelizzazione per birrerie artigianali e pub italiani', category: 'Ristorazione' },
  { title: 'Come usare i punti fedeltà per spingere piatti ad alto margine', category: 'Ristorazione' },
  // --- Saloni & Barbieri ---
  { title: 'Fidelizzazione clienti per estetiste e centri estetici', category: 'Saloni & Barbieri' },
  { title: 'Come ridurre le cancellazioni last-minute nel tuo salone', category: 'Saloni & Barbieri' },
  { title: 'Programma fedeltà per nail art e nail salon', category: 'Saloni & Barbieri' },
  { title: 'Come far tornare i clienti del barbiere ogni 3 settimane (non ogni 2 mesi)', category: 'Saloni & Barbieri' },
  { title: 'Fidelizzazione per centri benessere e spa urbane', category: 'Saloni & Barbieri' },
  { title: 'Come usare il programma fedeltà per vendere trattamenti premium in salone', category: 'Saloni & Barbieri' },
  { title: 'Programma fedeltà per tatuatori e piercing studio', category: 'Saloni & Barbieri' },
  { title: 'Come aumentare il valore medio dello scontrino in salone con i punti', category: 'Saloni & Barbieri' },
  { title: 'Fidelizzazione per centri di depilazione laser e trattamenti estetici avanzati', category: 'Saloni & Barbieri' },
  { title: 'Come usare il compleanno dei clienti per riempire l\'agenda del salone', category: 'Saloni & Barbieri' },
  // --- Bar & Caffetterie ---
  { title: 'Fidelizzazione per coffee shop: perché i punti battono la tessera cartacea', category: 'Bar & Caffetterie' },
  { title: 'Come aumentare lo scontrino medio al bar con un programma fedeltà', category: 'Bar & Caffetterie' },
  { title: 'Il bar che ha triplicato i clienti abituali in 6 mesi (caso reale)', category: 'Bar & Caffetterie' },
  { title: 'Come portare i clienti del bar a venire anche il pomeriggio (non solo al mattino)', category: 'Bar & Caffetterie' },
  { title: 'Fidelizzazione per bar con cucina: pranzo + colazione, strategie doppie', category: 'Bar & Caffetterie' },
  { title: 'Come usare le notifiche push per portare clienti al bar nelle ore morte', category: 'Bar & Caffetterie' },
  { title: 'Bar tabacchi e programma fedeltà: si può fare? Come funziona', category: 'Bar & Caffetterie' },
  { title: 'Come spiegare il QR code al cliente del bar in 30 secondi (script per il barista)', category: 'Bar & Caffetterie' },
  { title: 'Il premio perfetto per il bar: caffè gratis, cornetto o qualcos\'altro?', category: 'Bar & Caffetterie' },
  // --- Case Study ---
  { title: 'Case study: da 0 a 200 clienti fidelizzati in 3 mesi (bar di Milano)', category: 'Case Study' },
  { title: 'Come una parrucchiera di Roma ha aumentato le prenotazioni del 40% con Fidelio', category: 'Case Study' },
  { title: 'Da tessera cartacea a digitale: la storia di una gelateria che ha cambiato tutto', category: 'Case Study' },
  { title: 'Case study: ristorante familiare a Napoli, +25% clienti ricorrenti in 4 mesi', category: 'Case Study' },
  { title: 'Come una palestra di Torino ha azzerato il tasso di abbandono con Fidelio', category: 'Case Study' },
  { title: 'Da 50 a 500 clienti fidelizzati: la storia di una pizzeria d\'asporto di Bari', category: 'Case Study' },
  { title: 'Come una farmacia di Bologna usa Fidelio per fidelizzare i clienti over 60', category: 'Case Study' },
  { title: 'Case study: barbiere di Firenze, da 0 a 300 clienti abituali in 5 mesi', category: 'Case Study' },
  { title: 'Come un negozio bio di Venezia ha battuto la grande distribuzione con la fidelizzazione', category: 'Case Study' },
  { title: 'Case study: centro estetico di Catania, email di compleanno con 60% di tasso di ritorno', category: 'Case Study' },
  // --- Marketing ---
  { title: 'Come usare Instagram per promuovere il tuo programma fedeltà', category: 'Marketing' },
  { title: 'TikTok per negozi locali: idee di contenuti che portano clienti fisici', category: 'Marketing' },
  { title: 'Come chiedere recensioni Google ai tuoi clienti fidelizzati (senza sembrare disperato)', category: 'Marketing' },
  { title: 'Google My Business per negozi: come ottimizzarlo per attirare clienti vicini', category: 'Marketing' },
  { title: 'Come combinare il programma fedeltà con le campagne Meta Ads', category: 'Marketing' },
  { title: 'Passaparola digitale: come trasformare i tuoi clienti in promotori del negozio', category: 'Marketing' },
  { title: 'Come usare le storie di Instagram per comunicare le offerte ai clienti fidelizzati', category: 'Marketing' },
  { title: 'Email marketing vs social media per negozi locali: dove converge meglio il budget', category: 'Marketing' },
  { title: 'Come creare una lista clienti da zero (senza violare la privacy)', category: 'Marketing' },
  { title: 'Influencer locali e micro-influencer: come usarli per promuovere il tuo negozio', category: 'Marketing' },
  { title: 'Come usare WhatsApp Business per comunicare con i clienti del negozio', category: 'Marketing' },
  { title: 'Come scrivere la bio del tuo negozio su Instagram che converte', category: 'Marketing' },
  { title: 'Marketing locale: le 7 strategie che funzionano ancora nel 2026', category: 'Marketing' },
  { title: 'Come usare i dati del programma fedeltà per creare campagne Meta più precise', category: 'Marketing' },
  // --- Stagionale ---
  { title: 'Come preparare il tuo negozio al Black Friday: strategie per negozianti italiani', category: 'Stagionale' },
  { title: 'Fidelizzazione a Natale: come sfruttare dicembre per acquisire clienti tutto l\'anno', category: 'Stagionale' },
  { title: 'Come usare la Festa della Mamma per aumentare le vendite con i punti fedeltà', category: 'Stagionale' },
  { title: 'Strategie estive per negozi: come fidelizzare i clienti quando la gente è in vacanza', category: 'Stagionale' },
  { title: 'Rientro di settembre: come riattivare i clienti dopo l\'estate con una campagna winback', category: 'Stagionale' },
  { title: 'San Valentino e programma fedeltà: idee pratiche per bar, ristoranti e negozi', category: 'Stagionale' },
  { title: 'Come sfruttare la Pasqua per fidelizzare i clienti di bar e pasticcerie', category: 'Stagionale' },
  { title: 'Fidelizzazione in estate: strategie per bar al mare, chioschi e locali stagionali', category: 'Stagionale' },
  { title: 'Capodanno e punti fedeltà: come usare il 31 dicembre per fidelizzare', category: 'Stagionale' },
  { title: 'Come gestire il programma fedeltà durante le ferie (chiusure, messaggi automatici, punti)', category: 'Stagionale' },
  // --- Tecnologia ---
  { title: 'QR code vs NFC: quale tecnologia usare per il tuo programma fedeltà', category: 'Tecnologia' },
  { title: 'Cos\'è un programma fedeltà digitale e come funziona tecnicamente (spiegato ai negozianti)', category: 'Tecnologia' },
  { title: 'Come integrare Fidelio con il tuo e-commerce WooCommerce', category: 'Tecnologia' },
  { title: 'Come integrare Fidelio con Shopify: guida passo passo', category: 'Tecnologia' },
  { title: 'App vs web app per la fidelizzazione: quale è meglio per i clienti del tuo negozio', category: 'Tecnologia' },
  { title: 'Come funzionano le notifiche push per negozi (e perché i clienti le leggono)', category: 'Tecnologia' },
  { title: 'Google Wallet e Apple Wallet per negozi: la fidelity card digitale che non si perde mai', category: 'Tecnologia' },
  { title: 'Come proteggere i dati dei tuoi clienti: guida pratica alla cybersecurity per negozi', category: 'Tecnologia' },
  { title: 'Intelligenza artificiale per negozi locali: cosa puoi usare già oggi', category: 'Tecnologia' },
  { title: 'Come usare i webhook per connettere Fidelio al tuo gestionale o POS', category: 'Tecnologia' },
  { title: 'POS e programma fedeltà: come integrarli per assegnare punti automaticamente', category: 'Tecnologia' },
  { title: 'Tessera fedeltà digitale vs fisica: costi, vantaggi e cosa preferiscono i clienti', category: 'Tecnologia' },
]

const CATEGORY_ICONS: Record<string, string> = {
  'Strategia': '🎯',
  'Guide': '📖',
  'Negozi': '🏪',
  'Ristorazione': '🍕',
  'Saloni & Barbieri': '✂️',
  'Bar & Caffetterie': '☕',
  'Case Study': '📊',
  'Marketing': '📣',
  'Stagionale': '🗓️',
  'Tecnologia': '💻',
}

function IdeasView({ posts, onWrite, onBack }: { posts: Post[]; onWrite: (idea: { title: string; category: string }) => void; onBack: () => void }) {
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({})

  const byCategory = IDEAS.reduce<Record<string, typeof IDEAS>>((acc, idea) => {
    if (!acc[idea.category]) acc[idea.category] = []
    acc[idea.category].push(idea)
    return acc
  }, {})

  const categories = Object.keys(byCategory)

  function toggle(cat: string) {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const totalDone = IDEAS.filter(idea => posts.some(p => p.title === idea.title)).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
          ← Lista
        </button>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Idee articoli</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: '0.1rem' }}>
            {IDEAS.length} idee in {categories.length} categorie · {totalDone} già scritti
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {categories.map(cat => {
          const ideas = byCategory[cat]
          const done = ideas.filter(idea => posts.some(p => p.title === idea.title)).length
          const isOpen = !!openCats[cat]
          const icon = CATEGORY_ICONS[cat] || '📁'

          return (
            <div key={cat} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Header cartella */}
              <button
                onClick={() => toggle(cat)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.1rem', background: isOpen ? 'rgba(108,61,244,0.1)' : 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>{cat}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginRight: '0.5rem' }}>
                  {done > 0 && <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✓ {done}</span>}
                  {ideas.length - done} da scrivere
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', transition: 'transform 0.2s', display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
              </button>

              {/* Contenuto cartella */}
              {isOpen && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {ideas.map((idea, i) => {
                    const alreadyExists = posts.some(p => p.title === idea.title)
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.1rem', borderBottom: i < ideas.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: 'rgba(0,0,0,0.15)', opacity: alreadyExists ? 0.45 : 1 }}>
                        <span style={{ flex: 1, fontSize: '0.875rem', color: alreadyExists ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)', textDecoration: alreadyExists ? 'line-through' : 'none' }}>{idea.title}</span>
                        {alreadyExists ? (
                          <span style={{ fontSize: '0.72rem', color: '#10B981', flexShrink: 0, fontWeight: 600 }}>✓ Già scritto</span>
                        ) : (
                          <button onClick={() => onWrite({ title: idea.title, category: idea.category })}
                            style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: 7, padding: '4px 12px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', flexShrink: 0 }}>
                            Scrivi →
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'system-ui',
}
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'editor' | 'ideas'>('list')
  const [editing, setEditing] = useState<Post | null>(null)
  const [working, setWorking] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [form, setForm] = useState({ title: '', description: '', category: 'Strategia', readTime: '5 min', content: '', published: false })

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/blog')
      if (r.ok) setPosts(await r.json())
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openNew(prefill?: { title: string; category: string }) {
    setEditing(null)
    setForm({ title: prefill?.title || '', description: '', category: prefill?.category || 'Strategia', readTime: '5 min', content: '', published: false })
    setView('editor')
  }

  function openEdit(post: Post) {
    setEditing(post)
    setForm({ title: post.title, description: post.description, category: post.category, readTime: post.readTime, content: post.content, published: post.published })
    setView('editor')
  }

  async function save(publish?: boolean) {
    setWorking(true)
    setSaveError(null)
    const payload = publish !== undefined ? { ...form, published: publish, publishedAt: publish ? new Date().toISOString() : null } : form
    try {
      const res = editing
        ? await fetch('/api/admin/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...payload }) })
        : await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveError(err.error || `Errore ${res.status}`)
        return
      }
      await load()
      setView('list')
    } catch {
      setSaveError('Errore di rete. Riprova.')
    } finally { setWorking(false) }
  }

  async function togglePublish(post: Post) {
    await fetch('/api/admin/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: post.id, published: !post.published, publishedAt: !post.published ? new Date().toISOString() : null }) })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
  }

  async function remove(id: string) {
    if (!confirm('Eliminare questo articolo?')) return
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const published = posts.filter(p => p.published)
  const drafts = posts.filter(p => !p.published)

  return (
    <div style={{ padding: '2rem', maxWidth: 900 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>Blog</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            {published.length} pubblicati · {drafts.length} bozze
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setView('ideas')} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            💡 Idee articoli
          </button>
          <button onClick={() => openNew()} style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
            + Nuovo articolo
          </button>
        </div>
      </div>

      {/* LISTA */}
      {view === 'list' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Caricamento...</div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✍️</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Nessun articolo ancora. Inizia a scrivere!</p>
              <button onClick={() => openNew()} style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                Crea il primo articolo
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {posts.map(post => (
                <div key={post.id} style={{ background: post.published ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${post.published ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.title}</span>
                      {post.published
                        ? <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', borderRadius: '100px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>Pubblicato</span>
                        : <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', borderRadius: '100px', padding: '1px 8px', fontSize: '11px', fontWeight: 600 }}>Bozza</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
                      {post.category} · {post.readTime} · /blog/{post.slug}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button onClick={() => togglePublish(post)} style={{ background: post.published ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: post.published ? '#EF4444' : '#10B981', border: `1px solid ${post.published ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 8, padding: '5px 12px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      {post.published ? 'Nascondi' : 'Pubblica'}
                    </button>
                    <button onClick={() => openEdit(post)} style={{ background: 'rgba(108,61,244,0.15)', color: '#A78BFA', border: '1px solid rgba(108,61,244,0.2)', borderRadius: 8, padding: '5px 12px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      Modifica
                    </button>
                    <button onClick={() => remove(post.id)} style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '5px 10px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDITOR */}
      {view === 'editor' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => setView('list')} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
              ← Lista
            </button>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{editing ? 'Modifica articolo' : 'Nuovo articolo'}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Titolo *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titolo dell'articolo" />
            </div>
            <div>
              <label style={labelStyle}>Descrizione (meta description)</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Breve descrizione per i motori di ricerca (max 160 caratteri)" maxLength={160} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Categoria</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tempo lettura</label>
                <input style={inputStyle} value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} placeholder="5 min" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Contenuto (Markdown) *</label>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                ## Titolo H2 &nbsp;·&nbsp; ### Titolo H3 &nbsp;·&nbsp; **grassetto** &nbsp;·&nbsp; - lista
              </div>
              <textarea
                style={{ ...inputStyle, minHeight: '380px', resize: 'vertical', lineHeight: '1.6', fontSize: '13px', fontFamily: 'monospace' } as React.CSSProperties}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder={'## Introduzione\n\nInizia a scrivere il tuo articolo qui...\n\n## Sezione 1\n\nContenuto della sezione.\n\n- Punto 1\n- Punto 2'}
              />
            </div>
            {saveError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', color: '#EF4444', fontSize: '0.875rem' }}>
                {saveError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => save(false)} disabled={working || !form.title || !form.content}
                style={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: (working || !form.title || !form.content) ? 0.5 : 1 }}>
                {working ? '...' : '📝 Salva come bozza'}
              </button>
              <button onClick={() => save(true)} disabled={working || !form.title || !form.content}
                style={{ flex: 2, minWidth: 160, background: '#6C3DF4', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: (working || !form.title || !form.content) ? 0.6 : 1 }}>
                {working ? 'Salvataggio...' : editing ? '🚀 Salva e pubblica' : '🚀 Crea e pubblica'}
              </button>
              <button onClick={() => setView('list')} style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 600, cursor: 'pointer' }}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IDEE ARTICOLI */}
      {view === 'ideas' && (
        <IdeasView posts={posts} onWrite={(idea) => openNew(idea)} onBack={() => setView('list')} />
      )}
    </div>
  )
}
