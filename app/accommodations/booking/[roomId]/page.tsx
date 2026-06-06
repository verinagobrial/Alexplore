'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Check } from 'lucide-react'

interface Room {
  id: string
  room_number: string
  room_type: string
  price_per_night: number
  capacity: number
}

interface BookingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  specialRequests: string
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string
  const [user, setUser] = useState<any>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const [formData, setFormData] = useState<BookingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }))
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single()
      if (error) {
        setError('Failed to load room details')
        console.error(error)
      } else {
        setRoom(data)
      }
      setLoading(false)
    }
    if (roomId) fetchRoom()
  }, [roomId])

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0
    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(nights, 1)
  }

  const totalPrice = room ? calculateNights() * room.price_per_night : 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value,
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

      if (!formData.checkInDate || !formData.checkOutDate) {
        setError('Please select check-in and check-out dates')
        setSubmitting(false)
        return
      }

      if (formData.numberOfGuests > (room?.capacity || 0)) {
        setError(`This room can only accommodate ${room?.capacity} guests`)
        setSubmitting(false)
        return
      }

      const { error: insertError } = await supabase.from('room_bookings').insert({
        user_id: user.id,
        room_id: roomId,
        check_in_date: formData.checkInDate,
        check_out_date: formData.checkOutDate,
        number_of_guests: formData.numberOfGuests,
        total_price: totalPrice,
        special_requests: formData.specialRequests,
        payment_status: 'pending',
        booking_status: 'confirmed',
      })

      if (insertError) {
        setError('Failed to create booking. Please try again.')
        console.error(insertError)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="text-foreground/70">Loading...</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mx-auto">
                <Check className="text-green-500" size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-green-600">Booking Confirmed!</h2>
              <p className="text-foreground/70">
                Your room booking has been created successfully. You will be redirected to your dashboard shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Room Summary */}
              {room && (
                <div className="bg-secondary/10 rounded-xl p-8 border border-border">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                    {room.room_type} - Room {room.room_number}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-foreground/60 text-sm uppercase tracking-widest mb-2">
                        Room Type
                      </p>
                      <p className="text-lg font-bold text-foreground">{room.room_type}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm uppercase tracking-widest mb-2">
                        Price per Night
                      </p>
                      <p className="text-lg font-bold text-primary">${room.price_per_night}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm uppercase tracking-widest mb-2">
                        Capacity
                      </p>
                      <p className="text-lg font-bold text-foreground">{room.capacity} Guests</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm uppercase tracking-widest mb-2">
                        Total Nights
                      </p>
                      <p className="text-lg font-bold text-foreground">{calculateNights()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <div className="bg-card rounded-xl p-8 border border-border">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Booking Details
                </h3>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Guest Info */}
                  <div className="space-y-4">
                    <p className="text-foreground font-medium uppercase tracking-widest text-sm">
                      Guest Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          placeholder="Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates & Guests */}
                  <div className="space-y-4">
                    <p className="text-foreground font-medium uppercase tracking-widest text-sm">
                      Stay Details
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Check-in Date *
                        </label>
                        <input
                          type="date"
                          name="checkInDate"
                          value={formData.checkInDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Check-out Date *
                        </label>
                        <input
                          type="date"
                          name="checkOutDate"
                          value={formData.checkOutDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                          min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Number of Guests *
                        </label>
                        <select
                          name="numberOfGuests"
                          value={formData.numberOfGuests}
                          onChange={handleInputChange as any}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                        >
                          {room && Array.from({ length: room.capacity }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-4">
                    <p className="text-foreground font-medium uppercase tracking-widest text-sm">
                      Special Requests
                    </p>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requests for your stay? (e.g., high floor, early check-in)"
                      rows={4}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-border">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Nightly Rate:</span>
                        <span className="font-medium text-foreground">${room?.price_per_night} × {calculateNights()} nights</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground font-bold">Total Price:</span>
                          <span className="text-3xl font-heading font-bold text-primary">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Processing...' : 'Complete Booking'}
                  </button>

                  <p className="text-center text-foreground/60 text-sm">
                    {!user && 'You must be logged in to complete your booking. '}
                    By booking, you agree to our terms and conditions.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
