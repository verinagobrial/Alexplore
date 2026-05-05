"use client"

import Image from "next/image"
import { ArrowRight, MapPin, Star, Heart, Filter, ChevronDown } from "lucide-react"
import { AnimatedSection } from "@/components/alexplore/animated-section"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'

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
  {
    id: "alexandria-national-museum",
    title: "Alexandria National Museum",
    description: "Housing over 1,800 artifacts spanning Egypt's history from Pharaonic to modern times.",
    image: "/images/1678607223.jpg",
    rating: 4.8,
    reviews: 1245,
    category: "Museum",
    slug: "alexandria-national-museum"
  },
  {
    id: "pompeys-pillar",
    title: "Pompey's Pillar",
    description: "A magnificent Roman triumphal column standing 27 meters tall, dating back to 297 AD.",
    image: "/images/1.jpg",
    rating: 4.6,
    reviews: 987,
    category: "Historical",
    slug: "pompeys-pillar"
  },
  {
    id: "roman-amphitheater",
    title: "Roman Amphitheater",
    description: "The only Roman amphitheater in Egypt, featuring stunning marble seats and mosaic floors.",
    image: "/images/6.jpg",
    rating: 4.7,
    reviews: 1123,
    category: "Historical",
    slug: "roman-amphitheater"
  },
  {
    id: "stanley-bridge",
    title: "Stanley Bridge",
    description: "Iconic modern bridge offering breathtaking sunset views and popular local gathering spot.",
    image: "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
    rating: 4.8,
    reviews: 2341,
    category: "Leisure",
    slug: "stanley-bridge"
  },
]

const categories = ["All", "Historical", "Palace", "Cultural", "Museum", "Leisure"]

export default function DestinationsPage() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [likedDestinations, setLikedDestinations] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("rating")

  const toggleLike = (index: number) => {
    setLikedDestinations((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleDestinationClick = (slug: string) => {
    router.push(`/destinations/${slug}`)
  }

  // Filter and sort destinations
  const filteredDestinations = destinations
    .filter(dest => selectedCategory === "All" || dest.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "reviews") return b.reviews - a.reviews
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
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
              Discover all Destinations
            </h1>
            <p className="text-lg opacity-90 mb-8 animate-slide-up">
             The Soul of the Mediterranean in Your Hands.
            </p>
          </div>
        </div>
      </section>
      {/* Filters Section */}
      <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary/10 text-muted-foreground hover:bg-secondary/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-foreground hover:bg-secondary/20 transition-all"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Sort by: {sortBy === "rating" ? "Rating" : sortBy === "reviews" ? "Most Reviewed" : "A-Z"}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-30">
                  {["rating", "reviews", "title"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option)
                        setIsFilterOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/10 transition-colors"
                    >
                      {option === "rating" ? "Highest Rated" : option === "reviews" ? "Most Reviewed" : "A-Z"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredDestinations.length}</span> destinations
          </p>
        </div>
      </section>

      {/* Destinations Grid - EXACT same card style as homepage */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((destination, index) => (
              <AnimatedSection
                key={destination.id}
                animation="fade-up"
                delay={(index % 8) * 100}
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

          {/* Empty State */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 mb-6">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-serif mb-2">No destinations found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
              <Button onClick={() => setSelectedCategory("All")} variant="outline" className="rounded-full">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}