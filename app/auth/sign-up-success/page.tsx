import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

// Inner component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const resendEmail = async () => {
    if (!email) {
      setResendStatus({ type: 'error', message: 'No email found. Please sign up again.' })
      return
    }

    setResending(true)
    setResendStatus(null)
    
    try {
      const response = await fetch('/api/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setResendStatus({ type: 'success', message: '✓ Confirmation email sent! Check your inbox.' })
      } else {
        setResendStatus({ type: 'error', message: data.error || 'Failed to resend email. Please try again.' })
      }
    } catch (error) {
      setResendStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Compass className="h-10 w-10 text-primary" />
          <span className="text-3xl font-serif font-bold text-primary">Alexplore</span>
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a confirmation link to <strong>{email || 'your email'}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Mail className="h-12 w-12 mx-auto text-primary mb-3" />
              <p className="text-sm text-gray-700">
                Click the link in your email to verify your account.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Make sure your server is running (npm run dev) before clicking the link.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={resendEmail} 
                variant="outline" 
                className="w-full"
                disabled={resending}
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Confirmation Email'
                )}
              </Button>
              
              {resendStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  resendStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {resendStatus.type === 'success' ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>{resendStatus.message}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{resendStatus.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <Link href="/">
                <Button variant="ghost" className="text-primary">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main page with Suspense boundary
export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}