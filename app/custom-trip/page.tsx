// app/custom-trip/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/alexplore/header"
import { Footer } from "@/components/alexplore/footer"
import Image from "next/image"
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign, 
  Heart, 
  Check,
  Send,
  User,
  Mail,
  Phone,
  MessageCircle,
  Plane,
  Hotel,
  Utensils,
  Camera,
  ShoppingBag,
  Landmark,
  Waves,
  Mountain,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/alexplore/animated-section"

// Step data
const steps = [
  { number: 1, title: "Basic Info", icon: User },
  { number: 2, title: "Travel Details", icon: Calendar },
  { number: 3, title: "Interests", icon: Heart },
  { number: 4, title: "Budget", icon: DollarSign },
  { number: 5, title: "Review", icon: Check }
]

// Interests data
const interests = [
  { id: "history", label: "History & Culture", icon: Landmark, emoji: "🏛️" },
  { id: "beach", label: "Beach & Relaxation", icon: Waves, emoji: "🏖️" },
  { id: "food", label: "Food & Dining", icon: Utensils, emoji: "🍽️" },
  { id: "adventure", label: "Adventure", icon: Mountain, emoji: "⛰️" },
  { id: "photography", label: "Photography", icon: Camera, emoji: "📸" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, emoji: "🛍️" },
  { id: "luxury", label: "Luxury Experience", icon: Hotel, emoji: "✨" },
  { id: "local", label: "Local Life", icon: MapPin, emoji: "🏘️" }
]

// Budget ranges
const budgets = [
  { id: "budget", label: "Budget", range: "$500 - $800", description: "Comfortable stay with essential experiences" },
  { id: "moderate", label: "Moderate", range: "$800 - $1200", description: "Good hotels with premium experiences" },
  { id: "luxury", label: "Luxury", range: "$1200 - $2000", description: "Luxury hotels and exclusive experiences" },
  { id: "premium", label: "Premium", range: "$2000+", description: "Ultimate luxury with private guides" }
]

// Accommodation preferences
const accommodations = [
  { id: "budget", label: "Budget Hotel", price: "$$" },
  { id: "mid", label: "Mid-Range Hotel", price: "$$$" },
  { id: "luxury", label: "Luxury Hotel", price: "$$$$" },
  { id: "resort", label: "Beach Resort", price: "$$$$" },
  { id: "boutique", label: "Boutique Hotel", price: "$$$" }
]

