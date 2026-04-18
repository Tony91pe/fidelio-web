'use client'

const treatments = [
  {
    id: 1,
    activity: 'Gestione account negozi',
    purpose: 'Erogazione del servizio SaaS, esecuzione del contratto di abbonamento',
    legalBasis: 'Art. 6(1)(b) GDPR — esecuzione di un contratto',
    data: ['Nome e cognome titolare', 'Email', 'Nome negozio', 'Indirizzo negozio', 'Telefono', 'Password (hash)'],
    subjects: 'Titolari di negozi registrati su Fidelio',
    retention: 'Durata del contratto + 10 anni (obblighi fiscali)',
    processors: ['Vercel Inc. (hosting) — USA, SCCs', 'Neon Inc. (database) — USA, SCCs', 'Clerk Inc. (autenticazione) — USA, SCCs'],
    transfer: 'USA — con garanzie adeguate (Standard Contractual Clauses)',
  },
  {
    id: 2,
    activity: 'Gestione clienti programma fedeltà',
    purpose: 'Gestione punti, premi, storico visite per conto del negozio iscritto',
    legalBasis: 'Art. 6(1)(b) GDPR — esecuzione del servizio richiesto dal cliente',
    data: ['Nome', 'Email', 'Data di nascita', 'Codice QR personale', 'Storico visite e punti'],
    subjects: 'Clienti finali dei negozi che usano Fidelio',
    retention: 'Durata del rapporto con il negozio + 3 anni, poi cancellazione automatica',
    processors: ['Vercel Inc. (hosting) — USA, SCCs', 'Neon Inc. (database) — USA, SCCs'],
    transfer: 'USA — con garanzie adeguate (Standard Contractual Clauses)',
  },
  {
    id: 3,
    activity: 'Invio email automatiche',
    purpose: 'Email transazionali (benvenuto, punti assegnati), automazioni (compleanno, winback)',
    legalBasis: 'Art. 6(1)(b) GDPR — esecuzione del contratto / Art. 6(1)(f) interesse legittimo',
    data: ['Nome', 'Email', 'Data di nascita (per automazione compleanno)'],
    subjects: 'Clienti finali dei negozi Fidelio',
    retention: 'Fino alla cancellazione dell\'account o disiscrizione',
    processors: ['Resend Inc. (invio email) — USA, SCCs'],
    transfer: 'USA — con garanzie adeguate (Standard Contractual Clauses)',
  },
  {
    id: 4,
    activity: 'Gestione pagamenti abbonamenti',
    purpose: 'Processamento pagamenti piani Starter, Growth, Pro',
    legalBasis: 'Art. 6(1)(b) GDPR — esecuzione del contratto',
    data: ['Email', 'Dati di fatturazione (gestiti direttamente da Paddle come Merchant of Record)'],
    subjects: 'Titolari di negozi con piano a pagamento',
    retention: '10 anni (obblighi fiscali e contabili)',
    processors: ['Paddle.com Inc. (Merchant of Record, pagamenti) — UK/USA, GDPR compliant'],
    transfer: 'UK/USA — Paddle è conforme GDPR e agisce come responsabile autonomo del trattamento per i dati di pagamento',
  },
  {
    id: 5,
    activity: 'Notifiche push',
    purpose: 'Invio notifiche push su smartphone per aggiornamenti punti e offerte',
    legalBasis: 'Art. 6(1)(a) GDPR — consenso esplicito dell\'utente',
    data: ['Token di sottoscrizione push (anonimo, non contiene dati personali diretti)'],
    subjects: 'Clienti finali che hanno attivato le notifiche push',
    retention: 'Fino alla revoca del consenso o disinstallazione dell\'app',
    processors: ['Vercel Inc. (hosting API) — USA, SCCs', 'Browser/OS del dispositivo dell\'utente (Web Push API)'],
    transfer: 'USA — con garanzie adeguate (Standard Contractual Clauses)',
  },
  {
    id: 6,
    activity: 'Statistiche e analisi utilizzo',
    purpose: 'Dashboard analitiche per i negozi (visite, clienti, trend), miglioramento del servizio',
    legalBasis: 'Art. 6(1)(f) GDPR — interesse legittimo del titolare',
    data: ['Dati aggregati di visita', 'Timestamp accessi', 'Metriche di utilizzo anonimizzate'],
    subjects: 'Clienti finali (dati aggregati e pseudonimizzati)',
    retention: '2 anni, poi eliminazione automatica',
    processors: ['Vercel Inc. (hosting) — USA, SCCs', 'Neon Inc. (database) — USA, SCCs'],
    transfer: 'USA — con garanzie adeguate (Standard Contractual Clauses)',
  },
]

export default function GdprRegisterPage() {
  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.3rem' }}>📋 Registro dei Trattamenti GDPR</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Art. 30 Regolamento UE 2016/679 — documento interno riservato</p>
        </div>
        <button
          onClick={() => window.print()}
          style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
          🖨️ Stampa / Salva PDF
        </button>
      </div>

      {/* Info titolare */}
      <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#a78bfa' }}>Titolare del Trattamento</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
          <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Nome:</span> Antonio Piersante</div>
          <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Indirizzo:</span> R. Rossetti, Pescara (PE), Italia</div>
          <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Email:</span> support@getfidelio.app</div>
          <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Sito:</span> getfidelio.app</div>
          <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Ultimo aggiornamento:</span> aprile 2026</div>
        </div>
      </div>

      {/* Trattamenti */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {treatments.map(t => (
          <div key={t.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: '#7C3AED', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{t.id}</span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.activity}</span>
            </div>
            <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <Field label="Finalità" value={t.purpose} />
              <Field label="Base giuridica" value={t.legalBasis} highlight />
              <Field label="Dati trattati" value={t.data} />
              <Field label="Interessati" value={t.subjects} />
              <Field label="Conservazione" value={t.retention} />
              <Field label="Responsabili esterni" value={t.processors} />
              <Field label="Trasferimento extra-UE" value={t.transfer} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
        Documento redatto ai sensi dell'art. 30 del Regolamento (UE) 2016/679 (GDPR). Da conservare internamente e aggiornare ad ogni variazione dei trattamenti. Non destinato alla pubblicazione. In caso di ispezione da parte del Garante per la Protezione dei Dati Personali, presentare questo documento.
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, value, highlight }: { label: string; value: string | string[]; highlight?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</p>
      {Array.isArray(value) ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {value.map((v, i) => (
            <li key={i} style={{ fontSize: '0.83rem', color: highlight ? '#a78bfa' : 'rgba(255,255,255,0.65)', marginBottom: '0.15rem', display: 'flex', gap: '0.4rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>{v}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '0.83rem', color: highlight ? '#a78bfa' : 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{value}</p>
      )}
    </div>
  )
}
