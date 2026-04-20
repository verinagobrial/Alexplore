// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendBookingConfirmation } from '@/app/actions/payment'

// In-memory storage (replace with database in production)
const bookings: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, bookingId, amount, currency, paymentMethod, status, customerDetails, bookingDetails } = body
    
    const booking = {
      id: bookingId,
      transactionId,
      amount,
      currency,
      paymentMethod,
      status,
      customerDetails,
      bookingDetails,
      createdAt: new Date().toISOString()
    }
    
    bookings.push(booking)
    
    // Send confirmation email if payment is completed
    if (status === 'completed') {
      await sendBookingConfirmation({
        ...bookingDetails,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        transactionId
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully'
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const transactionId = searchParams.get('transactionId')
  
  if (transactionId) {
    const booking = bookings.find(b => b.transactionId === transactionId)
    return NextResponse.json(booking)
  }
  
  return NextResponse.json(bookings)
}