export default function CustomTripPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: "",
    email: "",
    phone: "",
    
    // Step 2: Travel Details
    travelDate: "",
    duration: "",
    groupSize: "2",
    travelers: [] as string[],
    
    // Step 3: Interests
    selectedInterests: [] as string[],
    specialRequests: "",
    
    // Step 4: Budget & Preferences
    budget: "",
    accommodation: "",
    mealsIncluded: false,
    transportIncluded: false,
    guideIncluded: false,
    
    // Additional
    hearAboutUs: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(i => i !== interestId)
        : [...prev.selectedInterests, interestId]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log("Custom trip request:", formData)
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // In production, send to your API
    // await fetch('/api/custom-trip', { method: 'POST', body: JSON.stringify(formData) })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} />
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} />
      case 3:
        return <Step3 formData={formData} toggleInterest={toggleInterest} updateFormData={updateFormData} />
      case 4:
        return <Step4 formData={formData} updateFormData={updateFormData} budgets={budgets} accommodations={accommodations} />
      case 5:
        return <Step5 formData={formData} />
      default:
        return null
    }
  }

  if (isSubmitted) {
    return <SuccessScreen formData={formData} router={router} />
  }

  return (
    <main className="min-h-screen bg-gray-50">
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
        Custom Your Trip
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>


      {/* Progress Steps */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex-1 text-center">
                  <div className="relative">
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all ${
                      isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                      isCompleted ? "bg-accent text-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                    </div>
                    <div className="hidden md:block text-xs mt-2 text-muted-foreground">
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 ${
                      isCompleted ? "bg-accent" : "bg-secondary"
                    }`} style={{ transform: 'translateX(-50%)' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="bg-card rounded-3xl shadow-xl p-6 md:p-8">
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="rounded-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-full bg-accent hover:bg-accent/90 text-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground border-t-transparent mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    <Footer />
    </main>
  )
}

// Step 1: Basic Information
function Step1({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Tell us about yourself</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email Address *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone Number *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+20 123 456 7890"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
        <select
          value={formData.hearAboutUs}
          onChange={(e) => updateFormData("hearAboutUs", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select an option</option>
          <option value="google">Google Search</option>
          <option value="social">Social Media</option>
          <option value="friend">Friend/Family</option>
          <option value="travel">Travel Agency</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  )
}

// Step 2: Travel Details
function Step2({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Travel Preferences</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Preferred Travel Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={formData.travelDate}
            onChange={(e) => updateFormData("travelDate", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Trip Duration</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={formData.duration}
            onChange={(e) => updateFormData("duration", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select duration</option>
            <option value="3">3-4 Days</option>
            <option value="5">5-7 Days</option>
            <option value="8">8-10 Days</option>
            <option value="11">11-14 Days</option>
            <option value="14+">2+ Weeks</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Number of Travelers</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={formData.groupSize}
            onChange={(e) => updateFormData("groupSize", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1">Solo Traveler</option>
            <option value="2">2 Travelers</option>
            <option value="3">3 Travelers</option>
            <option value="4">4 Travelers</option>
            <option value="5">5+ Travelers</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Traveler Type</label>
        <div className="grid grid-cols-2 gap-3">
          {["Solo", "Couple", "Family", "Friends", "Business", "Group"].map((type) => (
            <label key={type} className="flex items-center gap-2 p-3 rounded-xl border border-input cursor-pointer hover:bg-secondary/50">
              <input
                type="checkbox"
                value={type}
                checked={formData.travelers.includes(type)}
                onChange={(e) => {
                  const newTravelers = e.target.checked
                    ? [...formData.travelers, type]
                    : formData.travelers.filter((t: string) => t !== type)
                  updateFormData("travelers", newTravelers)
                }}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// Step 3: Interests
function Step3({ formData, toggleInterest, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">What interests you?</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest) => {
          const Icon = interest.icon
          const isSelected = formData.selectedInterests.includes(interest.id)
          
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{interest.emoji}</span>
                <div>
                  <p className="font-medium">{interest.label}</p>
                </div>
                {isSelected && <Check className="ml-auto h-5 w-5 text-primary" />}
              </div>
            </button>
          )
        })}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Special Requests</label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            value={formData.specialRequests}
            onChange={(e) => updateFormData("specialRequests", e.target.value)}
            rows={4}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Any dietary restrictions, accessibility needs, or special requests?"
          />
        </div>
      </div>
    </div>
  )
}

// Step 4: Budget & Preferences
function Step4({ formData, updateFormData, budgets, accommodations }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Budget & Preferences</h2>

      <div>
        <label className="block text-sm font-medium mb-3">Budget per person</label>
        <div className="grid gap-3">
          {budgets.map((budget: any) => (
            <label
              key={budget.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.budget === budget.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="budget"
                value={budget.id}
                checked={formData.budget === budget.id}
                onChange={(e) => updateFormData("budget", e.target.value)}
                className="sr-only"
              />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{budget.label}</p>
                  <p className="text-sm text-muted-foreground">{budget.range}</p>
                  <p className="text-xs text-muted-foreground mt-1">{budget.description}</p>
                </div>
                {formData.budget === budget.id && <Check className="h-5 w-5 text-primary" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Accommodation Preference</label>
        <div className="grid grid-cols-2 gap-3">
          {accommodations.map((acc: any) => (
            <label
              key={acc.id}
              className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                formData.accommodation === acc.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="accommodation"
                value={acc.id}
                checked={formData.accommodation === acc.id}
                onChange={(e) => updateFormData("accommodation", e.target.value)}
                className="sr-only"
              />
              <div>
                <p className="font-medium">{acc.label}</p>
                <p className="text-xs text-muted-foreground">{acc.price}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium mb-2">Additional Inclusions</label>
        
        <label className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer">
          <span>Meals Included</span>
          <input
            type="checkbox"
            checked={formData.mealsIncluded}
            onChange={(e) => updateFormData("mealsIncluded", e.target.checked)}
            className="toggle"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer">
          <span>Private Transport</span>
          <input
            type="checkbox"
            checked={formData.transportIncluded}
            onChange={(e) => updateFormData("transportIncluded", e.target.checked)}
            className="toggle"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer">
          <span>Private Guide</span>
          <input
            type="checkbox"
            checked={formData.guideIncluded}
            onChange={(e) => updateFormData("guideIncluded", e.target.checked)}
            className="toggle"
          />
        </label>
      </div>
    </div>
  )
}

// Step 5: Review
function Step5({ formData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Review Your Request</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <User className="h-4 w-4" /> Personal Information
          </h3>
          <p className="text-sm">Name: {formData.fullName || "Not provided"}</p>
          <p className="text-sm">Email: {formData.email || "Not provided"}</p>
          <p className="text-sm">Phone: {formData.phone || "Not provided"}</p>
        </div>

        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Travel Details
          </h3>
          <p className="text-sm">Date: {formData.travelDate || "Not specified"}</p>
          <p className="text-sm">Duration: {formData.duration ? `${formData.duration} days` : "Not specified"}</p>
          <p className="text-sm">Travelers: {formData.groupSize} people</p>
        </div>

        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4" /> Interests
          </h3>
          <div className="flex flex-wrap gap-1">
            {formData.selectedInterests.map((interestId: string) => {
              const interest = interests.find(i => i.id === interestId)
              return (
                <span key={interestId} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {interest?.label}
                </span>
              )
            })}
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Budget & Preferences
          </h3>
          <p className="text-sm">Budget: {formData.budget || "Not specified"}</p>
          <p className="text-sm">Accommodation: {formData.accommodation || "Not specified"}</p>
        </div>
      </div>
    </div>
  )
}

// Success Screen
function SuccessScreen({ formData, router }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="max-w-2xl text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-foreground" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          Thank You, {formData.fullName || "Traveler"}!
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Your custom trip request has been submitted successfully. Our travel experts will review your preferences and get back to you within 24 hours.
        </p>
        <div className="bg-card rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">1</div>
              We'll review your preferences
            </li>
            <li className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">2</div>
              We'll create a personalized itinerary
            </li>
            <li className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">3</div>
              We'll send you a quote within 24 hours
            </li>
          </ul>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/")} variant="outline" className="rounded-full">
            Back to Home
          </Button>
          <Button onClick={() => router.push("/packages")} className="rounded-full bg-primary">
            Browse Packages
          </Button>
        </div>
      </div>
    </div>
    
  )
}