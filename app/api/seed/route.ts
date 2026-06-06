import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Seed rooms
    const { error: roomsError } = await supabase.from('rooms').insert([
      {
        room_number: '101',
        room_type: 'Deluxe Suite',
        description: 'Spacious suite with Mediterranean sea view and premium amenities',
        price_per_night: 250,
        capacity: 2,
        amenities: [
          'King bed',
          'Sea view',
          'Marble bathroom',
          'Premium toiletries',
          'Climate control',
        ],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        ],
      },
      {
        room_number: '102',
        room_type: 'Presidential Suite',
        description: 'Ultimate luxury with private terrace overlooking Alexandria harbor',
        price_per_night: 450,
        capacity: 4,
        amenities: [
          'Two bedrooms',
          'Private terrace',
          'Jacuzzi',
          'Living area',
          'Butler service',
        ],
        images: [
          'https://images.unsplash.com/photo-1611432579699-484f7990f955?w=800',
        ],
      },
      {
        room_number: '103',
        room_type: 'Ocean View Room',
        description: 'Elegant room with stunning coastal views',
        price_per_night: 180,
        capacity: 2,
        amenities: ['Ocean view', 'Balcony', 'Modern bathroom', 'Smart TV', 'Mini bar'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        ],
      },
      {
        room_number: '104',
        room_type: 'Classic Room',
        description: 'Comfortable and well-appointed room with city view',
        price_per_night: 120,
        capacity: 2,
        amenities: ['City view', 'Comfortable bed', 'WiFi', 'Work desk', 'Bathroom'],
        images: [
          'https://images.unsplash.com/photo-1618267537671-9f7e74e82e72?w=800',
        ],
      },
    ])

    if (roomsError) throw roomsError

    // Seed spa services
    const { error: spaError } = await supabase
      .from('spa_services')
      .insert([
        {
          name: 'Signature Massage',
          description: 'Relaxing full-body massage with essential oils',
          category: 'Massage',
          duration_minutes: 60,
          price: 120,
          image_url: 'https://images.unsplash.com/photo-1544161515-b2c74b1e8b8b?w=800',
        },
        {
          name: 'Hot Stone Therapy',
          description: 'Therapeutic massage with heated stones',
          category: 'Massage',
          duration_minutes: 90,
          price: 150,
          image_url: 'https://images.unsplash.com/photo-1600334129128-2b60643bad35?w=800',
        },
        {
          name: 'Facial Treatment',
          description: 'Luxurious facial with premium skincare products',
          category: 'Facial',
          duration_minutes: 60,
          price: 100,
          image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03cb5f513?w=800',
        },
        {
          name: 'Body Wrap',
          description: 'Nourishing treatment with natural ingredients',
          category: 'Body',
          duration_minutes: 60,
          price: 110,
          image_url: 'https://images.unsplash.com/photo-1552893369-29572604a129?w=800',
        },
      ])

    if (spaError) throw spaError

    // Seed restaurant menu
    const { error: menuError } = await supabase
      .from('restaurant_menu')
      .insert([
        {
          name: 'Risotto ai Frutti di Mare',
          description: 'Creamy risotto with fresh seafood',
          category: 'Main Course',
          price: 35,
          dietary_info: ['Gluten-Free Option Available', 'Contains Shellfish'],
          image_url: 'https://images.unsplash.com/photo-1587858694582-a8c3d0e45fc5?w=800',
        },
        {
          name: 'Handmade Tagliatelle Bolognese',
          description: 'Classic pasta with traditional meat sauce',
          category: 'Main Course',
          price: 28,
          dietary_info: ['Contains Dairy', 'Contains Gluten'],
          image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
        },
        {
          name: 'Burrata & Heirloom Tomatoes',
          description: 'Fresh mozzarella with seasonal tomatoes and basil',
          category: 'Appetizer',
          price: 18,
          dietary_info: ['Vegetarian', 'Contains Dairy', 'Gluten-Free'],
          image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        },
        {
          name: 'Ossobuco alla Milanese',
          description: 'Braised veal shank with saffron risotto',
          category: 'Main Course',
          price: 42,
          dietary_info: ['Contains Dairy'],
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        },
        {
          name: 'Panna Cotta',
          description: 'Silky cream dessert with berry compote',
          category: 'Dessert',
          price: 12,
          dietary_info: ['Vegetarian', 'Contains Dairy', 'Gluten-Free'],
          image_url: 'https://images.unsplash.com/photo-1488477181946-6dd79a47f3e0?w=800',
        },
      ])

    if (menuError) throw menuError

    // Seed events
    const { error: eventsError } = await supabase.from('events').insert([
      {
        name: 'Corporate Conference',
        description: 'Full-day conference with state-of-the-art facilities',
        capacity: 200,
        price_per_head: 150,
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      },
      {
        name: 'Wedding Reception',
        description: 'Elegant wedding celebration with Mediterranean ambiance',
        capacity: 150,
        price_per_head: 120,
        image_url: 'https://images.unsplash.com/photo-1519671482677-0e3f4d3833b2?w=800',
      },
      {
        name: 'Gala Dinner',
        description: 'Exclusive evening event on the sky roof terrace',
        capacity: 80,
        price_per_head: 200,
        image_url: 'https://images.unsplash.com/photo-1496436518412-92f1cfdf8c3e?w=800',
      },
    ])

    if (eventsError) throw eventsError

    return NextResponse.json({
      message: 'Seed data created successfully',
      status: 'success',
    })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
