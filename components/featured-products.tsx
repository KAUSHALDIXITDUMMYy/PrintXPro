import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/firebase/products"
import { formatCurrency } from "@/lib/utils"
import { Star, ChevronRight } from "lucide-react"

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <Button variant="ghost" asChild>
          <Link href="/products" className="flex items-center">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4">
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
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
