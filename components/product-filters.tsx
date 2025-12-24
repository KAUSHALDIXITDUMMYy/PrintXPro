"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Filter, X, ChevronDown } from "lucide-react"

interface ProductFiltersProps {
  selectedCategory?: string
  selectedMinPrice?: number
  selectedMaxPrice?: number
  selectedRating?: number
}

const categories = ["Toys", "Decor", "Industrial", "Personalized", "Gadgets", "Art"]
const priceRanges = [
  { label: "Under $25", value: "0-25" },
  { label: "$25 to $50", value: "25-50" },
  { label: "$50 to $100", value: "50-100" },
  { label: "Over $100", value: "100-5000" },
]
const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
]

export function ProductFilters({
  selectedCategory,
  selectedMinPrice = 0,
  selectedMaxPrice = 5000,
  selectedRating,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null) {
      params.delete(name)
    } else {
      params.set(name, value)
    }

    return params.toString()
  }

  const handleCategoryChange = (category: string) => {
    router.push(`${pathname}?${createQueryString("category", category === selectedCategory ? null : category)}`)
  }

  const handlePriceChange = (value: string) => {
    const [min, max] = value.split("-").map(Number)
    const params = new URLSearchParams(searchParams.toString())

    if (min > 0) {
      params.set("minPrice", min.toString())
    } else {
      params.delete("minPrice")
    }

    if (max < 5000) {
      params.set("maxPrice", max.toString())
    } else {
      params.delete("maxPrice")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("sort", value)}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const hasActiveFilters = selectedCategory || selectedMinPrice > 0 || selectedMaxPrice < 5000 || selectedRating

  return (
    <div className="flex gap-3 flex-wrap">
      <div className="relative">
        <select
          value={selectedCategory || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f4f0f0] pl-4 pr-8 appearance-none"
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 absolute right-2 top-2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={`${selectedMinPrice || 0}-${selectedMaxPrice || 5000}`}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f4f0f0] pl-4 pr-8 appearance-none"
        >
          <option value="0-5000">Price</option>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 absolute right-2 top-2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f4f0f0] pl-4 pr-8 appearance-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 absolute right-2 top-2 pointer-events-none" />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="flex h-8 items-center gap-1 text-[#886364]"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}