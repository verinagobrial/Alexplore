import { createClient } from '@/lib/supabase/server'

// Fetch all rooms
export async function fetchRooms() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_available', true)
    .order('price_per_night', { ascending: true })

  if (error) throw error
  return data
}

// Fetch single room
export async function fetchRoom(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (error) throw error
  return data
}

// Fetch restaurant menu
export async function fetchRestaurantMenu() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurant_menu')
    .select('*')
    .order('category', { ascending: true })

  if (error) throw error
  return data || []
}

// Fetch spa services
export async function fetchSpaServices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spa_services')
    .select('*')
    .order('category', { ascending: true })

  if (error) throw error
  return data || []
}

// Fetch single spa service
export async function fetchSpaService(serviceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spa_services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (error) throw error
  return data
}

// Fetch events
export async function fetchEvents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch single event
export async function fetchEvent(eventId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) throw error
  return data
}

// Fetch user bookings
export async function fetchUserBookings(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('room_bookings')
    .select('*, rooms(*)')
    .eq('user_id', userId)
    .order('check_in_date', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch user restaurant reservations
export async function fetchUserRestaurantReservations(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurant_reservations')
    .select('*')
    .eq('user_id', userId)
    .order('reservation_date', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch user spa bookings
export async function fetchUserSpaBookings(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spa_bookings')
    .select('*, spa_services(*)')
    .eq('user_id', userId)
    .order('booking_date', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch user event bookings
export async function fetchUserEventBookings(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_bookings')
    .select('*, events(*)')
    .eq('user_id', userId)
    .order('event_date', { ascending: false })

  if (error) throw error
  return data || []
}

// Fetch user concierge requests
export async function fetchUserConciergeRequests(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('concierge_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Calculate price between dates
export function calculateRoomPrice(
  pricePerNight: number,
  checkIn: string,
  checkOut: string
) {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  return nights > 0 ? nights * pricePerNight : 0
}

// Format currency
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
