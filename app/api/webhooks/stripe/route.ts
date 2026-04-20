// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendBookingConfirmation } from '@/app/actions/payment'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Get booking details from metadata
    const transactionId = session.metadata?.transactionId
    const packageName = session.metadata?.packageName
    const guests = parseInt(session.metadata?.guests || '1')
    const date = session.metadata?.date
    
    if (transactionId && packageName) {
      // Send confirmation email
      await sendBookingConfirmation({
        transactionId,
        packageName,
        guests,
        date: date || new Date().toISOString(),
        customerName: session.customer_details?.name || '',
        customerEmail: session.customer_details?.email || '',
        customerPhone: session.customer_details?.phone || '',
        amount: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || 'USD',
        paymentMethod: 'stripe',
      })
    }
  }

  return NextResponse.json({ received: true })
}