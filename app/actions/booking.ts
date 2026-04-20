'use server'

import { stripe } from '@/lib/stripe.server'
import { redirect } from 'next/navigation'
import { sendBookingConfirmation } from './payment'
import { createClient } from '@/lib/supabase/server' // Add this import

export interface BookingData {
  transactionId: string
  paymentMethod: string
  amount: number
  currency: string
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
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

// Store bookings in memory as fallback (will be replaced by database)
const bookings = new Map<string, BookingData>()

// Database functions
async function saveBookingToDatabase(bookingData: {
  transactionId: string
  paymentMethod: string
  amount: number
  currency: string
  userId: string | null
  bookingDetails: {
    packageId: string
    packageName: string
    guests: number
    date: string
  }
  customerDetails: {
    name: string
    email: string
    phone?: string
    nationalId?: string
  }
  status: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      transaction_id: bookingData.transactionId,
      user_id: bookingData.userId,
      payment_method: bookingData.paymentMethod,
      amount: bookingData.amount,
      currency: bookingData.currency,
      status: bookingData.status,
      booking_details: bookingData.bookingDetails,
      customer_details: bookingData.customerDetails,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error saving booking to database:', error)
    throw error
  }
  
  return data
}

async function updateBookingStatusInDatabase(transactionId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('bookings')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('transaction_id', transactionId)
  
  if (error) {
    console.error('Error updating booking status in database:', error)
    throw error
  }
}

async function getBookingFromDatabase(transactionId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('transaction_id', transactionId)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error getting booking from database:', error)
  }
  
  return data
}

export async function createBooking(data: Omit<BookingData, 'status' | 'createdAt'>) {
  const booking: BookingData = {
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  
  // Store in memory as fallback
  bookings.set(data.transactionId, booking)
  
  // Store in database
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await saveBookingToDatabase({
      transactionId: data.transactionId,
      paymentMethod: data.paymentMethod,
      amount: data.amount,
      currency: data.currency,
      userId: user?.id || null,
      bookingDetails: data.bookingDetails,
      customerDetails: data.customerDetails,
      status: 'pending',
    })
    
    console.log('Booking saved to database:', booking)
  } catch (error) {
    console.error('Failed to save booking to database:', error)
    // Continue with in-memory storage as fallback
  }
  
  return booking
}

export async function getBooking(transactionId: string) {
  // Try to get from database first
  try {
    const dbBooking = await getBookingFromDatabase(transactionId)
    if (dbBooking) {
      return {
        transactionId: dbBooking.transaction_id,
        paymentMethod: dbBooking.payment_method,
        amount: dbBooking.amount,
        currency: dbBooking.currency,
        customerDetails: dbBooking.customer_details,
        bookingDetails: dbBooking.booking_details,
        status: dbBooking.status,
        createdAt: dbBooking.created_at,
      } as BookingData
    }
  } catch (error) {
    console.error('Error fetching from database:', error)
  }
  
  // Fallback to memory
  return bookings.get(transactionId)
}

export async function updateBookingStatus(transactionId: string, status: BookingData['status']) {
  const booking = await getBooking(transactionId)
  
  if (booking) {
    booking.status = status
    bookings.set(transactionId, booking)
    
    // Update in database
    try {
      await updateBookingStatusInDatabase(transactionId, status)
      console.log('Booking status updated in database:', { transactionId, status })
    } catch (error) {
      console.error('Failed to update booking status in database:', error)
    }
    
    // Send confirmation email when booking is completed
    if (status === 'completed') {
      await sendBookingConfirmation({
        transactionId: booking.transactionId,
        packageName: booking.bookingDetails.packageName,
        guests: booking.bookingDetails.guests,
        date: booking.bookingDetails.date,
        customerName: booking.customerDetails.name,
        customerEmail: booking.customerDetails.email,
        customerPhone: booking.customerDetails.phone || '',
        amount: booking.amount,
        currency: booking.currency,
        paymentMethod: booking.paymentMethod,
      }).catch(error => {
        console.error('Failed to send confirmation email:', error)
      })
    }
  }
  
  return booking
}

export async function createStripeCheckoutSession(
  packageId: string, 
  guests: number, 
  packageName: string, 
  priceInCents: number,
  customerEmail: string,
  customerName: string,
  customerPhone: string,
  date: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageName,
              description: `${guests} guest(s) on ${date}`,
            },
            unit_amount: priceInCents,
          },
          quantity: guests,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&payment_method=stripe`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      customer_email: customerEmail,
      metadata: {
        packageId,
        guests: guests.toString(),
        packageName,
        customerName,
        customerPhone,
        date,
      },
    })

    if (!session.url) {
      throw new Error('No checkout URL returned')
    }

    // Store booking with pending status
    await createBooking({
      transactionId: session.id,
      paymentMethod: 'stripe',
      amount: (priceInCents * guests) / 100,
      currency: 'usd',
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      bookingDetails: {
        packageId,
        packageName,
        guests,
        date,
      },
    })

    return { success: true, url: session.url, sessionId: session.id }
  } catch (error) {
    console.error('Stripe error:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}

export async function handleBookingSuccess(transactionId: string, paymentMethod: string) {
  try {
    console.log('Handling success for:', { transactionId, paymentMethod })
    
    // First check if it's a Stripe session
    if (paymentMethod === 'stripe') {
      try {
        const session = await stripe.checkout.sessions.retrieve(transactionId, {
          expand: ['customer_details']
        })
        
        if (session.payment_status === 'paid') {
          // Update local booking if exists
          const booking = await getBooking(transactionId)
          if (booking) {
            await updateBookingStatus(transactionId, 'completed')
            return { success: true, booking }
          } else {
            // Create booking from Stripe data
            const newBooking = await createBooking({
              transactionId: session.id,
              paymentMethod: 'stripe',
              amount: (session.amount_total || 0) / 100,
              currency: session.currency?.toUpperCase() || 'USD',
              customerDetails: {
                name: session.metadata?.customerName || session.customer_details?.name || '',
                email: session.customer_details?.email || '',
                phone: session.metadata?.customerPhone || '',
              },
              bookingDetails: {
                packageId: session.metadata?.packageId || '',
                packageName: session.metadata?.packageName || '',
                guests: parseInt(session.metadata?.guests || '1'),
                date: session.metadata?.date || '',
              },
            })
            await updateBookingStatus(transactionId, 'completed')
            return { success: true, booking: newBooking }
          }
        } else {
          throw new Error('Payment not completed')
        }
      } catch (stripeError) {
        console.error('Stripe session error:', stripeError)
        throw new Error('Invalid Stripe session')
      }
    } else {
      // For non-Stripe payments, retrieve from database or local storage
      const booking = await getBooking(transactionId)
      
      if (!booking) {
        throw new Error('Booking not found')
      }
      
      if (booking.status === 'pending') {
        await updateBookingStatus(transactionId, 'completed')
        booking.status = 'completed'
      }
      
      return { success: true, booking }
    }
  } catch (error) {
    console.error('Handle success error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process booking success' 
    }
  }
}

export async function getStripeSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details']
    })
    
    return {
      status: session.status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      metadata: session.metadata,
      lineItems: session.line_items?.data,
      paymentStatus: session.payment_status,
    }
  } catch (error) {
    console.error('Error retrieving Stripe session:', error)
    throw new Error('Failed to retrieve Stripe session')
  }
}

// Export database functions for direct use if needed
export { saveBookingToDatabase, updateBookingStatusInDatabase, getBookingFromDatabase }