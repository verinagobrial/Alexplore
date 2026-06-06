'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Users, BookOpen, Zap, Calendar, DollarSign } from 'lucide-react'

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [restaurantReservations, setRestaurantReservations] = useState<any[]>([])
  const [spaBookings, setSpaBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsAuthorized(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      setIsAuthorized(profile?.is_admin || false)

      if (profile?.is_admin) {
        fetchAllBookings()
      }
    } catch (error) {
      console.error('[v0] Admin check error:', error)
      setIsAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllBookings = async () => {
    try {
      const [roomBookings, restaurantRes, spaRes] = await Promise.all([
        supabase.from('room_bookings').select('*, profiles(email), rooms(room_type)'),
        supabase.from('restaurant_reservations').select('*, profiles(email)'),
        supabase.from('spa_bookings').select('*, profiles(email), spa_services(name)'),
      ])

      if (roomBookings.data) setBookings(roomBookings.data)
      if (restaurantRes.data) setRestaurantReservations(restaurantRes.data)
      if (spaRes.data) setSpaBookings(spaRes.data)
    } catch (error) {
      console.error('[v0] Fetch bookings error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="text-destructive" size={24} />
            <h1 className="text-3xl font-bold">Access Denied</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            You do not have permission to access the admin dashboard.
          </p>
          <Button onClick={() => (window.location.href = '/')}>Return to Home</Button>
        </main>
        <Footer />
      </div>
    )
  }

  const totalRevenue = [
    ...bookings.map((b) => b.total_price || 0),
    ...restaurantReservations.map((r) => r.total_price || 0),
    ...spaBookings.map((s) => s.total_price || 150),
  ].reduce((sum, price) => sum + price, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-heading mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all hotel bookings and reservations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length + restaurantReservations.length + spaBookings.length}</div>
              <p className="text-xs text-muted-foreground">All services</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Room Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">Active reservations</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All payments</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...bookings, ...restaurantReservations, ...spaBookings].filter((b) => b.payment_status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Room Bookings Section */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle>Room Bookings</CardTitle>
            <CardDescription>Manage all room reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Guest</th>
                    <th className="text-left py-2 px-2">Room</th>
                    <th className="text-left py-2 px-2">Check-in</th>
                    <th className="text-left py-2 px-2">Check-out</th>
                    <th className="text-left py-2 px-2">Price</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map((booking: any) => (
                    <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-2">{booking.profiles?.email || 'N/A'}</td>
                      <td className="py-2 px-2">{booking.rooms?.room_type || 'N/A'}</td>
                      <td className="py-2 px-2">{booking.check_in_date}</td>
                      <td className="py-2 px-2">{booking.check_out_date}</td>
                      <td className="py-2 px-2 font-semibold">${booking.total_price}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            booking.payment_status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {booking.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No room bookings yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Reservations Section */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle>Restaurant Reservations</CardTitle>
            <CardDescription>Manage dining reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Guest</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Time</th>
                    <th className="text-left py-2 px-2">Guests</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurantReservations.slice(0, 10).map((reservation: any) => (
                    <tr key={reservation.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-2">{reservation.profiles?.email || 'N/A'}</td>
                      <td className="py-2 px-2">{reservation.reservation_date}</td>
                      <td className="py-2 px-2">{reservation.reservation_time}</td>
                      <td className="py-2 px-2">{reservation.number_of_guests}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            reservation.reservation_status === 'confirmed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {reservation.reservation_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {restaurantReservations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No reservations yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Spa Bookings Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Spa Bookings</CardTitle>
            <CardDescription>Manage spa service reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Guest</th>
                    <th className="text-left py-2 px-2">Service</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Time</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {spaBookings.slice(0, 10).map((booking: any) => (
                    <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-2">{booking.profiles?.email || 'N/A'}</td>
                      <td className="py-2 px-2">{booking.spa_services?.name || 'N/A'}</td>
                      <td className="py-2 px-2">{booking.booking_date}</td>
                      <td className="py-2 px-2">{booking.booking_time}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            booking.booking_status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {booking.booking_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {spaBookings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No spa bookings yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
