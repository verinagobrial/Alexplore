// app/dashboard/layout.tsx - FIXED VERSION
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { supabase } = await createClient()
  const { data: { session } } = await supabase.auth.getSession() // Use getSession, not getUser

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}