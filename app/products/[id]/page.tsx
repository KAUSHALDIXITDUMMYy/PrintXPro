import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/product-details"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { getProductById } from "@/lib/firebase/products"
import { ProductDetailsSkeleton } from "@/components/product-details-skeleton"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = params.id
  const product = await getProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails product={product} />
      </Suspense>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews productId={productId} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts currentProductId={productId} category={product.category} />
      </div>
    </div>
  )
}
