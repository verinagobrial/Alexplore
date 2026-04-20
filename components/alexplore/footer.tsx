"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "./animated-section"
import { useState } from "react"

const quickLinks = [
  { href: "#packages", label: "Packages" },
  { href: "#", label: "Custom Trips" },
  { href: "#destinations", label: "Destinations" },
  { href: "#", label: "Activities" },
  { href: "#", label: "Accommodations" },
  { href: "#", label: "Gallery" },
]

const supportLinks = [
  { href: "#", label: "FAQs" },
  { href: "#", label: "Travel Insurance" },
  { href: "#", label: "Terms & Conditions" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Cancellation Policy" },
  { href: "#", label: "Careers" },
]

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer id="contact" className="bg-primary text-secondary relative overflow-hidden">
      {/* Newsletter Section */}
      {/* <div className="border-b border-secondary/10">
        <div className="container mx-auto px-4 py-16">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h3 className="font-serif text-3xl md:text-4xl font-light text-secondary mb-4">
              Get Travel Inspiration
            </h3>
            <p className="text-secondary/70 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for exclusive deals, travel tips, and the latest Alexandria adventures.
            </p>
            
            {subscribed ? (
              <div className="bg-accent/20 rounded-2xl p-6 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-accent" />
                </div>
                <p className="text-secondary font-medium">Thanks for subscribing!</p>
                <p className="text-secondary/70 text-sm mt-2">Check your inbox for a welcome gift.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full bg-secondary/10 border border-secondary/20 text-secondary placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                  required
                />
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-foreground px-8 py-4 rounded-full font-medium hover:scale-105 transition-all"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <AnimatedSection className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2">
             
              <span className="font-serif text-2xl font-semibold text-secondary tracking-wide">
                Alexplore
              </span>
            </Link>
            <p className="text-secondary/70 text-sm leading-relaxed">
              The Soul of the Mediterranean in Your Hands. Discover the ancient wonders and breathtaking beauty of Alexandria, Egypt.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link 
                  key={social.label}
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-accent hover:text-foreground transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection delay={100}>
            <h4 className="font-serif text-lg font-medium mb-6 text-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-secondary/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Support */}
          <AnimatedSection delay={200}>
            <h4 className="font-serif text-lg font-medium mb-6 text-secondary">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-secondary/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={300}>
            <h4 className="font-serif text-lg font-medium mb-6 text-secondary">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hello@alexplore.com" 
                  className="flex items-center gap-3 text-secondary/70 hover:text-accent transition-colors text-sm group"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  hello@alexplore.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+20312345677" 
                  className="flex items-center gap-3 text-secondary/70 hover:text-accent transition-colors text-sm group"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  +20 3 123 4567
                </a>
              </li>
              <li className="flex items-start gap-3 text-secondary/70 text-sm">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <span>
                  123 Corniche Road,<br />
                  Alexandria, Egypt
                </span>
              </li>
            </ul>
          </AnimatedSection>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-secondary/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-secondary/50 text-sm">
              &copy; 2026 Alexplore. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-secondary/50 text-sm">
              <Link href="#" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-accent transition-colors">Terms</Link>
              <Link href="#" className="hover:text-accent transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
    </footer>
  )
}
