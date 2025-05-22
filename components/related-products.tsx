import Link from "next/link"
import Image from "next/image"
import { getRelatedProducts } from "@/lib/firebase/products"
import { formatCurrency } from "@/lib/utils"
import { Star } from "lucide-react"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export async function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const products = await getRelatedProducts(currentProductId, category)

  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-square relative">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-3">
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>

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
            </div>

            <div className="mt-1">
              <span className="font-semibold text-sm">{formatCurrency(product.price)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
