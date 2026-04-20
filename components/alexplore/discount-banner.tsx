"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock, ArrowRight } from "lucide-react"
import { AnimatedSection } from "./animated-section"
import { useState, useEffect } from "react"

export function DiscountBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          days--
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (num: number) => num.toString().padStart(2, "0")

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
  <video 
    src="/images/From Main Klickpin CF- Pinterest Video - 6VyAL4JrC.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="object-cover w-full h-full"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/80" />
</div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm text-accent px-6 py-3 rounded-full text-sm font-medium mb-8 border border-accent/30">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Limited Time Offer - Save up to 30%
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light text-secondary mb-6 text-balance">
              Spring Sale
              <br />
              <span className="text-accent italic">Book Now & Save Big</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="text-lg md:text-xl text-secondary/80 max-w-2xl mx-auto mb-10 text-pretty">
              Unlock exclusive discounts on premium Alexandria experiences. 
              Limited availability - don&apos;t miss your chance to explore the Mediterranean&apos;s hidden gem.
            </p>
          </AnimatedSection>

          {/* Countdown Timer */}
          <AnimatedSection delay={300}>
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
              <div className="flex items-center gap-2 text-secondary/70">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Offer ends in:</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Min" },
                  { value: timeLeft.seconds, label: "Sec" },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-xl px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[70px]">
                      <span className="text-2xl md:text-3xl font-bold text-accent font-mono">
                        {formatTime(item.value)}
                      </span>
                    </div>
                    <span className="text-xs text-secondary/60 mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-foreground px-10 py-6 text-lg font-medium rounded-full shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-105 transition-all group"
              >
                Claim Your Discount
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary/30 text-secondary hover:bg-secondary/10 px-8 py-6 text-lg font-medium rounded-full backdrop-blur-sm"
              >
                View All Deals
              </Button>
            </div>
          </AnimatedSection>

          {/* Trust badges */}
          <AnimatedSection delay={500}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-secondary/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Booking
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                No Hidden Fees
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Free Cancellation
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
