'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user?: any
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Accommodations', href: '/accommodations' },
    { label: 'Restaurant', href: '/restaurant' },
    { label: 'Sky Roof Bar', href: '/sky-roof' },
    { label: 'Spa', href: '/spa' },
    { label: 'Events', href: '/events' },
    { label: 'Concierge', href: '/concierge' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-heading font-bold text-primary">
              LUXOR
            </div>
            <div className="text-xs text-muted-foreground">Alexandria</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors text-sm font-medium ${
                  pathname === item.href
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <button
                onClick={handleLogout}
                className="text-primary"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  pathname === item.href
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="px-4 py-3 border-t border-border mt-3 flex gap-2">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center text-sm font-medium text-foreground/70 hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex-1 text-center px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
