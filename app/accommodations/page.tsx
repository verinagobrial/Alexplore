// app/accommodations/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/alexplore/header"
import { Footer } from "@/components/alexplore/footer"
import { useRouter } from "next/navigation"
import { Star, MapPin, ArrowRight, Wifi, Car, Coffee, Waves, Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/alexplore/animated-section"

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  pool: Waves,
}

// Extended hotel data
const allHotels = [
  {
    id: "four-seasons-san-stefano",
    name: "Four Seasons San Stefano",
    location: "San Stefano, Alexandria",
    rating: 5,
    price: 320,
    image: "/images/hotel-1.jpg",
    gallery: ["/images/hotel-1-1.jpg", "/images/hotel-1-2.jpg", "/images/hotel-1-3.jpg"],
    description: "Beachfront luxury with panoramic Mediterranean views and world-class amenities. Experience unparalleled service and elegance at this iconic property.",
    longDescription: "Overlooking the Mediterranean Sea, Four Seasons San Stefano offers luxurious accommodations with private balconies, a private beach, indoor and outdoor pools, and a world-class spa. The hotel features multiple fine dining restaurants serving international and local cuisine.",
    amenities: ["wifi", "parking", "breakfast", "pool"],
    reviews: 1247,
    ratingScore: 4.9,
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    nearby: ["San Stefano Mall", "Royal Jewelry Museum", "Stanley Bridge"],
    phone: "+20 3 581 8000",
    email: "reservations.sanstefano@fourseasons.com"
  },
  {
    id: "rixos-montaza",
    name: "Rixos Montaza",
    location: "Montaza, Alexandria",
    rating: 5,
    price: 280,
    image: "/images/hotel-2.jpg",
    gallery: ["/images/hotel-2-1.jpg", "/images/hotel-2-2.jpg"],
    description: "Elegant resort nestled in the historic Montaza gardens with private beach access and stunning sea views.",
    longDescription: "Located within the historic Montaza Palace gardens, Rixos offers a unique blend of luxury and history. The resort features a private beach, multiple swimming pools, a full-service spa, and several restaurants serving Turkish, Egyptian, and international cuisine.",
    amenities: ["wifi", "parking", "breakfast", "pool"],
    reviews: 892,
    ratingScore: 4.8,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    nearby: ["Montaza Palace", "Montaza Gardens", "Alexandria Zoo"],
    phone: "+20 3 589 5555",
    email: "info@rixos.com"
  },
  {
    id: "hilton-alexandria-corniche",
    name: "Hilton Alexandria Corniche",
    location: "Corniche Road, Alexandria",
    rating: 4,
    price: 180,
    image: "/images/corniche.jpg",
    gallery: ["/images/hilton-1.jpg", "/images/hilton-2.jpg"],
    description: "Prime location on the iconic Corniche with stunning sunset views over the sea and easy access to attractions.",
    longDescription: "Situated along Alexandria's famous Corniche, this modern hotel offers comfortable rooms with sea views, a rooftop pool, fitness center, and several dining options. Perfect for both business and leisure travelers.",
    amenities: ["wifi", "parking", "breakfast"],
    reviews: 2156,
    ratingScore: 4.6,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    nearby: ["Bibliotheca Alexandrina", "Qaitbay Citadel", "Alexandria Corniche"],
    phone: "+20 3 554 7777",
    email: "alexandria@hilton.com"
  },
  {
    id: "steigenberger-alexandria",
    name: "Steigenberger Cecil Hotel",
    location: "Saad Zaghloul Square, Alexandria",
    rating: 4,
    price: 150,
    image: "/images/steigenberger.jpg",
    gallery: ["/images/steigenberger-1.jpg", "/images/steigenberger-2.jpg"],
    description: "Historic charm meets modern comfort in this iconic hotel overlooking the Mediterranean.",
    longDescription: "Originally opened in 1929, this historic hotel has hosted royalty and celebrities. Recently renovated, it offers elegant rooms, a rooftop restaurant with panoramic views, and easy access to Alexandria's cultural attractions.",
    amenities: ["wifi", "breakfast"],
    reviews: 1432,
    ratingScore: 4.5,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    nearby: ["Roman Amphitheater", "Alexandria National Museum", "Ancient Roman Theater"],
    phone: "+20 3 485 5555",
    email: "reservations@steigenberger.com"
  },
  {
    id: "paradise-inn-le-méridien",
    name: "Paradise Inn Le Méridien",
    location: "El Maamoura, Alexandria",
    rating: 5,
    price: 250,
    image: "/images/paradise-inn.jpg",
    gallery: ["/images/paradise-1.jpg", "/images/paradise-2.jpg"],
    description: "Beachfront resort offering extensive recreational facilities and family-friendly amenities.",
    longDescription: "This expansive beachfront resort features multiple pools, tennis courts, a water park, and a private beach. Perfect for families seeking a complete vacation experience with various dining options and entertainment.",
    amenities: ["wifi", "parking", "breakfast", "pool"],
    reviews: 1876,
    ratingScore: 4.7,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    nearby: ["Maamoura Beach", "Montaza Gardens", "Alexandria Corniche"],
    phone: "+20 3 547 8000",
    email: "reservations@paradiseinn.com"
  },
  {
    id: "windsor-palace",
    name: "Windsor Palace Hotel",
    location: "Alexandria Corniche",
    rating: 3,
    price: 90,
    image: "/images/windsor.jpg",
    gallery: ["/images/windsor-1.jpg", "/images/windsor-2.jpg"],
    description: "Historic hotel with old-world charm and unbeatable location on the Corniche.",
    longDescription: "Dating back to 1906, this historic hotel offers classic elegance and stunning sea views. While rooms are traditional, the location and character make it a popular choice for budget-conscious travelers seeking authenticity.",
    amenities: ["wifi", "breakfast"],
    reviews: 876,
    ratingScore: 4.2,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    nearby: ["Alexandria Corniche", "Ancient Roman Theater", "Alexandria National Museum"],
    phone: "+20 3 480 7223",
    email: "info@windsorpalace.com"
  }
]

