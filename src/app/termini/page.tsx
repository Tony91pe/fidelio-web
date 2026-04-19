import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini di Servizio — Fidelio',
  description: 'Termini e condizioni di utilizzo del servizio Fidelio.',
  alternates: { canonical: 'https://www.getfidelio.app/termini' },
}

export default function TerminiPage() {
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '2rem 0 0.5rem' }}>Termini di Servizio</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Aggiornati al 19 aprile 2026</p>

      <Section title="1. Accettazione dei termini">
        <P>Accedendo o utilizzando il servizio Fidelio («Servizio»), disponibile all'indirizzo <strong>getfidelio.app</strong>, dichiari di aver letto, compreso e accettato i presenti Termini di Servizio («Termini»). Se non accetti i Termini, non utilizzare il Servizio.</P>
        <P>Il Servizio è fornito da <strong>Antonio Piersante</strong>, Via R. Rossetti, Pescara (PE), Italia («Fidelio», «noi»). I pagamenti e le fatture sono gestiti da <strong>Paddle.com Market Ltd.</strong> in qualità di Merchant of Record.</P>
      </Section>

      <Section title="2. Descrizione del servizio">
        <P>Fidelio è una piattaforma SaaS (Software as a Service) che consente ai titolari di negozi fisici di gestire programmi fedeltà digitali: raccolta punti, premi, gift card, check-in clienti, QR code, comunicazioni automatizzate e reportistica.</P>
      </Section>

      <Section title="3. Licenza d'uso">
        <P>Fidelio ti concede una licenza limitata, non esclusiva, non trasferibile e revocabile per utilizzare il Servizio esclusivamente per le tue attività commerciali lecite, nel rispetto dei presenti Termini.</P>
        <P>È vietato:</P>
        <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.9', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
          <li>Cedere in sublicenza, rivendere, noleggiare o trasferire l'accesso al Servizio a terzi</li>
          <li>Decompilare, fare reverse engineering o tentare di estrarre il codice sorgente</li>
          <li>Utilizzare il Servizio per attività illegali, fraudolente o lesive di diritti di terzi</li>
          <li>Sovraccaricare intenzionalmente l'infrastruttura (attacchi DoS, scraping massiccio)</li>
        </ul>
      </Section>

      <Section title="4. Account e sicurezza">
        <P>Sei responsabile della riservatezza delle tue credenziali di accesso e di tutte le attività svolte dal tuo account. Notifica immediatamente eventuali accessi non autorizzati a <a href="mailto:support@getfidelio.app" style={{ color: '#A78BFA' }}>support@getfidelio.app</a>.</P>
      </Section>

      <Section title="5. Piani, prezzi e pagamenti">
        <P>Il Servizio è disponibile nei piani <strong>STARTER</strong> (€19/mese), <strong>GROWTH</strong> (€39/mese) e <strong>PRO</strong> (€79/mese), con eventuale periodo di prova gratuita di 14 giorni.</P>
        <P>I pagamenti sono elaborati da <strong>Paddle</strong>, che emette le fatture e gestisce l'IVA per conto di Fidelio. I prezzi includono IVA dove applicabile.</P>
        <P>Gli abbonamenti si rinnovano automaticamente alla scadenza. Puoi disdire in qualsiasi momento dalla dashboard del tuo account o contattando il supporto.</P>
      </Section>

      <Section title="6. Rimborsi e garanzia soddisfatti">
        <P>Offriamo una garanzia <strong>soddisfatti o rimborsati entro 14 giorni</strong> dall'attivazione dell'abbonamento, senza domande. Per richiedere il rimborso scrivi a <a href="mailto:support@getfidelio.app" style={{ color: '#A78BFA' }}>support@getfidelio.app</a>. Per dettagli consulta la nostra <Link href="/rimborsi" style={{ color: '#A78BFA' }}>Refund Policy</Link>.</P>
      </Section>

      <Section title="7. Dati e privacy">
        <P>Il trattamento dei dati personali degli utenti è descritto nella nostra <Link href="/privacy" style={{ color: '#A78BFA' }}>Informativa sulla Privacy</Link>. Per i dati dei clienti finali dei negozi, Fidelio opera come responsabile del trattamento (art. 28 GDPR) ai sensi del Data Processing Agreement disponibile nell'area admin.</P>
      </Section>

      <Section title="8. Proprietà intellettuale">
        <P>Il Servizio, il software, il marchio Fidelio, il logo e tutti i contenuti prodotti da Fidelio sono di proprietà esclusiva di Antonio Piersante e sono protetti dalle leggi italiane e internazionali su copyright, marchi e brevetti.</P>
        <P>I dati inseriti dall'utente (dati del negozio, dati dei clienti) rimangono di proprietà dell'utente. Fidelio non rivendica diritti su tali dati.</P>
      </Section>

      <Section title="9. Disponibilità del servizio">
        <P>Puntiamo a garantire una disponibilità del 99,5%. Potremmo sospendere temporaneamente il Servizio per manutenzione, aggiornamenti o cause di forza maggiore, dandone comunicazione preventiva quando possibile. Non garantiamo l'assenza di interruzioni.</P>
      </Section>

      <Section title="10. Limitazione di responsabilità">
        <P>Nei limiti consentiti dalla legge, Fidelio non è responsabile per danni indiretti, incidentali o conseguenti derivanti dall'uso o dall'impossibilità di utilizzo del Servizio. La responsabilità complessiva di Fidelio è limitata all'importo pagato dall'utente negli ultimi 3 mesi.</P>
        <P>Nulla in questi Termini esclude o limita la nostra responsabilità per morte o lesioni personali causate da negligenza, frode o qualsiasi altra responsabilità che non possa essere esclusa per legge.</P>
      </Section>

      <Section title="11. Indennizzo">
        <P>Accetti di manlevare e tenere indenne Fidelio da qualsiasi pretesa, danno, perdita o spesa (incluse le spese legali ragionevoli) derivante da: (a) tuo uso del Servizio in violazione dei presenti Termini; (b) violazione di diritti di terzi; (c) contenuti o dati che carichi tramite il Servizio.</P>
      </Section>

      <Section title="12. Sospensione e risoluzione">
        <P>Fidelio può sospendere o terminare il tuo account, con o senza preavviso, in caso di violazione dei presenti Termini, comportamento fraudolento o attività che mettano a rischio la sicurezza del Servizio o di altri utenti.</P>
        <P>In caso di risoluzione, esporteremo i tuoi dati su richiesta entro 30 giorni, dopodiché saranno eliminati.</P>
      </Section>

      <Section title="13. Modifiche ai termini">
        <P>Ci riserviamo il diritto di modificare i presenti Termini. In caso di modifiche sostanziali ti avviseremo via e-mail con almeno 30 giorni di preavviso. L'uso continuato del Servizio dopo l'entrata in vigore delle modifiche costituisce accettazione delle stesse.</P>
      </Section>

      <Section title="14. Legge applicabile e foro competente">
        <P>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente in via esclusiva il Tribunale di Pescara, salvo diversa previsione di legge a tutela del consumatore.</P>
      </Section>

      <Section title="15. Servizi di terze parti">
        <P>Il Servizio può contenere link o integrazioni con servizi di terze parti (es. piattaforme social, servizi di pagamento). Fidelio non è responsabile per il contenuto, le politiche o le pratiche di tali servizi.</P>
      </Section>

      <Section title="16. Contatti">
        <P>Per qualsiasi domanda sui presenti Termini:</P>
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

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', fontSize: '0.9rem', marginBottom: '0.6rem' }}>{children}</p>
}
