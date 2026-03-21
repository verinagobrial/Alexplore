// lib/stripe.ts
import 'server-only'
import Stripe from 'stripe'

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY
  
  if (!key) {
    throw new Error(
      '❌ Stripe secret key is missing!\n' +
      'Please add STRIPE_SECRET_KEY to your .env.local file\n' +
      'You can find your key at: https://dashboard.stripe.com/test/apikeys'
    )
  }
  
  // Validate key format (starts with sk_test_ or sk_live_)
  if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
    throw new Error(
      '❌ Invalid Stripe secret key format!\n' +
      'Key should start with "sk_test_" (test mode) or "sk_live_" (live mode)'
    )
  }
  
  return key
}

export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})
