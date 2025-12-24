import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/firebase/products"
import { formatCurrency } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export async function FeaturedProducts() {
  let products = []

  try {
    products = await getFeaturedProducts()
  } catch (error) {
    console.error("Error getting featured products:", error)
    products = []
  }

  if (products.length === 0) {
    return (
      <div className="px-4">
        <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Items</h2>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch p-4 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                <div className="w-full aspect-square bg-muted rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center px-4 pb-3 pt-5">
        <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em]">Featured Items</h2>
        <Button variant="ghost" asChild className="text-sm font-medium leading-normal">
          <Link href="/products" className="flex items-center">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 gap-3">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
              <Link href={`/products/${product.id}`} className="w-full aspect-square relative rounded-lg">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </Link>
              <div>
                <p className="text-[#181111] text-base font-medium leading-normal">{product.name}</p>
                <p className="text-[#886364] text-sm font-normal leading-normal">{product.description?.substring(0, 50)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function NewArrivals() {
  let products = []

  try {
    products = await getFeaturedProducts()
  } catch (error) {
    console.error("Error getting new arrivals:", error)
    products = []
  }

  if (products.length === 0) {
    return (
      <div className="px-4">
        <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">New Arrivals</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 pb-3">
              <div className="w-full aspect-square bg-muted rounded-lg animate-pulse"></div>
              <div>
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center px-4 pb-3 pt-5">
        <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em]">New Arrivals</h2>
        <Button variant="ghost" asChild className="text-sm font-medium leading-normal">
          <Link href="/products" className="flex items-center">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="flex flex-col gap-3 pb-3">
            <Link href={`/products/${product.id}`} className="w-full aspect-square relative rounded-lg">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </Link>
            <div>
              <p className="text-[#181111] text-base font-medium leading-normal">{product.name}</p>
              <p className="text-[#886364] text-sm font-normal leading-normal">
                {product.description?.substring(0, 30)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SpecialOffer() {
  return (
    <div className="p-4">
      <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Special Offers</h2>
      <div className="flex flex-col items-stretch justify-start rounded-lg md:flex-row md:items-start">
        <div className="w-full aspect-video bg-cover bg-center bg-no-repeat rounded-lg"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfZoZF2CBbqU2fwmfgMw20AmWcFvWoWAhGmnkGTgfxGk-LEJZClPlQBNKR2RAt1dm4JaacskkfjiBnUNVl84j-ACsj3TpFuV_eQIG-U3bgtt9lHGkLY-guCjfkTwFPExT8cDuLLXsX8yG7PYQFZbt7fqOnd3-eKU453eF-pyiJgIymVvk2EbY4mW6_6xsLmbHEga8NEve0zY7VtYCxpDJIurwdjk0kyQU9C7IU0rao8I4t1BlUcbTLe4u7O4Hx_k7AAnVg5QbY810m")'
          }}>
        </div>
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 md:px-4">
          <p className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em]">Limited Time Offer</p>
          <div className="flex items-end gap-3 justify-between">
            <p className="text-[#886364] text-base font-normal leading-normal">
              Get 20% off on all vases. Use code DECOR20 at checkout.
            </p>
            <Button
              className="flex min-w-[84px] max-w-[480px] h-8 px-4 bg-[#e92932] text-white text-sm font-medium leading-normal"
              asChild
            >
              <Link href="/products">
                <span className="truncate">Shop Now</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
