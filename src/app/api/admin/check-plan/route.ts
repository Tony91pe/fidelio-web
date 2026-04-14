import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkPlan } from '@/lib/checkPlan'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { feature } = body

  const { shop, error } = await checkPlan(feature)
  if (error) return error

  return NextResponse.json({ 
    hasFeature: true,
    plan: shop.plan,
    planExpiresAt: shop.planExpiresAt 
  })
}
