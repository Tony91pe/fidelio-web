import Link from 'next/link'

export default function RimborsiPage() {
  return (
    <div style={{
      fontFamily: 'system-ui,sans-serif', background: '#0D0D1A',
      color: 'white', minHeight: '100vh', padding: '2rem',
      maxWidth: '800px', margin: '0 auto',
    }}>
      <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '2rem 0 0.5rem' }}>Politica di Rimborso</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Ultimo aggiornamento: aprile 2026</p>

      {[
        {
          title: '1. Garanzia soddisfatti o rimborsati',
          content: 'Offriamo una garanzia di rimborso completo entro 14 giorni dall\'attivazione di qualsiasi piano a pagamento (Starter, Growth, Pro). Se non sei soddisfatto del servizio per qualsiasi motivo, contattaci entro questo periodo e riceverai un rimborso completo senza domande.'
        },
        {
          title: '2. Come richiedere un rimborso',
          content: 'Per richiedere un rimborso entro i 14 giorni, invia una email a support@getfidelio.app indicando il tuo indirizzo email di registrazione e il motivo della richiesta. Elaboriamo le richieste entro 3-5 giorni lavorativi.'
        },
        {
          title: '3. Rimborsi dopo i 14 giorni',
          content: 'Trascorsi i 14 giorni dalla prima attivazione, i piani mensili non sono rimborsabili. Puoi comunque disdire in qualsiasi momento: il tuo abbonamento rimarrà attivo fino alla fine del periodo già pagato, dopodiché non verrà rinnovato.'
        },
        {
          title: '4. Cancellazione abbonamento',
          content: 'Puoi cancellare il tuo abbonamento in qualsiasi momento dalla sezione "Upgrade" del tuo dashboard. La cancellazione è immediata e non verranno addebitati ulteriori importi. Non sono previsti rimborsi pro-rata per il periodo rimanente del mese in corso.'
        },
        {
          title: '5. Pagamenti gestiti da Lemon Squeezy',
          content: 'I pagamenti sono processati da Lemon Squeezy (lemonsqueezy.com), che agisce come Merchant of Record. Le transazioni vengono gestite da Lemon Squeezy nel rispetto delle normative internazionali sui pagamenti. In caso di dispute, Lemon Squeezy può essere contattato direttamente all\'indirizzo lemonsqueezy.com/help.'
        },
        {
          title: '6. Eccezioni',
          content: 'Non sono previsti rimborsi in caso di violazione dei Termini di Servizio, utilizzo fraudolento del servizio, o account sospesi per comportamenti illeciti.'
        },
        {
          title: '7. Contatti',
          content: 'Per qualsiasi domanda sulla nostra politica di rimborso: support@getfidelio.app'
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#A78BFA' }}>{section.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7', fontSize: '0.9rem' }}>{section.content}</p>
        </div>
      ))}
    </div>
  )
}
