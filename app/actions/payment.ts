// app/actions/payment.ts
'use server'

import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { emailConfig } from '@/lib/email/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export interface BookingConfirmationData {
  transactionId: string
  packageName: string
  guests: number
  date: string
  time?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  currency: string
  paymentMethod: string
}

// Stripe Payment (International Credit Cards)
export async function createStripePayment(
  amount: number,
  currency: string,
  customerDetails: {
    name: string
    email: string
    phone: string
  },
  bookingDetails: {
    packageName: string
    guests: number
    date: string
    transactionId: string
  }
) {
  try {
    console.log('Creating Stripe session with:', {
      amount,
      currency,
      customerEmail: customerDetails.email,
      packageName: bookingDetails.packageName,
    })

    // Validate amount is positive
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Validate app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL is not configured')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: bookingDetails.packageName,
              description: `${bookingDetails.guests} guest(s) on ${new Date(bookingDetails.date).toLocaleDateString()}`,
              metadata: {
                transactionId: bookingDetails.transactionId,
              },
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&payment_method=stripe&transaction_id=${bookingDetails.transactionId}`,
      cancel_url: `${appUrl}/booking/cancel`,
      customer_email: customerDetails.email,
      metadata: {
        transactionId: bookingDetails.transactionId,
        packageName: bookingDetails.packageName,
        guests: bookingDetails.guests.toString(),
        date: bookingDetails.date,
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
      },
    })

    console.log('Stripe session created:', session.id)
    console.log('Stripe session URL:', session.url)

    if (!session.url) {
      throw new Error('No checkout URL returned from Stripe')
    }

    // Validate URL format
    try {
      new URL(session.url)
    } catch (urlError) {
      throw new Error(`Invalid URL returned from Stripe: ${session.url}`)
    }

    return {
      success: true,
      url: session.url,
      sessionId: session.id,
    }
  } catch (error) {
    console.error('Stripe payment error details:', error)
    
    // Provide more specific error messages
    if (error instanceof Stripe.errors.StripeError) {
      switch (error.type) {
        case 'StripeAuthenticationError':
          return {
            success: false,
            error: 'Stripe authentication failed. Please check your API keys.',
          }
        case 'StripeCardError':
          return {
            success: false,
            error: error.message || 'Your card was declined.',
          }
        case 'StripeRateLimitError':
          return {
            success: false,
            error: 'Too many requests. Please try again later.',
          }
        default:
          return {
            success: false,
            error: error.message || 'Failed to create payment session',
          }
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment session',
    }
  }
}

// InstaPay Payment (Egyptian Banks)
export async function createInstaPayPayment(
  amount: number,
  customerDetails: {
    name: string
    email: string
    phone: string
  },
  bookingDetails: {
    packageName: string
    guests: number
    date: string
    transactionId: string
  }
) {
  try {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Generate a unique payment reference
    const paymentRef = `ALEX-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`.toUpperCase()
    
    // For InstaPay, provide bank transfer details
    const bankDetails = {
      bankName: 'Commercial International Bank (CIB)',
      accountName: 'Alexplore Tours',
      accountNumber: '123456789012',
      iban: 'EG380012345678901234567890123',
      swiftCode: 'CIBEEGCX',
    }
    
    return {
      success: true,
      paymentRef,
      instructions: {
        method: 'instapay',
        steps: [
          'Option 1 - InstaPay App:',
          '1. Open your InstaPay app',
          '2. Select "Pay by QR" or "Send Money"',
          `3. Enter amount: EGP ${amount.toLocaleString()}`,
          `4. Use reference: ${paymentRef}`,
          '5. Complete the payment',
          '',
          'Option 2 - Bank Transfer:',
          `Bank: ${bankDetails.bankName}`,
          `Account Name: ${bankDetails.accountName}`,
          `Account Number: ${bankDetails.accountNumber}`,
          `IBAN: ${bankDetails.iban}`,
          `SWIFT: ${bankDetails.swiftCode}`,
          `Reference: ${paymentRef}`,
        ].join('\n'),
        qrCode: generateInstaPayQR(paymentRef, amount),
        bankDetails,
      },
    }
  } catch (error) {
    console.error('InstaPay payment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment',
    }
  }
}

// Generate InstaPay QR Code
function generateInstaPayQR(paymentRef: string, amount: number): string {
  const qrData = {
    merchant: 'Alexplore',
    amount: amount,
    currency: 'EGP',
    reference: paymentRef,
    merchantCode: '123456789',
    merchantName: 'Alexplore Tours',
  }
  
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(JSON.stringify(qrData))}`
}

// Check payment status (for InstaPay)
export async function checkPaymentStatus(paymentRef: string) {
  try {
    // In production, you would:
    // 1. Query your database
    // 2. Or call InstaPay API to verify payment
    
    // For demo, return mock status
    return {
      success: true,
      status: 'pending',
      paymentRef,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to check payment status',
    }
  }
}

// Confirm payment after verification
export async function confirmPayment(transactionId: string, paymentMethod: string) {
  try {
    // Update booking status in your database
    // Send confirmation email
    // Update payment records
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to confirm payment' }
  }
}

// Send booking confirmation email
export async function sendBookingConfirmation(data: BookingConfirmationData) {
  try {
    console.log('📧 Sending booking confirmation email to:', data.customerEmail)
    
    // Create transporter INSIDE the function (only runs at request time, NOT during build)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
    
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const formattedTime = data.time || '10:00 AM'
    
    const mailOptions = {
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: data.customerEmail,
      subject: `✨ Booking Confirmed: ${data.packageName} - ${emailConfig.siteName}`,
      html: generateEmailHTML(data, formattedDate, formattedTime),
    }
    
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully to:', data.customerEmail)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper function to generate email HTML
function generateEmailHTML(data: BookingConfirmationData, formattedDate: string, formattedTime: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ec489a 100%); padding: 40px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! ✨</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0;">Your Alexandria adventure awaits</p>
        </div>
        
        <div style="padding: 40px 32px;">
          <p style="color: #374151; font-size: 16px;">Hi <strong>${data.customerName}</strong>,</p>
          <p style="color: #374151; font-size: 16px;">Thank you for choosing <strong>Alexplore</strong>! Your booking has been confirmed.</p>
          
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #f59e0b; margin: 0 0 16px 0;">📋 Booking Details</h3>
            <table style="width: 100%;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Package:</td>
                <td><strong>${data.packageName}</strong></td>
              </tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td><strong>${formattedDate}</strong></td>
              </tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Time:</td>
                <td><strong>${formattedTime}</strong></td>
              </tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Guests:</td>
                <td><strong>${data.guests}</strong></td>
              </tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Total Paid:</td>
                <td><strong>${data.currency} ${data.amount.toLocaleString()}</strong></td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fef3c7; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #92400e;">Booking Reference: <strong>${data.transactionId.slice(-8).toUpperCase()}</strong></p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px;">Questions? Contact us at <a href="mailto:${emailConfig.supportEmail}" style="color: #f59e0b;">${emailConfig.supportEmail}</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}