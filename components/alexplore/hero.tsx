"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, MapPin, Calendar, Users } from "lucide-react"
import { useState, useEffect } from "react"

const heroImages = [
  "/images/1678607223.jpg",
  "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
  "/images/1.jpg",
]

const stats = [
  { value: "50+", label: "Destinations" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "100+", label: "Local Guides" },
  { value: "15+", label: "Years Experience" },
]

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Mediterranean coast of Alexandria, Egypt"
              fill
              className="object-cover scale-105 animate-slow-zoom"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-foreground/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div
                className={`space-y-6 transition-all duration-1000 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* <div className="inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-full px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm text-secondary/90 font-medium">
                    New: Spring 2026 Tours Now Available
                  </span>
                </div> */}

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-secondary leading-[1.1] text-balance">
                  Discover the <span className="text-accent italic">Soul</span> of the Mediterranean
                </h1>

                <p className="text-lg md:text-xl text-secondary/80 max-w-xl text-pretty leading-relaxed">
                  Journey through ancient wonders, pristine beaches, and vibrant culture. 
                  Alexandria awaits with stories written in every corner.
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-200 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-foreground px-8 py-6 text-lg font-medium rounded-full group shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-secondary/30 text-secondary hover:bg-secondary/10 px-8 py-6 text-lg font-medium rounded-full group backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Video
                </Button>
              </div>

              {/* Quick Search Bar */}
              {/* <div
                className={`bg-secondary/10 backdrop-blur-md rounded-2xl p-4 border border-secondary/20 transition-all duration-1000 delay-300 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/10 rounded-xl">
                    <MapPin className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs text-secondary/60">Destination</p>
                      <p className="text-sm text-secondary font-medium">Alexandria, Egypt</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/10 rounded-xl">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs text-secondary/60">When</p>
                      <p className="text-sm text-secondary font-medium">Select Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/10 rounded-xl">
                    <Users className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs text-secondary/60">Travelers</p>
                      <p className="text-sm text-secondary font-medium">2 Adults</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Right Side - Featured Card */}
            <div
              className={`hidden lg:block transition-all duration-1000 delay-500 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
                <div className="relative bg-secondary/10 backdrop-blur-md rounded-3xl p-6 border border-secondary/20">
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-4">
                    <Image
                      src="/images/6.jpg"
                      alt="Qaitbay Citadel"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-secondary mb-2">Qaitbay Citadel</h3>
                  <p className="text-secondary/70 text-sm mb-4">
                    Explore the iconic 15th-century fortress built on the ancient Lighthouse site.
                  </p>
                  <div className="flex items-center justify-between">
                    {/* <div>
                      <span className="text-accent text-2xl font-semibold">$45</span>
                      <span className="text-secondary/60 text-sm"> /person</span>
                    </div> */}
                    {/* <Button size="sm" className="bg-accent hover:bg-accent/90 text-foreground rounded-full">
                      Book Now
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div
        className={`relative z-10 bg-primary/45 backdrop-blur-md border-t border-secondary/10 transition-all duration-1000 delay-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-serif text-accent font-semibold">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImage
                ? "w-8 bg-accent"
                : "w-2 bg-secondary/50 hover:bg-secondary/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
