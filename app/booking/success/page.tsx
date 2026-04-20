// app/booking/success/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, Calendar, Users, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveBookingToDatabase, updateBookingStatus } from '@/app/actions/booking'
import { formatPrice } from '@/lib/products'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const paymentMethod = searchParams.get('payment_method')
  const packageId = searchParams.get('package_id')
  const guests = searchParams.get('guests')
  const date = searchParams.get('date')
  const packageName = searchParams.get('package_name')
  const amount = searchParams.get('amount')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    const saveBooking = async () => {
      if (!sessionId || !paymentMethod || !packageId) {
        setStatus('error')
        setError('Missing booking information')
        return
      }

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setStatus('error')
          setError('User not authenticated')
          return
        }

        // Save booking to database
        const bookingData = {
          transactionId: sessionId,
          paymentMethod: paymentMethod,
          amount: parseFloat(amount || '0'),
          currency: 'USD',
          userId: user.id,
          bookingDetails: {
            packageId: packageId,
            packageName: packageName || '',
            guests: parseInt(guests || '1'),
            date: date || '',
          },
          customerDetails: {
            name: user.user_metadata?.first_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
          },
          status: 'completed'
        }

        // Save to database
        await saveBookingToDatabase(bookingData)
        
        // Update booking status
        await updateBookingStatus(sessionId, 'completed')
        
        setStatus('success')
        setBooking(bookingData)
      } catch (err) {
        console.error('Error saving booking:', err)
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Failed to save booking')
      }
    }

    saveBooking()
  }, [sessionId, paymentMethod, packageId, guests, date, packageName, amount])

  const handleViewBookings = () => {
    router.push('/my-bookings')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Processing Your Booking</h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your booking...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Booking Error</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'There was an error processing your booking. Please contact support.'}
          </p>
          <Button onClick={handleBackToHome} className="mr-3">
            Return Home
          </Button>
          <Button variant="outline" onClick={() => router.push('/contact')}>
            Contact Support
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Details */}
          {booking && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Booking Details</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-mono text-sm">{booking.transactionId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package:</span>
                  <span className="font-medium">{booking.bookingDetails.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span>{booking.bookingDetails.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travel Date:</span>
                  <span>{new Date(booking.bookingDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="capitalize">{booking.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold">Total Paid:</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(booking.amount * 100)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What's Next?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-1" />
                <span>You'll receive a confirmation email with all the details of your booking.</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-1" />
                <span>Our team will contact you within 24 hours to finalize the arrangements.</span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-1" />
                <span>A receipt has been sent to your email for your records.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleViewBookings} className="flex-1">
              View My Bookings
            </Button>
            <Button variant="outline" onClick={handleBackToHome} className="flex-1">
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading booking details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  )
}