'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { TRAVEL_PACKAGES, formatPrice, type TravelPackage } from '@/lib/products'
import { Search, Clock, Users, Star, MapPin, Filter, ArrowRight } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All Packages' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'family', label: 'Family' },
]

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPackages = TRAVEL_PACKAGES.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

      {/* Filters & Packages */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Filter className="h-5 w-5 text-muted-foreground" />
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-8">
            Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
          </p>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No packages found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function PackageCard({ package: pkg }: { package: TravelPackage }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold capitalize">
            {pkg.category}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-serif font-bold text-white mb-1">{pkg.name}</h3>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {pkg.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Max {pkg.maxGuests}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>
        
        {/* Highlights */}
        <div className="mb-4">
          <ul className="text-sm space-y-1">
            {pkg.highlights.slice(0, 3).map((highlight, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{pkg.rating}</span>
              <span className="text-muted-foreground text-sm">({pkg.reviewCount} reviews)</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(pkg.priceInCents)}
              <span className="text-sm font-normal text-muted-foreground"> /person</span>
            </p>
          </div>
          <Link href={`/packages/${pkg.id}`}>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              View <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
