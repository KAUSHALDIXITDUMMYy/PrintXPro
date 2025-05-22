"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/firebase/auth-context"
import { createOrder } from "@/lib/firebase/orders"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle2, CreditCard, Truck, AlertCircle } from "lucide-react"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "card",
    notes: "",
  })

  useEffect(() => {
    setIsClient(true)

    // Pre-fill email if user is logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your order.",
        variant: "destructive",
      })
      router.push("/auth/login?redirect=/checkout")
      return
    }

    if (cart.items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before checkout.",
        variant: "destructive",
      })
      router.push("/products")
      return
    }

    try {
      setIsSubmitting(true)

      // Create order in Firestore
      const order = await createOrder({
        userId: user.uid,
        products: cart.items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: cart.subtotal > 2000 ? cart.subtotal : cart.subtotal + 150,
        shippingFee: cart.subtotal > 2000 ? 0 : 150,
        status: "pending",
        paymentMethod: formData.paymentMethod,
        address: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        notes: formData.notes,
        timestamp: new Date(),
      })

      // Clear cart after successful order
      clearCart()

      // Show success message
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      })

      // Redirect to order confirmation page
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Failed to place order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">You need to add products to your cart before checkout.</p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for delivery or product customization"
                />
              </div>
            </form>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange} className="space-y-3">
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-5 w-5" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                  <Truck className="h-5 w-5" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
            </RadioGroup>

            {formData.paymentMethod === "card" && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  This is a demo application. No actual payment will be processed.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({cart.items.length})</span>
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

            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
