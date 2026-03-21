'use server'

import { stripe } from '@/lib/stripe'
import { getPackageById } from '@/lib/products'

export async function createCheckoutSession(packageId: string, guests: number = 1) {
  const travelPackage = getPackageById(packageId)

  if (!travelPackage) {
    throw new Error('Package not found')
  }

  const totalPrice = travelPackage.priceInCents * guests

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: travelPackage.name,
            description: `${travelPackage.duration} - ${guests} guest${guests > 1 ? 's' : ''}`,
          },
          unit_amount: travelPackage.priceInCents,
        },
        quantity: guests,
      },
    ],
    mode: 'payment',
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      packageId: travelPackage.id,
      packageName: travelPackage.name,
      guests: guests.toString(),
    },
  })

  return { clientSecret: session.client_secret }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
    metadata: session.metadata,
  }
}
