'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Check, Phone, Mail, Clock } from 'lucide-react'

export default function ConciergePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    requestType: '',
    description: '',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (!formData.requestType || !formData.description) {
        setError('Please fill in all fields')
        setSubmitting(false)
        return
      }

      const { error: insertError } = await supabase.from('concierge_requests').insert({
        user_id: user.id,
        request_type: formData.requestType,
        description: formData.description,
        status: 'pending',
      })

      if (insertError) {
        setError('Failed to submit request. Please try again.')
        console.error(insertError)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setFormData({
            requestType: '',
            description: '',
          })
        }, 3000)
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
            Dedicated Service
          </p>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground">
            Concierge Services
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Available 24/7 to fulfill your every need. From restaurant reservations to travel arrangements, our concierge team is here to serve you.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-foreground text-center mb-12">
            How We Can Help
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🍽️',
                title: 'Restaurant Reservations',
                desc: 'Secure bookings at Alexandria\'s finest dining establishments',
              },
              {
                icon: '🚗',
                title: 'Transportation',
                desc: 'Arrange airport transfers, car rentals, and local tours',
              },
              {
                icon: '🎭',
                title: 'Entertainment',
                desc: 'Tickets to shows, events, and cultural attractions',
              },
              {
                icon: '✈️',
                title: 'Travel Planning',
                desc: 'Organize excursions and day trips across Egypt',
              },
              {
                icon: '🛍️',
                title: 'Shopping Services',
                desc: 'Personalized shopping assistance and sourcing',
              },
              {
                icon: '⏰',
                title: 'Special Requests',
                desc: 'Any request, any time - we\'re here for you',
              },
            ].map((service, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border text-center space-y-4">
                <div className="text-5xl">{service.icon}</div>
                <h3 className="font-heading font-bold text-foreground text-lg">
                  {service.title}
                </h3>
                <p className="text-foreground/70 text-sm">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl p-8 md:p-12 border border-border">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">
              Submit Your Request
            </h2>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mx-auto">
                  <Check className="text-green-500" size={32} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-green-600">
                  Request Submitted!
                </h3>
                <p className="text-foreground/70">
                  Thank you for your request. Our team will contact you shortly to assist you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Request Type *
                  </label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a request type...</option>
                    <option value="restaurant_reservation">Restaurant Reservation</option>
                    <option value="transportation">Transportation Arrangement</option>
                    <option value="event_tickets">Event Tickets</option>
                    <option value="tour_excursion">Tour or Excursion</option>
                    <option value="shopping">Shopping Assistance</option>
                    <option value="special_request">Special Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Please describe your request in detail..."
                    rows={6}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>

                <p className="text-center text-foreground/60 text-sm">
                  Our concierge team will respond within 1 hour during business hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-foreground text-center mb-12">
            Reach Out Directly
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Phone className="text-primary" size={28} />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg">Phone</h3>
              <p className="text-primary font-bold">+20 (3) 481 5500</p>
              <p className="text-foreground/60 text-sm">24/7 Available</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="text-primary" size={28} />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg">Email</h3>
              <p className="text-primary font-bold">concierge@luxoralexandria.com</p>
              <p className="text-foreground/60 text-sm">Response within 1 hour</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Clock className="text-primary" size={28} />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg">Hours</h3>
              <p className="text-foreground/70 text-sm">Always available</p>
              <p className="text-primary font-bold">Day & Night Service</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
