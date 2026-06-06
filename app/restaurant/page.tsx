'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Check, Clock, Users } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  dietary_info: string[]
}

export default function RestaurantPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [reservationForm, setReservationForm] = useState({
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 2,
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
    const fetchMenuItems = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('restaurant_menu').select('*')
      if (error) {
        console.error('Error fetching menu:', error)
      } else {
        setMenuItems(data || [])
      }
      setLoading(false)
    }
    fetchMenuItems()
  }, [])

  const categories = ['all', ...new Set(menuItems.map(m => m.category))]
  const filteredItems = selectedCategory === 'all' ? menuItems : menuItems.filter(m => m.category === selectedCategory)

  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setReservationForm(prev => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value,
    }))
  }

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (!reservationForm.reservationDate || !reservationForm.reservationTime) {
        setError('Please select a date and time for your reservation')
        setSubmitting(false)
        return
      }

      const { error: insertError } = await supabase.from('restaurant_reservations').insert({
        user_id: user.id,
        reservation_date: reservationForm.reservationDate,
        reservation_time: reservationForm.reservationTime,
        number_of_guests: reservationForm.numberOfGuests,
        special_requests: reservationForm.specialRequests,
        payment_status: 'pending',
        reservation_status: 'confirmed',
      })

      if (insertError) {
        setError('Failed to create reservation. Please try again.')
        console.error(insertError)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setShowReservationForm(false)
          setSuccess(false)
          setReservationForm({
            reservationDate: '',
            reservationTime: '',
            numberOfGuests: 2,
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
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-12">
          <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
            Fine Italian Dining
          </p>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground">
            Authentic Italian Cuisine
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Experience the authentic flavors of Italy brought to life by our award-winning culinary team.
          </p>
        </div>

        {/* Reservation CTA */}
        <div className="max-w-4xl mx-auto text-center">
          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 flex items-center gap-4">
              <Check className="text-green-500 flex-shrink-0" size={24} />
              <div className="text-left">
                <p className="font-bold text-green-600">Reservation Confirmed!</p>
                <p className="text-sm text-foreground/70">We look forward to welcoming you.</p>
              </div>
            </div>
          ) : !showReservationForm ? (
            <button
              onClick={() => setShowReservationForm(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              Reserve a Table
            </button>
          ) : (
            <form onSubmit={handleReservationSubmit} className="bg-card rounded-xl p-8 border border-border space-y-6">
              <h3 className="text-2xl font-heading font-bold text-foreground">Reserve Your Table</h3>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="reservationDate"
                    value={reservationForm.reservationDate}
                    onChange={handleReservationChange}
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
                    name="reservationTime"
                    value={reservationForm.reservationTime}
                    onChange={handleReservationChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Number of Guests *
                </label>
                <select
                  name="numberOfGuests"
                  value={reservationForm.numberOfGuests}
                  onChange={handleReservationChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={reservationForm.specialRequests}
                  onChange={handleReservationChange}
                  placeholder="Any special occasions or dietary requirements?"
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-heading font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Processing...' : 'Confirm Reservation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReservationForm(false)}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-heading font-bold hover:bg-secondary/90 transition-colors border border-border"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Menu
            </h2>
            <p className="text-foreground/70">
              Carefully curated selections of authentic Italian dishes
            </p>
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

          {/* Menu Items */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-foreground/60">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-heading font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground/70 text-sm mb-4">
                    {item.description}
                  </p>

                  {item.dietary_info && item.dietary_info.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.dietary_info.map((info, i) => (
                        <span key={i} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {info}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '👨‍🍳',
              title: 'Award-Winning Chef',
              description: 'Our executive chef brings decades of culinary excellence and authentic Italian expertise.',
            },
            {
              icon: '🍷',
              title: 'Wine Selection',
              description: 'Curated wine list featuring Italian vintages and international selections.',
            },
            {
              icon: '🌅',
              title: 'Ambiance',
              description: 'Elegant dining room with Mediterranean views and sophisticated atmosphere.',
            },
          ].map((item, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="text-5xl">{item.icon}</div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-foreground/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
