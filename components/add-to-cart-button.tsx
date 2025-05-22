"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import type { Product } from "@/lib/types"
import { ShoppingCart, Check } from "lucide-react"

interface AddToCartButtonProps extends ButtonProps {
  product: Product
  quantity?: number
}

export function AddToCartButton({ product, quantity = 1, children, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <Button onClick={handleAddToCart} {...props}>
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        children || (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )
      )}
    </Button>
  )
}
