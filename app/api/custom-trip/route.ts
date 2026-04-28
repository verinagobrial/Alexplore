import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supabase } = await createClient()
    
    // Prepare data for insertion
    const tripData = {
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      hear_about_us: body.hearAboutUs,
      travel_date: body.travelDate || null,
      duration: body.duration,
      group_size: body.groupSize,
      travelers: body.travelers || [],
      selected_interests: body.selectedInterests || [],
      special_requests: body.specialRequests,
      budget: body.budget,
      accommodation: body.accommodation,
      meals_included: body.mealsIncluded,
      transport_included: body.transportIncluded,
      guide_included: body.guideIncluded,
      status: 'pending',
    }
    
    // Insert into database
    const { data: trip, error: insertError } = await supabase
      .from('custom_trips')
      .insert(tripData)
      .select()
      .single()
    
    if (insertError) throw insertError
    
    return NextResponse.json({ 
      success: true, 
      message: 'Custom trip request submitted successfully',
      data: trip 
    })
    
  } catch (error) {
    console.error('Custom trip submission error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit request' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { supabase } = await createClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    
    let query = supabase.from('custom_trips').select('*')
    
    if (email) {
      query = query.eq('email', email)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      query = query.eq('email', user.email)
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ data })
    
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase } = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { id, status, quoted_amount } = body
    
    const updateData: any = { status }
    if (quoted_amount !== undefined) updateData.quoted_amount = quoted_amount
    if (status === 'quoted') updateData.quote_sent_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('custom_trips')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}