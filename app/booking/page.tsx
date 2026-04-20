// app/booking/page.tsx
'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button' 
import { Input } from '@/components/ui/input' 
import { Label } from '@/components/ui/label' 
import { getPackageById, formatPrice } from '@/lib/products'
import { PaymentProcessor } from '@/components/payment/PaymentProcessor'
import { Clock, Users, MapPin, Shield, Loader2, Calendar, Phone, Mail, User, CreditCard, Wallet } from 'lucide-react'

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const packageId = searchParams.get('packageId') || ''
  const guests = parseInt(searchParams.get('guests') || '1')
  const date = searchParams.get('date') || ''
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP')
  const [showPayment, setShowPayment] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pkg = getPackageById(packageId)

  if (!pkg) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Package not found</h1>
        <p className="text-muted-foreground">The requested package could not be found.</p>
      </div>
    )
  }

  const totalPrice = pkg.priceInCents * guests
  const priceInUSD = totalPrice / 100
  const priceInEGP = priceInUSD * 50

  const handlePaymentSuccess = (transactionId: string) => {
    router.push(`/booking/success?session_id=${transactionId}&payment_method=${currency === 'EGP' ? 'local' : 'stripe'}`)
  }

  if (showPayment) {
    return (
      <PaymentProcessor
        amount={currency === 'EGP' ? priceInEGP : priceInUSD}
        currency={currency}
        packageName={pkg.name}
        guests={guests}
        date={date}
        time="10:00 AM"
        customerDetails={customerDetails}
        onSuccess={handlePaymentSuccess}
        onBack={() => setShowPayment(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
     <section className="relative py-20 overflow-hidden">
  {/* Image Background */}
  <div 
    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/images/image-1773580378733.png')" }}
  />
  
  {/* Blurred Overlay */}
  <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm z-0" />
  
  {/* Optional: Animated gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 z-0" />

  {/* Content */}
  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-3xl mx-auto text-center text-primary-foreground">
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in text-secondary">
        Complete Your Booking 
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Order Summary - Moves to top on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="sticky top-24 shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-b p-4 sm:p-5 md:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Package Info */}
                <div className="flex gap-3 sm:gap-4">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">{pkg.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{pkg.duration}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base py-1">
                    <span className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span>Guests</span>
                    </span>
                    <span className="font-semibold">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  {date && (
                    <div className="flex items-center justify-between text-xs sm:text-sm md:text-base py-1">
                      <span className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                        <span>Travel Date</span>
                      </span>
                      <span className="font-semibold">{new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base py-1">
                    <span className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span>Location</span>
                    </span>
                    <span className="font-semibold">Alexandria, Egypt</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between text-xs sm:text-sm md:text-base">
                    <span className="text-muted-foreground">{formatPrice(pkg.priceInCents)} x {guests}</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base sm:text-lg md:text-xl pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-xs sm:text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                  <span>Secure checkout • Multiple payment methods</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b p-4 sm:p-5 md:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Details
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Please provide your information for booking confirmation
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                      placeholder="your@email.com"
                      className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    placeholder={isMobile ? "012 3456 7890" : "+20 123 456 7890"}
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base"
                    required
                  />
                </div>

                {/* Currency Selection */}
                <div className="pt-2">
                  <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block flex items-center gap-2">
                    <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                    Select Currency
                  </Label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Button
                      type="button"
                      variant={currency === 'EGP' ? 'default' : 'outline'}
                      className="w-full py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base h-auto"
                      onClick={() => setCurrency('EGP')}
                    >
                      <span className="truncate">🇪🇬 EGP - {priceInEGP.toLocaleString()}</span>
                    </Button>
                    <Button
                      type="button"
                      variant={currency === 'USD' ? 'default' : 'outline'}
                      className="w-full py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base h-auto"
                      onClick={() => setCurrency('USD')}
                    >
                      <span className="truncate">🇺🇸 USD - ${priceInUSD.toFixed(2)}</span>
                    </Button>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={() => setShowPayment(true)}
                  className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={!customerDetails.name || !customerDetails.email || !customerDetails.phone}
                >
                  Continue to Payment
                  <CreditCard className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                {/* Info Message */}
                <div className="text-center text-xs text-muted-foreground pt-2">
                  <p>You'll be able to review payment details before completing your booking</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
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