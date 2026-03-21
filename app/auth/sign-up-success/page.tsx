import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass, Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Compass className="h-10 w-10 text-primary" />
          <span className="text-3xl font-serif font-bold text-primary">Alexplore</span>
        </Link>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              {"We've sent you a confirmation link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <Mail className="h-12 w-12 mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground">
                Click the link in your email to verify your account and complete your registration.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {"Didn't receive the email? Check your spam folder or"}
              </p>
              <Button variant="outline" className="w-full">
                Resend Confirmation Email
              </Button>
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
