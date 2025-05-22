import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryShowcase } from "@/components/category-showcase"
import { TestimonialSection } from "@/components/testimonial-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <div className="my-8 max-w-2xl mx-auto">
        <SearchBar />
      </div>
      <FeaturedProducts />
      <CategoryShowcase />
      <TestimonialSection />
    </div>
  )
}
