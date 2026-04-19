import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

const posts = [
  {
    title: 'Come aumentare la fidelizzazione dei clienti nel tuo bar',
    description: 'Strategie concrete e strumenti digitali per trasformare i clienti occasionali del tuo bar in abituali. Dal caffè del mattino al programma punti.',
    category: 'Strategie',
    readTime: '6 min',
    content: `# Come aumentare la fidelizzazione dei clienti nel tuo bar

La fidelizzazione dei clienti è la sfida numero uno per ogni titolare di bar. Un cliente che torna ogni giorno vale molto di più di dieci clienti che passano una volta sola.

## Perché i clienti non tornano?

Prima di parlare di soluzioni, è importante capire il problema. I clienti abbandonano un bar per tre motivi principali:

- **Non si sentono riconosciuti**: vanno al bar, pagano, escono. Nessuna connessione.
- **Non hanno un motivo extra per tornare**: il caffè lo fanno bene anche dall'altra parte della strada.
- **Si dimenticano di te**: la vita è frenetica, e senza uno stimolo cambiano abitudini.

## La soluzione: un programma punti digitale

Il sistema più efficace che i bar moderni stanno adottando è il programma punti digitale. Funziona così:

1. Il cliente si registra scansionando un QR code alla cassa
2. Ad ogni consumazione accumula punti
3. Quando raggiunge una soglia, riceve un premio (un caffè gratis, una colazione, uno sconto)

Il risultato? I clienti hanno un motivo concreto per tornare da te invece che dal concorrente.

## Quanto aumentano le visite?

I negozi che usano programmi fedeltà digitali registrano mediamente:

- +25% di visite nei primi 3 mesi
- +40% di valore medio dello scontrino nei clienti fidelizzati
- Riduzione del 60% del tasso di abbandono

## Come implementarlo senza complicazioni

Non serve un gestionale costoso o un'app da far scaricare. Con strumenti come Fidelio basta:

1. Stampare un QR code da tenere in cassa
2. Il cliente lo scansiona con la fotocamera del telefono (nessuna app)
3. Tu vedi tutto dalla dashboard: quanti clienti hai, chi torna, chi non torna

## L'email automatica che fa la differenza

Uno dei trucchi più potenti è il messaggio di rientro automatico: quando un cliente non viene da 30 giorni, gli arriva un'email con un'offerta personalizzata. Questa singola automazione può recuperare dal 10% al 20% dei clienti persi.

## Conclusione

Fidelizzare i clienti del bar non richiede grandi investimenti. Richiede un sistema semplice, costante e che lavori per te anche quando sei impegnato a fare caffè. Un programma punti digitale è il punto di partenza più efficace che puoi fare oggi.`,
  },
  {
    title: 'QR code per negozi: guida pratica per iniziare subito',
    description: 'Come usare il QR code per fidelizzare i clienti del tuo negozio. Dalla stampa alla prima scansione: tutto quello che devi sapere.',
    category: 'Guide',
    readTime: '5 min',
    content: `# QR code per negozi: guida pratica per iniziare subito

Il QR code è diventato il modo più semplice per connettere il mondo fisico del tuo negozio con il digitale. Non serve nessuna app, nessun lettore speciale: basta lo smartphone che i tuoi clienti hanno già in tasca.

## Cos'è un QR code per la fidelizzazione?

È un'immagine quadrata che, una volta scansionata dalla fotocamera dello smartphone, apre automaticamente una pagina web. Nel contesto di un programma fedeltà, porta il cliente a una pagina dove può:

- Registrarsi al tuo programma punti
- Vedere il suo saldo punti
- Scoprire i premi disponibili

## Dove posizionare il QR code

La posizione è fondamentale. I posti migliori sono:

- In cassa: dove il cliente è già fermo ad aspettare. Massima visibilità.
- Sul bancone: per i bar, vicino alla macchinetta del caffè
- Sul tavolo: per ristoranti e pizzerie
- In vetrina: per intercettare i clienti prima che entrino
- Sullo scontrino: stampa il QR direttamente sulla ricevuta

## QR statico vs QR dinamico: qual è la differenza?

Il QR statico punta sempre allo stesso link. Se vuoi cambiare qualcosa, devi ristampare tutto.

Il QR dinamico invece punta a un link intermedio che puoi modificare quando vuoi. Cambi orari, premi, informazioni senza toccare il cartello stampato.

Per un negozio che vuole essere flessibile, il QR dinamico è la scelta giusta.

## Come convincere i clienti a scansionarlo

Il QR da solo non basta. Ecco alcune frasi che funzionano:

"Scansiona il codice, accumuli punti ad ogni visita e guadagni un caffè gratis ogni 10 visite"

La chiarezza sul beneficio immediato è tutto.

## Quante scansioni aspettarsi?

Nei primi giorni aspettati poche scansioni. La curva di adozione è graduale:

- Settimana 1: 5-10% dei clienti scansiona
- Mese 1: 20-30% con il passaparola
- Mese 3: 40-60% se ricordi verbalmente ai clienti

Il promemoria verbale ("Hai già il nostro programma punti?") raddoppia il tasso di adozione.

## Conclusione

Implementare un QR code per il tuo negozio richiede meno di 10 minuti. L'unica cosa che ti serve è uno strumento come Fidelio che ti genera il QR, gestisce i punti e ti dà una dashboard per vedere i risultati.`,
  },
  {
    title: 'Programma fedeltà digitale: perché è meglio della tessera cartacea',
    description: 'Confronto tra il classico programma fedeltà con tessera e il moderno sistema digitale. Costi, vantaggi e perché i negozi stanno passando al digitale.',
    category: 'Strategie',
    readTime: '7 min',
    content: `# Programma fedeltà digitale: perché è meglio della tessera cartacea

Per anni la tessera cartacea con i timbri è stata lo strumento di fidelizzazione dei negozi di prossimità. Ma il mondo è cambiato, e il digitale offre qualcosa che la carta non potrà mai dare.

## Il problema della tessera cartacea

La tessera fisica sembra semplice, ma nasconde problemi reali:

- Il cliente la dimentica a casa: quante volte hai sentito "oh, non ce l'ho"?
- Si perde: e con lei tutti i timbri accumulati
- Non ti dà dati: non sai chi sono i tuoi clienti, quando vengono, cosa comprano
- Facilmente falsificabile: qualcuno timbra da solo
- Non permette automazioni: non puoi inviare un messaggio a chi non viene da un mese

## I vantaggi del digitale

Con un programma fedeltà digitale come Fidelio:

### Zero oggetti fisici da gestire
Il cliente usa il suo smartphone. Non dimentica niente perché il suo profilo è sempre nel telefono.

### Dati reali sui tuoi clienti
Sai esattamente quanti clienti attivi hai, chi viene di più, chi ha smesso di venire. Questi dati valgono oro.

### Comunicazione automatica
Il sistema invia automaticamente:
- Email di benvenuto al nuovo cliente
- Auguri di compleanno con un'offerta speciale
- Messaggio di rientro dopo 30 giorni di assenza
- Notifica quando il premio è vicino

### Antifrode integrato
Ogni cliente ha un codice univoco. Non si può copiare, falsificare o usare due volte.

### Costi più bassi
Niente tessere da stampare, niente timbri da comprare. L'abbonamento mensile si ripaga con poche visite extra al mese.

## Il passaggio dal cartaceo al digitale

Se hai già clienti abituali con tessera cartacea, non devi buttare via niente. Puoi:

1. Annunciare il passaggio al nuovo sistema
2. Offrire un bonus di benvenuto digitale equivalente ai timbri già accumulati
3. Tenere entrambi per 1 mese di transizione

## Conclusione

La tessera cartacea ha fatto il suo tempo. Il programma fedeltà digitale costa meno, funziona meglio e ti dà dati preziosi che la carta non ti darà mai. Il momento di cambiare è adesso.`,
  },
  {
    title: 'Email marketing per negozi locali: 5 automazioni che fanno tornare i clienti',
    description: "Come usare le email automatiche per fidelizzare i clienti del tuo negozio senza mandare spam. Le 5 automazioni che ogni negozio dovrebbe avere attive.",
    category: 'Marketing',
    readTime: '8 min',
    content: `# Email marketing per negozi locali: 5 automazioni che fanno tornare i clienti

L'email marketing non è solo per le grandi aziende. Anche un piccolo negozio di quartiere può usare le email automatiche per fidelizzare i clienti — e i risultati possono essere sorprendenti.

## Automazione 1: Email di benvenuto

Si attiva subito dopo la prima visita o registrazione del cliente.

Deve contenere:
- Un benvenuto caldo con il nome del negozio
- Quanti punti ha ricevuto per la prima visita
- Come funziona il programma fedeltà
- Il premio che lo aspetta

Perché funziona: il cliente è al massimo dell'entusiasmo subito dopo la prima esperienza positiva. Un'email immediata rafforza il ricordo e aumenta la probabilità di seconda visita del 35%.

## Automazione 2: Notifica punti accumulati

Si attiva ogni volta che il cliente accumula punti.

Deve contenere:
- I punti guadagnati nell'ultima visita
- Il saldo totale aggiornato
- Quanto manca al prossimo premio

Perché funziona: mantiene il cliente aggiornato sul suo "progresso". Come i giochi con i livelli: la barra che si riempie spinge a continuare.

## Automazione 3: Email di compleanno

Si attiva il giorno del compleanno del cliente.

Deve contenere:
- Auguri personalizzati con il nome
- Un regalo speciale (punti doppi, uno sconto, un omaggio)
- Call to action per venire a ritirarlo

Perché funziona: le email di compleanno hanno un tasso di apertura del 45% contro il 20% medio. I clienti si sentono valorizzati.

## Automazione 4: Messaggio di rientro (win-back)

Si attiva quando un cliente non viene da 30 giorni.

Deve contenere:
- Un tono personale ("Ci manchi!")
- Un incentivo per tornare (punti bonus, offerta speciale)
- Un senso di urgenza ("Valido fino a domenica")

Perché funziona: recupera mediamente il 15-20% dei clienti che stavano per perdersi definitivamente.

## Automazione 5: Premio pronto

Si attiva quando il cliente raggiunge la soglia per riscattare il premio.

Deve contenere:
- La notifica che il premio è disponibile
- Come riscattarlo in cassa
- Una scadenza per creare urgenza

Perché funziona: molti clienti accumulano punti ma si dimenticano di riscattare il premio. Questa email li fa tornare.

## Come impostare queste automazioni

Con strumenti come Fidelio, queste automazioni si attivano in pochi click dalla dashboard. Non serve un tecnico, non serve conoscere il codice. Si imposta una volta e funzionano da sole.

## Conclusione

Cinque automazioni, zero lavoro manuale, risultati misurabili. L'email marketing per negozi locali non è complicato: è solo una questione di avere lo strumento giusto.`,
  },
  {
    title: 'Come trattenere i clienti: il metodo che usano i negozi di successo',
    description: "Perché la retention vale più dell'acquisizione, e come i negozi italiani di maggior successo costruiscono una base di clienti fedeli che torna mese dopo mese.",
    category: 'Strategie',
    readTime: '6 min',
    content: `# Come trattenere i clienti: il metodo che usano i negozi di successo

Acquisire un nuovo cliente costa da 5 a 7 volte di più che mantenerne uno esistente. Eppure la maggior parte dei negozi investe tutto su volantini, social media e pubblicità per attirare gente nuova, dimenticandosi di chi è già entrato.

Il metodo dei negozi di successo è esattamente il contrario: prima fidelizza chi hai già, poi pensa a chi non conosci ancora.

## Il valore di un cliente fedele

Facciamo un calcolo semplice. Un cliente abituale che viene nel tuo negozio 2 volte a settimana, spende 15 euro a visita, per 50 settimane l'anno vale 1.500 euro all'anno. Moltiplicato per 10 anni di fedeltà: 15.000 euro da una sola persona.

Ora immagina di averne 50 così. La matematica parla chiaro.

## Il problema della memoria

Il principale motivo per cui i clienti smettono di venire non è la qualità del prodotto o il prezzo. È semplicemente che si dimenticano. La vita è piena di distrazioni, e senza uno stimolo, le abitudini cambiano.

Il negozio che li ricorda — con un messaggio, un'offerta, una notifica — è quello dove tornano.

## Il metodo in 3 fasi

### Fase 1: Cattura il contatto al primo passaggio

Il momento più prezioso è la prima visita. Il cliente è curioso, positivo, aperto. Se in quel momento lo iscrivi a un programma fedeltà e raccogli la sua email, hai creato un canale di comunicazione permanente.

Come fare: QR code in cassa con iscrizione in 30 secondi.

### Fase 2: Costruisci l'abitudine con i premi

L'abitudine si crea attraverso la ripetizione premiata. Un programma punti funziona esattamente così: ogni visita dà una piccola soddisfazione (i punti) e la prospettiva di una soddisfazione più grande (il premio).

Il primo premio deve essere raggiungibile in fretta: non 500 punti, ma 10 visite. Il cliente deve toccare con mano il risultato prima possibile.

### Fase 3: Recupera i distratti in automatico

Un'email automatica dopo 30 giorni di assenza con un piccolo incentivo recupera una percentuale significativa di clienti che altrimenti sarebbero persi.

## Gli errori da evitare

- Premio irraggiungibile: se richiede 200 visite, il cliente si demoralizza dopo 10
- Nessuna comunicazione: iscrivere i clienti e non mandar mai niente
- Premi poco attraenti: uno sconto del 5% non entusiasma nessuno. Un caffè gratis sì.
- Dimenticare i migliori: i clienti top meritano riconoscimento speciale

## Conclusione

Trattenere i clienti non è magia. È un sistema: cattura il contatto, costruisci l'abitudine con i premi, recupera i distratti in automatico. Ogni negozio di successo che conosci ha qualcosa di simile.`,
  },
  {
    title: "Gift card digitale per negozi: cos'è e come aumenta le vendite",
    description: "La gift card digitale è il regalo perfetto per i clienti che non sanno cosa scegliere. Come funziona, perché aumenta lo scontrino medio e come implementarla.",
    category: 'Funzionalità',
    readTime: '5 min',
    content: `# Gift card digitale per negozi: cos'è e come aumenta le vendite

Le gift card non sono solo un'invenzione dei grandi centri commerciali. Anche il negozio di quartiere, la parrucchiera di fiducia o il bar sotto casa possono offrire gift card digitali ai propri clienti.

## Cos'è una gift card digitale?

È un buono acquisto in formato digitale. Il cliente la acquista (per sé o come regalo) e riceve un codice univoco che può usare in negozio. Nessun pezzo di carta, nessuna card fisica da gestire.

Il processo è semplice:
1. Il cliente acquista la gift card
2. Riceve un codice via email
3. Quando viene in negozio, mostra il codice al banco
4. Tu lo scansioni e scala il valore

## Perché le gift card aumentano le vendite?

Ci sono tre meccanismi che le rendono efficaci:

### Il "regalo impossibile" diventa possibile
Quante volte un cliente ti ha detto "non so cosa regalare"? La gift card è la risposta perfetta. E il destinatario del regalo diventa un nuovo cliente.

### Lo scontrino medio sale
Chi ha una gift card da 30 euro tende a spendere di più. Il meccanismo psicologico è quello del "già pagato": si sente libero di aggiungere qualcosa.

### Liquidità anticipata
Quando un cliente acquista una gift card da 50 euro, tu ricevi quei soldi subito — anche se il servizio verrà erogato tra un mese.

## Chi usa le gift card?

Le gift card funzionano particolarmente bene per:

- Parrucchieri e centri estetici: il regalo di bellezza è sempre gradito
- Ristoranti e bar: per regali aziendali o tra amici
- Negozi di abbigliamento: il cliente sceglie da solo
- Palestre e centri sportivi: abbonamenti come regalo
- Negozi specializzati: libri, vinili, articoli sportivi

## Come implementarla con Fidelio

Con il piano GROWTH di Fidelio puoi creare e gestire gift card digitali direttamente dalla dashboard. Imposti il valore, il sistema genera un codice univoco, e in cassa lo scansioni per validarlo.

## Conclusione

Le gift card digitali si implementano una volta e funzionano da sole. Nuovi clienti, scontrino medio più alto, liquidità anticipata. Se non le hai ancora, è il momento giusto per iniziare.`,
  },
  {
    title: 'Fidelizzazione clienti ristorante: strategie pratiche per il 2025',
    description: 'Come i ristoranti italiani stanno usando i programmi fedeltà digitali per aumentare le prenotazioni abituali e ridurre la dipendenza dalle piattaforme di delivery.',
    category: 'Strategie',
    readTime: '7 min',
    content: `# Fidelizzazione clienti ristorante: strategie pratiche per il 2025

Il ristorante è uno dei settori dove la fidelizzazione fa la differenza più grande. Un cliente abituale prenota, conosce il menu, porta amici, lascia recensioni positive. Vale dieci volte un turista che entra per caso.

## Il problema delle piattaforme di delivery

Deliveroo, Just Eat e simili portano ordini, ma creano una dipendenza pericolosa: il cliente ordina dal tuo ristorante ma attraverso la piattaforma. Tu non hai il suo contatto. Non sai chi è. Non puoi comunicargli direttamente.

La piattaforma tiene il cliente. Tu cuoci.

La soluzione è costruire un rapporto diretto con i clienti che vengono in sala.

## Strategia 1: Il programma punti per le visite in sala

Per ogni visita in sala, il cliente accumula punti. Dopo 10 pranzi o cene, riceve un dessert omaggio, uno sconto, o una bottiglia di vino.

Funziona perché crea un'asimmetria con il delivery: i punti si accumulano solo venendo di persona. Stai premiando il comportamento che vuoi incentivare.

## Strategia 2: La prenotazione come touchpoint

Quando il cliente prenota, hai il suo contatto. Usalo bene:

- Conferma immediata con il link al programma fedeltà
- Promemoria il giorno prima con un dettaglio del menu del giorno
- Follow-up il giorno dopo: "Come è stata la serata? Lasciaci una recensione"

## Strategia 3: Il compleanno come occasione

Il ristorante è il posto dove le persone festeggiano. Se sai quando compie gli anni un cliente abituale, mandagli gli auguri 10 giorni prima con un'offerta speciale.

Questa attenzione si trasforma quasi sempre in una prenotazione. E non viene solo: porta amici.

## Strategia 4: Segmentare i clienti

Con un sistema digitale puoi distinguere:

- I top client: vengono più di una volta a settimana
- I regolari: una o due volte al mese
- Gli occasionali: qualche volta l'anno
- I dormienti: non vengono da più di 60 giorni

Ogni segmento merita una comunicazione diversa. I top client vanno coccolati. I dormienti vanno "svegliati" con un'offerta irresistibile.

## Il risultato atteso

Ristoranti che hanno implementato un programma fedeltà digitale riportano:

- +20% di visite mensili dai clienti già registrati
- +15% di prenotazioni dirette (meno dipendenza dalle piattaforme)
- Riduzione del 30% dei clienti persi nei periodi di bassa stagione

## Conclusione

La fidelizzazione nel ristorante non si costruisce solo con un buon piatto. Si costruisce con la costanza, la comunicazione e la memoria. Un sistema digitale automatizza la memoria per te, così puoi concentrarti su quello che sai fare meglio: cucinare.`,
  },
]

async function main() {
  console.log('Inserimento articoli blog...')
  for (const post of posts) {
    const slug = toSlug(post.title)
    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      console.log(`  SKIP (esiste già): ${post.title}`)
      continue
    }
    await db.blogPost.create({
      data: { slug, ...post, published: true, publishedAt: new Date() },
    })
    console.log(`  ✓ Pubblicato: ${post.title}`)
  }
  console.log('Fatto!')
}

main().catch(console.error).finally(() => db.$disconnect())
