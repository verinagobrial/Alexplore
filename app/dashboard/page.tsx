'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Home, Wine, Droplets, Users, FileText, LogOut } from 'lucide-react'

interface RoomBooking {
  id: string
  room_id: string
  check_in_date: string
  check_out_date: string
  total_price: number
  booking_status: string
  created_at: string
}

interface RestaurantReservation {
  id: string
  reservation_date: string
  reservation_time: string
  number_of_guests: number
  reservation_status: string
  created_at: string
}

interface SpaBooking {
  id: string
  service_id: string
  booking_date: string
  booking_time: string
  booking_status: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([])
  const [restaurantReservations, setRestaurantReservations] = useState<RestaurantReservation[]>([])
  const [spaBookings, setSpaBookings] = useState<SpaBooking[]>([])
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
        await fetchBookings(user.id)
      }
    }
    getUser()
  }, [])

  const fetchBookings = async (userId: string) => {
    setLoading(true)
    try {
      const [roomsRes, restaurantRes, spaRes] = await Promise.all([
        supabase.from('room_bookings').select('*').eq('user_id', userId),
        supabase.from('restaurant_reservations').select('*').eq('user_id', userId),
        supabase.from('spa_bookings').select('*').eq('user_id', userId),
      ])

      if (roomsRes.data) setRoomBookings(roomsRes.data)
      if (restaurantRes.data) setRestaurantReservations(restaurantRes.data)
      if (spaRes.data) setSpaBookings(spaRes.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase mb-2">
                Welcome Back
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                My Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* User Info */}
          <div className="bg-card rounded-xl p-6 border border-border mb-12">
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-foreground/60 text-sm mb-2">Email</p>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm mb-2">User ID</p>
                <p className="text-foreground font-medium text-sm break-all">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Bookings Tabs */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">Loading your bookings...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Room Bookings */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home className="text-primary" size={20} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    Room Bookings
                  </h2>
                </div>

                {roomBookings.length === 0 ? (
                  <div className="p-8 bg-secondary/10 rounded-xl border border-border text-center">
                    <p className="text-foreground/70 mb-4">No room bookings yet</p>
                    <Link
                      href="/accommodations"
                      className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Browse Rooms
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roomBookings.map(booking => (
                      <div key={booking.id} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-heading font-bold text-foreground">
                              Room Booking #{booking.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-foreground/60">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.booking_status === 'confirmed'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}>
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Check-in</p>
                            <p className="text-foreground font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Check-out</p>
                            <p className="text-foreground font-medium">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Total Price</p>
                            <p className="text-primary font-bold">${booking.total_price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Payment Status</p>
                            <p className="text-foreground font-medium capitalize">{booking.payment_status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Restaurant Reservations */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wine className="text-primary" size={20} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    Restaurant Reservations
                  </h2>
                </div>

                {restaurantReservations.length === 0 ? (
                  <div className="p-8 bg-secondary/10 rounded-xl border border-border text-center">
                    <p className="text-foreground/70 mb-4">No restaurant reservations yet</p>
                    <Link
                      href="/restaurant"
                      className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Make a Reservation
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {restaurantReservations.map(reservation => (
                      <div key={reservation.id} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-heading font-bold text-foreground">
                              Reservation #{reservation.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-foreground/60">
                              {new Date(reservation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reservation.reservation_status === 'confirmed'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}>
                            {reservation.reservation_status.charAt(0).toUpperCase() + reservation.reservation_status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Date</p>
                            <p className="text-foreground font-medium">{new Date(reservation.reservation_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Time</p>
                            <p className="text-foreground font-medium">{reservation.reservation_time}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Guests</p>
                            <p className="text-foreground font-medium">{reservation.number_of_guests}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Spa Bookings */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Droplets className="text-primary" size={20} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    Spa Bookings
                  </h2>
                </div>

                {spaBookings.length === 0 ? (
                  <div className="p-8 bg-secondary/10 rounded-xl border border-border text-center">
                    <p className="text-foreground/70 mb-4">No spa bookings yet</p>
                    <Link
                      href="/spa"
                      className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Book a Service
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {spaBookings.map(booking => (
                      <div key={booking.id} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-heading font-bold text-foreground">
                              Spa Booking #{booking.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-foreground/60">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.booking_status === 'confirmed'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}>
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Date</p>
                            <p className="text-foreground font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60 text-xs mb-1">Time</p>
                            <p className="text-foreground font-medium">{booking.booking_time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