const priceRanges = [
  { label: "All", min: 0, max: 1000 },
  { label: "Budget (Under $100)", min: 0, max: 100 },
  { label: "Moderate ($100 - $200)", min: 100, max: 200 },
  { label: "Luxury ($200+)", min: 200, max: 1000 }
]

export default function AccommodationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredHotels = allHotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPrice = hotel.price >= selectedPriceRange.min && hotel.price <= selectedPriceRange.max
    const matchesRating = selectedRating ? hotel.rating >= selectedRating : true
    
    return matchesSearch && matchesPrice && matchesRating
  })

  return (
   <main className="min-h-screen bg-gray-50">
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
        Explore Our Best Hotels
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>


      {/* Search and Filters */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search hotels by name, location, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedPriceRange.label}
                onChange={(e) => {
                  const range = priceRanges.find(r => r.label === e.target.value)
                  if (range) setSelectedPriceRange(range)
                }}
                className="px-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {priceRanges.map(range => (
                  <option key={range.label}>{range.label}</option>
                ))}
              </select>

              <select
                value={selectedRating || ""}
                onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-card rounded-xl space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <select
                  value={selectedPriceRange.label}
                  onChange={(e) => {
                    const range = priceRanges.find(r => r.label === e.target.value)
                    if (range) setSelectedPriceRange(range)
                  }}
                  className="w-full px-4 py-2 rounded-full border border-input bg-background"
                >
                  {priceRanges.map(range => (
                    <option key={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <select
                  value={selectedRating || ""}
                  onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 rounded-full border border-input bg-background"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
              <Button onClick={() => setShowFilters(false)} className="w-full">
                Apply Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-muted-foreground">
          Found {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
        </p>
      </div>

      {/* Hotels Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No hotels found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setSelectedPriceRange(priceRanges[0])
                setSelectedRating(null)
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredHotels.map((hotel, index) => (
              <AnimatedSection key={hotel.id} animation="fade-up" delay={index * 100}>
                <div
                  className="group bg-card rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/accommodations/${hotel.id}`)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-2/5 h-64 md:h-auto">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-2">
                        <span className="text-lg font-bold text-primary">${hotel.price}</span>
                        <span className="text-xs text-muted-foreground">/night</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: hotel.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-accent fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({hotel.reviews.toLocaleString()} reviews)
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                        {hotel.name}
                      </h3>

                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        {hotel.location}
                      </div>

                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {hotel.description}
                      </p>

                      {/* Amenities */}
                      <div className="flex items-center gap-3 mb-4">
                        {hotel.amenities.map((amenity) => {
                          const Icon = amenityIcons[amenity]
                          return (
                            <div
                              key={amenity}
                              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                              title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                            >
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                          )
                        })}
                      </div>

                      <Button className="w-full md:w-auto">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    <Footer />
    </main>
  )
}