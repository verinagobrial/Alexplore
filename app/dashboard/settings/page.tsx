// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Lock, Bell, Shield, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    email_promotions: false,
    sms_updates: true,
  })

  useEffect(() => {
    async function loadUserData() {
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
      
      if (profile) {
        setProfile(profile)
        setProfileForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
        })
      }
      
      setLoading(false)
    }
    
    loadUserData()
  }, [])

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          phone: profileForm.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setSuccess('Profile updated successfully!')
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match')
      setSaving(false)
      return
    }

    if (passwordForm.new_password.length < 6) {
      setError('Password must be at least 6 characters')
      setSaving(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      })

      if (error) throw error

      setSuccess('Password updated successfully!')
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function updateNotifications() {
    setSaving(true)
    try {
      // Save notification settings to database (you'll need to create a notifications table)
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          email_bookings: notifications.email_bookings,
          email_promotions: notifications.email_promotions,
          sms_updates: notifications.sms_updates,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setSuccess('Notification settings updated!')
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setSaving(false)
    }
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
    <main className="min-h-screen bg-gray-50">
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
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in text-secondary">
       Account settings
      </h1>
      <p className="text-lg opacity-90 mb-8 animate-slide-up">
       The Soul of the Mediterranean in Your Hands.
      </p>
    </div>
  </div>
</section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={updateProfile} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={profileForm.first_name}
                          onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                          placeholder="Enter your first name"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={profileForm.last_name}
                          onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                          placeholder="Enter your last name"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="h-11 bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if you need to update your email.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+20 123 456 7890"
                        className="h-11"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full md:w-auto bg-primary hover:bg-primary/90"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={updatePassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        placeholder="Enter new password"
                        className="h-11"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        placeholder="Confirm new password"
                        className="h-11"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={saving || !passwordForm.new_password}
                      className="w-full md:w-auto bg-primary hover:bg-primary/90"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h3 className="font-semibold text-amber-800 mb-2">Security Tips:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                        <li>Use a strong password with at least 8 characters</li>
                        <li>Include numbers, uppercase, and special characters</li>
                        <li>Never share your password with anyone</li>
                        <li>Enable two-factor authentication for extra security</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Booking Confirmations</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email when you book a package
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email_bookings}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, email_bookings: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Promotions & Offers</p>
                        <p className="text-sm text-muted-foreground">
                          Receive special deals and travel tips
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email_promotions}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, email_promotions: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">SMS Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get text alerts for booking reminders
                        </p>
                      </div>
                      <Switch
                        checked={notifications.sms_updates}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, sms_updates: checked })
                        }
                      />
                    </div>

                    <Button
                      onClick={updateNotifications}
                      disabled={saving}
                      className="w-full md:w-auto bg-primary hover:bg-primary/90 mt-4"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}