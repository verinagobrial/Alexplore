// app/activities/page.tsx
'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/alexplore/header"
import { Footer } from "@/components/alexplore/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, Star, ArrowRight, Compass, Waves, Camera, Utensils, 
  Search, Filter, X, Users, MapPin, Heart, Share2, ChevronDown,
  Mountain, Building, Landmark, Coffee
} from "lucide-react"
import { AnimatedSection } from "@/components/alexplore/animated-section"

const categories = [
  { id: "all", label: "All Activities", icon: Compass, color: "from-blue-500 to-cyan-500" },
  { id: "water", label: "Water Sports", icon: Waves, color: "from-cyan-500 to-teal-500" },
  { id: "culture", label: "Cultural", icon: Camera, color: "from-amber-500 to-orange-500" },
  { id: "food", label: "Food & Dining", icon: Utensils, color: "from-red-500 to-pink-500" },
  { id: "history", label: "Historical", icon: Landmark, color: "from-purple-500 to-indigo-500" },
  { id: "adventure", label: "Adventure", icon: Mountain, color: "from-green-500 to-emerald-500" },
]

const activities = [
  {
    id: 1,
    title: "Sunset Felucca Cruise",
    description: "Sail on a traditional Egyptian sailboat as the Mediterranean sun paints the sky in golden hues. An unforgettable romantic experience with complimentary Egyptian tea and snacks.",
    duration: "2 hours",
    price: 45,
    rating: 4.9,
    reviews: 856,
    badge: "BESTSELLER",
    image: "/images/sunset-sea.jpg",
    category: "water",
    groupSize: "2-8",
    difficulty: "Easy",
    location: "Eastern Harbor",
    included: ["Traditional sailboat", "Egyptian tea", "Snacks", "Life jackets"],
    highlights: ["Sunset views", "Traditional sailing experience", "Photo opportunities"]
  },
  {
    id: 2,
    title: "Diving at Qaitbay",
    description: "Explore underwater archaeological sites and discover ancient ruins beneath the Mediterranean waves. Perfect for certified divers with experienced guides.",
    duration: "4-5 hours",
    price: 85,
    rating: 4.8,
    reviews: 432,
    badge: "ADVENTURE",
    image: "/images/qaitbay-citadel.jpg",
    category: "water",
    groupSize: "4-6",
    difficulty: "Intermediate",
    location: "Qaitbay Citadel Area",
    included: ["Diving equipment", "Professional guide", "Underwater photos", "Refreshments"],
    highlights: ["Ancient ruins", "Marine life", "Professional guidance"]
  },
  {
    id: 3,
    title: "Grand Shahin Veranda",
    description: "Experience authentic Egyptian hospitality at one of Alexandria's most iconic seaside cafes with stunning panoramic views and traditional cuisine.",
    duration: "2-3 hours",
    price: 25,
    rating: 4.9,
    reviews: 1247,
    badge: "LOCAL FAVORITE",
    image: "/images/gallery-2.jpg",
    category: "food",
    groupSize: "Any",
    difficulty: "Easy",
    location: "Corniche",
    included: ["Welcome drink", "Traditional meal", "Dessert", "Tea/coffee"],
    highlights: ["Authentic cuisine", "Sea views", "Local atmosphere"]
  },
  {
    id: 4,
    title: "Bibliotheca Night Tour",
    description: "Discover the modern Library of Alexandria after dark with exclusive access to special exhibitions and rare manuscripts. Includes astronomer-guided stargazing session.",
    duration: "3 hours",
    price: 35,
    rating: 4.7,
    reviews: 689,
    badge: "EXCLUSIVE",
    image: "/images/bibliotheca.jpg",
    category: "culture",
    groupSize: "10-20",
    difficulty: "Easy",
    location: "Bibliotheca Alexandrina",
    included: ["Entry tickets", "Professional guide", "Stargazing equipment", "Hot drink"],
    highlights: ["Rare manuscripts", "Night access", "Stargazing experience"]
  },
  {
    id: 5,
    title: "Montaza Gardens Picnic",
    description: "Enjoy a curated gourmet picnic in the royal Montaza gardens with stunning palace views and Mediterranean breezes. Perfect for couples and families.",
    duration: "3 hours",
    price: 55,
    rating: 4.8,
    reviews: 423,
    badge: "ROMANTIC",
    image: "/images/montaza-palace.jpg",
    category: "food",
    groupSize: "2-4",
    difficulty: "Easy",
    location: "Montaza Palace Gardens",
    included: ["Gourmet picnic basket", "Blanket", "Wine/soft drinks", "Dessert"],
    highlights: ["Royal gardens", "Gourmet experience", "Palace views"]
  },
  {
    id: 6,
    title: "Roman Ruins Walking Tour",
    description: "Walk through 2000 years of history exploring ancient Roman amphitheaters, catacombs, and archaeological wonders with an expert Egyptologist.",
    duration: "4 hours",
    price: 40,
    rating: 4.9,
    reviews: 782,
    badge: "HISTORICAL",
    image: "/images/gallery-1.jpg",
    category: "history",
    groupSize: "6-15",
    difficulty: "Moderate",
    location: "Kom El-Dikka",
    included: ["Entry tickets", "Egyptologist guide", "Water", "Museum access"],
    highlights: ["Roman amphitheater", "Ancient catacombs", "Expert guidance"]
  },
  {
    id: 7,
    title: "Alexandria Food Tour",
    description: "Taste your way through Alexandria's best culinary spots, from fresh seafood to traditional Egyptian sweets. A feast for the senses!",
    duration: "4 hours",
    price: 65,
    rating: 4.9,
    reviews: 534,
    badge: "CULINARY",
    image: "/images/gallery-3.jpg",
    category: "food",
    groupSize: "4-8",
    difficulty: "Easy",
    location: "Various Locations",
    included: ["7 food tastings", "Local guide", "Beverages", "Food map"],
    highlights: ["Local specialties", "Hidden gems", "Cultural insights"]
  },
  {
    id: 8,
    title: "Catacombs Exploration",
    description: "Descend into the largest Roman burial site ever discovered in Egypt. Explore the fascinating underground chambers and learn about ancient funerary practices.",
    duration: "2.5 hours",
    price: 30,
    rating: 4.7,
    reviews: 321,
    badge: "UNESCO",
    image: "/images/catacombs.jpg",
    category: "history",
    groupSize: "8-12",
    difficulty: "Easy",
    location: "Kom El-Shuqafa",
    included: ["Entry ticket", "Guide", "Flashlight", "Water"],
    highlights: ["Underground chambers", "Roman-Egyptian art", "Ancient history"]
  },
  {
    id: 9,
    title: "Jet Ski Adventure",
    description: "Feel the thrill of speeding across the Mediterranean waters with stunning views of Alexandria's coastline and historic landmarks.",
    duration: "1 hour",
    price: 60,
    rating: 4.8,
    reviews: 245,
    badge: "THRILLING",
    image: "/images/jetski.jpg",
    category: "water",
    groupSize: "1-2",
    difficulty: "Intermediate",
    location: "Stanley Beach",
    included: ["Jet ski rental", "Safety gear", "Briefing", "Photos"],
    highlights: ["High-speed adventure", "Coastal views", "Photo opportunities"]
  }
]

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Category filter
    if (activeCategory !== "all" && activity.category !== activeCategory) return false
    
    // Search filter
    if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Price filter
    if (activity.price < priceRange[0] || activity.price > priceRange[1]) return false
    
    return true
  })

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const handleBookNow = (activityId: number) => {
    // Navigate to booking page with activity details
    window.location.href = `/booking?packageId=${activityId}&guests=1`
  }

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
        Discover Alexandrie's Best Activities
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>

        {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-white text-gray-900 border-0 shadow-lg"
              />
            </div>
    </div>
  </div>
</section>

            
          
          {/* </div>
        </div>
      </section> */}

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <AnimatedSection animation="fade-up" className="bg-white rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Price Range</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <div className="text-sm text-gray-600">
                Up to ${priceRange[1]}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>

        {/* Activity Cards Grid */}
        {sortedActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedActivities.map((activity, index) => (
              <AnimatedSection key={activity.id} animation="fade-up" delay={index * 100}>
                <div
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  onMouseEnter={() => setHoveredCard(activity.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className={`object-cover transition-all duration-700 ${
                        hoveredCard === activity.id ? "scale-110" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <Badge className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold">
                      {activity.badge}
                    </Badge>

                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                      <Heart className="h-4 w-4" />
                    </button>

                    {/* Quick Info Overlay */}
                    <div
                      className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm transition-all duration-300 ${
                        hoveredCard === activity.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Users className="h-4 w-4" />
                        {activity.groupSize}
                      </div>
                      <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {activity.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                        <h3 className="font-serif text-xl font-medium text-gray-900 group-hover:text-primary transition-colors">
                          {activity.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-full shrink-0">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-sm font-semibold">{activity.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        {activity.duration}
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-xs">({activity.reviews.toLocaleString()} reviews)</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-gray-500">From </span>
                        <span className="text-2xl font-semibold text-primary">${activity.price}</span>
                        <span className="text-sm text-gray-500">/person</span>
                      </div>
                      <Button
                        onClick={() => handleBookNow(activity.id)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white rounded-full group/btn hover:scale-105 transition-all"
                      >
                        Book Now
                        <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* View All Activities Link */}
        {activeCategory !== "all" && (
          <AnimatedSection delay={600} className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setActiveCategory("all")}
              className="group border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8"
            >
              View All Activities
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </AnimatedSection>
        )}
      </div>

      <Footer />
    </main>
  )
}