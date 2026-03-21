'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPackageById, formatPrice } from '@/lib/products'
import { createCheckoutSession } from '@/app/actions/stripe'
import { Clock, Users, MapPin, Shield, Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function BookingContent() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get('packageId') || ''
  const guests = parseInt(searchParams.get('guests') || '1')
  const date = searchParams.get('date') || ''

  const pkg = getPackageById(packageId)

  const fetchClientSecret = useCallback(async () => {
    const { clientSecret } = await createCheckoutSession(packageId, guests)
    return clientSecret!
  }, [packageId, guests])

  if (!pkg) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Package not found</h1>
        <p className="text-muted-foreground">The requested package could not be found.</p>
      </div>
    )
  }

  const totalPrice = pkg.priceInCents * guests

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-center mb-8">Complete Your Booking</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Order Summary */}
        <div className="lg:col-span-1 lg:order-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Package Info */}
              <div className="flex gap-4">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Guests
                  </span>
                  <span>{guests}</span>
                </div>
                {date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Travel Date
                    </span>
                    <span>{new Date(date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Location
                  </span>
                  <span>Alexandria, Egypt</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(pkg.priceInCents)} x {guests}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading checkout...</p>
        </div>
      }>
        <BookingContent />
      </Suspense>
      <Footer />
    </main>
  )
}
