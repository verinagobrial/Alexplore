"use client"

import Image from "next/image"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedSection } from "./animated-section"
import { useState, useEffect } from "react"

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "New York, USA",
    avatar: "SM",
    rating: 5,
    text: "Alexplore made our Alexandria trip absolutely magical. From the moment we arrived, every detail was perfectly planned. The Qaitbay Citadel at sunset was breathtaking!",
    trip: "Mediterranean Escape Package",
  },
  {
    name: "David Chen",
    location: "London, UK",
    avatar: "DC",
    rating: 5,
    text: "The local guides were incredibly knowledgeable. We discovered hidden gems we would never have found on our own. The diving experience was world-class!",
    trip: "Adventure Explorer Package",
  },
  {
    name: "Elena Rodriguez",
    location: "Barcelona, Spain",
    avatar: "ER",
    rating: 5,
    text: "As a solo traveler, I felt completely safe and welcomed. The team organized everything flawlessly, and the accommodations exceeded my expectations.",
    trip: "Alexandria Heritage Tour",
  },
  {
    name: "Mohammed Al-Rashid",
    location: "Dubai, UAE",
    avatar: "MA",
    rating: 5,
    text: "The cultural immersion was authentic and respectful. We visited places that showed the true soul of Alexandria. Already planning our second trip!",
    trip: "Cultural Discovery Package",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 lg:py-32 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Testimonials</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance">
            What Our <span className="text-primary italic">Travelers</span> Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from real adventurers who discovered Alexandria with us.
          </p>
        </AnimatedSection>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 w-12 h-12 rounded-full bg-card shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 w-12 h-12 rounded-full bg-card shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Testimonial Card */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-lg border border-border/50 text-center">
                    {/* Quote Icon */}
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                      <Quote className="h-8 w-8 text-accent" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-6">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-accent fill-current" />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-lg lg:text-xl text-foreground leading-relaxed mb-8 font-serif italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        <p className="text-xs text-primary mt-1">{testimonial.trip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <AnimatedSection delay={300}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-serif text-primary font-semibold">4.9</div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-current" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary font-semibold">2,847</div>
              <div className="text-sm text-muted-foreground mt-2">Verified Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary font-semibold">98%</div>
              <div className="text-sm text-muted-foreground mt-2">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-primary font-semibold">15+</div>
              <div className="text-sm text-muted-foreground mt-2">Years of Excellence</div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
