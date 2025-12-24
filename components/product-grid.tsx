import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/firebase/products"
import { formatCurrency } from "@/lib/utils"
import { Star } from "lucide-react"
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
        <h3 className="text-lg font-medium mb-2 text-[#181111]">No products found</h3>
        <p className="text-[#886364] mb-6">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col gap-2">
          <Link href={`/products/${product.id}`} className="block">
            <div className="relative aspect-square bg-[#f4f0f0] rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          </Link>
          
          <div className="mt-2">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-[#181111] text-sm font-medium leading-tight line-clamp-2">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center mt-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#886364] ml-1">({product.reviewCount || 0})</span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-[#181111] text-sm font-medium">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-[#886364]">{product.category}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <AddToCartButton 
              product={product} 
              variant="outline"
              size="sm"
              className="text-xs h-8 flex-1"
            />
            <AddToWishlistButton 
              productId={product.id}
              size="sm"
              variant="outline"
              className="h-8 w-8"
            />
          </div>
        </div>
      ))}
    </div>
  )
}