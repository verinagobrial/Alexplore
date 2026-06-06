'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { Users, Calendar, MapPin } from 'lucide-react'

interface Event {
  id: string
  name: string
  description: string
  capacity: number
  price_per_head: number
}

export default function EventsPage() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('events').select('*')
      if (error) {
        console.error('Error fetching events:', error)
      } else {
        setEvents(data || [])
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
            Memorable Occasions
          </p>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground">
            Events & Conferences
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Host your wedding, corporate event, or celebration in our elegant venues with full service support.
          </p>
        </div>
      </section>

      {/* Venues */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Venues
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div
                  key={event.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Users size={48} className="text-foreground/40 opacity-50" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      {event.name}
                    </h3>
                    <p className="text-foreground/70 text-sm mb-4 flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-6 text-sm text-foreground/70">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Capacity: {event.capacity} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>${event.price_per_head} per person</span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Inquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Event Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Full Event Planning',
                items: ['Venue Selection', 'Catering', 'Decoration', 'Entertainment'],
              },
              {
                title: 'Catering & Beverages',
                items: ['Custom Menus', 'Wine Selection', 'Bar Service', 'Staffing'],
              },
              {
                title: 'Audio & Visual',
                items: ['Sound Systems', 'Projection', 'Live Stream', 'Photography'],
              },
              {
                title: 'Guest Services',
                items: ['Accommodation', 'Transportation', 'Concierge', 'Parking'],
              },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-xl bg-secondary/10 border border-border">
                <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <ul className="space-y-2">
                  {service.items.map((item, j) => (
                    <li key={j} className="text-foreground/70 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-heading font-bold text-foreground">
            Plan Your Perfect Event
          </h2>
          <p className="text-foreground/70 text-lg">
            Contact our events team to discuss your vision and create an unforgettable celebration.
          </p>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105">
            Contact Events Team
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
