'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getCheckoutSession } from '@/app/actions/stripe'
import { CheckCircle, Calendar, Mail, Download, ArrowRight, Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState<{
    status: string | null
    customerEmail: string | undefined
    amountTotal: number | null
    metadata: Record<string, string> | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      getCheckoutSession(sessionId).then((data) => {
        setSession(data)
        setLoading(false)
      })
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Confirming your booking...</p>
      </div>
    )
  }

  if (!session || session.status !== 'complete') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">We could not confirm your booking. Please contact support.</p>
        <Link href="/packages">
          <Button>Return to Packages</Button>
        </Link>
      </div>
    )
  }

  const formatAmount = (amount: number | null) => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for choosing Alexplore. Your adventure awaits!
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="text-lg font-mono font-semibold">{sessionId?.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-primary">{formatAmount(session.amountTotal)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Package</p>
                <p className="font-semibold">{session.metadata?.packageName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Guests</p>
                  <p className="font-semibold">{session.metadata?.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Email</p>
                  <p className="font-semibold">{session.customerEmail}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Confirmation email sent</p>
                  <p className="text-sm text-muted-foreground">
                    {"We've sent booking details and your itinerary to"} {session.customerEmail}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm text-muted-foreground">
                    {"You'll receive a detailed confirmation with your complete itinerary"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Prepare for your trip</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will contact you 48 hours before to confirm pickup details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Enjoy Alexandria!</p>
                  <p className="text-sm text-muted-foreground">
                    Meet your guide and start your unforgettable adventure
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/bookings">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              <Calendar className="mr-2 h-4 w-4" />
              View My Bookings
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" className="w-full sm:w-auto">
              Explore More Packages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  )
}
