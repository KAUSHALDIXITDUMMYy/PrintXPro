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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e92932]"></div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingBag className="h-16 w-16 text-[#886364] mb-4" />
        <h1 className="text-[#181111] text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-[#886364] mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Button 
          asChild
          className="bg-[#e92932] text-white text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 max-w-[960px] mx-auto">
      <div className="flex flex-wrap gap-2 p-4">
        <Link href="/" className="text-[#886364] text-base font-medium leading-normal">Home</Link>
        <span className="text-[#886364] text-base font-medium leading-normal">/</span>
        <span className="text-[#181111] text-base font-medium leading-normal">Cart</span>
      </div>
      
      <h1 className="text-[#181111] text-[32px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
        Your Cart ({cart.items.length})
      </h1>

      <div className="px-4 py-3">
        <div className="overflow-hidden rounded-lg border border-[#e5dcdc] bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-3 text-left text-[#181111] text-sm font-medium leading-normal">Item</th>
                <th className="px-4 py-3 text-left text-[#181111] text-sm font-medium leading-normal">Price</th>
                <th className="px-4 py-3 text-left text-[#181111] text-sm font-medium leading-normal">Quantity</th>
                <th className="px-4 py-3 text-left text-[#181111] text-sm font-medium leading-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id} className="border-t border-t-[#e5dcdc]">
                  <td className="h-[72px] px-4 py-2">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[#181111] text-sm font-normal leading-normal">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="h-[72px] px-4 py-2 text-[#886364] text-sm font-normal leading-normal">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="h-[72px] px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-[#886364] text-sm font-normal leading-normal">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="h-[72px] px-4 py-2 text-[#886364] text-sm font-normal leading-normal">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 py-3">
        <h3 className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em] pb-2">
          Order Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-[#886364] text-sm font-normal leading-normal">Subtotal</p>
            <p className="text-[#181111] text-sm font-normal leading-normal">
              {formatCurrency(cart.subtotal)}
            </p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-[#886364] text-sm font-normal leading-normal">Shipping</p>
            <p className="text-[#181111] text-sm font-normal leading-normal">
              {cart.subtotal > 2000 ? "Free" : formatCurrency(150)}
            </p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-[#886364] text-sm font-normal leading-normal">Estimated Tax</p>
            <p className="text-[#181111] text-sm font-normal leading-normal">
              {formatCurrency(cart.subtotal * 0.08)} {/* Assuming 8% tax */}
            </p>
          </div>
          
          <div className="flex justify-between pt-3 border-t border-[#e5dcdc]">
            <p className="text-[#886364] text-sm font-normal leading-normal">Total</p>
            <p className="text-[#181111] text-sm font-normal leading-normal">
              {formatCurrency(
                cart.subtotal > 2000 
                  ? cart.subtotal * 1.08 
                  : (cart.subtotal + 150) * 1.08
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex px-4 py-3 justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            clearCart()
            toast({
              title: "Cart cleared",
              description: "All items have been removed from your cart.",
            })
          }}
          className="text-[#181111] border-[#e5dcdc] hover:bg-[#f4f0f0]"
        >
          Clear Cart
        </Button>
        
        <Button
          asChild
          className="bg-[#e92932] text-white text-base font-bold leading-normal tracking-[0.015em] h-12 px-5"
        >
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  )
}