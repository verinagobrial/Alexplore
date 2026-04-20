"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Landmark, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const features = [
  "Stunning 19th-century architecture",
  "Overlooks the Mediterranean Sea",
  "Hosts major religious celebrations",
  "Open to visitors of all faiths",
]

const heritageImages = [
  {
    src: "/images/274967-مسجد-العطارين-في-الإسكندرية.jpeg",
    alt: "Abu al-Abbas al-Mursi Mosque in Alexandria",
    title: "Abu al-Abbas al-Mursi Mosque",
    description: "One of the largest and most beautiful mosques in Alexandria"
  },
  {
    src: "/images/st_ mercurius coptic alexandria - Bing.jpeg",
    alt: "St. Mark's Coptic Orthodox Cathedral",
    title: "St. Mark's Coptic Cathedral",
    description: "The historic seat of the Pope of the Coptic Orthodox Church"
  },
  {
    src: "/images/eliahu hanavi.jpg",
    alt: "Interior of Abu al-Abbas al-Mursi Mosque",
    title: "Sacred Interior Views",
    description: "Intricate Islamic architecture and spiritual atmosphere"
  }
]

export function Heritage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heritageImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heritageImages.length) % heritageImages.length)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Change image every 5 seconds
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <section className="py-24 lg:py-32 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <AnimatedSection animation="fade-right" className="space-y-8 lg:pr-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <Landmark className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Sacred Heritage</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-balance">
              Religious <span className="text-primary italic">Heritage</span> of Alexandria
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
              Alexandria is home to some of the most sacred and historically significant religious sites in the Mediterranean. From the magnificent Abu al-Abbas al-Mursi Mosque to ancient Coptic churches, the city stands as a testament to centuries of faith and devotion.
            </p>

            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <h3 className="font-serif text-xl text-foreground mb-4">
                {heritageImages[currentIndex].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {heritageImages[currentIndex].description}
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 hover:scale-105 transition-all"
            >
              Explore Sacred Sites
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </AnimatedSection>

          {/* Image Carousel */}
          <AnimatedSection animation="fade-left" className="relative order-1 lg:order-2">
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/20 rounded-3xl -z-10 animate-pulse-subtle" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-3xl -z-10 animate-pulse-subtle" style={{ animationDelay: "1s" }} />
              
              {/* Main Image Container */}
              <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl group">
                {heritageImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentIndex
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-full"
                    }`}
                    style={{
                      transform: index === currentIndex 
                        ? "translateX(0)" 
                        : index < currentIndex 
                          ? "translateX(-100%)" 
                          : "translateX(100%)"
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heritageImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-8 h-2 bg-white"
                        : "w-2 h-2 bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 lg:right-8 bg-card rounded-2xl p-4 shadow-xl border border-border/50 animate-float hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Heritage Sites</p>
                    <p className="text-2xl font-serif text-primary font-semibold">50+</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}