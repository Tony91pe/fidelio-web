import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { giftPlan } from '@/lib/giftPlan'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId, plan, months } = body

  if (!shopId || !plan || !months) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['STARTER', 'GROWTH', 'PRO'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  if (months < 1 || months > 60) {
    return NextResponse.json({ error: 'Months must be between 1 and 60' }, { status: 400 })
  }

  try {
    const result = await giftPlan(shopId, plan, months, userId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
