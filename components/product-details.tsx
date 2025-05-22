import Image from "next/image"
import { Star, Check, Truck, ShieldCheck } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AddToWishlistButton } from "@/components/add-to-wishlist-button"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm ml-2">
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              {" "}
              ({product.reviewCount || 0} {product.reviewCount === 1 ? "review" : "reviews"})
            </span>
          </span>
        </div>

        <div className="mt-6">
          <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
          {product.stock > 0 ? (
            <span className="ml-3 inline-flex items-center text-sm text-green-600">
              <Check className="mr-1 h-4 w-4" /> In Stock
            </span>
          ) : (
            <span className="ml-3 inline-flex items-center text-sm text-red-600">Out of Stock</span>
          )}
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Materials</h3>
            <div className="flex flex-wrap gap-2">
              {product.materials.map((material) => (
                <span key={material} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {material}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <AddToCartButton product={product} className="flex-1" size="lg" />
            <AddToWishlistButton productId={product.id} />
          </div>

          <div className="border-t pt-6 mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over ₹2,000. Delivery within 5-7 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Quality Guarantee</h4>
                <p className="text-sm text-muted-foreground">
                  All our products are made with premium materials and undergo strict quality control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
