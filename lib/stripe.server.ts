// lib/stripe.server.ts
import 'server-only'
import Stripe from 'stripe'

// LAZY INITIALIZATION - No Stripe instance at module level
let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    console.log('🔧 Initializing Stripe from stripe.server...')
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  }
  return stripeInstance
}

// For backward compatibility with existing imports
// This proxy will only initialize Stripe when actually used
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const stripe = getStripe()
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.')
    }
    const value = stripe[prop as keyof Stripe]
    return typeof value === 'function' ? value.bind(stripe) : value
  }
})