// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/alexplore/header'  
import { Footer } from '@/components/alexplore/footer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Remove DashboardNav - your page already has its own header
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}