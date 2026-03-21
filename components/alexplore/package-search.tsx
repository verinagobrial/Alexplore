"use client"

import { useState } from "react"
import { CalendarIcon, MapPin, Users, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { AnimatedSection } from "./animated-section"

const popularDestinations = [
  "Qaitbay Citadel",
  "Bibliotheca Alexandrina",
  "Montaza Palace",
  "The Corniche",
  "Roman Amphitheater",
]

export function PackageSearch() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [destination, setDestination] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredDestinations = popularDestinations.filter((d) =>
    d.toLowerCase().includes(destination.toLowerCase())
  )

  return (
    <section className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Find Your Journey</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 text-balance">
            Plan Your <span className="text-primary italic">Perfect</span> Trip
          </h2>
          <p className="text-muted-foreground text-lg">
            Search through our curated packages or create a custom adventure.
          </p>
        </AnimatedSection>

        {/* Search Form */}
        <AnimatedSection delay={200}>
          <div className="max-w-5xl mx-auto relative">
            {/* Decorative background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-[2rem] blur-2xl opacity-50" />
            
            <div className="relative bg-card rounded-3xl shadow-2xl border border-border/50 p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Destination */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destination
                  </label>
                  <div className="relative">
                    <Input 
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Where do you want to go?" 
                      className="bg-secondary/30 border-border/50 focus:border-primary h-12 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredDestinations.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden z-10 animate-fade-in">
                        {filteredDestinations.map((dest) => (
                          <button
                            key={dest}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
                            onClick={() => {
                              setDestination(dest)
                              setShowSuggestions(false)
                            }}
                          >
                            <MapPin className="h-4 w-4 text-primary" />
                            {dest}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pax Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Travelers
                  </label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="2 Adults" 
                      min="1"
                      defaultValue={2}
                      className="bg-secondary/30 border-border/50 focus:border-primary h-12 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Check-in
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-secondary/30 border-border/50 hover:bg-secondary/50 h-12 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                      >
                        {checkIn ? (
                          format(checkIn, "MMM dd, yyyy")
                        ) : (
                          <span className="text-muted-foreground">Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Check-out
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-secondary/30 border-border/50 hover:bg-secondary/50 h-12 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                      >
                        {checkOut ? (
                          format(checkOut, "MMM dd, yyyy")
                        ) : (
                          <span className="text-muted-foreground">Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-medium rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/25 w-full sm:w-auto"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Packages
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-medium rounded-full w-full sm:w-auto group"
                >
                  <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Custom Trip
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Popular Searches */}
        <AnimatedSection delay={400} className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">Popular searches:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {popularDestinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setDestination(dest)}
                className="px-4 py-2 bg-secondary/50 hover:bg-primary/10 text-foreground text-sm rounded-full transition-all hover:scale-105"
              >
                {dest}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
