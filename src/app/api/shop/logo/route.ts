import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'
import { getShopFromRequest, corsHeaders } from '@/lib/shopAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const result = await getShopFromRequest(req)
  if (result.error) return result.error

  const { shop } = result

  const formData = await req.formData()
  const file = formData.get('logo') as File | null

  if (!file || !file.size) {
    return NextResponse.json({ error: 'Nessun file caricato' }, { status: 400, headers: corsHeaders })
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const blob = await put(`logos/${shop.id}.${ext}`, file, {
    access: 'public',
    contentType: file.type,
  })

  await db.shop.update({
    where: { id: shop.id },
    data: { logo: blob.url },
  })

  return NextResponse.json({ logo: blob.url }, { headers: corsHeaders })
}
