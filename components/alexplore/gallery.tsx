"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Camera, Instagram } from "lucide-react"
import { AnimatedSection } from "./animated-section"
import { Button } from "@/components/ui/button"

const galleryImages = [
  { src: "/images/5.jpg", alt: "Qaitbay Citadel", category: "Historical" },
  { src: "/images/7.jpg", alt: "Montaza Palace", category: "Palace" },
  { src: "/images/9.jpg", alt: "Abu al-Abbas al-Mursi Mosque", category: "Religious" },
  { src: "/images/4.jpg", alt: "Bibliotheca Alexandrina", category: "Cultural" },
  { src: "/images/Alexandria _ Egypt.jpeg", alt: "Alexandria Corniche", category: "Coastal" },
  { src: "/images/b94630d732490f4fa15a61d13a2651d3.jpg", alt: "Mediterranean Sunset", category: "Nature" },
  { src: "/images/bridge.jpeg", alt: "Roman Amphitheater", category: "Historical" },
  { src: "/images/b1e244e6-8b55-49d8-b849-833330ed6af6.jpeg", alt: "Local Cuisine", category: "Food" },
  { src: "/images/Alexandria - City Branding.jpg", alt: "Alexandria Skyline", category: "Coastal" },
  { src: "/images/a7fb252b-d905-4576-9320-209cc1d166fa.jpeg", alt: "Luxury Resort", category: "Hotels" },
  { src: "/images/Alexandria Library  Alexandria - Egypt.jpeg", alt: "Beachfront Hotel", category: "Hotels" },
  { src: "/images/Qaitbay Fort2.jpeg", alt: "Beachfront Hotel", category: "Hotels" },
]

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  
  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % galleryImages.length)
    }
  }
  
  const goToPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === "ArrowRight") goToNext()
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  return (
    <section className="py-24 lg:py-32 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Camera className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Visual Journey</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-balance">
            Capture the <span className="text-primary italic">Magic</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            Browse through stunning moments captured by travelers from around the world.
          </p>
        </AnimatedSection>

        {/* Gallery Grid - Masonry Style */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((image, index) => (
            <AnimatedSection
              key={index}
              animation="scale-up"
              delay={index * 50}
              className="break-inside-avoid"
            >
              <div
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => openLightbox(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`relative ${index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredIndex === index ? "scale-110 brightness-75" : "scale-100"
                    }`}
                  />
                  
                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="bg-secondary/90 backdrop-blur-sm rounded-full p-4 mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                      <Camera className="h-6 w-6 text-foreground" />
                    </div>
                    <span className="text-secondary font-medium text-sm bg-foreground/60 backdrop-blur-sm px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                      {image.alt}
                    </span>
                    <span className="text-secondary/70 text-xs mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Instagram CTA */}
        <AnimatedSection delay={600} className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-secondary rounded-full px-8 group"
          >
            <Instagram className="mr-2 h-5 w-5" />
            Follow @Alexplore
          </Button>
          <p className="text-muted-foreground text-sm mt-4">
            Tag #AlexploreTravel to be featured in our gallery
          </p>
        </AnimatedSection>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-md flex items-center justify-center animate-fade-in"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-secondary hover:text-accent transition-colors z-10 bg-secondary/10 rounded-full p-2 hover:bg-secondary/20"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-6 text-secondary hover:text-accent transition-colors z-10 bg-secondary/10 rounded-full p-3 hover:bg-secondary/20"
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              className="absolute right-6 text-secondary hover:text-accent transition-colors z-10 bg-secondary/10 rounded-full p-3 hover:bg-secondary/20"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image */}
            <div
              className="relative max-w-5xl w-full aspect-video mx-4 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[selectedIndex].src}
                alt={galleryImages[selectedIndex].alt}
                fill
                className="object-contain"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent">
                <p className="text-secondary font-serif text-2xl">{galleryImages[selectedIndex].alt}</p>
                <p className="text-secondary/70 text-sm mt-1">{galleryImages[selectedIndex].category}</p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-secondary/50 hover:bg-secondary/70"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
