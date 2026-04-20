// lib/payment/payment-service.server.ts
import 'server-only'
import { stripe } from '@/lib/stripe.server'

export interface PaymentRequest {
  amount: number
  currency: string
  method: string
  customerDetails: {
    name: string
    email: string
    phone?: string
    nationalId?: string
  }
  bookingDetails: {
    packageId: string
    packageName: string
    guests: number
    date: string
  }
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  redirectUrl?: string
  qrCode?: string
  instructions?: string
  error?: string
}

export async function processPaymentServer(request: PaymentRequest): Promise<PaymentResponse> {
  console.log('Processing payment method:', request.method)
  
  switch (request.method) {
    case 'stripe_card':
      return processStripeServer(request)
    case 'fawry':
      return processFawryServer(request)
    case 'paypal':
      return processPayPalServer(request)
    case 'vodafone_cash':
      // Vodafone Cash is handled client-side, but we'll return a response
      return {
        success: true,
        transactionId: `VC_${Date.now()}`,
        instructions: `Please complete payment using Vodafone Cash. Send ${request.amount} EGP to 01000000000.`
      }
    case 'orange_money':
      return {
        success: true,
        transactionId: `OM_${Date.now()}`,
        instructions: `Please complete payment using Orange Money. Send ${request.amount} EGP to 01200000000.`
      }
    case 'etisalat_cash':
      return {
        success: true,
        transactionId: `EC_${Date.now()}`,
        instructions: `Please complete payment using Etisalat Cash. Send ${request.amount} EGP to 01100000000.`
      }
    case 'instapay':
      return processInstaPayServer(request)
    case 'crypto':
      return processCryptoServer(request)
    default:
      console.error('Unsupported payment method:', request.method)
      return { 
        success: false, 
        error: `Payment method "${request.method}" is not supported on server` 
      }
  }
}

async function processStripeServer(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: request.currency.toLowerCase(),
            product_data: {
              name: request.bookingDetails.packageName,
              description: `${request.bookingDetails.guests} guests, ${request.bookingDetails.date}`,
            },
            unit_amount: request.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      customer_email: request.customerDetails.email,
      metadata: {
        packageId: request.bookingDetails.packageId,
        guests: request.bookingDetails.guests.toString(),
        date: request.bookingDetails.date,
        packageName: request.bookingDetails.packageName,
      },
    })

    if (!session.url) {
      throw new Error('No checkout URL returned')
    }

    return {
      success: true,
      transactionId: session.id,
      redirectUrl: session.url,
    }
  } catch (error) {
    console.error('Stripe error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create Stripe session' 
    }
  }
}

async function processFawryServer(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // For now, return a simulated response
    // In production, integrate with actual Fawry API
    const transactionId = `FAWRY_${Date.now()}`
    
    return {
      success: true,
      transactionId,
      redirectUrl: `https://atfawry.fawrystaging.com/?merchantRefNum=${transactionId}`,
      instructions: 'You will be redirected to Fawry to complete payment'
    }
    
    // Uncomment when Fawry API is configured:
    /*
    const response = await fetch('https://api.fawry.com/v2/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FAWRY_API_KEY}`
      },
      body: JSON.stringify({
        merchantCode: process.env.FAWRY_MERCHANT_CODE,
        merchantRefNum: `ALEXPLORE_${Date.now()}`,
        customerMobile: request.customerDetails.phone,
        customerEmail: request.customerDetails.email,
        amount: request.amount,
        currencyCode: request.currency,
        paymentMethod: 'PAYATFAWRY',
        description: request.bookingDetails.packageName,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success`,
        authCaptureModePayment: true
      })
    })

    const data = await response.json()
    
    if (data.statusCode === 200) {
      return {
        success: true,
        transactionId: data.referenceNumber,
        redirectUrl: data.paymentUrl,
        instructions: 'Click the link to complete payment via Fawry'
      }
    }
    
    return { success: false, error: data.statusDescription }
    */
  } catch (error) {
    console.error('Fawry error:', error)
    return { success: false, error: 'Fawry payment processing failed' }
  }
}

async function processPayPalServer(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // For now, return a simulated response
    const transactionId = `PAYPAL_${Date.now()}`
    
    return {
      success: true,
      transactionId,
      redirectUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${transactionId}`,
      instructions: 'You will be redirected to PayPal to complete payment'
    }
    
    // Uncomment when PayPal API is configured:
    /*
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64')

    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const { access_token } = await tokenResponse.json()

    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: request.currency,
            value: request.amount.toString(),
          },
          description: request.bookingDetails.packageName,
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
        },
      }),
    })

    const data = await orderResponse.json()
    
    const approvalUrl = data.links.find((link: any) => link.rel === 'approve')?.href
    
    return {
      success: true,
      transactionId: data.id,
      redirectUrl: approvalUrl,
    }
    */
  } catch (error) {
    console.error('PayPal error:', error)
    return { success: false, error: 'PayPal processing failed' }
  }
}

async function processInstaPayServer(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // Simulated InstaPay response
    const transactionId = `INSTAPAY_${Date.now()}`
    
    return {
      success: true,
      transactionId,
      instructions: `Please complete payment using InstaPay. Send ${request.amount} EGP to merchant code: 123456`,
      qrCode: await generateQRCode({
        merchant: 'Alexplore',
        amount: request.amount,
        reference: transactionId
      })
    }
  } catch (error) {
    console.error('InstaPay error:', error)
    return { success: false, error: 'InstaPay processing failed' }
  }
}

async function processCryptoServer(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // Simulated crypto payment
    const transactionId = `CRYPTO_${Date.now()}`
    const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7593CbC5c3'
    
    return {
      success: true,
      transactionId,
      instructions: `Send ${request.amount} ${request.currency} worth of crypto to: ${walletAddress}`,
      qrCode: await generateQRCode({
        address: walletAddress,
        amount: request.amount,
        currency: request.currency
      })
    }
  } catch (error) {
    console.error('Crypto error:', error)
    return { success: false, error: 'Crypto payment processing failed' }
  }
}

async function generateQRCode(data: any): Promise<string> {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`
}