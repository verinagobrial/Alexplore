// app/heritage/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Landmark, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Star, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Church,
  Sparkles,
  Heart,
  Share2,
  Navigation,
  Info,
  Users,
  Camera,
  Languages
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/alexplore/animated-section'

// Types
interface HeritageSite {
  id: number
  name: string
  category: 'mosque' | 'church' | 'synagogue' | 'monastery'
  description: string
  longDescription: string
  image: string
  gallery: string[]
  location: string
  address: string
  phone?: string
  website?: string
  openingHours: string
  entryFee: string
  rating: number
  reviewCount: number
  features: string[]
  history: string
  bestTimeToVisit: string
  dressCode: string
  prayerTimes?: string
  massTimes?: string
}

const heritageSites: HeritageSite[] = [
  {
    id: 1,
    name: "Abu al-Abbas al-Mursi Mosque",
    category: "mosque",
    description: "One of the largest and most beautiful mosques in Alexandria, featuring stunning Andalusian architecture.",
    longDescription: "The Abu al-Abbas al-Mursi Mosque is the largest mosque in Alexandria and one of the most important Islamic landmarks in Egypt. Built in the 13th century, it features stunning Andalusian-style architecture with intricate geometric patterns, beautiful calligraphy, and towering minarets. The mosque is dedicated to the 13th-century Sufi saint Ahmed Abu al-Abbas al-Mursi, a revered figure in Islamic history.",
    image: "/images/274967-مسجد-العطارين-في-الإسكندرية.jpeg",
    gallery: [
      "/images/274967-مسجد-العطارين-في-الإسكندرية.jpeg",
      "/images/mosque-interior.jpg",
      "/images/mosque-courtyard.jpg"
    ],
    location: "Al Attarin, Alexandria",
    address: "Abu al-Abbas al-Mursi Mosque, Al Attarin, Alexandria Governorate",
    phone: "+20 3 480 2158",
    website: "https://example.com/abu-al-abbas-mosque",
    openingHours: "Daily: 8:00 AM - 8:00 PM (Closed during prayer times for 30 minutes)",
    entryFee: "Free (Donations appreciated)",
    rating: 4.8,
    reviewCount: 1243,
    features: ["Andalusian Architecture", "Guided Tours Available", "Wheelchair Accessible", "Free Wi-Fi", "Library", "Islamic Calligraphy"],
    history: "Built in 1943 on the site of a 13th-century tomb, the mosque has become a symbol of Alexandria. The original tomb dates back to 1286 when the saint passed away.",
    bestTimeToVisit: "Early morning (8-10 AM) or late afternoon (4-6 PM) for fewer crowds and beautiful lighting",
    dressCode: "Conservative dress required - Long sleeves and pants/skirts. Headscarves available for women",
    prayerTimes: "5 daily prayers - Fajr (5:00 AM), Dhuhr (12:00 PM), Asr (3:30 PM), Maghrib (5:45 PM), Isha (7:15 PM)"
  },
  {
    id: 2,
    name: "St. Mark's Coptic Orthodox Cathedral",
    category: "church",
    description: "The historic seat of the Pope of the Coptic Orthodox Church and one of the oldest Christian sites in Egypt.",
    longDescription: "St. Mark's Cathedral is the most important Coptic Christian site in Alexandria. Built on the site where St. Mark the Evangelist founded the Church of Alexandria in 61 AD, this cathedral serves as the official seat of the Pope of the Coptic Orthodox Church. The current structure, completed in 2019, is one of the largest cathedrals in the Middle East.",
    image: "/images/st_ mercurius coptic alexandria - Bing.jpeg",
    gallery: [
      "/images/st_ mercurius coptic alexandria - Bing.jpeg",
      "/images/cathedral-interior.jpg",
      "/images/cathedral-altar.jpg"
    ],
    location: "Mahattat al-Raml, Alexandria",
    address: "St. Mark's Coptic Orthodox Cathedral, Mahattat al-Raml, Alexandria",
    phone: "+20 3 392 5458",
    website: "https://example.com/st-marks-cathedral",
    openingHours: "Daily: 9:00 AM - 5:00 PM (Closed during services)",
    entryFee: "Free",
    rating: 4.7,
    reviewCount: 892,
    features: ["Historic Architecture", "Papal Seat", "Icon Museum", "St. Mark's Relics", "Copt Museum", "Library"],
    history: "Originally built in 62 AD, the cathedral has undergone numerous reconstructions, with the most recent completed in 2019 after a bombing in 2011.",
    bestTimeToVisit: "Morning hours (9-11 AM) to avoid crowds and attend morning prayers",
    dressCode: "Modest attire required - Shoulders and knees covered",
    massTimes: "Sunday: 7:00 AM, 9:00 AM, 11:00 AM | Weekdays: 8:00 AM"
  },
  {
    id: 3,
    name: "Eliyahu Hanavi Synagogue",
    category: "synagogue",
    description: "The only remaining synagogue in Alexandria, representing the rich Jewish heritage of the city.",
    longDescription: "The Eliyahu Hanavi Synagogue is the oldest synagogue in Egypt, named after the biblical prophet Elijah. Built in 1354 and reconstructed in the 19th century, it once served Alexandria's thriving Jewish community. Today, it stands as a testament to the city's multicultural heritage and is protected as a historic monument.",
    image: "/images/eliahu hanavi.jpg",
    gallery: [
      "/images/eliahu hanavi.jpg",
      "/images/synagogue-interior.jpg",
      "/images/synagogue-torah.jpg"
    ],
    location: "Mansheya, Alexandria",
    address: "Eliyahu Hanavi Synagogue, Mansheya, Alexandria",
    phone: "+20 3 484 2185",
    openingHours: "Sunday-Thursday: 10:00 AM - 2:00 PM (By appointment only)",
    entryFee: "Free (Registration required)",
    rating: 4.6,
    reviewCount: 456,
    features: ["Roman-era Columns", "Torah Scrolls", "Historic Cemetery", "Jewish Museum", "Archival Library"],
    history: "The original synagogue dates back to 1354, with the current structure built in the 1850s. It was renovated in 2017 with Egyptian government support.",
    bestTimeToVisit: "Weekdays between 10 AM - 12 PM, booking at least 24 hours in advance",
    dressCode: "Conservative dress, men required to wear kippah (provided)"
  },
  {
    id: 4,
    name: "St. Catherine's Church",
    category: "church",
    description: "Beautiful Catholic church with stunning stained glass windows and Italian architecture.",
    longDescription: "St. Catherine's Church is a beautiful Roman Catholic church located in central Alexandria. Built in the 19th century by Italian missionaries, it features stunning neo-Gothic architecture with magnificent stained glass windows depicting scenes from the life of St. Catherine of Alexandria.",
    image: "/images/st-catherine-church.jpg",
    gallery: [
      "/images/st-catherine-church.jpg",
      "/images/st-catherine-altar.jpg"
    ],
    location: "Mansheya, Alexandria",
    address: "St. Catherine's Church, Mansheya Square, Alexandria",
    phone: "+20 3 480 9874",
    openingHours: "Daily: 8:00 AM - 7:00 PM",
    entryFee: "Free",
    rating: 4.5,
    reviewCount: 378,
    features: ["Neo-Gothic Architecture", "Stained Glass Windows", "Pipe Organ", "Italian Frescoes", "Peace Garden"],
    history: "Built in 1880 by Italian Franciscan missionaries, the church has served Alexandria's Catholic community for over 140 years.",
    bestTimeToVisit: "Afternoon (2-4 PM) when sunlight illuminates the stained glass windows beautifully",
    dressCode: "Modest attire please"
  }
]

