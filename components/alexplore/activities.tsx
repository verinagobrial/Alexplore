"use client"
import Link from "next/link"
import Image from "next/image"
import { Clock, Star, ArrowRight, Users, Compass, Waves, Camera, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "./animated-section"
import { useState } from "react"

const categories = [
  { id: "all", label: "All Activities", icon: Compass },
  { id: "water", label: "Water Sports", icon: Waves },
  { id: "culture", label: "Cultural", icon: Camera },
  { id: "food", label: "Food & Dining", icon: Utensils },
]

const activities = [
  {
    title: "Sunset Felucca Cruise",
    description: "Sail on a traditional Egyptian sailboat as the Mediterranean sun paints the sky in golden hues. An unforgettable romantic experience.",
    duration: "2 hours",
    price: 45,
    rating: 4.9,
    reviews: 856,
    badge: "BESTSELLER",
    image: "/images/sunset-sea.jpg",
    category: "water",
    groupSize: "2-8",
    difficulty: "Easy",
  },
  {
    title: "Diving at Qaitbay",
    description: "Explore underwater archaeological sites and discover ancient ruins beneath the Mediterranean waves. Perfect for certified divers.",
    duration: "4-5 hours",
    price: 85,
    rating: 4.8,
    reviews: 432,
    badge: "ADVENTURE",
    image: "/images/qaitbay-citadel.jpg",
    category: "water",
    groupSize: "4-6",
    difficulty: "Intermediate",
  },
  {
    title: "Grand Shahin Veranda",
    description: "Experience authentic Egyptian hospitality at one of Alexandria's most iconic seaside cafes with stunning panoramic views.",
    duration: "2-3 hours",
    price: 25,
    rating: 4.9,
    reviews: 1247,
    badge: "LOCAL FAVORITE",
    image: "/images/gallery-2.jpg",
    category: "food",
    groupSize: "Any",
    difficulty: "Easy",
  },
  {
    title: "Bibliotheca Night Tour",
    description: "Discover the modern Library of Alexandria after dark with exclusive access to special exhibitions and rare manuscripts.",
    duration: "3 hours",
    price: 35,
    rating: 4.7,
    reviews: 689,
    badge: "EXCLUSIVE",
    image: "/images/bibliotheca.jpg",
    category: "culture",
    groupSize: "10-20",
    difficulty: "Easy",
  },
  {
    title: "Montaza Gardens Picnic",
    description: "Enjoy a curated gourmet picnic in the royal Montaza gardens with stunning palace views and Mediterranean breezes.",
    duration: "3 hours",
    price: 55,
    rating: 4.8,
    reviews: 423,
    badge: "ROMANTIC",
    image: "/images/montaza-palace.jpg",
    category: "food",
    groupSize: "2-4",
    difficulty: "Easy",
  },
  {
    title: "Roman Ruins Walking Tour",
    description: "Walk through 2000 years of history exploring ancient Roman amphitheaters, catacombs, and archaeological wonders.",
    duration: "4 hours",
    price: 40,
    rating: 4.9,
    reviews: 782,
    badge: "HISTORICAL",
    image: "/images/gallery-1.jpg",
    category: "culture",
    groupSize: "6-15",
    difficulty: "Moderate",
  },
]

export function Activities() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const filteredActivities =
    activeCategory === "all"
      ? activities
      : activities.filter((a) => a.category === activeCategory)

  return (
    <section className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Compass className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Experiences</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance">
            Activities & <span className="text-primary italic">Hidden</span> Gems
          </h2>
          <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
            From thrilling water adventures to serene cultural experiences, 
            discover extraordinary activities that reveal Alexandria&apos;s authentic spirit.
          </p>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection delay={200} className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "bg-secondary/50 text-foreground hover:bg-secondary hover:scale-105"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            )
          })}
        </AnimatedSection>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity, index) => (
            <AnimatedSection key={activity.title} animation="fade-up" delay={index * 100}>
              <div
                className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredCard === index ? "scale-110 brightness-90" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <Badge className="absolute top-4 left-4 bg-accent text-foreground text-xs font-semibold animate-pulse-subtle">
                    {activity.badge}
                  </Badge>

                  {/* Quick Info Overlay */}
                  <div
                    className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-secondary text-sm transition-all duration-300 ${
                      hoveredCard === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <div className="flex items-center gap-2 bg-foreground/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Users className="h-4 w-4" />
                      {activity.groupSize} people
                    </div>
                    <div className="bg-foreground/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {activity.difficulty}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full shrink-0">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm font-semibold">{activity.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {activity.duration}
                    </div>
                    <span className="text-border">|</span>
                    <span className="text-xs">({activity.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-sm text-muted-foreground">From </span>
                      <span className="text-2xl font-semibold text-primary">${activity.price}</span>
                      <span className="text-sm text-muted-foreground">/person</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group/btn hover:scale-105 transition-all"
                    >
                      Book
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Link */}
       
<AnimatedSection delay={600} className="text-center mt-12">
  <Link href="/activities">
    <Button
      size="lg"
      variant="outline"
      className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8"
    >
      Explore All Activities
      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  </Link>
</AnimatedSection>
      </div>
    </section>
  )
}
