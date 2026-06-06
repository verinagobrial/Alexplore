# Luxor Alexandria - Luxury Hotel Management System

A fully-featured luxury hotel website and management system built with Next.js 16, TypeScript, Supabase, and Stripe integration.

## Project Overview

Luxor Alexandria is a premium hotel in Alexandria, Egypt featuring:
- **Luxury Accommodations** - Multiple room types with premium amenities
- **Italian Restaurant** - Fine dining with Mediterranean cuisine
- **Sky Roof Bar** - Rooftop lounge with panoramic views
- **Spa & Wellness** - Complete spa services and treatments
- **Event Facilities** - Conferences, weddings, and private events
- **Concierge Services** - Personal assistance and activity bookings

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom luxury theme
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Playfair Display (headings), Geist (body)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Payments**: Stripe (Checkout Session)
- **API**: Next.js Route Handlers

### Color Scheme
- **Primary**: Gold/Champagne (#D4AF37 equivalent)
- **Background**: Deep Navy (#0A0A0A equivalent)
- **Accent**: Warm tones and luxe metallics
- **Text**: Off-white and light grays

## Database Schema

### Core Tables

#### `profiles` (User Profiles)
```sql
- id (UUID, FK to auth.users)
- first_name (TEXT)
- last_name (TEXT)
- email (TEXT)
- phone (TEXT)
- country (TEXT)
- is_admin (BOOLEAN)
- created_at, updated_at
```

#### `rooms` (Available Rooms)
```sql
- id (UUID)
- room_number (VARCHAR)
- room_type (VARCHAR) - Deluxe Suite, Presidential Suite, etc.
- description (TEXT)
- price_per_night (DECIMAL)
- capacity (INTEGER)
- amenities (TEXT[])
- images (TEXT[])
- is_available (BOOLEAN)
```

#### `room_bookings` (Room Reservations)
```sql
- id (UUID)
- user_id (FK to profiles)
- room_id (FK to rooms)
- check_in_date (DATE)
- check_out_date (DATE)
- number_of_guests (INTEGER)
- total_price (DECIMAL)
- payment_status (VARCHAR) - pending, paid
- booking_status (VARCHAR) - confirmed, cancelled
- special_requests (TEXT)
- stripe_payment_id (VARCHAR)
```

#### `restaurant_menu` (Menu Items)
```sql
- id (UUID)
- name (VARCHAR)
- description (TEXT)
- category (VARCHAR) - Appetizer, Main Course, Dessert
- price (DECIMAL)
- dietary_info (TEXT[])
- image_url (TEXT)
```

#### `restaurant_reservations` (Dining Reservations)
```sql
- id (UUID)
- user_id (FK to profiles)
- reservation_date (DATE)
- reservation_time (TIME)
- number_of_guests (INTEGER)
- special_requests (TEXT)
- total_price (DECIMAL)
- payment_status (VARCHAR)
- reservation_status (VARCHAR)
```

#### `spa_services` (Spa Treatments)
```sql
- id (UUID)
- name (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- duration_minutes (INTEGER)
- price (DECIMAL)
- image_url (TEXT)
```

#### `spa_bookings` (Spa Appointments)
```sql
- id (UUID)
- user_id (FK to profiles)
- service_id (FK to spa_services)
- booking_date (DATE)
- booking_time (TIME)
- payment_status (VARCHAR)
- booking_status (VARCHAR)
- special_requests (TEXT)
```

#### `events` (Event Packages)
```sql
- id (UUID)
- name (VARCHAR)
- description (TEXT)
- capacity (INTEGER)
- price_per_head (DECIMAL)
- image_url (TEXT)
```

#### `event_bookings` (Event Reservations)
```sql
- id (UUID)
- user_id (FK to profiles)
- event_id (FK to events)
- event_date (DATE)
- number_of_guests (INTEGER)
- total_price (DECIMAL)
- special_requests (TEXT)
- payment_status (VARCHAR)
- booking_status (VARCHAR)
```

#### `concierge_requests` (Guest Requests)
```sql
- id (UUID)
- user_id (FK to profiles)
- request_type (VARCHAR)
- description (TEXT)
- status (VARCHAR) - pending, in-progress, completed
- response (TEXT)
- created_at, updated_at
```

## Key Features

### Guest Features
- **Browse Accommodations** - View all room types with photos and amenities
- **Book Rooms** - Select dates and make reservations
- **Restaurant Reservations** - Browse menu and reserve tables
- **Spa Bookings** - Schedule spa treatments
- **Event Planning** - Organize conferences, weddings, and private events
- **Concierge Requests** - Request special services
- **User Dashboard** - View all bookings and manage reservations
- **Payment Processing** - Secure Stripe checkout

### Admin Features
- **Admin Dashboard** - View all bookings and reservations
- **Guest Management** - Manage guest profiles and requests
- **Booking Analytics** - Track revenue and bookings
- **Payment Monitoring** - Monitor payment status

## Getting Started

### Prerequisites
- Node.js 18+ (pnpm, npm, or yarn)
- Supabase Account
- Stripe Account (for payments)

### Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
/app
  /(root routes)
  /auth              - Authentication pages
    /login
    /sign-up
    /callback
    /error
  /accommodations    - Room booking
  /restaurant        - Dining reservations
  /sky-roof          - Sky roof bar
  /spa               - Spa services
  /events            - Event bookings
  /concierge         - Concierge requests
  /dashboard         - User bookings dashboard
  /admin             - Admin panel
  /api               - Backend routes
    /room-bookings
    /restaurant-reservations
    /spa-bookings
    /event-bookings
    /create-checkout-session
    /seed

/components
  navbar.tsx         - Navigation
  footer.tsx         - Footer
  /ui                - shadcn components

/lib
  supabase/
    client.ts        - Browser client
    server.ts        - Server client
    proxy.ts         - Proxy handler
  db-utils.ts        - Database utilities
  utils.ts           - General utilities

/public              - Static assets
```

## API Endpoints

### Room Bookings
- `POST /api/room-bookings` - Create booking
- `GET /api/room-bookings` - Get user's bookings

### Restaurant Reservations
- `POST /api/restaurant-reservations` - Create reservation
- `GET /api/restaurant-reservations` - Get user's reservations

### Spa Bookings
- `POST /api/spa-bookings` - Create booking
- `GET /api/spa-bookings` - Get user's bookings

### Payments
- `POST /api/create-checkout-session` - Create Stripe session

### Data Seeding
- `POST /api/seed` - Populate database with sample data

## Seed Data

The application includes sample data for:
- 4 room types with varying prices ($120-$450/night)
- 5 menu items with Italian cuisine
- 4 spa services with different durations
- 3 event packages

To seed the database, send a POST request to `/api/seed` or call it from a button in the admin panel.

## Row Level Security (RLS)

All tables have RLS policies enabled to ensure:
- Users can only view/modify their own bookings
- Public data (rooms, menu, services) is viewable by all
- Admins can view all bookings and guest information

## Authentication Flow

1. Users sign up with email and password
2. Email confirmation required (automatic redirect to `/auth/callback`)
3. Authenticated users can make bookings
4. Session managed via Supabase Auth + Cookies
5. Protected routes use middleware

## Payment Flow

1. User initiates booking with total price
2. Frontend sends price to `/api/create-checkout-session`
3. Stripe creates checkout session
4. User redirected to Stripe Checkout
5. After payment, user returns to `/dashboard` with success flag
6. Payment status updated in database

## Styling & Theme

The site uses a luxury hotel aesthetic with:
- Deep navy backgrounds (#0A0A0A)
- Gold/champagne accents for highlights
- Playfair Display for elegant headings
- Smooth animations and transitions
- Mobile-first responsive design
- Tailwind CSS for utilities

## Security Considerations

- All database queries use parameterized statements
- Sensitive API routes require authentication
- Stripe keys properly secured as env variables
- CORS enabled for approved origins
- Row Level Security on all sensitive tables
- Password hashing via Supabase Auth

## Performance Optimization

- Images from Unsplash (optimized CDN)
- Tailwind CSS v4 for minimal bundle size
- Server Components where possible
- Image lazy loading
- Semantic HTML for SEO

## Future Enhancements

- Email notifications for bookings
- SMS confirmations
- Multi-language support (Arabic for Egypt)
- Photo gallery management
- Advanced booking calendar
- Guest loyalty program
- In-app messaging between guests and staff
- Mobile app with push notifications
- Analytics dashboard with Charts
- Booking modifications and cancellations

## Support & Deployment

### Local Development
```bash
pnpm dev
```

### Vercel Deployment
```bash
vercel deploy
```

### Database Backups
Use Supabase's built-in backup features in the Dashboard.

## Contact & License

For questions about this hotel management system, contact the development team.
Licensed for use with Luxor Alexandria Hotel.
