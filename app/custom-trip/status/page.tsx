// app/custom-trip/status/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, Clock, Send, DollarSign, UserCheck } from 'lucide-react'

export default function TripStatusPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)

  const searchTrips = async () => {
    if (!email) return
    setLoading(true)
    setSearched(true)
    
    const response = await fetch(`/api/custom-trip?email=${encodeURIComponent(email)}`)
    const { data } = await response.json()
    
    setTrips(data || [])
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'reviewing': return <UserCheck className="h-5 w-5 text-blue-500" />
      case 'quoted': return <DollarSign className="h-5 w-5 text-purple-500" />
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-serif font-bold mb-6">Track Your Custom Trip Request</h1>
          
          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <Button onClick={searchTrips} disabled={!email}>
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {searched && (
            loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No trip requests found for this email</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {trips.map((trip: any) => (
                  <Card key={trip.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Request #{trip.id.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Submitted on {new Date(trip.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(trip.status)}
                          <Badge className="capitalize">{trip.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Travel Date</p>
                          <p>{trip.travel_date || 'Flexible'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p>{trip.duration ? `${trip.duration} days` : 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Travelers</p>
                          <p>{trip.group_size} people</p>
                        </div>
                      </div>

                      {trip.quoted_amount && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Quote: {trip.quoted_currency} {trip.quoted_amount}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <Send className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {trip.status === 'pending' && 'Our team will review your request within 24 hours'}
                            {trip.status === 'reviewing' && 'A travel expert is currently reviewing your preferences'}
                            {trip.status === 'quoted' && 'Quote has been sent to your email. Check your inbox!'}
                            {trip.status === 'confirmed' && 'Your trip is confirmed! Get ready for an amazing journey!'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}