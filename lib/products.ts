export interface TravelPackage {
  id: string
  name: string
  description: string
  priceInCents: number
  duration: string
  highlights: string[]
  included: string[]
  maxGuests: number
  rating: number
  reviewCount: number
  image: string
  category: 'adventure' | 'cultural' | 'luxury' | 'family'
}

export const TRAVEL_PACKAGES: TravelPackage[] = [
  {
    id: 'alexandria-discovery',
    name: 'Alexandria Discovery',
    description: 'Experience the highlights of Alexandria in 3 unforgettable days. Visit the iconic Bibliotheca Alexandrina, explore the Qaitbay Citadel, and stroll along the beautiful Corniche.',
    priceInCents: 29900,
    duration: '3 Days / 2 Nights',
    highlights: [
      'Guided tour of Bibliotheca Alexandrina',
      'Qaitbay Citadel exploration',
      'Corniche sunset walk',
      'Traditional Egyptian dinner'
    ],
    included: [
      '4-star hotel accommodation',
      'Daily breakfast',
      'Airport transfers',
      'Professional guide',
      'All entrance fees'
    ],
    maxGuests: 12,
    rating: 4.8,
    reviewCount: 324,
    image: '/images/bibliotheca.jpg',
    category: 'cultural'
  },
  {
    id: 'mediterranean-luxury',
    name: 'Mediterranean Luxury Escape',
    description: 'Indulge in a premium Alexandria experience with 5-star accommodations, private tours, and exclusive access to the finest restaurants and attractions.',
    priceInCents: 89900,
    duration: '5 Days / 4 Nights',
    highlights: [
      'Private yacht tour along the coast',
      'VIP access to historical sites',
      'Gourmet dining experiences',
      'Spa treatments at luxury resort'
    ],
    included: [
      '5-star resort accommodation',
      'All meals included',
      'Private transfers',
      'Personal concierge',
      'Spa access'
    ],
    maxGuests: 6,
    rating: 4.9,
    reviewCount: 156,
    image: '/images/hotel-1.jpg',
    category: 'luxury'
  },
  {
    id: 'ancient-wonders',
    name: 'Ancient Wonders Tour',
    description: 'Dive deep into Alexandria\'s rich history with expert archaeologists. Explore Roman ruins, catacombs, and hidden treasures of this legendary city.',
    priceInCents: 44900,
    duration: '4 Days / 3 Nights',
    highlights: [
      'Catacombs of Kom el Shoqafa',
      'Roman Amphitheater tour',
      'Pompey\'s Pillar visit',
      'Underground archaeological sites'
    ],
    included: [
      '4-star hotel accommodation',
      'Daily breakfast & lunch',
      'Expert archaeologist guide',
      'Transportation',
      'All entrance fees'
    ],
    maxGuests: 10,
    rating: 4.7,
    reviewCount: 218,
    image: '/images/gallery-1.jpg',
    category: 'cultural'
  },
  {
    id: 'family-adventure',
    name: 'Family Fun Adventure',
    description: 'Perfect for families! Kid-friendly activities, interactive experiences, and memorable moments for all ages in beautiful Alexandria.',
    priceInCents: 59900,
    duration: '5 Days / 4 Nights',
    highlights: [
      'Alexandria Aquarium visit',
      'Beach day at Montaza',
      'Interactive history workshops',
      'Felucca boat ride'
    ],
    included: [
      'Family suite accommodation',
      'All meals included',
      'Kid-friendly activities',
      'Family transfers',
      'Travel insurance'
    ],
    maxGuests: 8,
    rating: 4.8,
    reviewCount: 189,
    image: '/images/montaza-palace.jpg',
    category: 'family'
  },
  {
    id: 'coastal-adventure',
    name: 'Coastal Adventure Experience',
    description: 'For thrill-seekers! Scuba diving, water sports, and coastal exploration along Alexandria\'s stunning Mediterranean shoreline.',
    priceInCents: 54900,
    duration: '4 Days / 3 Nights',
    highlights: [
      'Scuba diving at underwater ruins',
      'Jet skiing & parasailing',
      'Coastal hiking trails',
      'Sunset fishing trip'
    ],
    included: [
      'Beachfront hotel',
      'Breakfast & dinner',
      'All equipment rental',
      'Certified instructors',
      'Safety gear'
    ],
    maxGuests: 8,
    rating: 4.6,
    reviewCount: 142,
    image: '/images/corniche.jpg',
    category: 'adventure'
  },
  {
    id: 'spiritual-journey',
    name: 'Spiritual & Sacred Journey',
    description: 'Explore Alexandria\'s diverse religious heritage. Visit historic mosques, churches, and temples that showcase centuries of faith and culture.',
    priceInCents: 34900,
    duration: '3 Days / 2 Nights',
    highlights: [
      'Abu al-Abbas al-Mursi Mosque',
      'Saint Mark\'s Coptic Cathedral',
      'Jewish heritage sites',
      'Meditation & reflection sessions'
    ],
    included: [
      '4-star hotel accommodation',
      'Daily breakfast',
      'Expert cultural guide',
      'Transportation',
      'Modest dress provided'
    ],
    maxGuests: 15,
    rating: 4.9,
    reviewCount: 98,
    image: '/images/mosque.jpg',
    category: 'cultural'
  }
]

// Helper function to get package by ID - with safety check
export function getPackageById(id: string | undefined | null): TravelPackage | undefined {
  if (!id) return undefined
  return TRAVEL_PACKAGES.find(pkg => pkg.id === id)
}

// Helper function to format price - with safety check
export function formatPrice(priceInCents: number | undefined | null): string {
  if (priceInCents === undefined || priceInCents === null) {
    return '$0.00'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(priceInCents / 100)
}