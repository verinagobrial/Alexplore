import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">LUXOR</h3>
            <p className="text-sm text-secondary-foreground/70 mb-4">
              Experience luxury hospitality in the heart of Alexandria, Egypt. Where elegance meets Mediterranean charm.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/accommodations" className="text-sm hover:text-primary transition-colors">Accommodations</Link></li>
              <li><Link href="/restaurant" className="text-sm hover:text-primary transition-colors">Restaurant</Link></li>
              <li><Link href="/spa" className="text-sm hover:text-primary transition-colors">Spa & Wellness</Link></li>
              <li><Link href="/events" className="text-sm hover:text-primary transition-colors">Events & Conferences</Link></li>
              <li><Link href="/concierge" className="text-sm hover:text-primary transition-colors">Concierge</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>Corniche, Alexandria, Egypt</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>+20 (3) 481 5500</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>info@luxoralexandria.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Front Desk:</p>
                  <p className="text-secondary-foreground/70">24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-medium">Restaurant:</p>
                  <p className="text-secondary-foreground/70">12:00 PM - 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-foreground/60">
            &copy; 2024 Luxor Alexandria. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
