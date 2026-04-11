import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
export async function sendWelcomeEmail(to:string, customerName:string, shopName:string, points:number) {
await resend.emails.send({
from: 'Fidelio <noreply@resend.dev>',
to,
subject: 'Benvenuto in ' + shopName + '! Hai ' + points + ' punti',
html: '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">' +
'<div style="background:#6C3DF4;padding:2rem;text-align:center;border-radius:12px 12px 0 0">' +
'<h1 style="color:white;margin:0">' + shopName + '</h1></div>' +
'<div style="background:white;padding:2rem;border-radius:0 0 12px 12px">' +
'<h2>Benvenuto, ' + customerName + '!</h2>' +
'<p>Grazie per esserti registrato. Hai ricevuto <strong>' + points + ' punti</strong> di benvenuto
!</p>' +
'<p>Torna presto per accumulare altri punti e sbloccare premi esclusivi.</p>' +
'</div></div>',
})
}
export async function sendWinbackEmail(to:string, customerName:string, shopName:string, points:number, d
ays:number) {
await resend.emails.send({
from: 'Fidelio <noreply@resend.dev>',
to,
subject: 'Ci manchi! Hai ancora ' + points + ' punti da usare',
html: '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">' +
'<div style="background:#FF6B35;padding:2rem;text-align:center;border-radius:12px 12px 0 0">' +
'<h1 style="color:white;margin:0">Ti manca ' + shopName + '?</h1></div>' +
'<div style="background:white;padding:2rem;border-radius:0 0 12px 12px">' +
'<h2>Ciao ' + customerName + '!</h2>' +
'<p>Sono passati ' + days + ' giorni dalla tua ultima visita. Hai ancora <strong>' + points + ' pu
nti</strong>!</p>' +
'</div></div>',
})
}
