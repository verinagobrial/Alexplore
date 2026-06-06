'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { Star, WiFi, AirVent, Coffee, Users } from 'lucide-react'

interface Room {
  id: string
  room_number: string
  room_type: string
  description: string
  price_per_night: number
  capacity: number
  amenities: string[]
  is_available: boolean
}

export default function AccommodationsPage() {
  const [user, setUser] = useState<any>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const supabase = createClient()

  const amenityIcons: { [key: string]: any } = {
    wifi: WiFi,
    'air conditioning': AirVent,
    'mini bar': Coffee,
    'ocean view': Star,
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('rooms').select('*').eq('is_available', true)
      if (error) {
        console.error('Error fetching rooms:', error)
      } else {
        setRooms(data || [])
      }
      setLoading(false)
    }
    fetchRooms()
  }, [])

  const roomTypes = ['all', ...new Set(rooms.map(r => r.room_type))]
  const filteredRooms = selectedType === 'all' ? rooms : rooms.filter(r => r.room_type === selectedType)

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-12">
          <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
            Your Perfect Room
          </p>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground">
            Luxury Accommodations
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Choose from our exquisite selection of rooms, each designed to provide the ultimate in comfort and elegance.
          </p>
        </div>

        {/* Room Type Filter */}
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center mb-12">
          {roomTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-full font-medium transition-colors text-sm font-heading ${
                selectedType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/10 text-foreground hover:bg-secondary/20 border border-border'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map(room => (
                <div
                  key={room.id}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col"
                >
                  {/* Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                    <div className="text-foreground/40 text-center">
                      <Star size={32} className="mx-auto opacity-50" />
                      <p className="text-sm mt-2">Room {room.room_number}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-foreground">
                          {room.room_type}
                        </h3>
                        <p className="text-sm text-foreground/60">Room {room.room_number}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-heading font-bold text-primary">
                          ${room.price_per_night}
                        </div>
                        <p className="text-xs text-foreground/60">per night</p>
                      </div>
                    </div>

                    <p className="text-foreground/70 text-sm mb-4 flex-grow">
                      {room.description}
                    </p>

                    {/* Capacity */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-foreground/70">
                      <Users size={16} />
                      <span>Capacity: {room.capacity} guests</span>
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-xs font-medium text-foreground/70 uppercase tracking-widest">
                          Amenities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, i) => {
                            const IconComponent = amenityIcons[amenity.toLowerCase()] || WiFi
                            return (
                              <div key={i} className="flex items-center gap-1 text-xs text-foreground/70 bg-secondary/20 rounded-full px-3 py-1">
                                <IconComponent size={12} />
                                <span>{amenity}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/accommodations/booking/${room.id}`}
                      className="w-full mt-auto py-3 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-center hover:bg-primary/90 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/70 text-lg">No rooms available for the selected type.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Bedding',
                description: 'Egyptian cotton linens and luxury pillows ensure restful sleep.',
              },
              {
                title: 'Modern Amenities',
                description: 'Flat-screen TVs, high-speed WiFi, and smart climate control in every room.',
              },
              {
                title: 'Stunning Views',
                description: 'Panoramic vistas of the Mediterranean Sea from your private balcony.',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-3">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
