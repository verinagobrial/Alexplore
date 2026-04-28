// components/Header.tsx
"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Compass,
  Mountain,
  Building,
  Hotel,
  MapPin,
  Wand2
} from "lucide-react"
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

// Define a local User type for our app (don't import from supabase)
interface AppUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  emailVerified: boolean;
  created_at: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    is_admin?: boolean;
    phone?: string;
  };
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
]

// More menu items for desktop dropdown and mobile section
const moreMenuItems = [
  { 
    href: "/destinations", 
    label: "Destinations", 
    icon: Compass,
    description: "Explore amazing places"
  },
  { 
    href: "/activities", 
    label: "Activities", 
    icon: Mountain,
    description: "Things to do and experiences"
  },
  { 
    href: "/heritage", 
    label: "Historical Sites", 
    icon: MapPin,
    description: "Ancient wonders & landmarks"
  },
  { 
    href: "/accommodations", 
    label: "Hotels & Accommodations", 
    icon: Hotel,
    description: "Comfortable stays"
  },
  { 
    href: "/custom-trip", 
    label: "Customize Your Trip", 
    icon: Wand2,
    description: "Build your perfect journey",
    highlight: true
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Create supabase client - stable reference
  const supabase = useRef(createClient()).current
  
  // Use refs for router to avoid dependency issues
  const routerRef = useRef(router)
  useEffect(() => {
    routerRef.current = router
  }, [router])

  // Handle scroll effect - stable dependencies
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // Auth state management - Supabase version with real-time subscription
  useEffect(() => {
    let isMounted = true

    // Get initial session
    const getInitialUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (isMounted && currentUser) {
          // Format Supabase user to our AppUser type
          const formattedUser: AppUser = {
            id: currentUser.id,
            email: currentUser.email!,
            name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name,
            phone: currentUser.user_metadata?.phone,
            emailVerified: currentUser.email_confirmed_at ? true : false,
            created_at: currentUser.created_at,
            user_metadata: {
              first_name: currentUser.user_metadata?.first_name || '',
              last_name: currentUser.user_metadata?.last_name || '',
              is_admin: currentUser.user_metadata?.is_admin || false,
              phone: currentUser.user_metadata?.phone,
            }
          }
          setUser(formattedUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.log("No user session found")
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getInitialUser()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return
        
        console.log("Auth state changed:", event)
        
        if (event === 'SIGNED_IN' && session?.user) {
          const formattedUser: AppUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            phone: session.user.user_metadata?.phone,
            emailVerified: session.user.email_confirmed_at ? true : false,
            created_at: session.user.created_at,
            user_metadata: {
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              is_admin: session.user.user_metadata?.is_admin || false,
              phone: session.user.user_metadata?.phone,
            }
          }
          setUser(formattedUser)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        } else if (event === 'USER_UPDATED' && session?.user) {
          const formattedUser: AppUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            phone: session.user.user_metadata?.phone,
            emailVerified: session.user.email_confirmed_at ? true : false,
            created_at: session.user.created_at,
            user_metadata: {
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              is_admin: session.user.user_metadata?.is_admin || false,
              phone: session.user.user_metadata?.phone,
            }
          }
          setUser(formattedUser)
        }
        
        setLoading(false)
      }
    )

    // Refresh user when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getInitialUser()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isMounted = false
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [supabase])

  // Helper function to get user initials - memoized
  const getInitials = useCallback(() => {
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
  }, [user])

  // Helper function to get display name - memoized
  const getDisplayName = useCallback(() => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    if (user?.name) {
      return user.name
    }
    return user?.email?.split('@')[0] || 'Account'
  }, [user])

  // Sign out handler - stable
  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setMobileMenuOpen(false)
      routerRef.current.push("/")
      routerRef.current.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [supabase])

  const initials = getInitials()
  const isAdmin = user?.user_metadata?.is_admin === true
  const displayName = getDisplayName()

  // User Menu Component
  const UserMenu = useCallback(() => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`rounded-full gap-2 transition-colors ${
            scrolled 
              ? "text-secondary hover:text-primary" 
              : "text-secondary hover:bg-secondary/10"
          }`}
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
      <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{user?.email || ''}</p>
        </div>
        <DropdownMenuSeparator className="bg-gray-100" />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
          <Link href="/dashboard" className="text-gray-700">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
          <Link href="/dashboard/settings" className="text-gray-700">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
              <Link href="/admin" className="text-primary">
                <User className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-gray-100" />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer hover:bg-gray-100">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ), [scrolled, initials, displayName, user, isAdmin, handleSignOut])

  return (
    <>
      {/* Main Header */}
      <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "top-0 bg-primary backdrop-blur-md shadow-lg" 
          : "top-0 bg-transparent"
      }`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
                scrolled ? "bg-primary" : "bg-accent/20 backdrop-blur-sm"
              }`}>
                <img 
                  src="/alexandre-logo.png" 
                  alt="Alexplore Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`font-serif text-2xl font-semibold tracking-wide transition-colors text-secondary`}>
                Alexplore
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 text-secondary hover:bg-secondary/10`}
                >
                  {link.label}
                </Link>
              ))}
              {/* More Dropdown Menu - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 text-secondary hover:bg-secondary/10`}>
                  More <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200 p-2">
                  {moreMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                      <Link href={item.href} className="flex items-start gap-3 text-gray-700">
                        <item.icon className="h-5 w-5 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <p className={`font-medium ${item.highlight ? 'text-primary' : 'text-gray-900'}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop CTA - Integrated with auth state */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-10 bg-muted animate-pulse rounded-full" />
              ) : user ? (
                <UserMenu />
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      className="rounded-full transition-colors text-secondary hover:text-accent hover:bg-secondary/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
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
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-full transition-colors z-50 ${
                scrolled ? "text-secondary hover:bg-muted" : "text-secondary hover:bg-secondary/10"
              }`}
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
      </header>

      {/* Mobile & Tablet Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ top: scrolled ? '64px' : '80px' }}
      >
        {/* Backdrop overlay - dark with opacity */}
        <div 
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          style={{ opacity: mobileMenuOpen ? 1 : 0 }}
        />
        
        {/* Menu panel - ALWAYS WHITE BACKGROUND */}
        <div 
          className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex-1 py-8 px-6">
              <nav className="flex flex-col gap-2">
                {/* Main Navigation Links */}
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="px-4 py-3 text-lg font-medium rounded-xl text-gray-800 hover:text-yellow-600 hover:bg-yellow-50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-gray-200 my-4" />
                
                {/* More Section Title - Mobile/Tablet */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Explore More
                  </p>
                </div>
                
                {/* More Menu Items - Mobile/Tablet with icons and descriptions */}
                {moreMenuItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${
                      item.highlight 
                        ? 'bg-primary/10 hover:bg-primary/20 text-primary' 
                        : 'text-gray-800 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 mt-0.5 ${item.highlight ? 'text-primary' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${item.highlight ? 'text-primary' : ''}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                ))}

                <div className="border-t border-gray-200 my-4" />

                <div className="mt-6 flex flex-col gap-3">
                  {loading ? (
                    <div className="w-full h-12 bg-gray-100 animate-pulse rounded-full" />
                  ) : user ? (
                    <>
                      {/* User Info Section */}
                      <div className="px-4 py-3 mb-2 bg-yellow-50 rounded-xl">
                        <p className="font-medium text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-500 break-all">{user.email}</p>
                      </div>
                      
                      {/* Dashboard Links */}
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-full py-6 text-lg border-gray-200 hover:border-yellow-500 hover:bg-yellow-50">
                          <LayoutDashboard className="mr-2 h-5 w-5" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-full py-6 text-lg border-gray-200 hover:border-yellow-500 hover:bg-yellow-50">
                          <Settings className="mr-2 h-5 w-5" />
                          Settings
                        </Button>
                      </Link>
                      
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full rounded-full py-6 text-lg text-yellow-600 border-yellow-500 hover:bg-yellow-50">
                            <User className="mr-2 h-5 w-5" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      
                      {/* Sign Out Button */}
                      <Button 
                        variant="ghost" 
                        className="w-full rounded-full py-6 text-lg text-red-600 hover:bg-red-50 hover:text-red-700"
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
                      {/* Auth Buttons for non-authenticated users */}
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-full py-6 text-lg border-gray-200 hover:border-yellow-500 hover:bg-yellow-50">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-full py-6 text-lg">
                          Create Account
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  {/* Book Now Button - Always visible */}
                  <Link href="/packages" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#326964] hover:bg-[#28544f] text-white rounded-full py-6 text-lg mt-2">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}