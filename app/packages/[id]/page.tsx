// app/packages/[id]/page.tsx
'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { getPackageById, formatPrice } from '@/lib/products'
import { 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Check, 
  Calendar,
  Shield,
  Phone,
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react'
import { notFound } from 'next/navigation'

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const pkg = getPackageById(id)
  const [guests, setGuests] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  const router = useRouter()

  if (!pkg) {
    notFound()
  }

  const totalPrice = pkg.priceInCents * guests

  function handleBookNow() {
    // Make sure we have a valid date
    if (!travelDate) {
      alert('Please select a travel date')
      return
    }

    // Use the id from params (the URL ID) or pkg.id if available
    const packageIdToUse = id || (pkg as any).id
    
    const searchParams = new URLSearchParams({
      packageId: packageIdToUse,
      guests: guests.toString(),
      date: travelDate,
    })
    
    router.push(`/booking?${searchParams.toString()}`)
  }

  return (
    <main className="min-h-screen">
      <Header />
      
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
        Explore Our Travel Packages
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>


      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Meta */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {pkg.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{pkg.rating}</span>
                  <span className="text-muted-foreground">({pkg.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                {pkg.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {pkg.duration}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Max {pkg.maxGuests} guests
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Alexandria, Egypt
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About This Package</h2>
              <p className="text-muted-foreground leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Trip Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {pkg.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{"What's Included"}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {pkg.included.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Package</span>
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(pkg.priceInCents)}
                    <span className="text-base font-normal text-muted-foreground"> /person</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Travel Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Travel Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <Label>Number of Guests</Label>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">
                        {guests} {guests === 1 ? 'Guest' : 'Guests'}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(Math.min(pkg.maxGuests, guests + 1))}
                        disabled={guests >= pkg.maxGuests}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum {pkg.maxGuests} guests per booking
                    </p>
                  </div>

                  {/* Price Summary */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(pkg.priceInCents)} x {guests} guest{guests > 1 ? 's' : ''}</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={handleBookNow}
                    className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg"
                    disabled={!travelDate}
                  >
                    Book Now
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span>Free cancellation up to 48 hours before</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}