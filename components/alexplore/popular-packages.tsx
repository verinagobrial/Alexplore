"use client"

import Image from "next/image"
import { Star, MapPin, Utensils, Plane, Clock, Users, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "./animated-section"
import { useState } from "react"

const packages = [
  {
    title: "Alexandria Heritage Tour",
    description: "Immerse yourself in ancient history with guided tours of Alexandria's most iconic landmarks.",
    duration: "5 Days / 4 Nights",
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviews: 847,
    location: "Alexandria, Egypt",
    image: "/images/qaitbay-citadel.jpg",
    features: ["Breakfast Included", "Airport Transfer", "Guided Tours", "Entry Tickets"],
    highlights: ["Qaitbay Citadel", "Bibliotheca Alexandrina", "Roman Amphitheater"],
    badge: "BESTSELLER",
    maxGroup: 12,
  },
  {
    title: "Mediterranean Escape",
    description: "The ultimate luxury experience combining Alexandria and Cairo's finest attractions.",
    duration: "7 Days / 6 Nights",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 623,
    location: "Alexandria & Cairo",
    image: "/images/montaza-palace.jpg",
    features: ["All Meals", "Flight Included", "5-Star Hotels", "Private Transport"],
    highlights: ["Montaza Palace", "Pyramids of Giza", "Sphinx", "Egyptian Museum"],
    badge: "LUXURY",
    maxGroup: 8,
  },
  {
    title: "Adventure Explorer",
    description: "For thrill-seekers: diving, sailing, and off-the-beaten-path discoveries.",
    duration: "6 Days / 5 Nights",
    price: 949,
    originalPrice: 1149,
    rating: 4.9,
    reviews: 412,
    location: "Alexandria Coast",
    image: "/images/sunset-sea.jpg",
    features: ["Equipment Included", "Expert Guides", "Lunch Daily", "Insurance"],
    highlights: ["Scuba Diving", "Felucca Sailing", "Desert Safari", "Snorkeling"],
    badge: "ADVENTURE",
    maxGroup: 10,
  },
]

export function PopularPackages() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="packages" className="py-24 lg:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Plane className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Curated Packages</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance">
            Popular <span className="text-primary italic">Travel</span> Packages
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Carefully curated experiences designed to show you the very best of Alexandria and beyond.
          </p>
        </AnimatedSection>

        {/* Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
              <div
                className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 h-full flex flex-col"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredIndex === index ? "scale-110 brightness-90" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <Badge className="absolute top-4 left-4 bg-accent text-foreground text-xs font-semibold">
                    {pkg.badge}
                  </Badge>

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                      <span className="text-sm line-through text-muted-foreground">${pkg.originalPrice}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">/person</span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-secondary text-sm">
                    <div className="flex items-center gap-1 bg-foreground/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center gap-1 bg-foreground/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Users className="h-4 w-4" />
                      Max {pkg.maxGroup}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-serif text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full shrink-0">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    {pkg.location}
                    <span className="text-border">|</span>
                    <span className="text-xs">({pkg.reviews} reviews)</span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {pkg.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full group/btn hover:scale-[1.02] transition-all"
                    >
                      Book This Package
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Custom Trip CTA */}
        <AnimatedSection delay={500} className="mt-16">
          <div className="bg-primary rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="/images/hero-alexandria.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="font-serif text-3xl lg:text-4xl text-primary-foreground mb-4">
                Looking for Something Different?
              </h3>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Let our travel experts create a custom itinerary tailored to your preferences, 
                budget, and travel style. Your perfect Alexandria adventure awaits.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-foreground rounded-full px-8 hover:scale-105 transition-all"
              >
                Create Custom Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
