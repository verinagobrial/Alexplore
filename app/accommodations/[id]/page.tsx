// app/accommodations/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Star, MapPin, Wifi, Car, Coffee, Waves, Phone, Mail, Clock, Calendar, Users, Check, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/alexplore/animated-section"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  pool: Waves,
}

// Same hotel data as above (in production, fetch from API)
const getHotelData = (id: string) => {
  const hotels: Record<string, any> = {
    "four-seasons-san-stefano": {
      id: "four-seasons-san-stefano",
      name: "Four Seasons San Stefano",
      location: "San Stefano, Alexandria",
      rating: 5,
      price: 320,
      image: "/images/hotel-1.jpg",
      gallery: ["/images/hotel-1-1.jpg", "/images/hotel-1-2.jpg", "/images/hotel-1-3.jpg"],
      description: "Beachfront luxury with panoramic Mediterranean views and world-class amenities.",
      longDescription: "Overlooking the Mediterranean Sea, Four Seasons San Stefano offers luxurious accommodations with private balconies, a private beach, indoor and outdoor pools, and a world-class spa. The hotel features multiple fine dining restaurants serving international and local cuisine. Each room is elegantly appointed with modern amenities, marble bathrooms, and stunning sea or city views.",
      amenities: ["wifi", "parking", "breakfast", "pool"],
      reviews: 1247,
      ratingScore: 4.9,
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      nearby: ["San Stefano Mall", "Royal Jewelry Museum", "Stanley Bridge"],
      phone: "+20 3 581 8000",
      email: "reservations.sanstefano@fourseasons.com",
      features: [
        "Private Beach Access",
        "Indoor & Outdoor Pools",
        "Full-Service Spa",
        "Fitness Center",
        "Multiple Restaurants",
        "Concierge Service"
      ]
    },
    "steigenberger": {
      id: "steigenberger",
      name: "Steigenberger Cecil Hotel",
      location: "Alexandria Corniche",
      rating: 4,
      price: 180,
      image: "/images/hotel-2.jpg",
      gallery: ["/images/hotel-2-1.jpg", "/images/hotel-2-2.jpg", "/images/hotel-2-3.jpg"],
      description: "Historic luxury hotel on the Alexandria Corniche with sea views.",
      longDescription: "Steigenberger Cecil Hotel is a historic landmark on Alexandria's famous Corniche. Built in 1929, this elegant hotel combines old-world charm with modern amenities. Enjoy stunning Mediterranean Sea views, traditional hospitality, and easy access to Alexandria's main attractions including the Bibliotheca Alexandrina and the Citadel of Qaitbay.",
      amenities: ["wifi", "parking", "breakfast"],
      reviews: 892,
      ratingScore: 4.7,
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      nearby: ["Alexandria Corniche", "Citadel of Qaitbay", "Bibliotheca Alexandrina"],
      phone: "+20 3 480 5757",
      email: "cecil@steigenberger.com",
      features: [
        "Sea View Rooms",
        "Historic Building",
        "Fine Dining Restaurant",
        "24/7 Room Service",
        "Business Center",
        "Concierge Service"
      ]
    },
    "paradise-inn": {
      id: "paradise-inn",
      name: "Paradise Inn Le Metropole",
      location: "Ramleh Station, Alexandria",
      rating: 4,
      price: 150,
      image: "/images/hotel-3.jpg",
      gallery: ["/images/hotel-3-1.jpg", "/images/hotel-3-2.jpg", "/images/hotel-3-3.jpg"],
      description: "Boutique hotel in the heart of Alexandria with French charm.",
      longDescription: "Paradise Inn Le Metropole is a charming boutique hotel located in the historic Ramleh district. This beautifully restored property offers elegant rooms with European flair, a rooftop restaurant with panoramic sea views, and warm hospitality. Perfect for travelers seeking a unique and authentic Alexandria experience.",
      amenities: ["wifi", "breakfast"],
      reviews: 634,
      ratingScore: 4.6,
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      nearby: ["Ramleh Station", "Alexandria Opera House", "El Nabi Daniel Street"],
      phone: "+20 3 392 8018",
      email: "info@lemmetropole.com",
      features: [
        "Rooftop Restaurant",
        "Historic Building",
        "Boutique Style",
        "Free Breakfast",
        "24/7 Front Desk",
        "Airport Shuttle"
      ]
    }
  }
  return hotels[id] || null
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  const supabase = createClient()
  const hotel = getHotelData(params.id as string)

  // Calculate number of nights and total price
  const calculateTotal = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      const total = nights * hotel.price
      return { nights, total }
    }
    return { nights: 0, total: 0 }
  }

  const { nights, total } = calculateTotal()

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates")
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push(`/auth/login?redirect=/accommodations/${params.id}`)
        return
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          accommodation_id: hotel.id,
          accommodation_name: hotel.name,
          user_id: user.id,
          check_in: checkInDate,
          check_out: checkOutDate,
          guests: guests,
          total_price: total,
          status: 'pending',
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Booking error:', error)
        alert("Failed to create booking. Please try again.")
      } else {
        alert("Booking created successfully!")
        router.push('/dashboard/bookings')
      }
    } catch (error) {
      console.error('Error:', error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hotel not found</h2>
          <Button onClick={() => router.push("/accommodations")}>View All Hotels</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to accommodations
        </button>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={hotel.gallery[selectedImage] || hotel.image}
              alt={hotel.name}
              fill
              className="object-cover"
            />
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {hotel.gallery.slice(0, 4).map((img: string, idx: number) => (
              <div
                key={idx}
                className={`relative h-[190px] lg:h-[240px] rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedImage === idx ? "ring-2 ring-primary" : "hover:opacity-90"
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image
                  src={img}
                  alt={`${hotel.name} view ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  ({hotel.reviews.toLocaleString()} reviews)
                </span>
                <span className="text-primary font-semibold ml-2">{hotel.ratingScore} ★</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
                {hotel.name}
              </h1>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                {hotel.location}
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {hotel.longDescription}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity: string) => {
                    const Icon = amenityIcons[amenity]
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="capitalize text-muted-foreground">
                          {amenity === "wifi" ? "Free WiFi" : 
                           amenity === "breakfast" ? "Breakfast Included" :
                           amenity === "pool" ? "Swimming Pool" :
                           "Free Parking"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Hotel Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hotel.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Attractions */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Nearby Attractions</h2>
                <div className="flex flex-wrap gap-3">
                  {hotel.nearby.map((place: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground">
                      {place}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{hotel.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>{hotel.email}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedSection className="sticky top-24">
              <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${hotel.price} <span className="text-base font-normal text-muted-foreground">/ night</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Includes taxes and fees</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-in</p>
                      <p className="font-semibold">{hotel.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-out</p>
                      <p className="font-semibold">{hotel.checkOut}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Occupancy</p>
                      <p className="font-semibold">Up to 4 guests</p>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkInDate && checkOutDate && nights > 0 && (
                  <div className="bg-secondary/30 rounded-lg p-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${hotel.price} × {nights} nights
                        </span>
                        <span>${hotel.price * nights}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes & fees</span>
                        <span>${Math.round(hotel.price * nights * 0.15)}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${total + Math.round(hotel.price * nights * 0.15)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  {isLoading ? "Processing..." : checkInDate && checkOutDate ? "Book Now" : "Select Dates to Book"}
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    You won't be charged yet. Free cancellation available.
                  </p>
                </div>

                {/* Share Button */}
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => {
                      navigator.share?.({
                        title: hotel.name,
                        text: hotel.description,
                        url: window.location.href,
                      })
                    }}
                    className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share this hotel
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}