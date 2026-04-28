'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Calendar, Users, Heart, CreditCard, Send, CheckCircle } from 'lucide-react'

interface FormData {
  fullName: string
  email: string
  phone: string
  hearAboutUs: string
  travelDate: string
  duration: string
  groupSize: string
  travelers: string[]
  selectedInterests: string[]
  specialRequests: string
  budget: string
  accommodation: string
  mealsIncluded: boolean
  transportIncluded: boolean
  guideIncluded: boolean
}

const interestOptions = [
  'Adventure', 'Cultural', 'Nature', 'Wildlife', 'Beach', 
  'Photography', 'Food & Wine', 'Historical', 'Relaxation', 'Luxury'
]

const travelerOptions = [
  'Solo Traveler', 'Couple', 'Family with Kids', 'Group of Friends', 'Senior Travelers'
]

const budgetOptions = [
  'Under $1000', '$1000 - $2000', '$2000 - $3000', '$3000 - $5000', '$5000+'
]

const accommodationOptions = [
  'Budget (Hostels/Basic Hotels)',
  'Standard (3-star Hotels)',
  'Comfort (4-star Hotels)',
  'Luxury (5-star Hotels)',
  'Boutique/Specialty'
]

export default function CustomTripForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [tripId, setTripId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    hearAboutUs: '',
    travelDate: '',
    duration: '',
    groupSize: '2',
    travelers: [],
    selectedInterests: [],
    specialRequests: '',
    budget: '',
    accommodation: '',
    mealsIncluded: false,
    transportIncluded: false,
    guideIncluded: false,
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields and try again.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const supabase = createClient()
      
      const tripData = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        hear_about_us: formData.hearAboutUs?.trim() || null,
        travel_date: formData.travelDate || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        group_size: formData.groupSize || '2',
        travelers: formData.travelers || [],
        selected_interests: formData.selectedInterests || [],
        special_requests: formData.specialRequests?.trim() || null,
        budget: formData.budget || null,
        accommodation: formData.accommodation || null,
        meals_included: formData.mealsIncluded,
        transport_included: formData.transportIncluded,
        guide_included: formData.guideIncluded,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('Submitting trip request:', tripData)
      
      const { data, error } = await supabase
        .from('custom_trips')
        .insert(tripData)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase insertion error:', error)
        
        if (error.code === '23505') {
          throw new Error('A request with this email already exists. Please contact us directly.')
        } else if (error.code === '23514') {
          throw new Error('Invalid data format. Please check your inputs and try again.')
        } else {
          throw new Error(error.message)
        }
      }
      
      if (!data) {
        throw new Error('No data returned from server')
      }
      
      console.log('Trip request submitted successfully:', data)
      
      setTripId(data.id)
      
      // Save to localStorage for reference
      try {
        localStorage.setItem('lastTripId', data.id)
        localStorage.setItem('lastTripEmail', formData.email)
        localStorage.setItem('lastTripTimestamp', new Date().toISOString())
      } catch (storageError) {
        console.warn('Could not save to localStorage:', storageError)
      }
      
      toast({
        title: "Success! 🎉",
        description: "Your custom trip request has been submitted. We'll contact you within 24 hours.",
      })
      
      setIsSubmitted(true)
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } catch (error: any) {
      console.error('Submission error:', error)
      
      let errorMessage = 'Failed to submit your request. Please try again.'
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.'
      } else if (error.message?.includes('permission')) {
        errorMessage = 'Permission denied. Please contact support.'
      } else {
        errorMessage = error.message || 'An unexpected error occurred. Please try again.'
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
      
      // Save failed submission for retry
      try {
        const failedData = {
          ...tripData,
          failedAt: new Date().toISOString(),
          retryCount: 0
        }
        localStorage.setItem('failedTripSubmission', JSON.stringify(failedData))
      } catch (storageError) {
        console.warn('Could not save failed submission:', storageError)
      }
      
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleArrayItem = (field: 'travelers' | 'selectedInterests', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Request Received! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your custom trip request. Our travel experts will review your preferences and get back to you within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Reference ID</p>
              <p className="font-mono text-sm text-gray-700">{tripId}</p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                We've sent a confirmation to <strong>{formData.email}</strong>
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Plan Your <span className="text-blue-600">Custom Trip</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about your dream vacation, and our travel experts will create a personalized itinerary just for you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium mb-1 block">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        placeholder="John Doe"
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-1 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="john@example.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium mb-1 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="+1 234 567 8900"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="hearAboutUs" className="text-sm font-medium mb-1 block">
                        How did you hear about us?
                      </Label>
                      <Select
                        value={formData.hearAboutUs}
                        onValueChange={(value) => updateFormData('hearAboutUs', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Search</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="friend">Friend/Family</SelectItem>
                          <SelectItem value="advertisement">Advertisement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Travel Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Travel Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="travelDate" className="text-sm font-medium mb-1 block">
                        Preferred Travel Date
                      </Label>
                      <Input
                        id="travelDate"
                        type="date"
                        value={formData.travelDate}
                        onChange={(e) => updateFormData('travelDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-sm font-medium mb-1 block">
                        Duration (days)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', e.target.value)}
                        placeholder="7"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupSize" className="text-sm font-medium mb-1 block">
                        Group Size *
                      </Label>
                      <Select
                        value={formData.groupSize}
                        onValueChange={(value) => updateFormData('groupSize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Solo</SelectItem>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3">3 People</SelectItem>
                          <SelectItem value="4">4 People</SelectItem>
                          <SelectItem value="5">5 People</SelectItem>
                          <SelectItem value="6+">6+ People</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Traveler Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Traveler Type (Select all that apply)
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {travelerOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.travelers.includes(option)}
                          onCheckedChange={() => toggleArrayItem('travelers', option)}
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Heart className="h-4 w-4 text-blue-600" />
                    Travel Interests (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                      <label key={interest} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.selectedInterests.includes(interest)}
                          onCheckedChange={() => toggleArrayItem('selectedInterests', interest)}
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget & Preferences */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Budget & Preferences
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Budget Range
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {budgetOptions.map((budget) => (
                          <label key={budget} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="budget"
                              value={budget}
                              checked={formData.budget === budget}
                              onChange={(e) => updateFormData('budget', e.target.value)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">{budget}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Accommodation Preference
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {accommodationOptions.map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="accommodation"
                              value={option}
                              checked={formData.accommodation === option}
                              onChange={(e) => updateFormData('accommodation', e.target.value)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.mealsIncluded}
                          onCheckedChange={(checked) => updateFormData('mealsIncluded', checked)}
                        />
                        <span className="text-sm">Include Meals</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.transportIncluded}
                          onCheckedChange={(checked) => updateFormData('transportIncluded', checked)}
                        />
                        <span className="text-sm">Include Transport</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.guideIncluded}
                          onCheckedChange={(checked) => updateFormData('guideIncluded', checked)}
                        />
                        <span className="text-sm">Include Guide</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests" className="text-sm font-medium mb-2 block">
                    Special Requests or Additional Information
                  </Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => updateFormData('specialRequests', e.target.value)}
                    rows={4}
                    placeholder="Tell us about any specific requirements, preferences, or must-see attractions..."
                    className="resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Custom Trip Request
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our terms and conditions. We'll never share your information.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}