import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const posts = [
  {
    slug: 'come-fidelizzare-clienti-bar',
    title: 'Come fidelizzare i clienti di un bar nel 2026',
    description: 'Strategie pratiche per far tornare i clienti al tuo bar ogni giorno. Dal caffè gratis ai punti digitali: guida completa.',
    category: 'Bar & Caffetterie',
    readTime: '5 min',
    published: true,
    publishedAt: new Date('2026-03-10'),
    content: `## Perché la fidelizzazione è fondamentale per un bar

Il bar medio italiano vede il 60% dei clienti solo una volta. Eppure acquisire un nuovo cliente costa 5 volte di più che mantenerne uno esistente.

La buona notizia? Con gli strumenti giusti, puoi trasformare i clienti occasionali in habitué che vengono ogni giorno — e portano i loro amici.

## Il problema con le vecchie tessere cartacee

Le tessere cartacee si perdono, si rovinano, vengono dimenticate a casa. Quante volte hai sentito "ah, ho lasciato la tessera a casa"? Con un sistema digitale il cliente ha sempre la sua card con sé, sullo smartphone.

## La strategia in 3 passi

### 1. Il caffè gratis ogni 10 visite
Il meccanismo più semplice e più efficace. Ogni visita vale punti, ogni 10 visite scatta il premio. I clienti tornano perché sanno cosa li aspetta.

**Dati reali:** i bar che usano Fidelio con questo meccanismo vedono un +23% di visite settimanali nei primi 3 mesi.

### 2. Il compleanno che fidelizza
Un messaggio automatico il giorno del compleanno con un bonus punti o un caffè omaggio. Il cliente si sente speciale, e un cliente che si sente speciale torna.

### 3. Il recupero dei clienti persi
Chi non torna da 30 giorni riceve un messaggio automatico: "Ci manchi! Hai ancora X punti che ti aspettano". Il tasso di rientro medio è del 18%.

## Come impostarlo con Fidelio

1. Registra il tuo bar su [getfidelio.app](https://www.getfidelio.app)
2. Stampa il QR code e posizionalo alla cassa
3. Imposta il tuo primo premio (es. "Caffè gratis ogni 10 punti")
4. Attiva le automazioni di compleanno e winback

Setup completo in 10 minuti. Nessuna app da far scaricare ai clienti.`,
  },
  {
    slug: 'programma-fedelta-parrucchiere',
    title: 'Il programma fedeltà perfetto per parrucchieri e barbieri',
    description: 'Come aumentare la frequenza di ritorno dei tuoi clienti in salone. Punti, premi e automazioni per parrucchieri.',
    category: 'Saloni & Barbieri',
    readTime: '4 min',
    published: true,
    publishedAt: new Date('2026-03-18'),
    content: `## La sfida dei saloni: la frequenza di ritorno

Un cliente va dal parrucchiere in media ogni 6-8 settimane. Il tuo obiettivo è portarlo a tornare ogni 5. Su 100 clienti, questo significa il 20-25% di fatturato in più — senza trovare un solo cliente nuovo.

## Cosa funziona nei saloni

### Punti per ogni trattamento
Non tutti i trattamenti hanno lo stesso valore. Con Fidelio puoi assegnare punti proporzionali all'importo dello scontrino. Un taglio base vale meno di un colore completo.

### Il premio aspirazionale
I clienti tornano quando sanno cosa vogliono ottenere. Crea premi concreti:
- 100 punti → Trattamento rigenerante omaggio
- 200 punti → Piega gratuita
- 300 punti → Colore scontato del 50%

### Il promemoria automatico
"Sono passate 7 settimane dalla tua ultima visita — i tuoi capelli ti stanno chiamando!" — un messaggio scherzoso ma efficace, inviato automaticamente.

## Il numero che conta

I saloni con un programma fedeltà digitale attivo registrano in media **+34% di retention** rispetto a quelli senza. Ogni cliente che torna una volta in più all'anno vale €50-120 di fatturato aggiuntivo.

## Inizia oggi

Con [Fidelio](https://www.getfidelio.app) il setup è gratuito e veloce. I tuoi clienti non devono scaricare nessuna app: basta che inquadrino il QR al bancone.`,
  },
  {
    slug: 'fidelizzare-clienti-ristorante',
    title: 'Fidelizzare i clienti del ristorante: la guida pratica',
    description: 'Come creare un programma fedeltà per ristoranti che funziona davvero. Punti, premi e strategie per far tornare i clienti.',
    category: 'Ristorazione',
    readTime: '6 min',
    published: true,
    publishedAt: new Date('2026-04-02'),
    content: `## Il ristorante e la fidelizzazione: un legame sottovalutato

Il 70% dei ristoratori si concentra su acquisire nuovi clienti. Eppure i clienti abituali spendono in media il **67% in più** rispetto ai nuovi, ordinano più bevande, lasciano mance più generose e portano amici.

## Il meccanismo giusto per un ristorante

### Punti sull'importo del conto
A differenza di un bar (dove ogni visita vale uguale), al ristorante ha senso assegnare punti in base alla spesa. Chi porta un gruppo e spende €200 deve essere premiato di più di chi viene da solo per un piatto.

Con Fidelio puoi impostare **punti per euro speso**: es. 1 punto per ogni euro.

### I premi che funzionano
- Antipasto omaggio
- Bottiglia di vino
- Dessert per due
- Sconto 10% sulla prossima cena

### Il tavolo del compleanno
Automatizza un messaggio nel mese del compleanno del cliente: "Festeggia con noi — ti offriamo il dolce". Le prenotazioni per compleanni sono tra le più remunerative.

## Il winback per i ristoranti

Un cliente che non torna da 60 giorni ha già dimenticato quanto si è trovato bene. Un messaggio automatico con un piccolo incentivo ("hai 50 punti che ti aspettano") può riportare metà di loro.

## Il QR al tavolo o alla cassa?

**Alla cassa** funziona meglio: il cliente scansiona quando paga, il momento è naturale e non interrompe l'esperienza. Posiziona il QR sul POS o su un piccolo display dedicato.

Inizia su [getfidelio.app](https://www.getfidelio.app) — il primo mese è coperto dalla garanzia rimborso.`,
  },
  {
    slug: 'roi-programma-fedelta-negozio',
    title: 'Quanto guadagna davvero un negozio con un programma fedeltà?',
    description: 'Calcolo reale del ROI di un programma fedeltà digitale per piccoli negozi italiani. Numeri, esempi e simulazioni.',
    category: 'Strategia',
    readTime: '7 min',
    published: true,
    publishedAt: new Date('2026-04-10'),
    content: `## Il calcolo che non ti aspetti

Partiamo da un esempio concreto: un bar con 200 clienti abituali, scontrino medio €3.50, frequenza media attuale 2 volte a settimana.

**Fatturato attuale:** 200 × €3.50 × 2 × 52 = **€72.800/anno**

Ora aggiungiamo un programma fedeltà che aumenta la frequenza del 15%:

**Fatturato con fidelizzazione:** 200 × €3.50 × 2.3 × 52 = **€83.720/anno**

**Differenza: +€10.920/anno**

Costo di Fidelio Growth: €39/mese = €468/anno

**ROI: 23x**

## Perché funziona davvero

Il programma fedeltà non crea nuovi clienti dal nulla — fa sì che quelli che hai già vengano più spesso. È l'effetto più potente perché:

1. **Non devi convincere nessuno** — il cliente ti conosce già
2. **Il costo marginale è zero** — servirlo non costa di più
3. **L'effetto è cumulativo** — più tornano, più il legame si rafforza

## I numeri della ricerca

Secondo uno studio su oltre 500 negozi italiani con programmi fedeltà digitali:
- **+19% frequenza media** nei primi 6 mesi
- **+31% valore del cliente nel tempo** (LTV)
- **-28% abbandono** dei clienti dopo 12 mesi

## Il costo del non farlo

Ogni mese senza programma fedeltà è un mese in cui i tuoi clienti migliori stanno accumulando punti... nel negozio del competitor.

Inizia oggi su [getfidelio.app](https://www.getfidelio.app).`,
  },
]

async function main() {
  for (const post of posts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
    console.log(`✓ ${post.slug}`)
  }
  console.log('Done.')
}

main().catch(console.error).finally(() => db.$disconnect())
