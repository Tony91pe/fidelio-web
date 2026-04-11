import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
export async function GET() {
const { userId } = await auth()
if (!userId) return NextResponse.json({ insights: [] })
const shop = await db.shop.findFirst({ where: { ownerId: userId } })
if (!shop) return NextResponse.json({ insights: [] })
const ago30 = new Date(Date.now()-30*24*60*60*1000)
const total = await db.customer.count({ where: { shopId: shop.id } })
const active = await db.customer.count({ where: { shopId: shop.id, lastVisitAt: { gte: ago30 } } })
const atRisk = await db.customer.count({ where: { shopId: shop.id, lastVisitAt: { lt: ago30 } } })
const prompt = 'Sei un consulente marketing per negozi italiani. ' +
'Negozio: ' + shop.name + ' categoria: ' + shop.category + '. ' +
'Dati: clienti totali ' + total + ', attivi 30gg ' + active + ', a rischio ' + atRisk + '. ' +
'Dai 3 consigli pratici in italiano. Rispondi SOLO in JSON: ' +
'[{"titolo":"...","descrizione":"...","azione":"..."}]'
try {
const { text } = await generateText({ model: openai('gpt-4o-mini'), prompt, max_tokens: 400 })
const clean = text.replace(/```json|```/g,'').trim()
return NextResponse.json({ insights: JSON.parse(clean) })
} catch {
return NextResponse.json({ insights: [
{ titolo:'Clienti a rischio', descrizione: atRisk + ' clienti non vengono da 30+ giorni.', azione:
'Invia campagna winback' }
]})
}
}
