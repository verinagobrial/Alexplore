// app/destinations/[slug]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, MapPin, Star, Clock, Ticket, Calendar, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/alexplore/animated-section"
import { useState } from "react"

// Mock data - In real app, fetch from API
const getDestinationData = (slug: string) => {
  const destinations = {
    "qaitbay-citadel": {
      title: "Qaitbay Citadel",
      description: "A 15th-century fortress built on the legendary site of the Pharos Lighthouse, offering stunning Mediterranean views and rich maritime history.",
      longDescription: "Built between 1477 and 1480 AD by Sultan Al-Ashraf Qaitbay, this fortress stands on the exact site of the ancient Pharos Lighthouse, one of the Seven Wonders of the Ancient World. The citadel served as a defensive stronghold for over 500 years and now houses a naval museum showcasing Alexandria's maritime heritage.",
      image: "/images/qaitbay-citadel.jpg",
      gallery: ["/images/qaitbay-1.jpg", "/images/qaitbay-2.jpg", "/images/qaitbay-3.jpg"],
      rating: 4.9,
      reviews: 2847,
      category: "Historical",
      location: "Eastern Harbor, Alexandria",
      price: "EGP 60",
      openingHours: "9:00 AM - 5:00 PM daily",
      bestTime: "Sunset hours for spectacular views",
      duration: "2-3 hours",
      tips: [
        "Arrive early to avoid crowds",
        "Bring a camera for sunset photos",
        "Visit the mosque inside the citadel",
        "Wear comfortable shoes for exploring"
      ],
      nearby: ["Alexandria National Museum", "Ancient Roman Theater", "The Corniche"]
    },
    "montaza-palace": {
      title: "Montaza Palace",
      description: "Royal gardens and palatial elegance overlooking pristine beaches - a perfect blend of Turkish and Florentine architectural styles.",
      longDescription: "Built in 1892 by Khedive Abbas II, Montaza Palace served as a royal summer residence. The palace complex features beautiful gardens, a private beach, and stunning views of the Mediterranean Sea.",
      image: "/images/montaza-palace.jpg",
      gallery: ["/images/montaza-1.jpg", "/images/montaza-2.jpg"],
      rating: 4.8,
      reviews: 1923,
      category: "Palace",
      location: "Montaza District, Alexandria",
      price: "EGP 40",
      openingHours: "8:00 AM - 8:00 PM daily",
      bestTime: "Spring for blooming gardens",
      duration: "3-4 hours",
      tips: ["Visit the gardens early morning", "Try local tea at the cafe", "Bring swimwear for the beach"]
    },
    // Add more destinations...
  }
  return destinations[slug as keyof typeof destinations] || null
}

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  
  const destination = getDestinationData(params.slug as string)

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Destination not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-secondary/20 backdrop-blur-sm hover:bg-secondary/40 text-secondary px-4 py-2 rounded-full transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-secondary/20 backdrop-blur-sm hover:bg-secondary/40 p-3 rounded-full transition-all"
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-secondary"}`} />
          </button>
          <button className="bg-secondary/20 backdrop-blur-sm hover:bg-secondary/40 p-3 rounded-full transition-all">
            <Share2 className="h-5 w-5 text-secondary" />
          </button>
        </div>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-secondary">
          <div className="container mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-accent text-foreground px-3 py-1 rounded-full text-sm">
                  {destination.category}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span className="text-secondary/70">({destination.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {destination.title}
              </h1>
              <div className="flex items-center gap-2 text-secondary/80">
                <MapPin className="h-5 w-5" />
                {destination.location}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {destination.longDescription}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h2 className="text-2xl font-bold mb-4">Travel Tips</h2>
              <ul className="space-y-2 mb-8">
                {destination.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* <AnimatedSection delay={200}>
              <h2 className="text-2xl font-bold mb-4">Nearby Attractions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {destination.nearby.map((place, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{place}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection> */}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <AnimatedSection className="sticky top-24">
              <div className="bg-secondary/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Ticket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="font-semibold text-lg">{destination.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Opening Hours</p>
                    <p className="font-semibold">{destination.openingHours}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                    <p className="font-semibold">{destination.bestTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Recommended Duration</p>
                    <p className="font-semibold">{destination.duration}</p>
                  </div>
                </div>

                <Button className="w-full mt-4" size="lg">
                  Book Tickets
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}