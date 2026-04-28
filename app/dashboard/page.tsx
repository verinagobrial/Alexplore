// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, User, Calendar, Package, Mail, Phone, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
      setLoading(false)
    }
    
    getUserData()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <>
      <Header />
      
         {/* Hero Section */}
     <section className="relative py-20 overflow-hidden">
  {/* Image Background */}
  <div 
    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/images/image-1773580378733.png')" }}
  />
  
  {/* Blurred Overlay */}
  <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm z-0" />
  
  {/* Optional: Animated gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 z-0" />

  {/* Content */}
  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4">
              Welcome Back, {profile?.first_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-base md:text-lg opacity-90 px-4">
              Manage your bookings and explore new adventures
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Cards */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* User Info Card */}
            <Card className="md:col-span-1 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </p>
                  <p className="font-medium break-all">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </p>
                  <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="font-medium">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="w-full mt-4 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="md:col-span-2 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link href="/packages">
                    <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                      <Package className="h-6 w-6" />
                      <span>Browse Packages</span>
                    </Button>
                  </Link>
                 <Link href="/my-bookings">
  <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-r from-amber-500 to-yellow-500  hover:from-amber-600 hover:to-yellow-600">
    <Package className="h-6 w-6" />
    <span>My Bookings</span>
  </Button>
</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}