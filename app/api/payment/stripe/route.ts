// app/api/payment/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Stripe API - POST request received')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { packageId, guests, packageName, priceInCents, customerEmail } = body
    
    // Validate
    if (!packageId || !guests || !packageName || !priceInCents || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageName,
              description: `${guests} guest(s)`,
            },
            unit_amount: priceInCents,
          },
          quantity: guests,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&payment_method=stripe`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      customer_email: customerEmail,
      metadata: {
        packageId,
        guests: guests.toString(),
        packageName,
      },
    })
    
    console.log('✅ Stripe session created:', session.id)
    
    return NextResponse.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id
    })
    
  } catch (error) {
    console.error('❌ Stripe API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create Stripe session'
      },
      { status: 500 }
    )
  }
}