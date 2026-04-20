"use client"

import Image from "next/image"
import { Star, MapPin, ArrowRight, Wifi, Car, Coffee, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "./animated-section"
import { useState } from "react"
import { useRouter } from "next/navigation"

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  pool: Waves,
}

const hotels = [
  {
    id: "four-seasons-san-stefano",
    name: "Four Seasons San Stefano",
    location: "San Stefano, Alexandria",
    rating: 5,
    price: 320,
    image: "/images/hotel-1.jpg",
    description: "Beachfront luxury with panoramic Mediterranean views and world-class amenities.",
    amenities: ["wifi", "parking", "breakfast", "pool"],
    reviews: 1247,
  },
  {
    id: "rixos-montaza",
    name: "Rixos Montaza",
    location: "Montaza, Alexandria",
    rating: 5,
    price: 280,
    image: "/images/hotel-2.jpg",
    description: "Elegant resort nestled in the historic Montaza gardens with private beach access.",
    amenities: ["wifi", "parking", "breakfast", "pool"],
    reviews: 892,
  },
  {
    id: "hilton-alexandria-corniche",
    name: "Hilton Alexandria Corniche",
    location: "Corniche Road, Alexandria",
    rating: 4,
    price: 180,
    image: "/images/corniche.jpg",
    description: "Prime location on the iconic Corniche with stunning sunset views over the sea.",
    amenities: ["wifi", "parking", "breakfast"],
    reviews: 2156,
  },
]

export function Accommodations() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleViewAllHotels = () => {
    router.push("/accommodations")
  }

  const handleHotelClick = (hotelId: string) => {
    router.push(`/accommodations/${hotelId}`)
  }

  return (
    <section className="py-24 lg:py-32 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Luxury Stays</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-balance">
              Where to <span className="text-primary italic">Stay</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              Handpicked accommodations offering exceptional comfort and authentic Mediterranean hospitality.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleViewAllHotels}
            className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-fit"
          >
            View All Hotels
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AnimatedSection>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
              <div
                className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleHotelClick(hotel.id)}
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredIndex === index ? "scale-110 brightness-90" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                    <span className="text-lg font-bold text-primary">${hotel.price}</span>
                    <span className="text-xs text-muted-foreground">/night</span>
                  </div>

                  {/* Star Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-foreground/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-current" />
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                    {hotel.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    {hotel.location}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
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
                    <span className="text-xs text-muted-foreground ml-auto">
                      {hotel.reviews.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group/btn hover:scale-[1.02] transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleHotelClick(hotel.id)
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button> */}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Trust Banner */}
        <AnimatedSection delay={500} className="mt-16">
          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-serif text-primary font-semibold">Best Price</div>
                <div className="text-sm text-muted-foreground mt-1">Guarantee</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-primary font-semibold">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Customer Support</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-primary font-semibold">Free</div>
                <div className="text-sm text-muted-foreground mt-1">Cancellation</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-primary font-semibold">Verified</div>
                <div className="text-sm text-muted-foreground mt-1">Properties</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}