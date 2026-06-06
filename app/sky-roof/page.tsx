'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Music, Users, Clock } from 'lucide-react'

export default function SkyRoofPage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
            Rooftop Elegance
          </p>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground">
            SKY ROOF BAR
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            Rise above the city and experience Alexandria's most exclusive rooftop destination. Craft cocktails, Mediterranean breezes, and panoramic skyline views.
          </p>

          <div className="relative h-96 md:h-[500px] mt-12 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Sparkles size={48} className="text-foreground/40 opacity-50" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Music, label: 'Live Music', desc: 'Enjoy live performances nightly' },
            { icon: Users, label: 'VIP Sections', desc: 'Private lounge areas available' },
            { icon: Clock, label: 'Hours', desc: 'Open 6 PM - 2 AM daily' },
            { icon: Sparkles, label: 'Views', desc: '360° skyline panorama' },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="text-center space-y-4 p-6 rounded-xl bg-card border border-border">
                <Icon className="text-primary mx-auto" size={32} />
                <h3 className="font-heading font-bold text-foreground text-lg">
                  {feature.label}
                </h3>
                <p className="text-foreground/70 text-sm">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Cocktail Menu */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Signature Cocktails
            </h2>
            <p className="text-foreground/70">
              Handcrafted drinks by our award-winning mixologists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Alexandria Moon',
                description: 'Premium vodka, passion fruit, lunar ice',
                price: '$16',
              },
              {
                name: 'Mediterranean Breeze',
                description: 'Aperol, prosecco, fresh citrus, mint',
                price: '$14',
              },
              {
                name: 'Pharaoh\'s Gold',
                description: 'Egyptian rum, honey, cardamom, gold leaf',
                price: '$18',
              },
              {
                name: 'Sunset Mirage',
                description: 'Tequila, passion fruit, ginger, lime',
                price: '$15',
              },
            ].map((cocktail, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  {cocktail.name}
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  {cocktail.description}
                </p>
                <p className="text-primary font-bold">
                  {cocktail.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-heading font-bold text-foreground">
            Reserve Your Table
          </h2>
          <p className="text-foreground/70 text-lg">
            For table reservations and VIP bookings, please contact our concierge or make a reservation through your account.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
