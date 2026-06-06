import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
})

interface CheckoutSessionBody {
  bookingType: 'room' | 'restaurant' | 'spa' | 'event'
  bookingId: string
  amount: number
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: CheckoutSessionBody = await request.json()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: body.description,
              description: `${body.bookingType} booking for Luxor Alexandria`,
            },
            unit_amount: Math.round(body.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/dashboard?success=true&bookingId=${body.bookingId}`,
      cancel_url: `${request.nextUrl.origin}/dashboard?cancelled=true`,
      customer_email: user.email,
      metadata: {
        bookingId: body.bookingId,
        bookingType: body.bookingType,
        userId: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('[v0] Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
