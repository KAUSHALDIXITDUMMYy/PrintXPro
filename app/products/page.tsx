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
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-[#181111] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Shop All Products
              </h1>
            </div>

            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <ProductFilters
                selectedCategory={category}
                selectedMinPrice={minPrice}
                selectedMaxPrice={maxPrice}
                selectedRating={rating}
              />
            </div>

            <div className="p-4">
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  rating={rating}
                  search={search}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}