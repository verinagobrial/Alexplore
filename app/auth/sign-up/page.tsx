// app/auth/sign-up/page.tsx
'use client'

import 'crypto'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      setIsSupabaseConfigured(false)
      setError('Supabase is not configured. Please check your environment variables.')
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isSupabaseConfigured) {
      setError('Authentication is not configured. Please contact support.')
      return
    }

    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name')
      return
    }

    if (!formData.email) {
      setError('Please enter your email')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      console.log('Attempting signup with:', formData.email)
      
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
        },
      })

      if (signUpError) {
        console.error('Signup error details:', signUpError)
        
        if (signUpError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else if (signUpError.message.includes('Invalid email')) {
          setError('Please enter a valid email address.')
        } else if (signUpError.message.includes('password')) {
          setError('Password must be at least 6 characters.')
        } else {
          setError(`Signup failed: ${signUpError.message}`)
        }
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log('Signup successful:', data.user.email)
        router.push('/auth/sign-up-success')
      } else {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        setError('Cannot connect to authentication service. Please check your Supabase configuration.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/image-1773580378733.png')" }}
        />
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in text-secondary">
              Start Your Journey
            </h1>
            <p className="text-lg opacity-90 mb-8 animate-slide-up">
              The Soul of the Mediterranean in Your Hands.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
              <CardDescription>
                Join Alexplore and start planning your Alexandria adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+20 123 456 7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 6 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-secondary hover:bg-secondary/95 font-semibold"
                  disabled={loading || !isSupabaseConfigured}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}