// app/destinations/page.tsx
"use client"
import { Header } from "@/components/alexplore/header"
import { Footer } from "@/components/alexplore/footer"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Star, Heart, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/alexplore/animated-section"

// Destination data (could be imported from a shared file)
const allDestinations = [
  {
    id: 1,
    title: "Qaitbay Citadel",
    description: "A 15th-century fortress built on the legendary site of the Pharos Lighthouse, offering stunning Mediterranean views and rich maritime history.",
    image: "/images/qaitbay-citadel.jpg",
    rating: 4.9,
    reviews: 2847,
    category: "Historical",
    location: "Eastern Harbor, Alexandria",
    price: "EGP 60",
    duration: "2-3 hours",
    slug: "qaitbay-citadel"
  },
  {
    id: 2,
    title: "Montaza Palace",
    description: "Royal gardens and palatial elegance overlooking pristine beaches - a perfect blend of Turkish and Florentine architectural styles.",
    image: "/images/montaza-palace.jpg",
    rating: 4.8,
    reviews: 1923,
    category: "Palace",
    location: "Montaza District, Alexandria",
    price: "EGP 40",
    duration: "3-4 hours",
    slug: "montaza-palace"
  },
  {
    id: 3,
    title: "Bibliotheca Alexandrina",
    description: "A modern architectural marvel honoring the ancient Library of Alexandria, hosting millions of books, museums, and cultural events.",
    image: "/images/bibliotheca.jpg",
    rating: 4.9,
    reviews: 3156,
    category: "Cultural",
    location: "El Shatby, Alexandria",
    price: "EGP 70",
    duration: "3-4 hours",
    slug: "bibliotheca-alexandrina"
  },
  {
    id: 4,
    title: "The Corniche",
    description: "A scenic 16km waterfront promenade perfect for sunset walks, local dining, and experiencing authentic Alexandrian coastal life.",
    image: "/images/corniche.jpg",
    rating: 4.7,
    reviews: 4521,
    category: "Leisure",
    location: "Mediterranean Coastline",
    price: "Free",
    duration: "2-4 hours",
    slug: "the-corniche"
  },
  {
    id: 5,
    title: "Pompey's Pillar",
    description: "A massive Roman triumphal column and one of the largest monolithic columns ever erected, standing 27 meters tall.",
    image: "/images/pompeys-pillar.jpg",
    rating: 4.6,
    reviews: 1234,
    category: "Historical",
    location: "Alexandria, Egypt",
    price: "EGP 40",
    duration: "1-2 hours",
    slug: "pompeys-pillar"
  },
  {
    id: 6,
    title: "Alexandria National Museum",
    description: "Housed in a restored palace, this museum showcases Alexandria's rich history from ancient times to the modern era.",
    image: "/images/alexandria-museum.jpg",
    rating: 4.7,
    reviews: 987,
    category: "Cultural",
    location: "Alexandria, Egypt",
    price: "EGP 50",
    duration: "2-3 hours",
    slug: "alexandria-museum"
  }
]

const categories = ["All", "Historical", "Palace", "Cultural", "Leisure"]

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [likedDestinations, setLikedDestinations] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLikedDestinations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const filteredDestinations = allDestinations.filter(destination => {
    const matchesCategory = selectedCategory === "All" || destination.category === selectedCategory
    const matchesSearch = destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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
       Best Destinations
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>


      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No destinations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <AnimatedSection key={destination.id} animation="fade-up" delay={index * 100}>
                <div className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <Link href={`/destinations/${destination.slug}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={destination.image}
                        alt={destination.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-accent text-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {destination.category}
                      </div>

                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleLike(destination.id)
                        }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-secondary/20 backdrop-blur-sm hover:bg-secondary/40 transition-all"
                      >
                        <Heart
                          className={`h-5 w-5 transition-all ${
                            likedDestinations.includes(destination.id)
                              ? "fill-red-500 text-red-500"
                              : "text-secondary"
                          }`}
                        />
                      </button>

                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-white text-sm font-medium">{destination.rating}</span>
                        <span className="text-white/70 text-xs">
                          ({destination.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                        <MapPin className="h-4 w-4" />
                        {destination.location}
                      </div>
                      
                      <h3 className="font-serif text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                        {destination.title}
                      </h3>
                      
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {destination.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-primary font-semibold">{destination.price}</span>
                          <span className="text-muted-foreground">• {destination.duration}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="group">
                          Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Link>
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