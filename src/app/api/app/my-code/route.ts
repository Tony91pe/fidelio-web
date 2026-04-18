import { NextResponse } from 'next/server'
import { getCustomerFromRequest, corsHeaders } from '@/lib/customerAuth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(req: Request) {
  const result = await getCustomerFromRequest(req)
  if (result.error) return result.error

  const { customer } = result
  return NextResponse.json(
    { code: customer.code, points: customer.points, totalVisits: customer.totalVisits, name: customer.name },
    { headers: corsHeaders }
  )
}
