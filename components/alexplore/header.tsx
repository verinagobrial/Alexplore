"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ChevronDown, Phone, Mail, User, LogOut, LayoutDashboard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  // Fixed: Add proper null checks for initials
  const getInitials = () => {
    if (!user) return 'U'
    const firstName = user.user_metadata?.first_name
    if (firstName && typeof firstName === 'string' && firstName[0]) {
      return firstName[0].toUpperCase()
    }
    const email = user.email
    if (email && typeof email === 'string' && email[0]) {
      return email[0].toUpperCase()
    }
    return 'U'
  }
  
  const initials = getInitials()
  const isAdmin = user?.user_metadata?.is_admin === true
  const displayName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Account'

  return (
    <>
      {/* Top Bar */}
      {/* <div className={`fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground transition-all duration-300 ${scrolled ? "h-0 overflow-hidden opacity-0" : "h-10 opacity-100"}`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="mailto:hello@alexplore.com" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">hello@alexplore.com</span>
            </a>
            <a href="tel:+20312345677" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+20 3 123 4567</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-primary-foreground/80">Book now & get 20% off!</span>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "top-0 bg-primary backdrop-blur-md shadow-lg border-b border-border/50" : "top-5 bg-transparent"}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
            {/* Logo */}
<Link href="/" className="flex items-center gap-2 group">
  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
    scrolled ? "bg-primary" : "bg-accent/20 backdrop-blur-sm"
  }`}>
    <img 
      src="/alexandre-logo.png" 
      alt="Alexplore Logo" 
      className="w-full h-full object-cover"
    />
  </div>
  <span className={`font-serif text-2xl font-semibold tracking-wide transition-colors ${
    scrolled ? "text-secondary" : "text-secondary"
  }`}>
    Alexplore
  </span>
</Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    scrolled 
                      ? "text-secondary  hover:bg-secondary/10" 
                      : "text-secondary  hover:bg-secondary/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${scrolled ? "text-secondary  hover:bg-secondary/10" : "text-secondary/80 hover:text-secondary hover:bg-secondary/10"}`}>
                  More <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/#activities">Activities</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/#accommodations">Accommodations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/#gallery">Gallery</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-10 bg-muted animate-pulse rounded-full" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`rounded-full gap-2 transition-colors ${scrolled ? "text-foreground hover:text-primary" : "text-secondary hover:bg-secondary/10"}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden xl:inline">{displayName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email || ''}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-primary">
                            <User className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    className={`rounded-full transition-colors ${scrolled ? "text-foreground hover:text-primary" : "text-secondary hover:text-accent hover:bg-secondary/10"}`}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
              <Link href="/packages">
                <Button 
                  className={`rounded-full px-6 transition-all hover:scale-105 ${
                    scrolled 
                      ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                      : "bg-accent hover:bg-accent/90 text-foreground shadow-lg shadow-accent/25"
                  }`}
                >
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-full transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-secondary hover:bg-secondary/10"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 top-[calc(4rem+2.5rem)] bg-background transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className={`transition-all duration-300 ${mobileMenuOpen ? "translate-y-0" : "-translate-y-4"}`}>
            <nav className="container mx-auto px-4 py-8 flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="px-4 py-3 text-lg font-medium rounded-xl text-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-border my-4" />
              
              <Link 
                href="/#activities"
                className="px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Activities
              </Link>
              <Link 
                href="/#accommodations"
                className="px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accommodations
              </Link>
              <Link 
                href="/#gallery"
                className="px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>

              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full py-6 text-lg">
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Dashboard
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-full py-6 text-lg text-primary">
                          <User className="mr-2 h-5 w-5" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-full py-6 text-lg text-red-600"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full py-6 text-lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full py-6 text-lg">
                        Create Account
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="/packages" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg">
                    Book Now
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}