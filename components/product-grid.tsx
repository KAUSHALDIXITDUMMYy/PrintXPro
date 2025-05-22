import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/firebase/products"
import { formatCurrency } from "@/lib/utils"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AddToWishlistButton } from "@/components/add-to-wishlist-button"

interface ProductGridProps {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
}

export async function ProductGrid({ category, minPrice, maxPrice, rating, search }: ProductGridProps) {
  const products = await getProducts({ category, minPrice, maxPrice, rating, search })

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
        <Button asChild>
          <Link href="/products">Clear Filters</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href={`/products/${product.id}`} className="block">
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          <div className="p-4">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>

              <div className="flex items-center mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">({product.reviewCount || 0})</span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
                <span className="text-xs text-muted-foreground">{product.category}</span>
              </div>
            </Link>

            <div className="flex gap-2 mt-4">
              <AddToCartButton product={product} variant="default" className="flex-1" />
              <AddToWishlistButton productId={product.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
