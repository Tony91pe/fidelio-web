import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{
      fontFamily: 'system-ui,sans-serif', background: '#0D0D1A',
      color: 'white', minHeight: '100vh', padding: '2rem',
      maxWidth: '800px', margin: '0 auto',
    }}>
      <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '2rem 0 0.5rem' }}>Privacy Policy</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Ultimo aggiornamento: gennaio 2026</p>

      {[
        {
          title: '1. Titolare del trattamento',
          content: 'Fidelio, piattaforma di fidelizzazione digitale per negozi italiani. Per qualsiasi richiesta relativa alla privacy: privacy@fidelio.it'
        },
        {
          title: '2. Dati raccolti',
          content: 'Raccogliamo: nome, indirizzo email, dati di utilizzo del servizio (visite, punti accumulati). Per i negozianti: dati aziendali, metodo di pagamento (gestito da Stripe).'
        },
        {
          title: '3. Finalità del trattamento',
          content: 'I dati vengono utilizzati per: erogare il servizio di fidelizzazione, inviare comunicazioni relative ai punti e premi, migliorare il servizio. Non vendiamo i tuoi dati a terzi.'
        },
        {
          title: '4. Base giuridica',
          content: 'Il trattamento è basato sul consenso dell\'utente (art. 6 par. 1 lett. a GDPR) e sull\'esecuzione del contratto di servizio (art. 6 par. 1 lett. b GDPR).'
        },
        {
          title: '5. Conservazione dei dati',
          content: 'I dati vengono conservati per tutta la durata del rapporto contrattuale e per i successivi 5 anni, salvo diversi obblighi di legge.'
        },
        {
          title: '6. Diritti dell\'interessato',
          content: 'Hai diritto di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione. Per esercitare questi diritti: privacy@fidelio.it'
        },
        {
          title: '7. Cookie',
          content: 'Utilizziamo cookie tecnici necessari al funzionamento del sito. Non utilizziamo cookie di profilazione o marketing senza consenso esplicito.'
        },
        {
          title: '8. Trasferimento dati',
          content: 'I dati possono essere trasferiti a fornitori di servizi (Vercel per hosting, Resend per email, Stripe per pagamenti, Clerk per autenticazione) che garantiscono adeguate misure di sicurezza.'
        },
        {
          title: '9. Reclami',
          content: 'Hai il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).'
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