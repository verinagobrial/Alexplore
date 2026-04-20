"use client"

import Image from "next/image"
import { ArrowRight, MapPin, Star, Heart } from "lucide-react"
import { AnimatedSection } from "./animated-section"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation" // For App Router
// import { useRouter } from "next/router" // For Pages Router (if using old structure)

const destinations = [
  {
    id: "qaitbay-citadel",
    title: "Qaitbay Citadel",
    description: "A 15th-century fortress built on the legendary site of the Pharos Lighthouse, offering stunning Mediterranean views.",
    image: "/images/6.jpg",
    rating: 4.9,
    reviews: 2847,
    category: "Historical",
    slug: "qaitbay-citadel"
  },
  {
    id: "montaza-palace",
    title: "Montaza Palace",
    description: "Royal gardens and palatial elegance overlooking pristine beaches - a perfect blend of nature and history.",
    image: "/images/monazah palace.jpg",
    rating: 4.8,
    reviews: 1923,
    category: "Palace",
    slug: "montaza-palace"
  },
  {
    id: "bibliotheca-alexandrina",
    title: "Bibliotheca Alexandrina",
    description: "A modern architectural marvel honoring the ancient Library of Alexandria, hosting millions of books and artifacts.",
    image: "/images/Alexandria Library Egypt.jpeg",
    rating: 4.9,
    reviews: 3156,
    category: "Cultural",
    slug: "bibliotheca-alexandrina"
  },
  {
    id: "corniche",
    title: "The Corniche",
    description: "A scenic 16km waterfront promenade perfect for sunset walks, local dining, and experiencing authentic Alexandrian life.",
    image: "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
    rating: 4.7,
    reviews: 4521,
    category: "Leisure",
    slug: "the-corniche"
  },
]

export function Destinations() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [likedDestinations, setLikedDestinations] = useState<number[]>([])

  const toggleLike = (index: number) => {
    setLikedDestinations((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Navigation handlers
  const handleViewAll = () => {
    router.push("/destinations")
  }

  const handleDestinationClick = (slug: string) => {
    router.push(`/destinations/${slug}`)
  }

  return (
    <section id="destinations" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Top Destinations</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance">
            Explore Alexandria&apos;s <span className="text-primary italic">Iconic</span> Landmarks
          </h2>
          <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
            From ancient wonders to modern marvels, discover the places that make Alexandria 
            one of the Mediterranean&apos;s most captivating destinations.
          </p>
        </AnimatedSection>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <AnimatedSection
              key={index}
              animation="fade-up"
              delay={index * 100}
            >
              <div
                className="group relative overflow-hidden rounded-3xl bg-card shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleDestinationClick(destination.slug)}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={destination.image}
                    alt={destination.title}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredIndex === index ? "scale-110 brightness-90" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-accent text-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {destination.category}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(index)
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      likedDestinations.includes(index)
                        ? "bg-red-500 text-secondary"
                        : "bg-secondary/20 backdrop-blur-sm text-secondary hover:bg-secondary/40"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 transition-transform ${
                        likedDestinations.includes(index) ? "fill-current scale-110" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-secondary">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-accent/90 text-foreground px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-medium">{destination.rating}</span>
                    </div>
                    <span className="text-xs text-secondary/70">({destination.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <h3 className="font-serif text-2xl font-medium mb-2 group-hover:text-accent transition-colors">
                    {destination.title}
                  </h3>
                  <p className="text-sm text-secondary/80 line-clamp-2 mb-4 group-hover:line-clamp-none transition-all">
                    {destination.description}
                  </p>

                  <div
                    className={`flex items-center gap-2 text-accent text-sm font-medium transition-all duration-300 ${
                      hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    Explore Now <ArrowRight className="h-4 w-4 animate-bounce-x" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Button with Navigation */}
        <AnimatedSection delay={500} className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8"
            onClick={handleViewAll}
          >
            View All Destinations
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}