// Categories for filtering
const categories = [
  { id: 'all', label: 'All Sites', icon: Landmark },
  { id: 'mosque', label: 'Mosques', icon: Sparkles },
  { id: 'church', label: 'Churches', icon: Church },
  { id: 'synagogue', label: 'Synagogues', icon: Star }
]

export default function HeritagePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const filteredSites = selectedCategory === 'all' 
    ? heritageSites 
    : heritageSites.filter(site => site.category === selectedCategory)

  const nextImage = () => {
    if (selectedSite) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedSite.gallery.length)
    }
  }

  const prevImage = () => {
    if (selectedSite) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedSite.gallery.length) % selectedSite.gallery.length)
    }
  }

  return (
    <>
      <Header />
      
      {/* Hero Section */}
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
        Heritage Sites of Alexandria
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full gap-2 ${selectedCategory === category.id ? 'bg-primary' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Sites Grid */}
        <AnimatedSection animation="fade-up" className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((site) => (
              <Card 
                key={site.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedSite(site)}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={site.image}
                    alt={site.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800">
                      {site.rating} ★
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-serif font-semibold">{site.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {site.location}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {site.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Open today</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Learn More
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Featured Section */}
        <AnimatedSection animation="fade-up">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                  Plan Your Sacred Journey
                </h2>
                <p className="text-muted-foreground mb-6">
                  Experience the spiritual richness of Alexandria with our guided heritage tours. 
                  Our expert guides will take you through centuries of faith and history.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-primary">
                    Book a Guided Tour
                  </Button>
                  <Button variant="outline">
                    Download Map
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Sacred Sites</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">2000+</div>
                  <div className="text-sm text-muted-foreground">Years of History</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="text-sm text-muted-foreground">Religions</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Expert Guides</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Site Details Modal */}
      {selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-4xl w-full bg-background rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSite(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Gallery */}
            <div className="relative h-96 bg-gray-900">
              <Image
                src={selectedSite.gallery[currentImageIndex]}
                alt={selectedSite.name}
                fill
                className="object-contain"
              />
              
              {selectedSite.gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedSite.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">{selectedSite.name}</h2>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {selectedSite.rating} ({selectedSite.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedSite.location}
                </span>
              </div>

              <p className="text-muted-foreground mb-6">{selectedSite.longDescription}</p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Practical Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Opening Hours</p>
                        <p className="text-muted-foreground">{selectedSite.openingHours}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Entry Fee</p>
                        <p className="text-muted-foreground">{selectedSite.entryFee}</p>
                      </div>
                    </div>
                    {selectedSite.phone && (
                      <div className="flex gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-muted-foreground">{selectedSite.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedSite.website && (
                      <div className="flex gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a href={selectedSite.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Visitor Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Best Time to Visit</p>
                        <p className="text-muted-foreground">{selectedSite.bestTimeToVisit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Dress Code</p>
                        <p className="text-muted-foreground">{selectedSite.dressCode}</p>
                      </div>
                    </div>
                    {selectedSite.prayerTimes && (
                      <div className="flex gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Prayer Times</p>
                          <p className="text-muted-foreground">{selectedSite.prayerTimes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Historical Significance</h3>
                <p className="text-muted-foreground text-sm">{selectedSite.history}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2">
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Save to Wishlist
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}