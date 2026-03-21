import { Header } from "@/components/alexplore/header"
import { Hero } from "@/components/alexplore/hero"
import { Destinations } from "@/components/alexplore/destinations"
import { Heritage } from "@/components/alexplore/heritage"
import { Activities } from "@/components/alexplore/activities"
import { Accommodations } from "@/components/alexplore/accommodations"
import { DiscountBanner } from "@/components/alexplore/discount-banner"
import { PackageSearch } from "@/components/alexplore/package-search"
import { PopularPackages } from "@/components/alexplore/popular-packages"
import { Testimonials } from "@/components/alexplore/testimonials"
import { Gallery } from "@/components/alexplore/gallery"
import { Footer } from "@/components/alexplore/footer"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <Destinations />
      <Heritage />
      <Activities />
      <Accommodations />
      <DiscountBanner />
      <PackageSearch />
      <PopularPackages />
      <Testimonials />
      <Gallery />
      <Footer />
    </main>
  )
}
