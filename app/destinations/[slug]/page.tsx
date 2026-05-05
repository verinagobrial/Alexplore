"use client"

import Image from "next/image"
import { Header } from '@/components/alexplore/header'
import { Footer } from '@/components/alexplore/footer'
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowRight, 
  MapPin, 
  Star, 
  Heart, 
  Calendar, 
  Users, 
  Clock, 
  Phone, 
  Globe, 
  ChevronLeft,
  Share2,
  Bookmark,
  CheckCircle,
  X
} from "lucide-react"
import { AnimatedSection } from "@/components/alexplore/animated-section"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Complete destination data
const allDestinations = {
  "qaitbay-citadel": {
    id: "qaitbay-citadel",
    title: "Qaitbay Citadel",
    shortDescription: "A 15th-century fortress built on the legendary site of the Pharos Lighthouse, offering stunning Mediterranean views.",
    description: `Standing proudly at the entrance of Alexandria's Eastern Harbor, Qaitbay Citadel is one of Egypt's most impressive defensive fortresses. Built in the 15th century by Sultan Al-Ashraf Sayf al-Din Qaitbay, this magnificent fortress was constructed on the exact site of the legendary Pharos Lighthouse, one of the Seven Wonders of the Ancient World.

    The citadel served as a vital defensive stronghold protecting Alexandria from sea invasions for centuries. Today, it houses a naval museum showcasing artifacts from different eras, including the Roman, Byzantine, and Islamic periods.

    Visitors can explore the fortress walls, climb to the top for panoramic views of the Mediterranean Sea, and imagine the ancient lighthouse that once stood on these very grounds.`,
    image: "/images/6.jpg",
    gallery: [
      "/images/6.jpg",
      "/images/1678607223.jpg",
      "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
      "/images/1.jpg",
    ],
    rating: 4.9,
    reviews: 2847,
    category: "Historical",
    location: "Alexandria East",
    address: "Citadel of Qaitbay, Alexandria Governorate, Egypt",
    duration: "2-3 hours",
    bestTimeToVisit: "Morning (8 AM - 11 AM)",
    price: "$8",
    openingHours: "9:00 AM - 5:00 PM (Daily)",
    phone: "+20 3 4803599",
    website: "https://egymonuments.com/locations/details/qaitbay-citadel",
    whatToBring: ["Camera", "Hat", "Sunscreen", "Comfortable shoes", "Water bottle"],
    nearbyAttractions: [
      { name: "Alexandria National Museum", distance: "2.5 km" },
      { name: "Montaza Palace", distance: "8 km" },
      { name: "Stanley Bridge", distance: "5 km" }
    ],
    tips: [
      "Visit early morning to avoid crowds and heat",
      "The best photos are taken from the northern side during sunset",
      "Hire a guide for detailed historical context",
      "Allow at least 2 hours for a complete visit"
    ]
  },
  "montaza-palace": {
    id: "montaza-palace",
    title: "Montaza Palace",
    shortDescription: "Royal gardens and palatial elegance overlooking pristine beaches - a perfect blend of nature and history.",
    description: `Montaza Palace is a stunning complex of royal gardens, beaches, and palaces located in the Montaza district of Alexandria. Originally built as a hunting lodge for Khedive Abbas II in 1892, the palace was later expanded by King Fuad I as a summer residence for the royal family.

    The palace combines Turkish and Florentine architectural styles, creating a unique aesthetic that captivates visitors. The surrounding 150-acre gardens feature rare plants, tall palm trees, and breathtaking sea views.

    Today, Montaza Palace is partially open to the public, with some sections serving as a presidential retreat. The gardens and beaches are accessible to everyone, making it a popular destination for families and couples.`,
    image: "/images/monazah palace.jpg",
    gallery: [
      "/images/monazah palace.jpg",
      "/images/6.jpg",
      "/images/1678607223.jpg",
    ],
    rating: 4.8,
    reviews: 1923,
    category: "Palace",
    location: "Montaza District",
    address: "Montaza Palace, Alexandria Governorate, Egypt",
    duration: "3-4 hours",
    bestTimeToVisit: "Afternoon (2 PM - 5 PM)",
    price: "$5",
    openingHours: "8:00 AM - 8:00 PM (Daily)",
    phone: "+20 3 5470830",
    website: "https://egymonuments.com/locations/details/montaza-palace",
    whatToBring: ["Picnic essentials", "Swimsuit", "Camera", "Comfortable walking shoes", "Sunscreen"],
    nearbyAttractions: [
      { name: "Alexandria Corniche", distance: "7 km" },
      { name: "Stanley Bridge", distance: "3 km" },
      { name: "Royal Jewelry Museum", distance: "6 km" }
    ],
    tips: [
      "Visit during weekdays for fewer crowds",
      "Bring a picnic to enjoy in the beautiful gardens",
      "The beaches are best visited in the morning",
      "Sunset views from the palace are spectacular"
    ]
  },
  "bibliotheca-alexandrina": {
    id: "bibliotheca-alexandrina",
    title: "Bibliotheca Alexandrina",
    shortDescription: "A modern architectural marvel honoring the ancient Library of Alexandria, hosting millions of books and artifacts.",
    description: `The Bibliotheca Alexandrina is a magnificent modern library and cultural center that pays homage to the legendary Ancient Library of Alexandria. Opened in 2002, this architectural masterpiece was designed by Norwegian architectural firm Snøhetta and represents a giant sundial facing the sea.

    The library houses millions of books and features specialized libraries for children, youth, and the blind. It also contains several museums, art galleries, a planetarium, and a manuscript restoration lab.

    The massive granite wall facing the sea is carved with characters from over 120 different scripts, symbolizing the universality of human knowledge.`,
    image: "/images/Alexandria Library Egypt.jpeg",
    gallery: [
      "/images/Alexandria Library Egypt.jpeg",
      "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
      "/images/6.jpg",
    ],
    rating: 4.9,
    reviews: 3156,
    category: "Cultural",
    location: "Alexandria City Center",
    address: "El Shatby, Alexandria Governorate, Egypt",
    duration: "2-4 hours",
    bestTimeToVisit: "Morning (10 AM - 1 PM)",
    price: "$3",
    openingHours: "10:00 AM - 7:00 PM (Closed Fridays)",
    phone: "+20 3 4839999",
    website: "https://www.bibalex.org",
    whatToBring: ["Camera (flash off)", "Notebook", "ID for entry"],
    nearbyAttractions: [
      { name: "Qaitbay Citadel", distance: "3 km" },
      { name: "Alexandria Corniche", distance: "1 km" },
      { name: "Roman Amphitheater", distance: "2 km" }
    ],
    tips: [
      "Check the planetarium schedule in advance",
      "The library has excellent cafes and restaurants",
      "Join a guided tour for deeper insights",
      "Visit the manuscript museum - it's fascinating"
    ]
  },
  "the-corniche": {
    id: "the-corniche",
    title: "The Corniche",
    shortDescription: "A scenic 16km waterfront promenade perfect for sunset walks, local dining, and experiencing authentic Alexandrian life.",
    description: `Alexandria's Corniche is a spectacular 16-kilometer waterfront promenade that stretches along the Mediterranean coast. This iconic seafront boulevard is the city's social heartbeat, where locals and tourists gather to enjoy stunning sea views, fresh seafood, and authentic Egyptian culture.

    The Corniche is lined with beautiful colonial-era buildings, modern cafes, traditional fish restaurants, and historic landmarks. It's the perfect place for morning jogs, afternoon strolls, and spectacular sunset views.

    Throughout the year, the Corniche hosts various festivals and events, making it a vibrant destination for cultural experiences.`,
    image: "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
    gallery: [
      "/images/15 Reasons Why You Should Visit Alexandria Egypt & Why it's Worth it!.jpeg",
      "/images/6.jpg",
      "/images/1678607223.jpg",
    ],
    rating: 4.7,
    reviews: 4521,
    category: "Leisure",
    location: "Waterfront",
    address: "Alexandria Corniche, Alexandria Governorate, Egypt",
    duration: "Flexible",
    bestTimeToVisit: "Sunset (5 PM - 7 PM)",
    price: "Free",
    openingHours: "24/7",
    phone: "",
    website: "",
    whatToBring: ["Camera", "Comfortable walking shoes", "Light jacket for evening", "Snacks"],
    nearbyAttractions: [
      { name: "Qaitbay Citadel", distance: "At the end of Corniche" },
      { name: "Bibliotheca Alexandrina", distance: "2 km" },
      { name: "Stanley Bridge", distance: "5 km" }
    ],
    tips: [
      "Best time for photos is during sunset",
      "Try fresh seafood at one of the many restaurants",
      "Visit the local ice cream shops for traditional Egyptian ice cream",
      "Take a horse-drawn carriage for a romantic ride"
    ]
  }
}

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const slug = params.slug as string
  const destination = allDestinations[slug as keyof typeof allDestinations]

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-serif mb-4">404</h1>
          <p className="text-muted-foreground mb-8">Destination not found</p>
          <Button onClick={() => router.push("/destinations")} className="rounded-full">
            Back to Destinations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
        <Header />
        
             {/* Hero Section */}
           <section className="relative py-20 overflow-hidden">
        {/* Image Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/image-1773580378733.png')" }}
        />
        
        {/* Blurred Overlay */}
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm z-0" />
        
        {/* Optional: Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 z-0" />
      
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in text-secondary">
              Discover all Destinations
            </h1>
            <p className="text-lg opacity-90 mb-8 animate-slide-up">
             The Soul of the Mediterranean in Your Hands.
            </p>
          </div>
        </div>
      </section>
      {/* Back Button */}
      {/* <div className="fixed top-24 left-4 z-50 lg:left-8">
        <button
          onClick={() => router.back()}
          className="bg-secondary/90 backdrop-blur-sm hover:bg-secondary text-foreground p-2 rounded-full transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div> */}

      {/* Share & Save Buttons */}
      {/* <div className="fixed top-24 right-4 z-50 lg:right-8 flex gap-2">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`bg-secondary/90 backdrop-blur-sm p-2 rounded-full transition-all duration-300 shadow-lg ${
            isLiked ? "text-red-500" : "text-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
        </button>
        <button className="bg-secondary/90 backdrop-blur-sm text-foreground p-2 rounded-full transition-all duration-300 shadow-lg hover:bg-secondary">
          <Share2 className="h-6 w-6" />
        </button>
      </div> */}

      {/* Hero Section with Image Gallery */}
      <section className="relative pt-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-[4/3]">
              <Image
                src={destination.gallery[activeImageIndex]}
                alt={destination.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3">
              {destination.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-2xl overflow-hidden aspect-video lg:aspect-[4/3] transition-all duration-300 ${
                    activeImageIndex === idx 
                      ? "ring-2 ring-accent scale-95" 
                      : "hover:scale-95"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${destination.title} - Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 bg-accent/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                {/* Category & Title */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
                    <span className="text-sm text-accent font-medium">{destination.category}</span>
                  </div>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4">
                    {destination.title}
                  </h1>
                  
                  {/* Rating & Location */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-accent/90 text-foreground px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-medium">{destination.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({destination.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-serif mb-4">About</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    {showFullDescription ? (
                      <p>{destination.description}</p>
                    ) : (
                      <p>{destination.shortDescription}</p>
                    )}
                    {destination.description.length > 200 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-accent hover:text-accent/80 font-medium transition-colors"
                      >
                        {showFullDescription ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tips & Recommendations */}
                <div className="mb-8">
                  <h2 className="text-2xl font-serif mb-4">Travel Tips</h2>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <ul className="space-y-3">
                      {destination.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* What to Bring */}
                <div className="mb-8">
                  <h2 className="text-2xl font-serif mb-4">What to Bring</h2>
                  <div className="flex flex-wrap gap-2">
                    {destination.whatToBring.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nearby Attractions */}
                {destination.nearbyAttractions && (
                  <div>
                    <h2 className="text-2xl font-serif mb-4">Nearby Attractions</h2>
                    <div className="space-y-3">
                      {destination.nearbyAttractions.map((attraction, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors cursor-pointer"
                          onClick={() => router.push(`/destinations/${attraction.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          <div>
                            <h3 className="font-medium text-foreground">{attraction.name}</h3>
                            <p className="text-sm text-muted-foreground">{attraction.distance} away</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatedSection>
            </div>

            {/* Sidebar - Booking Info */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={200}>
                <div className="sticky top-28">
                  <div className="bg-card rounded-3xl p-6 border border-border shadow-lg">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-accent">{destination.price}</div>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-sm font-medium">{destination.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Best Time to Visit</p>
                          <p className="text-sm font-medium">{destination.bestTimeToVisit}</p>
                        </div>
                      </div>
                      {destination.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-accent" />
                          <div>
                            <p className="text-xs text-muted-foreground">Contact</p>
                            <p className="text-sm font-medium">{destination.phone}</p>
                          </div>
                        </div>
                      )}
                      {destination.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-accent" />
                          <div>
                            <p className="text-xs text-muted-foreground">Website</p>
                            <a 
                              href={destination.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-accent hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border pt-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Opening Hours</p>
                          <p className="text-sm font-medium">{destination.openingHours}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="text-sm font-medium">{destination.address}</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-accent hover:bg-accent/90 text-foreground rounded-full py-6 text-lg font-medium group">
                      Book Your Visit
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Free cancellation up to 24 hours before
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}