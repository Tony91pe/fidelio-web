'use client'

import Link from 'next/link'

export default function DPAPage() {
  const today = '19 aprile 2026'

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui', maxWidth: 820 }}>
      <Link href="/admin/legal" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.85rem' }}>← Documenti legali</Link>

      <div style={{ marginTop: '1.5rem', marginBottom: '2rem', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
        📋 Documento interno riservato — Art. 28 GDPR — Data Processing Agreement
      </div>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Data Processing Agreement (DPA)</h1>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: '2.5rem' }}>Versione 1.0 — {today} — GDPR art. 28</p>

      <S title="1. Parti">
        <P>Il presente accordo è stipulato tra:</P>
        <ul style={UL}>
          <li><strong style={{ color: 'white' }}>Responsabile del trattamento («Fidelio»):</strong> Antonio Piersante, Via R. Rossetti, Pescara (PE), Italia — <a href="mailto:support@getfidelio.app" style={{ color: '#a78bfa' }}>support@getfidelio.app</a></li>
          <li><strong style={{ color: 'white' }}>Titolare del trattamento («Negozio»):</strong> il soggetto (persona fisica o giuridica) che si registra a Fidelio per gestire il proprio programma fedeltà.</li>
        </ul>
        <P>Fidelio tratta dati personali dei clienti finali del Negozio («Interessati») per conto e su istruzione del Negozio stesso.</P>
      </S>

      <S title="2. Oggetto e finalità del trattamento">
        <P>Fidelio tratta i dati personali degli Interessati esclusivamente per le seguenti finalità, nell'ambito dell'erogazione del Servizio:</P>
        <ul style={UL}>
          <li>Gestione del programma fedeltà (punti, premi, gift card)</li>
          <li>Check-in e identificazione clienti tramite QR code o codice cliente</li>
          <li>Invio di comunicazioni e-mail automatizzate (campagne, compleanno, promemoria)</li>
          <li>Reportistica e analisi delle performance del programma fedeltà</li>
        </ul>
      </S>

      <S title="3. Categorie di dati trattati">
        <ul style={UL}>
          <li>Nome e cognome del cliente finale</li>
          <li>Indirizzo e-mail</li>
          <li>Data di nascita (facoltativa)</li>
          <li>Codice cliente univoco (FID-XXXXXX)</li>
          <li>Saldo punti e storico transazioni</li>
          <li>Preferenze di comunicazione (consenso marketing)</li>
        </ul>
        <P>Non vengono trattate categorie particolari di dati (art. 9 GDPR).</P>
      </S>

      <S title="4. Obblighi di Fidelio (Responsabile)">
        <P>Fidelio si impegna a:</P>
        <ul style={UL}>
          <li>Trattare i dati personali solo su istruzione documentata del Titolare (il Negozio)</li>
          <li>Garantire che le persone autorizzate al trattamento abbiano assunto impegni di riservatezza</li>
          <li>Adottare le misure tecniche e organizzative di sicurezza appropriate (art. 32 GDPR)</li>
          <li>Assistere il Titolare nell'evasione delle richieste di esercizio dei diritti degli Interessati</li>
          <li>Assistere il Titolare negli adempimenti in materia di sicurezza, notifica di violazioni (data breach), DPIA</li>
          <li>Cancellare o restituire tutti i dati personali al termine della prestazione dei servizi</li>
          <li>Mettere a disposizione del Titolare tutte le informazioni necessarie per dimostrare il rispetto degli obblighi</li>
          <li>Non trasferire i dati extra-UE senza garanzie adeguate (Clausole Contrattuali Standard)</li>
        </ul>
      </S>

      <S title="5. Sub-responsabili del trattamento">
        <P>Fidelio autorizza i seguenti sub-responsabili. Il Negozio, accettando i Termini di Servizio, presta autorizzazione generale al ricorso a tali sub-responsabili:</P>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0.75rem' }}>
          <thead>
            <tr>
              <th style={TH}>Fornitore</th>
              <th style={TH}>Servizio</th>
              <th style={TH}>Sede</th>
              <th style={TH}>Garanzia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Neon Inc.', 'Database PostgreSQL', 'USA', 'SCC'],
              ['Vercel Inc.', 'Hosting / CDN', 'USA', 'SCC'],
              ['Resend Inc.', 'Email transazionali', 'USA', 'SCC'],
              ['Clerk Inc.', 'Autenticazione', 'USA', 'SCC'],
              ['Sentry (Functional Software)', 'Error monitoring', 'USA', 'SCC'],
              ['Crisp IM SARL', 'Chat supporto', 'Francia (UE)', 'UE'],
            ].map(([name, svc, loc, guar]) => (
              <tr key={name}>
                <td style={TD}><strong style={{ color: 'white' }}>{name}</strong></td>
                <td style={TD}>{svc}</td>
                <td style={TD}>{loc}</td>
                <td style={TD}>{guar}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <P>SCC = Clausole Contrattuali Standard Commissione Europea (dec. 2021/914). Fidelio notificherà al Negozio eventuali modifiche a questo elenco con almeno 30 giorni di preavviso.</P>
      </S>

      <S title="6. Sicurezza del trattamento (art. 32 GDPR)">
        <P>Fidelio adotta le seguenti misure di sicurezza:</P>
        <ul style={UL}>
          <li>Trasmissione dati cifrata (TLS 1.2+)</li>
          <li>Autenticazione sicura con Clerk (MFA disponibile)</li>
          <li>Separazione logica dei dati per negozio (tenant isolation)</li>
          <li>Backup automatici del database Neon</li>
          <li>Monitoraggio anomalie e incidenti tramite Sentry</li>
          <li>Accesso ai sistemi di produzione limitato al personale autorizzato</li>
        </ul>
      </S>

      <S title="7. Notifica violazioni (Data Breach)">
        <P>In caso di violazione dei dati personali, Fidelio notificherà il Negozio entro <strong>72 ore</strong> dalla scoperta, fornendo tutte le informazioni disponibili per consentire al Negozio di adempiere al proprio obbligo di notifica al Garante (art. 33 GDPR) e, se necessario, agli Interessati (art. 34 GDPR).</P>
      </S>

      <S title="8. Diritti degli interessati">
        <P>Fidelio assiste il Negozio nell'evasione delle richieste degli Interessati (accesso, rettifica, cancellazione, portabilità, opposizione). Il Negozio può esportare o eliminare i dati di qualsiasi cliente dalla propria dashboard in autonomia, oppure richiedere assistenza a <a href="mailto:support@getfidelio.app" style={{ color: '#a78bfa' }}>support@getfidelio.app</a>.</P>
      </S>

      <S title="9. Durata e cancellazione">
        <P>Il presente accordo è valido per tutta la durata del contratto di servizio tra Fidelio e il Negozio. Alla cessazione del contratto, Fidelio:</P>
        <ul style={UL}>
          <li>Mette a disposizione del Negozio un export completo dei dati entro 30 giorni dalla richiesta</li>
          <li>Procede alla cancellazione definitiva dei dati entro 60 giorni dalla cessazione</li>
        </ul>
      </S>

      <S title="10. Legge applicabile">
        <P>Il presente DPA è regolato dalla legge italiana e dal GDPR (Regolamento UE 2016/679). Per qualsiasi controversia sarà competente il Tribunale di Pescara.</P>
      </S>

      <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
        Documento interno — versione 1.0 — {today} — Fidelio (Antonio Piersante)
      </div>
    </div>
  )
}

const UL: React.CSSProperties = { color: 'rgba(255,255,255,0.6)', lineHeight: '1.85', fontSize: '0.88rem', paddingLeft: '1.25rem', marginBottom: '0.5rem' }
const TH: React.CSSProperties = { textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }
const TD: React.CSSProperties = { padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.6rem' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', fontSize: '0.88rem', marginBottom: '0.5rem' }}>{children}</p>
}
