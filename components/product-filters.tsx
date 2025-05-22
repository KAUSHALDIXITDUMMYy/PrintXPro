"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Filter, X, Star } from "lucide-react"

interface ProductFiltersProps {
  selectedCategory?: string
  selectedMinPrice?: number
  selectedMaxPrice?: number
  selectedRating?: number
}

const categories = ["Toys", "Decor", "Industrial", "Personalized", "Gadgets", "Art"]

export function ProductFilters({
  selectedCategory,
  selectedMinPrice = 0,
  selectedMaxPrice = 5000,
  selectedRating,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([selectedMinPrice, selectedMaxPrice])
  const [rating, setRating] = useState<number | undefined>(selectedRating)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  useEffect(() => {
    setPriceRange([selectedMinPrice, selectedMaxPrice])
  }, [selectedMinPrice, selectedMaxPrice])

  useEffect(() => {
    setRating(selectedRating)
  }, [selectedRating])

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

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 5000) {
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleRatingChange = (value: number) => {
    const newRating = rating === value ? undefined : value
    setRating(newRating)

    router.push(`${pathname}?${createQueryString("rating", newRating ? newRating.toString() : null)}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const hasActiveFilters = selectedCategory || selectedMinPrice > 0 || selectedMaxPrice < 5000 || selectedRating

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
            Clear All
          </Button>
        )}
      </div>

      <div className={`space-y-6 ${isMobileFiltersOpen ? "block" : "hidden md:block"}`}>
        {hasActiveFilters && (
          <div className="hidden md:flex justify-between items-center">
            <h3 className="font-medium">Active Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={category === selectedCategory}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`category-${category}`} className="ml-2 text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <Slider
            defaultValue={[0, 5000]}
            value={priceRange}
            min={0}
            max={5000}
            step={100}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
          <Button variant="outline" size="sm" onClick={applyPriceFilter} className="w-full mt-2">
            Apply
          </Button>
        </div>

        <div>
          <h3 className="font-medium mb-3">Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((value) => (
              <div key={value} className="flex items-center">
                <Checkbox
                  id={`rating-${value}`}
                  checked={rating === value}
                  onCheckedChange={() => handleRatingChange(value)}
                />
                <Label htmlFor={`rating-${value}`} className="ml-2 text-sm cursor-pointer flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < value ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="ml-1">& Up</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
