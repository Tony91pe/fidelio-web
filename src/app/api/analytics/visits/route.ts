import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
export async function GET(req: Request) {
const { searchParams } = new URL(req.url)
const shopId = searchParams.get('shopId')
if (!shopId) return NextResponse.json([])
const days = Array.from({length:7},(_,i) => {
const d = new Date(); d.setDate(d.getDate()-(6-i)); return d
})
const data = await Promise.all(days.map(async day => {
const start = new Date(day); start.setHours(0,0,0,0)
const end = new Date(day); end.setHours(23,59,59,999)
const count = await db.visit.count({ where:{ shopId, createdAt:{gte:start,lte:end} } })
return { day: day.toLocaleDateString('it-IT',{weekday:'short'}), visite: count }
}))
return NextResponse.json(data)
}
