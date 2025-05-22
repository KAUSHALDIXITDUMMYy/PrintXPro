"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/firebase/auth-context"
import { getWishlistProducts, removeFromWishlist } from "@/lib/firebase/wishlist"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AlertCircle, Heart, Trash2, Star } from "lucide-react"
import type { Product } from "@/lib/types"

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const wishlistProducts = await getWishlistProducts(user.uid)
        setProducts(wishlistProducts)
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return

    try {
      await removeFromWishlist(user.uid, productId)
      setProducts(products.filter((product) => product.id !== productId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          You need to be logged in to view your wishlist.
        </p>
        <Button onClick={() => router.push("/auth/login?redirect=/wishlist")}>Sign In</Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          You haven't added any products to your wishlist yet.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-sm">
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative">
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
                onClick={() => handleRemoveFromWishlist(product.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from wishlist</span>
              </Button>
            </div>

            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
              </Link>

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

              <div className="mt-4">
                <AddToCartButton product={product} className="w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
