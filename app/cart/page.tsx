"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-card rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearCart()
                    toast({
                      title: "Cart cleared",
                      description: "All items have been removed from your cart.",
                    })
                  }}
                >
                  Clear Cart
                </Button>
              </div>

              <ul className="divide-y">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-6 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg?height=96&width=96"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Link href={`/products/${item.id}`} className="text-lg font-medium hover:underline">
                          {item.name}
                        </Link>
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>

                      <p className="text-muted-foreground text-sm mt-1">{item.material || "Standard Material"}</p>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            removeFromCart(item.id)
                            toast({
                              title: "Item removed",
                              description: `${item.name} has been removed from your cart.`,
                            })
                          }}
                        >
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{cart.subtotal > 2000 ? "Free" : formatCurrency(150)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(cart.subtotal > 2000 ? cart.subtotal : cart.subtotal + 150)}</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <div className="mt-4">
              <Link href="/products" className="text-sm text-primary hover:underline block text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
