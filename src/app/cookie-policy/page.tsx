import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Fidelio',
  description: 'Informativa sull\'uso dei cookie e delle tecnologie di tracciamento su getfidelio.app.',
  alternates: { canonical: 'https://www.getfidelio.app/cookie-policy' },
}

const sections = [
  {
    title: '1. Definizioni',
    content: `Cookie: piccolo file di testo generato da un sito web e salvato dal tuo browser. Viene utilizzato per identificare il browser, raccogliere dati statistici e ricordare informazioni come preferenze di lingua o dati di accesso.\n\nSocietà: quando questa policy menziona "Fidelio", "noi" o "nostro", si riferisce ad Antonio Piersante, Via R. Rossetti, Pescara, Italia.\n\nDispositivo: qualsiasi dispositivo connesso a internet (telefono, tablet, computer) con cui puoi accedere a Fidelio.\n\nDato personale: qualsiasi informazione che consente di identificare, direttamente o indirettamente, una persona fisica.\n\nSito web: il sito di Fidelio, accessibile all'indirizzo getfidelio.app.`,
  },
  {
    title: '2. Cosa sono i cookie?',
    content: 'Un cookie è un piccolo file di testo memorizzato sul tuo dispositivo quando visiti un sito web. I cookie sono completamente sicuri: non possono eseguire programmi né trasmettere virus. Servono a far funzionare correttamente il sito e, con il tuo consenso, a raccogliere dati statistici di navigazione.',
  },
  {
    title: '3. Perché usiamo i cookie?',
    content: `Utilizziamo cookie propri e di terze parti per:\n\n— Garantire il funzionamento e la sicurezza del sito;\n— Mantenere attiva la sessione di autenticazione;\n— Migliorare l'esperienza di navigazione;\n— Analizzare l'utilizzo del sito (solo con il tuo consenso).`,
  },
  {
    title: '4. Tipi di cookie che utilizziamo',
    content: `Cookie tecnici / di sessione (necessari): indispensabili per il funzionamento del sito. Gestiti da Clerk per l'autenticazione degli utenti. Non richiedono consenso ai sensi del Provvedimento del Garante del 10 giugno 2021.\n\nCookie analitici (Google Analytics 4): utilizzati per misurare il traffico e le interazioni con il sito. Attivati solo dopo il tuo consenso esplicito tramite il banner cookie. Puoi revocare il consenso in qualsiasi momento.\n\nCookie di chat (Crisp): attivati solo se interagisci con il widget di supporto presente sul sito.\n\nLocal Storage: utilizzato dalla PWA Fidelio per memorizzare dati lato client e migliorare l'esperienza d'uso (nessun dato trasmesso a server di terze parti per questa funzione).`,
  },
  {
    title: '5. Cookie di terze parti',
    content: `Alcuni cookie sono impostati da servizi di terze parti:\n\n— Clerk (autenticazione utenti) — gestisce i propri cookie di sessione\n— Google Analytics 4 (statistiche) — solo con consenso\n— Crisp (chat supporto) — solo se usi la chat\n\nQueste terze parti hanno le proprie policy sulla privacy, accessibili sui rispettivi siti.`,
  },
  {
    title: '6. Come gestire i cookie',
    content: `Puoi gestire le tue preferenze cookie in qualsiasi momento tramite il banner presente sul sito (clicca su "Gestisci cookie" nel footer).\n\nPuoi anche configurare il tuo browser per bloccare o eliminare i cookie. Tieni presente che disabilitare i cookie tecnici potrebbe compromettere il funzionamento del sito e impedirti di accedere ad alcune funzionalità.\n\nIstruzioni per i principali browser:\n— Google Chrome: Impostazioni → Privacy e sicurezza → Cookie\n— Mozilla Firefox: Impostazioni → Privacy e sicurezza\n— Safari: Preferenze → Privacy\n— Microsoft Edge: Impostazioni → Privacy, ricerca e servizi`,
  },
  {
    title: '7. Durata dei cookie',
    content: `Cookie di sessione: eliminati alla chiusura del browser.\n\nCookie persistenti (es. preferenze consenso): conservati per un massimo di 12 mesi, salvo diversa indicazione del fornitore del cookie.`,
  },
  {
    title: '8. Modifiche alla Cookie Policy',
    content: 'Potremmo aggiornare questa Cookie Policy periodicamente per riflettere cambiamenti normativi o tecnici. La versione aggiornata sarà sempre disponibile su questa pagina con la data dell\'ultima modifica.',
  },
  {
    title: '9. Contatti',
    content: `Per domande relative all'uso dei cookie:\n\nEmail: support@getfidelio.app\nSito: getfidelio.app`,
  },
]

export default function CookiePolicyPage() {
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '2rem 0 0.5rem' }}>Cookie Policy</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Aggiornata al 19 aprile 2026</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Ai sensi del Provvedimento del Garante Privacy del 10 giugno 2021 e del GDPR</p>
      {sections.map(section => (
        <div key={section.title} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#A78BFA' }}>{section.title}</h2>
          {section.content.split('\n\n').map((para, i) => (
            <p key={i} style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{para}</p>
          ))}
        </div>
      ))}
    </div>
  )
}
