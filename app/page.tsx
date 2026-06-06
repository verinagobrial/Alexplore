'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, Sparkles, Wine, Palmtree, Users, HomeIcon, Shield } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const services = [
    {
      icon: HomeIcon,
      title: 'Luxury Rooms',
      description: 'Experience unparalleled comfort in our elegantly designed rooms with breathtaking Mediterranean views.',
      link: '/accommodations'
    },
    {
      icon: Wine,
      title: 'Italian Restaurant',
      description: 'Authentic Italian cuisine prepared by our award-winning chefs in an atmosphere of timeless elegance.',
      link: '/restaurant'
    },
    {
      icon: Sparkles,
      title: 'Sky Roof Bar',
      description: 'Enjoy craft cocktails under the stars at our exclusive rooftop bar overlooking Alexandria\'s skyline.',
      link: '/sky-roof'
    },
    {
      icon: Palmtree,
      title: 'Spa & Wellness',
      description: 'Rejuvenate your mind, body and spirit with our world-class spa treatments and wellness programs.',
      link: '/spa'
    },
    {
      icon: Users,
      title: 'Events & Conferences',
      description: 'Host memorable celebrations and business events in our sophisticated venues with full service support.',
      link: '/events'
    },
    {
      icon: Shield,
      title: 'Concierge Services',
      description: 'Our dedicated concierge team is available 24/7 to fulfill your every need and desire.',
      link: '/concierge'
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4 animate-fadeInDown">
              <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
                Welcome to Elegance
              </p>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground text-balance">
                LUXOR <span className="text-primary">ALEXANDRIA</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 text-balance max-w-3xl mx-auto">
                Where Mediterranean charm meets modern luxury. Experience the finest hospitality, culinary excellence, and timeless elegance in the heart of Egypt's coastal jewel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fadeInUp">
              <Link
                href="/accommodations"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 hover-lift"
              >
                Book Your Stay
                <ChevronRight size={20} />
              </Link>
              <Link
                href="/restaurant"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-heading font-bold text-lg hover:bg-secondary/90 transition-colors border border-border hover-scale"
              >
                Reserve Dining
              </Link>
            </div>
          </div>

          {/* Featured Image Placeholder */}
          <div className="mt-16 rounded-xl overflow-hidden shadow-2xl h-96 md:h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-scaleIn hover-glow">
            <div className="text-center text-foreground/40">
              <Sparkles size={48} className="mx-auto mb-4 opacity-50 animate-float" />
              <p className="text-lg">Hotel Exterior & Rooftop Views</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeInDown">
            <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase mb-4">
              Our Excellence
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Premium Services & Facilities
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Discover a comprehensive range of luxury services designed to make your stay unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Link
                  key={index}
                  href={service.link}
                  className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover-lift"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="text-primary" size={28} />
                    </div>

                    <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-medium text-sm pt-2 group-hover:gap-3 transition-all">
                      Explore <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slideInLeft">
              <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
                Why Choose Luxor
              </p>
              <h2 className="text-4xl font-heading font-bold text-foreground">
                Unmatched Elegance & Service
              </h2>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Since opening, Luxor Alexandria has been the premier destination for discerning travelers seeking the finest in hospitality, gastronomy, and entertainment in Egypt.
              </p>

              <ul className="space-y-4">
                {[
                  '5-star luxury accommodations with personalized service',
                  'Award-winning Italian restaurant and sky roof bar',
                  'Full-service spa and wellness center',
                  '24/7 dedicated concierge services',
                  'State-of-the-art event and conference facilities',
                  'Prime waterfront location overlooking the Mediterranean',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-foreground text-sm font-bold">✓</span>
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/accommodations"
                className="inline-flex items-center gap-2 text-primary font-heading font-bold hover:gap-3 transition-all pt-4"
              >
                Explore Our Rooms <ChevronRight size={20} />
              </Link>
            </div>

            <div className="rounded-xl overflow-hidden shadow-xl h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-slideInRight hover-glow">
              <div className="text-center text-foreground/40">
                <Sparkles size={48} className="mx-auto mb-4 opacity-50 animate-float" />
                <p className="text-lg">Luxury Interior Design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-secondary/20 to-primary/5 border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fadeInDown">
            <p className="text-primary font-heading font-bold text-sm tracking-widest uppercase">
              Ready to Experience Luxury?
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Plan Your Perfect Escape
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              From romantic getaways to business conferences, let Luxor Alexandria create an unforgettable experience tailored to your desires.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fadeInUp">
            <Link
              href="/accommodations"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 hover-lift"
            >
              Book Now
            </Link>
            <Link
              href="/concierge"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-heading font-bold text-lg hover:bg-secondary/90 transition-colors border border-border"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
