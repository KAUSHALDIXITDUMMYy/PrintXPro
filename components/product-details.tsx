import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AddToWishlistButton } from "@/components/add-to-wishlist-button"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 p-4">
              <a className="text-[#886364] text-base font-medium leading-normal" href="/products">
                Shop
              </a>
              <span className="text-[#886364] text-base font-medium leading-normal">/</span>
              <span className="text-[#181111] text-base font-medium leading-normal">{product.name}</span>
            </div>

            {/* Product Image */}
            <div className="flex w-full grow bg-white p-4">
              <div className="w-full gap-1 overflow-hidden bg-white aspect-[2/3] rounded-lg flex">
                <div className="w-full relative bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <h1 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
              {product.name}
            </h1>
            <p className="text-[#181111] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {product.description}
            </p>

            {/* Details Section */}
            <h3 className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Details
            </h3>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5dcdc] py-5">
                <p className="text-[#886364] text-sm font-normal leading-normal">Material</p>
                <p className="text-[#181111] text-sm font-normal leading-normal">
                  {product.materials.join(", ")}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5dcdc] py-5">
                <p className="text-[#886364] text-sm font-normal leading-normal">Dimensions</p>
                <p className="text-[#181111] text-sm font-normal leading-normal">
                  {product.dimensions || "N/A"}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5dcdc] py-5">
                <p className="text-[#886364] text-sm font-normal leading-normal">Weight</p>
                <p className="text-[#181111] text-sm font-normal leading-normal">
                  {product.weight || "N/A"}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5dcdc] py-5">
                <p className="text-[#886364] text-sm font-normal leading-normal">Color</p>
                <p className="text-[#181111] text-sm font-normal leading-normal">
                  {product.color || "N/A"}
                </p>
              </div>
            </div>

            {/* Price Section */}
            <h3 className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Price
            </h3>
            <p className="text-[#181111] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {formatCurrency(product.price)}
            </p>

            {/* Action Buttons */}
            <div className="flex px-4 py-3 justify-start gap-3">
              <AddToCartButton 
                product={product} 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e92932] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                Add to Cart
              </AddToCartButton>
              <AddToWishlistButton 
                productId={product.id}
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f4f0f0] text-[#181111] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
              />
            </div>

            {/* Additional Info */}
            <div className="border-t border-t-[#e5dcdc] mt-8 px-4 py-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-[#886364] mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                    <path fill="currentColor" d="M240 114a18 18 0 0 1-18 18h-22v84a14 14 0 0 1-14 14H70a14 14 0 0 1-14-14v-84H34a18 18 0 0 1-18-18v-72a6 6 0 0 1 6-6h18V40a14 14 0 0 1 14-14h112a14 14 0 0 1 14 14v26h26a6 6 0 0 1 6 6Zm-52-74H70a2 2 0 0 0-2 2v26h124V42a2 2 0 0 0-2-2ZM38 114v-66h180v66Z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[#181111] font-medium">Free Shipping</h4>
                  <p className="text-[#886364] text-sm mt-1">
                    Free shipping on orders over $50. Delivery within 5-7 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#886364] mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                    <path fill="currentColor" d="M224 60H32a12 12 0 0 0-12 12v112a12 12 0 0 0 12 12h192a12 12 0 0 0 12-12V72a12 12 0 0 0-12-12Zm-108 80H44V84h72Zm88 0h-72V84h72Z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[#181111] font-medium">Quality Guarantee</h4>
                  <p className="text-[#886364] text-sm mt-1">
                    All our products are made with premium materials and undergo strict quality control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}