import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Suspense } from "react"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { SearchBar } from "@/components/search-bar"

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined
  const rating = typeof searchParams.rating === "string" ? Number.parseInt(searchParams.rating) : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Our 3D Models</h1>

      <div className="mb-6 max-w-xl mx-auto">
        <SearchBar initialValue={search} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilters
            selectedCategory={category}
            selectedMinPrice={minPrice}
            selectedMaxPrice={maxPrice}
            selectedRating={rating}
          />
        </div>

        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid category={category} minPrice={minPrice} maxPrice={maxPrice} rating={rating} search={search} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
