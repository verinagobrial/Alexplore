'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Check, Clock, Droplets } from 'lucide-react'

interface SpaService {
  id: string
  name: string
  description: string
  category: string
  duration_minutes: number
  price: number
}

export default function SpaPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [services, setServices] = useState<SpaService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedService, setSelectedService] = useState<SpaService | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [bookingForm, setBookingForm] = useState({
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('spa_services').select('*')
      if (error) {
        console.error('Error fetching services:', error)
      } else {
        setServices(data || [])
      }
      setLoading(false)
    }
    fetchServices()
  }, [])

  const categories = ['all', ...new Set(services.map(s => s.category))]
  const filteredServices = selectedCategory === 'all' ? services : services.filter(s => s.category === selectedCategory)

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookingForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (!bookingForm.bookingDate || !bookingForm.bookingTime) {
        setError('Please select a date and time')
        setSubmitting(false)
        return
      }

      const { error: insertError } = await supabase.from('spa_bookings').insert({
        user_id: user.id,
        service_id: selectedService?.id,
        booking_date: bookingForm.bookingDate,
        booking_time: bookingForm.bookingTime,
        special_requests: bookingForm.specialRequests,
        payment_status: 'pending',
        booking_status: 'confirmed',
      })

      if (insertError) {
        setError('Failed to create booking. Please try again.')
        console.error(insertError)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setShowBookingForm(false)
          setSuccess(false)
          setSelectedService(null)
          setBookingForm({
            bookingDate: '',
            bookingTime: '',
            specialRequests: '',
          })
        }, 2000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
            Wellness & Rejuvenation
          </p>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground">
            Luxor Spa & Wellness
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Escape to our sanctuary of serenity. Indulge in world-class treatments designed to restore your mind, body, and spirit.
          </p>

          <div className="relative h-96 md:h-[500px] mt-12 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Droplets size={48} className="text-foreground/40 opacity-50" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Services
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors text-sm font-heading ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/10 text-foreground hover:bg-secondary/20 border border-border'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all flex flex-col"
                >
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-3">
                    {service.category}
                  </p>
                  <p className="text-foreground/70 text-sm mb-4 flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{service.duration_minutes} min</span>
                    </div>
                    <div className="text-lg font-heading font-bold text-primary">
                      ${service.price}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService(service)
                      setShowBookingForm(true)
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Book Service
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-8 border border-border max-w-md w-full">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Book {selectedService.name}
            </h3>

            {success ? (
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Check className="text-green-500 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-green-600">Booking Confirmed!</p>
                  <p className="text-sm text-foreground/70">We look forward to your visit.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={bookingForm.bookingDate}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={bookingForm.bookingTime}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={handleBookingChange}
                    placeholder="Any preferences or allergies?"
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <p className="text-sm text-foreground/70">
                    <span className="font-medium">Service:</span> {selectedService.name}
                  </p>
                  <p className="text-sm text-foreground/70">
                    <span className="font-medium">Duration:</span> {selectedService.duration_minutes} minutes
                  </p>
                  <p className="text-sm text-primary font-bold">
                    <span className="text-foreground/70">Price:</span> ${selectedService.price}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors border border-border"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Facilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-foreground text-center mb-12">
            Our Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'Sauna & Steam Room',
              'Indoor Infinity Pool',
              'Treatment Rooms',
              'Relaxation Lounge',
              'Changing Facilities',
              'Wellness Boutique',
            ].map((facility, i) => (
              <div key={i} className="p-6 rounded-xl bg-secondary/10 border border-border text-center">
                <h3 className="font-heading font-bold text-foreground text-lg">
                  {facility}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
