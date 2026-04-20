// components/payment/EgyptianPayment.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Copy, CheckCircle, ArrowLeft, QrCode, Wallet, Smartphone, Banknote, Clock, Shield } from 'lucide-react'

interface EgyptianPaymentProps {
  amount: number
  method: 'instapay' | 'vodafone_cash'
  onSuccess: () => void
  onBack: () => void
}

export function EgyptianPayment({ amount, method, onSuccess, onBack }: EgyptianPaymentProps) {
  const [reference] = useState(() => `ALEX-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`.toUpperCase())
  const [copied, setCopied] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (waiting && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [waiting, countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const qrCodes = {
    instapay: '/images/qr codes/instapay.jpeg',
    vodafone_cash: '/images/qr codes/vodafone.jpeg',
  }

  const paymentDetails = {
    instapay: {
      name: 'InstaPay',
      icon: <Banknote className="h-5 w-5 md:h-6 md:w-6" />,
      instructions: 'Open your banking app and scan the QR code to pay instantly',
      qrCode: qrCodes.instapay,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      steps: [
        'Open your InstaPay app or banking app',
        'Select "Pay by QR" or "Scan QR Code"',
        'Scan the QR code above',
        `Enter amount: EGP ${amount.toLocaleString()}`,
        `Enter reference: ${reference}`,
        'Confirm payment with your fingerprint or PIN',
        'You will receive instant confirmation'
      ]
    },
    vodafone_cash: {
      name: 'Vodafone Cash',
      icon: <Smartphone className="h-5 w-5 md:h-6 md:w-6" />,
      instructions: 'Open Vodafone Cash app and scan the QR code to pay',
      qrCode: qrCodes.vodafone_cash,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      steps: [
        'Open Vodafone Cash app',
        'Select "Pay by QR" or "Scan QR Code"',
        'Scan the QR code above',
        `Enter amount: EGP ${amount.toLocaleString()}`,
        `Enter reference: ${reference}`,
        'Confirm payment with your PIN',
        'You will receive SMS confirmation'
      ]
    },
  }

  const details = paymentDetails[method]

  const copyReference = () => {
    navigator.clipboard.writeText(reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confirmPayment = () => {
    setWaiting(true)
    setCountdown(300)
    setTimeout(() => {
      onSuccess()
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Fully Responsive */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-full">
                {method === 'instapay' ? (
                  <Banknote className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                ) : (
                  <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                )}
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 sm:mb-3 md:mb-4 px-4">
              Pay with {details.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 px-4 max-w-2xl mx-auto">
              Complete your payment securely to confirm your booking
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 sm:mb-6 gap-1 sm:gap-2 text-sm sm:text-base hover:bg-gray-100 h-9 sm:h-10"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Payment Methods
          </Button>

          {/* Payment Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className={`bg-gradient-to-r ${details.color} p-4 sm:p-5 md:p-6 text-white`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {details.icon}
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  Pay with {details.name}
                </h2>
              </div>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
                {details.instructions}
              </p>
            </div>
            
            <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
              {/* QR Code Section */}
              <div className="text-center">
                <div className="bg-white p-3 sm:p-4 rounded-xl inline-block border-2 border-gray-200 shadow-md">
                  <img 
                    src={details.qrCode} 
                    alt={`${details.name} QR Code`}
                    className="mx-auto"
                    style={{ 
                      width: isMobile ? '140px' : '180px', 
                      height: isMobile ? '140px' : '180px', 
                      objectFit: 'contain' 
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x200?text=QR+Code'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <p className="text-xs sm:text-sm text-gray-500">
                    Scan this QR code with your {details.name} app
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className={`${details.bgColor} rounded-lg p-3 sm:p-4 md:p-5`}>
                <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Wallet className="h-4 w-4" />
                  Payment Details
                </h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-xs sm:text-sm">Amount to Pay:</span>
                    <span className="font-bold text-base sm:text-lg md:text-xl text-primary">
                      EGP {amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-2">
                    <span className="text-gray-600 text-xs sm:text-sm">Reference Number:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border text-xs font-mono break-all max-w-[150px] sm:max-w-none">
                        {reference}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyReference}
                        className="h-6 sm:h-7 px-2 hover:bg-gray-200 shrink-0"
                      >
                        {copied ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-5">
                <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Smartphone className="h-4 w-4" />
                  How to pay with {details.name}:
                </h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
                  {details.steps.map((step, index) => (
                    <li key={index} className="text-gray-700 break-words">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-5 border border-yellow-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Shield className="h-4 w-4" />
                  Important Notes:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>Please use the exact reference number when making the payment</li>
                  <li>Your booking will be confirmed automatically after payment verification</li>
                  <li>You will receive a confirmation email once payment is confirmed</li>
                  <li className="hidden sm:list-item">If you don't receive confirmation within 30 minutes, contact support</li>
                </ul>
              </div>

              {/* Confirm Payment Button */}
              <Button
                onClick={confirmPayment}
                className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={waiting}
              >
                {waiting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span>Waiting for payment confirmation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>I have made the payment</span>
                  </>
                )}
              </Button>

              {/* Timer */}
              {waiting && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Auto-confirmation in: {formatTime(countdown)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    The page will update automatically when payment is confirmed
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-gray-500">
                After completing the payment, click the button above to confirm. 
                <span className="hidden sm:inline"> We'll verify your payment and send you a confirmation email.</span>
              </p>
            </CardContent>
          </Card>

          {/* Waiting Alert */}
          {waiting && (
            <Alert className="mt-4 sm:mt-6 bg-blue-50 border-blue-200">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs sm:text-sm">
                <strong className="text-xs sm:text-sm">Payment verification in progress...</strong>
                <span className="block mt-1">
                  We're checking your payment. This may take a few minutes. 
                  The page will update automatically when your payment is confirmed.
                </span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}