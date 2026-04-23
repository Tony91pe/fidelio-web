import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Programma Fedeltà per Negozi: Guida Completa 2026 — Fidelio',
  description: 'Guida definitiva su come creare un programma fedeltà digitale per il tuo negozio. Punti, premi, QR code e strategie per far tornare i clienti ogni settimana.',
  alternates: { canonical: 'https://www.getfidelio.app/programma-fedelta' },
  openGraph: {
    title: 'Programma Fedeltà per Negozi: Guida Completa 2026',
    description: 'Tutto quello che devi sapere per creare un programma fedeltà digitale efficace per bar, ristoranti, parrucchieri e negozi italiani.',
    url: 'https://www.getfidelio.app/programma-fedelta',
    type: 'article',
  },
}

const faqItems = [
  {
    q: 'Quanto costa creare un programma fedeltà digitale?',
    a: 'Con Fidelio puoi iniziare da 19€/mese, senza costi di setup né hardware da acquistare. Stampi un QR code e sei operativo in 10 minuti. I programmi fedeltà fisici (tessere in plastica, macchinari) costano invece centinaia di euro solo per partire.',
  },
  {
    q: 'Serve un\'app per i clienti?',
    a: 'No. Con Fidelio i clienti si registrano semplicemente scansionando il QR con la fotocamera del telefono e inserendo nome ed email. Nessuna app da scaricare, nessun account da creare. La barriera di ingresso è quasi zero.',
  },
  {
    q: 'Quanti punti devo dare per visita?',
    a: 'Dipende dalla frequenza media del tuo negozio. Una regola pratica: il cliente deve raggiungere la soglia premio in 8-12 visite. Se dai 10 punti a visita, metti la soglia a 100 punti. Così il primo premio arriva in circa due mesi per un cliente fedele.',
  },
  {
    q: 'Funziona anche per negozi fisici senza cassa digitale?',
    a: 'Assolutamente sì. Ti basta stampare il QR code del negozio (disponibile in dashboard) e appenderlo alla cassa. Il cliente lo scansiona, il commesso convalida la visita dallo scanner sulla dashboard. Zero integrazione richiesta.',
  },
  {
    q: 'Come faccio a non perdere i dati se cambio sistema?',
    a: 'Tutti i dati dei clienti (email, punti, storico visite) sono tuoi e puoi esportarli in CSV in qualsiasi momento dalla dashboard. Non sei mai bloccato.',
  },
  {
    q: 'Un programma fedeltà funziona davvero per piccoli negozi?',
    a: 'Sì, anzi: i dati mostrano che i piccoli negozi beneficiano proporzionalmente di più rispetto alle grandi catene. Un cliente fidelizzato in un negozio di prossimità spende in media il 23% in più a visita e torna 2.5 volte più spesso rispetto a un cliente occasionale.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://www.getfidelio.app/programma-fedelta#article',
      headline: 'Programma Fedeltà per Negozi: Guida Completa 2026',
      description: 'Guida definitiva su come creare un programma fedeltà digitale per il tuo negozio.',
      datePublished: '2026-01-15',
      dateModified: '2026-04-23',
      author: { '@type': 'Organization', name: 'Fidelio', url: 'https://www.getfidelio.app' },
      publisher: { '@type': 'Organization', name: 'Fidelio', url: 'https://www.getfidelio.app' },
      mainEntityOfPage: 'https://www.getfidelio.app/programma-fedelta',
    },
    {
      '@type': 'HowTo',
      name: 'Come creare un programma fedeltà digitale per il tuo negozio',
      description: 'Guida passo-passo per configurare un programma fedeltà digitale con punti e premi.',
      step: [
        { '@type': 'HowToStep', name: 'Registra il tuo negozio', text: 'Crea un account su Fidelio e inserisci le informazioni del tuo negozio: nome, categoria, indirizzo.' },
        { '@type': 'HowToStep', name: 'Configura punti e premi', text: 'Decidi quanti punti assegnare per visita e qual è la soglia per il primo premio. Crea almeno un premio attraente.' },
        { '@type': 'HowToStep', name: 'Stampa il QR code', text: 'Scarica e stampa il QR code del tuo negozio dalla dashboard. Posizionalo in cassa in modo visibile.' },
        { '@type': 'HowToStep', name: 'Presenta il programma ai clienti', text: 'Spiega ai clienti come funziona: scansionano il QR, inseriscono nome ed email, iniziano ad accumulare punti da subito.' },
        { '@type': 'HowToStep', name: 'Monitora e ottimizza', text: 'Usa la dashboard analytics per capire quali clienti sono più fedeli, quando rischiano di andarsene, e ottimizza i premi nel tempo.' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

const CTA = ({ label = 'Inizia gratis per 14 giorni →', utmRef = 'pillar' }: { label?: string; utmRef?: string }) => (
  <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
    <Link
      href={`/register?ref=${utmRef}`}
      style={{ display: 'inline-block', background: 'linear-gradient(135deg,#6C3DF4,#8B5CF6)', color: 'white', padding: '14px 36px', borderRadius: '100px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem', boxShadow: '0 0 32px rgba(108,61,244,0.35)' }}
    >
      {label}
    </Link>
    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
      Nessuna carta di credito · Setup in 10 minuti · Soddisfatti o rimborsati
    </p>
  </div>
)

export default async function PillarPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 6,
    select: { slug: true, title: true, description: true, category: true, readTime: true },
  })

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: '800', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/favicon.svg" alt="Fidelio" width={26} height={26} style={{ borderRadius: 6 }} />
          Fidelio
        </Link>
        <Link href="/register?ref=pillar-nav" style={{ background: '#6C3DF4', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
          Prova gratis 14 giorni
        </Link>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Home</Link>
          {' '}/{' '}
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Guide</Link>
          {' '}/{' '}
          <span style={{ color: '#A78BFA' }}>Programma Fedeltà</span>
        </div>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(108,61,244,0.15)', border: '1px solid rgba(108,61,244,0.3)', padding: '0.3rem 1rem', borderRadius: '100px', fontSize: '0.78rem', color: '#A78BFA', fontWeight: '700', marginBottom: '1.25rem' }}>
          📖 Guida Completa · Aggiornata Aprile 2026
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem,4.5vw,2.8rem)', fontWeight: '900', lineHeight: '1.15', marginBottom: '1.25rem' }}>
          Programma Fedeltà per Negozi:<br />La Guida Definitiva 2026
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.75', marginBottom: '1rem' }}>
          Se gestisci un negozio, un bar, un ristorante o un salone in Italia, questa guida ti spiega <strong style={{ color: 'white' }}>esattamente come creare un programma fedeltà digitale</strong> che funziona: dalla struttura dei punti ai premi, dagli strumenti giusti agli errori da evitare.
        </p>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Tempo di lettura: circa 12 minuti. Troverai anche esempi pratici per categoria di negozio e uno strumento per iniziare oggi stesso.
        </p>

        {/* Indice */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 1.75rem', marginBottom: '3rem' }}>
          <p style={{ fontWeight: '800', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>In questa guida</p>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              ['#cosè', 'Cos\'è un programma fedeltà digitale'],
              ['#perche-funziona', 'Perché funziona (i dati reali)'],
              ['#tipi', 'Tipi di programma fedeltà: quale scegliere'],
              ['#come-configurarlo', 'Come configurarlo: punti, soglie e premi'],
              ['#per-categoria', 'Strategie per categoria di negozio'],
              ['#errori', 'I 5 errori più comuni (e come evitarli)'],
              ['#metriche', 'Le metriche che contano davvero'],
              ['#come-iniziare', 'Come iniziare oggi in 10 minuti'],
              ['#faq', 'Domande frequenti'],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>{label as string}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* --- SEZIONE 1 --- */}
        <h2 id="cosè" style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1rem', scrollMarginTop: '5rem' }}>
          Cos'è un programma fedeltà digitale
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1rem' }}>
          Un <strong style={{ color: 'white' }}>programma fedeltà</strong> è un sistema che premia i clienti abituali con punti, sconti o vantaggi esclusivi ogni volta che tornano nel tuo negozio. L'obiettivo è semplice: rendere più conveniente tornare da te piuttosto che dal concorrente.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1rem' }}>
          La versione <strong style={{ color: 'white' }}>digitale</strong> sostituisce le vecchie tessere cartacee con un sistema basato su QR code, email e un profilo cliente online. Il risultato? Nessuna tessera da portare, nessun timbro da gestire, e tu hai finalmente i dati dei tuoi clienti in un posto solo.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '2rem' }}>
          I componenti di un programma fedeltà digitale moderno sono:
        </p>
        <ul style={{ margin: '0 0 2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            '**QR code** alla cassa che i clienti scansionano con il telefono',
            '**Profilo cliente** con punti accumulati, storico visite e premi disponibili',
            '**Email automatiche** per benvenuto, compleanno e promemoria',
            '**Dashboard** per il titolare con analytics, clienti e gestione premi',
            '**Sistema di premi** flessibile: sconti, prodotti gratuiti, esperienze',
          ].map((item, i) => (
            <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.65' }}
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color:white">$1</strong>') }} />
          ))}
        </ul>

        {/* --- SEZIONE 2 --- */}
        <h2 id="perche-funziona" style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1rem', scrollMarginTop: '5rem' }}>
          Perché funziona (i dati reali)
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1rem' }}>
          Il dato più importante che devi sapere: <strong style={{ color: 'white' }}>acquisire un nuovo cliente costa 5-7 volte di più che fidelizzarne uno esistente.</strong> Eppure la maggior parte dei negozi italiani spende tempo e soldi su volantini, social e promozioni per attirare gente nuova, ignorando chi è già entrato.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', margin: '1.5rem 0 2rem' }}>
          {[
            { stat: '+67%', label: 'spesa media dei clienti fidelizzati vs nuovi', color: '#A78BFA' },
            { stat: '5×', label: 'meno costoso mantenere un cliente rispetto ad acquisirne uno nuovo', color: '#10B981' },
            { stat: '+23%', label: 'di scontrino medio dopo il primo mese di programma fedeltà', color: '#F59E0B' },
          ].map(({ stat, label, color }) => (
            <div key={stat} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color, marginBottom: '0.4rem' }}>{stat}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1rem' }}>
          I programmi fedeltà digitali funzionano perché sfruttano due meccanismi psicologici potenti: il <strong style={{ color: 'white' }}>completion bias</strong> (il cervello vuole completare ciò che ha iniziato — i punti accumulati "devono" essere usati) e il <strong style={{ color: 'white' }}>sunk cost</strong> (ho già investito 8 visite, non cambio negozio ora).
        </p>

        <CTA label="Attiva il tuo programma fedeltà →" utmRef="pillar-s2" />

        {/* --- SEZIONE 3 --- */}
        <h2 id="tipi" style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1rem', scrollMarginTop: '5rem' }}>
          Tipi di programma fedeltà: quale scegliere
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Non tutti i programmi fedeltà sono uguali. Ecco i modelli principali e quando usarli:
        </p>

        {[
          {
            title: '🏆 Punti per visita (il più efficace per negozi fisici)',
            body: 'Il cliente accumula un numero fisso di punti ad ogni visita, indipendentemente dallo scontrino. Semplice, prevedibile, facilissimo da capire. Funziona benissimo per bar, parrucchieri, palestre — ovunque la frequenza sia più importante dello scontrino medio.',
            tag: 'Consigliato',
            tagColor: '#10B981',
          },
          {
            title: '💶 Punti proporzionali allo scontrino',
            body: 'Il cliente accumula punti in base a quanto spende (es. 1 punto ogni euro). Premia chi spende di più. Ottimo per ristoranti, boutique e negozi con ticket medio variabile. Richiede integrazione con il POS o inserimento manuale.',
            tag: 'Per alto ticket',
            tagColor: '#F59E0B',
          },
          {
            title: '🎴 Stamp card digitale',
            body: 'La versione digitale della tessera "10 caffè e il prossimo è gratis". Semplicissima da capire, perfetta per negozi con offerta mono-prodotto (bar, lavanderia, carwash). Meno flessibile dei punti.',
            tag: 'Semplicissimo',
            tagColor: '#A78BFA',
          },
          {
            title: '👑 Livelli VIP',
            body: 'I clienti salgono di livello (Bronzo → Argento → Oro) in base alle visite accumulate. Ogni livello sblocca vantaggi maggiori. Crea status, engagement e riduce il churn. Si abbina perfettamente al sistema a punti.',
            tag: 'Engagement alto',
            tagColor: '#EF4444',
          },
        ].map(({ title, body, tag, tagColor }) => (
          <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontWeight: '800', fontSize: '1rem', color: 'white', margin: 0 }}>{title}</h3>
              <span style={{ background: `${tagColor}20`, color: tagColor, padding: '0.15rem 0.6rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: '700' }}>{tag}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.65', margin: 0 }}>{body}</p>
          </div>
        ))}

        {/* --- SEZIONE 4 --- */}
        <h2 id="come-configurarlo" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2.5rem 0 1rem', scrollMarginTop: '5rem' }}>
          Come configurarlo: punti, soglie e premi
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          La configurazione è il punto dove più titolari sbagliano. Ecco la formula che funziona:
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#A78BFA', marginBottom: '0.75rem' }}>La regola delle 8-12 visite</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Il primo premio deve essere raggiungibile in <strong style={{ color: 'white' }}>8-12 visite</strong>. Troppo vicino (4-5 visite) e non crei abitudine. Troppo lontano (20+ visite) e i clienti si scoraggiano prima di arrivare.
        </p>
        <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'white' }}>📐 Formula pratica:</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Punti per visita: <strong style={{ color: 'white' }}>10</strong></li>
            <li style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Soglia premio: <strong style={{ color: 'white' }}>100 punti</strong> (= 10 visite)</li>
            <li style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Punti benvenuto: <strong style={{ color: 'white' }}>20 punti</strong> (= 2 visite gratis, incentivo iscrizione)</li>
          </ul>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#A78BFA', marginBottom: '0.75rem' }}>Il premio giusto</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1rem' }}>
          Il premio deve essere <strong style={{ color: 'white' }}>percepito come di valore</strong> dal cliente, ma avere un costo reale contenuto per te. Gli esempi migliori:
        </p>
        <ul style={{ margin: '0 0 2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'Bar: caffè o cornetto gratis (costo reale ~0.30€, valore percepito alto)',
            'Parrucchiere: trattamento gratuito o sconto 20% sul taglio successivo',
            'Ristorante: dessert gratis o antipasto della casa',
            'Palestra: lezione prova gratuita o personal training session',
            'Negozio: prodotto omaggio della tua scelta, sconto 15% sulla spesa',
          ].map((item, i) => (
            <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item}</li>
          ))}
        </ul>

        {/* --- SEZIONE 5 --- */}
        <h2 id="per-categoria" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2.5rem 0 1rem', scrollMarginTop: '5rem' }}>
          Strategie per categoria di negozio
        </h2>

        {[
          {
            emoji: '☕', title: 'Bar & Caffetteria',
            body: 'La frequenza è il tuo punto di forza: i clienti del caffè mattutino possono venire 5-7 volte a settimana. Usa una soglia bassa (8 visite) per il primo premio. Aggiungi un secondo livello per chi supera le 50 visite. Le email di compleanno funzionano benissimo in questo segmento.',
            tip: 'Offri doppi punti la domenica mattina per aumentare il traffico nel giorno più lento.',
          },
          {
            emoji: '✂️', title: 'Salone & Barbiere',
            body: 'Le visite sono meno frequenti (ogni 4-6 settimane) ma l\'importo è più alto. Usa punti proporzionali allo scontrino o premi legati a servizi aggiuntivi (trattamenti, colorazioni). Le email di "richiamata" a 5-6 settimane dall\'ultima visita sono cruciali per ridurre il churn.',
            tip: 'Crea un premio "VIP Day": taglio + barba gratis al superamento dei 200 punti.',
          },
          {
            emoji: '🍕', title: 'Ristorante & Pizzeria',
            body: 'Distingui i clienti del pranzo da quelli della cena. Offri punti doppi il martedì e mercoledì per riempire i giorni più vuoti. Il programma fedeltà digitale ti permette anche di raccogliere feedback tramite email post-visita. I premi più efficaci: dessert, aperitivo, bottiglia di vino.',
            tip: 'Aggiungi un premio "Compleanno": cena per 2 con sconto 30% nel mese del compleanno.',
          },
          {
            emoji: '💪', title: 'Palestra & Fitness',
            body: 'Il problema principale è il churn: il 40% dei membri cancella l\'abbonamento entro 3 mesi. Usa il programma fedeltà per premiare la continuità (premi milestone a 30, 60, 100 sessioni). Le email di winback dopo 2 settimane di assenza sono fondamentali.',
            tip: 'Premia il "portare un amico" con punti bonus — il referral è il canale di acquisizione più efficace per le palestre.',
          },
          {
            emoji: '🥐', title: 'Panetteria & Pasticceria',
            body: 'Alta frequenza, basso scontrino. Il modello stamp card funziona benissimo (es. "acquista 9 prodotti, il 10° è gratis"). Aggiungi punti extra per gli acquisti del weekend. Le email di compleanno con coupon sono particolarmente efficaci in questo settore.',
            tip: 'Lancia una "tessera colazione": 5 punti per ogni colazione completa (caffè + cornetto). Premio: colazione per 2.',
          },
        ].map(({ emoji, title, body, tip }) => (
          <div key={title} style={{ borderLeft: '3px solid rgba(108,61,244,0.4)', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'white', marginBottom: '0.5rem' }}>{emoji} {title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '0.5rem' }}>{body}</p>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', padding: '0.6rem 0.9rem', display: 'inline-block' }}>
              <span style={{ fontSize: '0.82rem', color: '#10B981' }}>💡 Tip: {tip}</span>
            </div>
          </div>
        ))}

        <CTA label="Scegli il tuo piano e inizia →" utmRef="pillar-s5" />

        {/* --- SEZIONE 6 --- */}
        <h2 id="errori" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2.5rem 0 1rem', scrollMarginTop: '5rem' }}>
          I 5 errori più comuni (e come evitarli)
        </h2>

        {[
          {
            n: '1', title: 'Soglia troppo alta',
            body: 'Se il primo premio richiede 30+ visite, la maggior parte dei clienti non ci arriverà mai. Abbassa la soglia e crea più livelli progressivi.',
          },
          {
            n: '2', title: 'Premio poco appetibile',
            body: '"10% di sconto" è debole. I clienti vogliono qualcosa di concreto e gratuito. Un prodotto omaggio o un servizio incluso funziona 3x meglio di una percentuale.',
          },
          {
            n: '3', title: 'Non comunicare il programma',
            body: 'Stampare il QR e non dire niente ai clienti è l\'errore più comune. Forma il personale, aggiungi un cartello, menzionalo attivamente in cassa per le prime settimane.',
          },
          {
            n: '4', title: 'Ignorare i dati',
            body: 'Il vero valore di un programma fedeltà digitale sono i dati: quali clienti non tornano da 30 giorni? Chi è vicino al premio? Chi festeggia il compleanno questa settimana? Usa queste informazioni.',
          },
          {
            n: '5', title: 'Non rinnovare mai i premi',
            body: 'I clienti si abituano. Aggiungi un premio stagionale ogni tanto, crea eventi speciali con punti doppi, introduce livelli VIP. La varietà mantiene alto l\'engagement.',
          },
        ].map(({ n, title, body }) => (
          <div key={n} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(108,61,244,0.2)', border: '1px solid rgba(108,61,244,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', color: '#A78BFA', flexShrink: 0, marginTop: '2px' }}>{n}</div>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '1rem', color: 'white', marginBottom: '0.3rem' }}>{title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.65', margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}

        {/* --- SEZIONE 7 --- */}
        <h2 id="metriche" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2.5rem 0 1rem', scrollMarginTop: '5rem' }}>
          Le metriche che contano davvero
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Non tutte le metriche hanno lo stesso valore. Queste sono le 5 che dovresti guardare ogni settimana:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { metric: 'Tasso di ritorno (30 giorni)', desc: 'Percentuale di clienti che tornano entro 30 giorni dalla prima visita. Benchmark sano: >40%.', color: '#A78BFA' },
            { metric: 'Churn rate mensile', desc: 'Clienti che non sono tornati da più di 60 giorni. Se supera il 30%, le email di winback sono prioritarie.', color: '#EF4444' },
            { metric: 'Frequenza media visite', desc: 'Quante volte al mese torna un cliente attivo. Confrontala mese su mese per vedere se il programma sta funzionando.', color: '#10B981' },
            { metric: 'Tasso di riscatto premi', desc: 'Quanti clienti raggiungono la soglia e riscattano il premio. Sotto il 15% significa soglia troppo alta o premio poco attraente.', color: '#F59E0B' },
            { metric: 'NPS (Net Promoter Score)', desc: 'Chiedi ai clienti: "Consiglieresti questo negozio a un amico?". Un programma fedeltà che funziona alza l\'NPS del 15-20 punti in media.', color: '#6C3DF4' },
          ].map(({ metric, desc, color }) => (
            <div key={metric} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '6px', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white', margin: '0 0 0.2rem' }}>{metric}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- SEZIONE 8 --- */}
        <h2 id="come-iniziare" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2.5rem 0 1rem', scrollMarginTop: '5rem' }}>
          Come iniziare oggi in 10 minuti
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Con Fidelio puoi avere il tuo programma fedeltà digitale attivo in meno di 10 minuti, senza hardware, senza tessere e senza app da far scaricare ai clienti. Ecco i passaggi:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { n: '1', title: 'Registra il negozio', body: 'Crea il tuo account su Fidelio. Inserisci nome, categoria e indirizzo del negozio. Ci vogliono 2 minuti.' },
            { n: '2', title: 'Configura punti e premi', body: 'Imposta quanti punti dai per visita, la soglia per il primo premio e il nome del premio (es. "Caffè gratis"). Puoi sempre modificarlo dopo.' },
            { n: '3', title: 'Stampa il QR code', body: 'Dalla dashboard, scarica e stampa il QR code. Appendilo in cassa con il cartello fornito. Fine.' },
            { n: '4', title: 'Presentalo ai clienti', body: 'I primi giorni, mostralo attivamente in cassa: "Sai che ora abbiamo un programma punti?" — la maggior parte aderirà volentieri.' },
            { n: '5', title: 'Monitora i risultati', body: 'Dopo le prime 2 settimane, controlla la dashboard: quanti clienti iscritti, visite, andamento punti. Ottimizza soglia e premi se necessario.' },
          ].map(({ n, title, body }) => (
            <div key={n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6C3DF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', color: 'white', flexShrink: 0 }}>{n}</div>
              <div style={{ paddingTop: '6px' }}>
                <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white', margin: '0 0 0.2rem' }}>{title}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <CTA label="Inizia gratis — nessuna carta richiesta →" utmRef="pillar-s8" />

        {/* --- SEZIONE FAQ --- */}
        <h2 id="faq" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2.5rem 0 1.25rem', scrollMarginTop: '5rem' }}>
          Domande frequenti
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {faqItems.map(({ q, a }) => (
            <div key={q} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontWeight: '700', fontSize: '0.98rem', color: 'white', marginBottom: '0.5rem' }}>{q}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Articoli correlati */}
        {posts.length > 0 && (
          <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem' }}>
              📚 Approfondisci con le nostre guide
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ background: 'rgba(108,61,244,0.15)', color: '#A78BFA', padding: '0.15rem 0.6rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '700' }}>{post.category}</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>{post.readTime}</span>
                  </div>
                  <p style={{ fontWeight: '700', fontSize: '0.93rem', color: 'white', margin: '0 0 0.2rem' }}>{post.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA finale */}
        <div style={{ marginTop: '3.5rem', background: 'linear-gradient(135deg, rgba(108,61,244,0.2), rgba(108,61,244,0.06))', border: '1px solid rgba(108,61,244,0.35)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
          <h2 style={{ fontWeight: '900', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Pronto a fidelizzare i tuoi clienti?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: '1.65' }}>
            Unisciti a centinaia di negozi italiani che usano Fidelio per far tornare i clienti ogni settimana.
          </p>
          <Link href="/register?ref=pillar-bottom" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#6C3DF4,#8B5CF6)', color: 'white', padding: '16px 40px', borderRadius: '100px', fontWeight: '800', textDecoration: 'none', fontSize: '1.05rem', boxShadow: '0 0 40px rgba(108,61,244,0.4)' }}>
            Inizia gratis per 14 giorni →
          </Link>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
            Setup in 10 minuti · Nessuna carta di credito · Soddisfatti o rimborsati
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {['✓ QR code pronto subito', '✓ Email automatiche incluse', '✓ Dashboard analytics'].map(f => (
              <span key={f} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{f}</span>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.85rem' }}>← Tutte le guide</Link>
        </div>
      </div>
    </div>
  )
}
