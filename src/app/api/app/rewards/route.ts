import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json([], { headers: corsHeaders })

  const customers = await db.customer.findMany({
    where: { email }, include: { shop: true }
  })

  const result = []
  for (const c of customers) {
    const rewards = await db.reward.findMany({
      where: { shopId: c.shopId, active: true }
    })
    for (const r of rewards) {
      result.push({
        id: r.id, title: r.title, description: r.description,
        pointsCost: r.pointsCost, shopName: c.shop.name,
        shopCategory: c.shop.category, customerPoints: c.points,
      })
    }
  }
  return NextResponse.json(result, { headers: corsHeaders })
}
