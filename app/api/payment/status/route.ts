// app/api/payment/status/route.ts
import { NextRequest, NextResponse } from 'next/server'

// In-memory payment storage (use database in production)
const payments = new Map()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ref = searchParams.get('ref')
  
  if (!ref) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
  }
  
  const payment = payments.get(ref)
  
  // For demo, simulate payment confirmation after 10 seconds
  // In production, you would check with your payment provider
  if (!payment) {
    return NextResponse.json({ status: 'pending' })
  }
  
  return NextResponse.json({ status: payment.status, payment })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { reference, status } = body
  
  payments.set(reference, { ...payments.get(reference), status })
  
  return NextResponse.json({ success: true })
}