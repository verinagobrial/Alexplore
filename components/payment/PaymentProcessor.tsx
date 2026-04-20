// components/payment/PaymentProcessor.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, Smartphone, Building, ArrowLeft, AlertCircle } from 'lucide-react'
import { createStripePayment } from '@/app/actions/payment'
import { EgyptianPayment } from './EgyptianPayment'

interface PaymentProcessorProps {
  amount: number
  currency: 'EGP' | 'USD'
  packageName: string
  guests: number
  date: string
  time: string
  customerDetails: {
    name: string
    email: string
    phone: string
  }
  onSuccess: (transactionId: string) => void
  onBack: () => void
}

type PaymentMethod = 'instapay' | 'vodafone_cash' | 'stripe' | null

export function PaymentProcessor({
  amount,
  currency,
  packageName,
  guests,
  date,
  customerDetails,
  onSuccess,
  onBack
}: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEgyptianPayment, setShowEgyptianPayment] = useState(false)

  const handleInternationalPayment = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const transactionId = `STRIPE_${Date.now()}`
      
      console.log('Processing Stripe payment with:', {
        amount,
        currency,
        packageName,
        guests,
        date,
        customerEmail: customerDetails.email
      })
      
      const result = await createStripePayment(
        amount,
        currency,
        customerDetails,
        {
          packageName,
          guests,
          date,
          transactionId,
        }
      )
      
      console.log('Stripe result:', result)
      
      if (result.success && result.url) {
        // Validate URL before redirect
        try {
          const url = new URL(result.url)
          console.log('Redirecting to Stripe:', url.toString())
          window.location.href = result.url
        } catch (urlError) {
          console.error('Invalid URL:', result.url)
          setError('Invalid payment URL. Please try again or contact support.')
        }
      } else {
        console.error('Stripe payment failed:', result.error)
        setError(result.error || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEgyptianSuccess = () => {
    const transactionId = `${selectedMethod}_${Date.now()}`
    onSuccess(transactionId)
  }

  if (showEgyptianPayment && selectedMethod && selectedMethod !== 'stripe') {
    return (
      <EgyptianPayment
        amount={amount}
        method={selectedMethod}
        onSuccess={handleEgyptianSuccess}
        onBack={() => setShowEgyptianPayment(false)}
      />
    )
  }

  const methods = currency === 'EGP' 
    ? [
        { id: 'instapay' as const, name: 'InstaPay', icon: <Building className="h-5 w-5" />, description: 'Instant bank transfer - Egyptian banks only' },
        { id: 'vodafone_cash' as const, name: 'Vodafone Cash', icon: <Smartphone className="h-5 w-5" />, description: 'Mobile wallet - Egyptian customers' },
      ]
    : [
        { id: 'stripe' as const, name: 'Credit / Debit Card', icon: <CreditCard className="h-5 w-5" />, description: 'Visa, Mastercard, American Express - International' },
      ]

  const handleMethodSelect = (methodId: PaymentMethod) => {
    setSelectedMethod(methodId)
    setError(null)
    if (currency === 'EGP' && methodId && methodId !== 'stripe') {
      setShowEgyptianPayment(true)
    } else if (methodId === 'stripe') {
      handleInternationalPayment()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-full">
                {currency === 'EGP' ? (
                  <Building className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                ) : (
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                )}
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 sm:mb-3 md:mb-4 px-4">
              {currency === 'EGP' ? 'Egyptian Payment Methods' : 'International Payment'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 px-4 max-w-2xl mx-auto">
              {currency === 'EGP' 
                ? 'Choose your preferred Egyptian payment method to complete your booking'
                : 'Pay securely with your credit card or PayPal account'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 sm:mb-6 gap-1 sm:gap-2 text-sm sm:text-base hover:bg-gray-100 h-9 sm:h-10"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Booking Details
          </Button>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-medium text-red-800">Payment Error</p>
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Methods Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="space-y-3">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedMethod === method.id ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">{method.name}</p>
                        <p className="text-xs text-gray-500 truncate">{method.description}</p>
                      </div>
                      {method.id === 'vodafone_cash' && (
                        <span className="text-xs text-gray-500 shrink-0">+1% fee</span>
                      )}
                      {method.id === 'stripe' && (
                        <span className="text-xs text-gray-500 shrink-0">+2.9% fee</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Total Card */}
          <Card className="mt-4 sm:mt-6 shadow-xl border-0 overflow-hidden">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg">Total:</span>
                <span className="font-bold text-lg sm:text-xl md:text-2xl text-primary">
                  {currency === 'EGP' ? 'EGP ' : '$ '}{amount.toLocaleString()}
                </span>
              </div>
              {selectedMethod === 'vodafone_cash' && (
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Includes 1% processing fee
                </p>
              )}
              {selectedMethod === 'stripe' && (
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Includes 2.9% processing fee
                </p>
              )}
            </CardContent>
          </Card>

          {loading && (
            <div className="flex justify-center mt-6">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <p className="ml-2 text-sm text-gray-600">Creating secure payment session...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}