import Link from 'next/link'

export default function TerminiPage() {
  return (
    <div style={{
      fontFamily: 'system-ui,sans-serif', background: '#0D0D1A',
      color: 'white', minHeight: '100vh', padding: '2rem',
      maxWidth: '800px', margin: '0 auto',
    }}>
      <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '2rem 0 0.5rem' }}>Termini di Servizio</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Ultimo aggiornamento: gennaio 2026</p>

      {[
        {
          title: '1. Accettazione dei termini',
          content: 'Utilizzando Fidelio accetti questi termini di servizio. Se non li accetti, non puoi utilizzare il servizio.'
        },
        {
          title: '2. Descrizione del servizio',
          content: 'Fidelio è una piattaforma SaaS che consente ai negozianti di gestire programmi fedeltà digitali per i propri clienti tramite QR code, punti e premi.'
        },
        {
          title: '3. Account negoziante',
          content: 'Per utilizzare Fidelio come negoziante devi creare un account, fornire informazioni accurate e mantenere la sicurezza delle tue credenziali. Sei responsabile di tutte le attività che avvengono sul tuo account.'
        },
        {
          title: '4. Piani e pagamenti',
          content: 'Fidelio offre piani gratuiti e a pagamento. I pagamenti sono processati da Stripe. I prezzi possono variare con preavviso di 30 giorni. Non sono previsti rimborsi salvo diverso accordo.'
        },
        {
          title: '5. Dati dei clienti',
          content: 'I negozianti sono responsabili del trattamento dei dati dei propri clienti nel rispetto del GDPR. Fidelio agisce come responsabile del trattamento per conto del negoziante.'
        },
        {
          title: '6. Limitazione di responsabilità',
          content: 'Fidelio non è responsabile per perdite di dati, interruzioni del servizio o danni indiretti. La responsabilità massima è limitata all\'importo pagato negli ultimi 3 mesi.'
        },
        {
          title: '7. Sospensione e cancellazione',
          content: 'Fidelio si riserva il diritto di sospendere o cancellare account che violano questi termini. Il negoziante può cancellare il proprio account in qualsiasi momento.'
        },
        {
          title: '8. Modifiche ai termini',
          content: 'Ci riserviamo il diritto di modificare questi termini. Le modifiche significative saranno comunicate via email con 30 giorni di preavviso.'
        },
        {
          title: '9. Legge applicabile',
          content: 'Questi termini sono regolati dalla legge italiana. Qualsiasi controversia sarà di competenza del Tribunale di Roma.'
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