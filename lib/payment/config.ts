// lib/payment/config.ts
export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  type: 'local' | 'international'
  currency: 'EGP' | 'USD'
  processingFee?: number
  processingTime: string
  minAmount?: number
  maxAmount?: number
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  // Egyptian Payment Methods (EGP)
  {
    id: 'instapay',
    name: 'InstaPay',
    description: 'Instant bank transfer - Egyptian banks only',
    icon: '/icons/instapay.svg',
    type: 'local',
    currency: 'EGP',
    processingFee: 0,
    processingTime: 'Instant',
    minAmount: 10,
    maxAmount: 100000,
  },
  {
    id: 'vodafone_cash',
    name: 'Vodafone Cash',
    description: 'Mobile wallet - Egyptian customers',
    icon: '/icons/vodafone-cash.svg',
    type: 'local',
    currency: 'EGP',
    processingFee: 0.01,
    processingTime: 'Instant',
  },
  {
    id: 'stripe_card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, American Express - International',
    icon: '/icons/credit-card.svg',
    type: 'international',
    currency: 'USD',
    processingFee: 0.029,
    processingTime: 'Instant',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'PayPal account - International',
    icon: '/icons/paypal.svg',
    type: 'international',
    currency: 'USD',
    processingFee: 0.034,
    processingTime: 'Instant',
  },
]

export interface BookingDetails {
  sessionId: string
  packageName: string
  date: Date
  time: string
  guests: number
  pricePerSpot: number
  currency: string
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  country?: string
}