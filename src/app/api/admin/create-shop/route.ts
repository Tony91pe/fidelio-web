import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { geocodeAddress } from '@/lib/geocode'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { name, category, address, city, phone, ownerEmail, plan, logo } = await req.json()

  if (!name || !category || !address || !city || !ownerEmail) {
    return NextResponse.json({ error: 'Campi obbligatori: nome, categoria, indirizzo, città, email proprietario' }, { status: 400 })
  }

  // Controlla che non esista già un negozio con questa email
  const existing = await db.shop.findFirst({ where: { ownerEmail } })
  if (existing) {
    return NextResponse.json({ error: `Esiste già un negozio con email ${ownerEmail}: "${existing.name}"` }, { status: 400 })
  }

  // Geocodifica automatica
  const coords = await geocodeAddress(address, city)

  const shop = await db.shop.create({
    data: {
      name,
      category,
      address,
      city,
      phone: phone || null,
      logo: logo || null,
      ownerEmail,
      ownerId: `admin-created-${Date.now()}`,
      plan: plan ?? 'STARTER',
      approved: true, // approvato direttamente dall'admin
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    },
  })

  return NextResponse.json({ ok: true, shop })
}
