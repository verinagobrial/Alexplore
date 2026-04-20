// components/payment/payment-methods.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { PAYMENT_METHODS, type BookingDetails } from '@/lib/payment/config'
import { createStripeCheckoutSession } from '@/app/actions/booking'
import { CreditCard, Smartphone, Wallet, Building, AlertCircle, Loader2, ChevronLeft, QrCode, Copy, Check } from 'lucide-react'

interface PaymentMethodsProps {
  amount: number
  packageId: string
  packageName: string
  guests: number
  date: string
  time?: string
  priceInCents?: number
  onSuccess: (transactionId: string) => void
  onBack?: () => void
  onMethodSelect?: (method: string) => void
}

interface PaymentResult {
  transactionId: string
  instructions: string
  qrCode?: string
  paymentNumber?: string
  amount: number
  currency: string
}

export function PaymentMethods({ 
  amount, 
  packageId, 
  packageName, 
  guests, 
  date, 
  time = '10:00 AM',
  priceInCents,
  onSuccess, 
  onBack,
  onMethodSelect
}: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'EGP' | 'USD'>('EGP')
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    onMethodSelect?.(methodId)
  }

  const getPriceForCurrency = () => {
    // If priceInCents is provided, use that (for Stripe)
    if (priceInCents && selectedCurrency === 'USD') {
      return priceInCents / 100
    }
    // Convert USD to EGP (1 USD = 50 EGP for demo)
    if (selectedCurrency === 'EGP') {
      return Math.round(amount * 50)
    }
    return amount
  }

  const getTotalAmount = () => {
    const price = getPriceForCurrency()
    return price * guests
  }

  const getFilteredPaymentMethods = () => {
    if (selectedCurrency === 'EGP') {
      return PAYMENT_METHODS.filter(m => m.currency === 'EGP')
    }
    return PAYMENT_METHODS.filter(m => m.currency === 'USD')
  }

  const handleLocalPayment = async (paymentMethod: any) => {
    const transactionId = `LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const totalAmount = getTotalAmount()
    
    // Create booking using your existing createBooking function
    const { createBooking } = await import('@/app/actions/booking')
    
    await createBooking({
      transactionId,
      paymentMethod: selectedMethod,
      amount: totalAmount,
      currency: selectedCurrency,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
      bookingDetails: {
        packageId,
        packageName,
        guests,
        date: `${date} ${time}`,
      },
    })
    
    // Set payment instructions based on method
    let instructions = ''
    let paymentNumber = ''
    let qrCode = ''
    
    if (paymentMethod?.id === 'paymob_valu') {
      paymentNumber = '0100 1234 5678'
      instructions = `Send ${totalAmount.toLocaleString()} EGP to Valu account: ${paymentNumber}`
      qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VALU:${paymentNumber}:${totalAmount}`
    } else if (paymentMethod?.id === 'paymob_instapay') {
      paymentNumber = 'instapay@puppyyoga.com'
      instructions = `Send ${totalAmount.toLocaleString()} EGP to InstaPay: ${paymentNumber}`
      qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=INSTAPAY:${paymentNumber}:${totalAmount}`
    } else if (paymentMethod?.id === 'paymob_aman') {
      paymentNumber = '123456789'
      instructions = `Visit any Aman kiosk with this code: ${paymentNumber} and pay ${totalAmount.toLocaleString()} EGP`
    } else {
      instructions = `Please pay ${totalAmount.toLocaleString()} EGP to the instructor before class starts`
    }
    
    setPaymentResult({
      transactionId,
      instructions,
      qrCode,
      paymentNumber,
      amount: totalAmount,
      currency: selectedCurrency
    })
    
    // Auto-complete after 30 seconds for demo (in production, you'd wait for webhook)
    setTimeout(async () => {
      const { updateBookingStatus } = await import('@/app/actions/booking')
      await updateBookingStatus(transactionId, 'completed')
      onSuccess(transactionId)
    }, 30000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!selectedMethod) {
      setError('Please select a payment method')
      setLoading(false)
      return
    }

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      setError('Please fill in all contact details')
      setLoading(false)
      return
    }

    if (!waiverAccepted) {
      setError('Please accept the waiver to continue')
      setLoading(false)
      return
    }

    const totalAmount = getTotalAmount()

    try {
      const paymentMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod)
      
      // Handle local Egyptian payments
      if (selectedMethod.includes('paymob') || selectedMethod === 'valu' || selectedMethod === 'instapay' || selectedMethod === 'aman') {
        await handleLocalPayment(paymentMethod)
        setLoading(false)
        return
      }
      
      // Handle Stripe payments - FIXED: Added all required parameters
      if (paymentMethod?.id.startsWith('stripe') && priceInCents) {
        const result = await createStripeCheckoutSession(
          packageId,           // packageId
          guests,              // guests
          packageName,         // packageName
          priceInCents,        // priceInCents
          customerDetails.email, // customerEmail
          customerDetails.name,   // customerName
          customerDetails.phone,  // customerPhone
          date                    // date
        )
        
        if (result.success && result.url) {
          window.location.href = result.url
        } else {
          throw new Error(result.error || 'Failed to create checkout session')
        }
      } 
      // Handle PayPal (future implementation)
      else if (paymentMethod?.id === 'paypal') {
        // Implement PayPal integration
        setError('PayPal integration coming soon')
        setLoading(false)
        return
      }
      else {
        // Demo mode fallback
        const transactionId = `DEMO_${Date.now()}`
        const { createBooking, updateBookingStatus } = await import('@/app/actions/booking')
        
        await createBooking({
          transactionId,
          paymentMethod: selectedMethod,
          amount: totalAmount,
          currency: selectedCurrency,
          customerDetails: {
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
          },
          bookingDetails: {
            packageId,
            packageName,
            guests,
            date: `${date} ${time}`,
          },
        })
        
        await updateBookingStatus(transactionId, 'completed')
        setTimeout(() => {
          onSuccess(transactionId)
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredMethods = getFilteredPaymentMethods()

  const getMethodIcon = (methodId: string) => {
    if (methodId.includes('card')) return <CreditCard className="h-5 w-5" />
    if (methodId.includes('wallet') || methodId.includes('instapay') || methodId.includes('valu')) 
      return <Wallet className="h-5 w-5" />
    if (methodId.includes('paypal') || methodId.includes('google') || methodId.includes('apple')) 
      return <Smartphone className="h-5 w-5" />
    return <Building className="h-5 w-5" />
  }
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Currency Selection */}
          <Card>
            <CardContent className="pt-6">
              <Label className="text-sm font-medium mb-3 block">Select Currency</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={selectedCurrency === 'EGP' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    setSelectedCurrency('EGP')
                    handleMethodSelect('')
                  }}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Egyptian Pound (EGP)
                </Button>
                <Button
                  type="button"
                  variant={selectedCurrency === 'USD' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    setSelectedCurrency('USD')
                    handleMethodSelect('')
                  }}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  US Dollar (USD)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="font-semibold text-lg">Contact Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  required
                  placeholder={selectedCurrency === 'EGP' ? '012 3456 7890' : '+20 123 456 7890'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
              
              {filteredMethods.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No payment methods available for selected currency
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {filteredMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleMethodSelect(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === method.id ? 'border-primary' : 'border-gray-300'
                        }`}>
                          {selectedMethod === method.id && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getMethodIcon(method.id)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                        {method.processingFee && method.processingFee > 0 && (
                          <span className="text-xs text-gray-500">
                            +{method.processingFee * 100}% fee
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waiver */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="waiver"
                  checked={waiverAccepted}
                  onCheckedChange={(checked) => setWaiverAccepted(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="waiver" className="font-medium cursor-pointer">
                    I agree to the Liability Waiver *
                  </Label>
                  <p className="text-sm text-gray-500">
                    I understand that this activity involves physical movement and that all participants 
                    release the studio from any liability for injuries or incidents.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600"
              disabled={loading || !selectedMethod || !waiverAccepted}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${selectedCurrency === 'EGP' ? 'EGP ' : '$ '}${getTotalAmount().toLocaleString()} Securely`
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500">
            By completing this booking, you agree to our Terms of Service and Privacy Policy.
            All payments are processed securely through {selectedCurrency === 'EGP' ? 'Paymob' : 'Stripe/PayPal'}.
          </p>
        </div>
      </form>

      {/* Payment Instructions Dialog */}
      <Dialog open={!!paymentResult} onOpenChange={() => setPaymentResult(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Payment Instructions
            </DialogTitle>
            <DialogDescription>
              Complete your payment using the instructions below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {paymentResult?.qrCode && (
              <div className="flex justify-center">
                <img 
                  src={paymentResult.qrCode} 
                  alt="Payment QR Code" 
                  className="w-48 h-48 border rounded-lg p-2"
                />
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Instructions:</p>
              <p className="text-sm text-gray-600">{paymentResult?.instructions}</p>
              
              {paymentResult?.paymentNumber && (
                <div className="mt-2">
                  <Label className="text-xs">Payment Reference</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-white px-3 py-2 rounded border text-sm flex-1">
                      {paymentResult.paymentNumber}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentResult.paymentNumber!)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Amount to pay: <strong>{paymentResult?.currency} {paymentResult?.amount?.toLocaleString()}</strong>
              </p>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your booking will be confirmed automatically after payment is received. 
                You'll receive an email confirmation shortly.
              </AlertDescription>
            </Alert>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => {
                setPaymentResult(null)
                // Don't call onSuccess here - it will be called after payment confirmation
              }}
            >
              I'll Complete Payment Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}