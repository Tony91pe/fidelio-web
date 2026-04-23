import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Fidelio',
  description: 'Informativa sul trattamento dei dati personali ai sensi degli artt. 13-14 del Regolamento UE 2016/679 (GDPR).',
  alternates: { canonical: 'https://www.getfidelio.app/privacy' },
}

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '2rem 0 0.5rem' }}>Informativa sulla Privacy</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Aggiornata al 19 aprile 2026</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Ai sensi degli artt. 13-14 del Regolamento UE 2016/679 (GDPR)</p>

      <Section title="1. Titolare del trattamento">
        <P>Il titolare del trattamento dei dati personali è <strong>Antonio Piersante</strong>, con sede in Via R. Rossetti, Pescara (PE), Italia — di seguito «Fidelio» o «Titolare».</P>
        <P>Contatti: <a href="mailto:support@getfidelio.app" style={{ color: '#A78BFA' }}>support@getfidelio.app</a></P>
      </Section>

      <Section title="2. Dati trattati e finalità">
        <H3>2.1 — Titolari di negozio (utenti registrati)</H3>
        <P>Raccogliamo i seguenti dati quando crei un account su Fidelio:</P>
        <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.9', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
          <li>Nome, cognome e indirizzo e-mail (registrazione e autenticazione)</li>
          <li>Nome del negozio, indirizzo, settore merceologico</li>
          <li>Dati di fatturazione gestiti da <strong>Paddle</strong> (Merchant of Record) — Fidelio non vede né memorizza dati di carta di credito</li>
          <li>Log di accesso e dati tecnici (IP, browser, ora) per sicurezza e prevenzione frodi</li>
        </ul>
        <P>Basi giuridiche: <strong>esecuzione del contratto</strong> (art. 6.1.b GDPR) per fornire il servizio; <strong>legittimo interesse</strong> (art. 6.1.f GDPR) per sicurezza e prevenzione frodi; <strong>obbligo legale</strong> (art. 6.1.c GDPR) per conservazione fiscale.</P>

        <H3>2.2 — Clienti finali dei negozi (interessati indiretti)</H3>
        <P>I negozi raccolgono dati dei loro clienti (nome, e-mail, data di nascita, codice cliente) tramite la piattaforma Fidelio. In questo contesto Fidelio agisce come <strong>responsabile del trattamento</strong> ai sensi dell'art. 28 GDPR per conto del negozio, che è il titolare autonomo del trattamento. Il DPA (Data Processing Agreement) è disponibile nell'area admin.</P>

        <H3>2.3 — Dati di navigazione</H3>
        <P>Come qualsiasi sito web, raccogliamo automaticamente dati tecnici di navigazione (indirizzo IP, pagine visitate, ora, browser). Questi dati vengono usati per garantire il corretto funzionamento del sito e per sicurezza.</P>

        <H3>2.4 — Dati statistici (Google Analytics 4)</H3>
        <P>Utilizziamo Google Analytics 4 per analizzare il traffico sul sito. GA4 viene caricato <strong>solo dopo il tuo consenso esplicito</strong> tramite il banner cookie. Puoi revocare il consenso in qualsiasi momento cliccando su «Gestisci cookie» in fondo alla pagina. Base giuridica: <strong>consenso</strong> (art. 6.1.a GDPR).</P>
      </Section>

      <Section title="3. Responsabili del trattamento (sub-processor)">
        <P>Ci avvaliamo dei seguenti fornitori, con i quali abbiamo stipulato appositi DPA:</P>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Fornitore</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Ruolo</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Sede</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Clerk Inc.', 'Autenticazione utenti', 'USA (SCC)'],
              ['Neon Inc.', 'Database PostgreSQL', 'USA (SCC)'],
              ['Vercel Inc.', 'Hosting e CDN', 'USA (SCC)'],
              ['Resend Inc.', 'Invio e-mail transazionali', 'USA (SCC)'],
              ['Paddle.com Market Ltd.', 'Pagamenti (Merchant of Record)', 'UK'],
              ['Sentry (Functional Software)', 'Monitoraggio errori', 'USA (SCC)'],
              ['Crisp IM SARL', 'Chat di supporto', 'Francia (UE)'],
              ['Google LLC', 'Analytics (solo con consenso)', 'USA (SCC)'],
            ].map(([name, role, location]) => (
              <tr key={name}>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><strong style={{ color: 'white' }}>{name}</strong></td>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{role}</td>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{location}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <P>SCC = Clausole Contrattuali Standard approvate dalla Commissione Europea (art. 46.2.c GDPR) — garanzia adeguata per i trasferimenti extra-UE.</P>
        <P>Il Data Processing Agreement (DPA) completo ai sensi dell&apos;art. 28 GDPR è disponibile alla pagina <a href="/dpa" style={{ color: '#A78BFA' }}>/dpa</a>.</P>
      </Section>

      <Section title="4. Periodo di conservazione">
        <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.9', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
          <li><strong style={{ color: 'white' }}>Dati account negozio:</strong> per tutta la durata del contratto + 10 anni per obblighi fiscali</li>
          <li><strong style={{ color: 'white' }}>Dati clienti finali:</strong> finché il negozio mantiene l'account attivo; cancellabili su richiesta</li>
          <li><strong style={{ color: 'white' }}>Log di sicurezza:</strong> 90 giorni</li>
          <li><strong style={{ color: 'white' }}>Dati analytics (GA4):</strong> 14 mesi (impostazione predefinita GA4)</li>
          <li><strong style={{ color: 'white' }}>Cookie di sessione:</strong> alla chiusura del browser</li>
        </ul>
      </Section>

      <Section title="5. I tuoi diritti (artt. 15-22 GDPR)">
        <P>Hai il diritto di:</P>
        <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.9', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
          <li><strong style={{ color: 'white' }}>Accesso</strong> (art. 15): ottenere copia dei tuoi dati personali</li>
          <li><strong style={{ color: 'white' }}>Rettifica</strong> (art. 16): correggere dati inesatti o incompleti</li>
          <li><strong style={{ color: 'white' }}>Cancellazione</strong> (art. 17): chiedere la cancellazione («diritto all'oblio»)</li>
          <li><strong style={{ color: 'white' }}>Limitazione</strong> (art. 18): limitare il trattamento in certi casi</li>
          <li><strong style={{ color: 'white' }}>Portabilità</strong> (art. 20): ricevere i dati in formato strutturato e leggibile da macchina</li>
          <li><strong style={{ color: 'white' }}>Opposizione</strong> (art. 21): opporti al trattamento basato su legittimo interesse</li>
          <li><strong style={{ color: 'white' }}>Revoca del consenso</strong>: in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente</li>
        </ul>
        <P>Per esercitare i tuoi diritti scrivi a <a href="mailto:support@getfidelio.app" style={{ color: '#A78BFA' }}>support@getfidelio.app</a>. Risponderemo entro 30 giorni. Hai inoltre il diritto di proporre reclamo al <strong>Garante per la protezione dei dati personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer" style={{ color: '#A78BFA' }}>www.garanteprivacy.it</a>).</P>
      </Section>

      <Section title="6. Cookie e tecnologie di tracciamento">
        <P>Utilizziamo:</P>
        <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.9', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
          <li><strong style={{ color: 'white' }}>Cookie tecnici/di sessione</strong> (Clerk): necessari per il funzionamento dell'autenticazione — non richiedono consenso</li>
          <li><strong style={{ color: 'white' }}>Cookie di chat</strong> (Crisp): attivati solo se apri il widget di supporto</li>
          <li><strong style={{ color: 'white' }}>Cookie analitici</strong> (Google Analytics 4): attivati solo con il tuo consenso esplicito</li>
        </ul>
        <P>Puoi gestire o revocare il consenso in qualsiasi momento tramite il banner cookie.</P>
      </Section>

      <Section title="7. Sicurezza">
        <P>Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati: connessioni cifrate (HTTPS/TLS), autenticazione sicura, accesso ai dati limitato al personale autorizzato, monitoraggio delle anomalie tramite Sentry. I pagamenti sono gestiti interamente da Paddle (PCI DSS Level 1) — Fidelio non vede né memorizza dati di carte di pagamento.</P>
      </Section>

      <Section title="8. Modifiche all'informativa">
        <P>Potremmo aggiornare questa informativa periodicamente. In caso di modifiche sostanziali ti avviseremo via e-mail o tramite avviso in app con almeno 15 giorni di preavviso. La versione aggiornata sarà sempre disponibile su questa pagina con la data dell'ultima modifica.</P>
      </Section>

      <Section title="9. Contatti">
        <P>Per qualsiasi domanda relativa alla privacy:</P>
        <P>Email: <a href="mailto:support@getfidelio.app" style={{ color: '#A78BFA' }}>support@getfidelio.app</a><br />
        Sito: <a href="https://www.getfidelio.app" style={{ color: '#A78BFA' }}>www.getfidelio.app</a></P>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#A78BFA' }}>{title}</h2>
      {children}
    </div>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)', margin: '1rem 0 0.4rem' }}>{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', fontSize: '0.9rem', marginBottom: '0.6rem' }}>{children}</p>
}
