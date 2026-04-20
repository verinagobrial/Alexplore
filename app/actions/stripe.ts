// app/actions/stripe.ts
'use server'

import { stripe } from '@/lib/stripe.server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(packageId: string, guests: number) {
  try {
    // Validate inputs
    if (!packageId || !guests) {
      throw new Error('Missing required parameters')
    }

    // Fetch package details - you need to implement this based on your data source
    // This is a placeholder - replace with actual database query
    const packageDetails = {
      name: 'Ancient Wonders Tour',
      priceInCents: 44900,
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageDetails.name,
              description: `${guests} guest(s)`,
            },
            unit_amount: packageDetails.priceInCents,
          },
          quantity: guests,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      metadata: {
        packageId,
        guests: guests.toString(),
      },
    })

    if (!session.url) {
      throw new Error('No checkout URL returned from Stripe')
    }

    // Redirect to Stripe checkout
    redirect(session.url)
    
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to create checkout session')
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    // Validate session ID
    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    console.log('Retrieving checkout session:', sessionId)

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details']
    })

    if (!session) {
      throw new Error('Session not found')
    }

    console.log('Session retrieved successfully:', session.id)

    return {
      status: session.status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      metadata: session.metadata,
      lineItems: session.line_items?.data,
      paymentStatus: session.payment_status,
    }
    
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    
    // Provide more detailed error message
    if (error instanceof Error) {
      if (error.message.includes('No such checkout.session')) {
        throw new Error('Invalid session ID. The checkout session does not exist.')
      }
      if (error.message.includes('API key')) {
        throw new Error('Stripe API key configuration error. Please check your environment variables.')
      }
      throw new Error(`Failed to retrieve checkout session: ${error.message}`)
    }
    
    throw new Error('Failed to retrieve checkout session')
  }
}