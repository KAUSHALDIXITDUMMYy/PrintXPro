"use client"

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
import Link from "next/link"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

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
    setIsMounted(true)

    // Load Razorpay script only on client side
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      toast({
        title: "Payment Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      })
    }
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [toast])

  // Initialize form data after mount
  useEffect(() => {
    if (isMounted && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: user.displayName || "",
      }))
    }
  }, [isMounted, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value,
    }))
  }

  const initiateRazorpayPayment = (orderId: string, amount: number) => {
    if (!isMounted || !razorpayLoaded || !window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment gateway not loaded. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_2sjuJ9vKAX4qoB",
      amount: amount * 100,
      currency: "INR",
      name: "PrintCraft",
      description: "3D Printing Order",
      order_id: orderId,
      handler: async (response: any) => {
        try {
          clearCart()
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          })
          router.push(`/orders/${orderId}`)
        } catch (error) {
          console.error("Payment verification error:", error)
          toast({
            title: "Payment Verification Failed",
            description: "Please contact support with your payment ID.",
            variant: "destructive",
          })
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      theme: {
        color: "#e92932",
      },
      modal: {
        ondismiss: () => {
          toast({
            title: "Payment Cancelled",
            description: "You can complete the payment later from your orders page.",
          })
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isMounted) return

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your order.",
        variant: "destructive",
      })
      router.push("/auth/login?redirect=/checkout")
      return
    }

    if (!cart.items.length) {
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

      const totalAmount = cart.subtotal > 2000 ? cart.subtotal : cart.subtotal + 150

      const order = await createOrder({
        userId: user.uid,
        products: cart.items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount,
        shippingFee: cart.subtotal > 2000 ? 0 : 150,
        status: "pending",
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === "card" ? "pending" : "pending",
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

      if (formData.paymentMethod === "card") {
        initiateRazorpayPayment(order.id, totalAmount)
      } else {
        clearCart()
        toast({
          title: "Order placed successfully!",
          description: `Your order #${order.id.slice(0, 8)} has been placed.`,
        })
        router.push(`/orders/${order.id}`)
      }
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

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e92932]"></div>
      </div>
    )
  }

  if (!cart.items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <AlertCircle className="h-16 w-16 text-[#886364] mb-4" />
        <h1 className="text-[#181111] text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-[#886364] mb-6">You need to add products to your cart before checkout.</p>
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
        <Link href="/cart" className="text-[#886364] text-base font-medium leading-normal">Cart</Link>
        <span className="text-[#886364] text-base font-medium leading-normal">/</span>
        <Link href="/checkout" className="text-[#886364] text-base font-medium leading-normal">Information</Link>
        <span className="text-[#886364] text-base font-medium leading-normal">/</span>
        <span className="text-[#181111] text-base font-medium leading-normal">Shipping</span>
      </div>

      <h1 className="text-[#181111] text-[32px] font-bold leading-tight tracking-[-0.015em] mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-[#181111] text-xl font-semibold mb-4">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="bg-[#f4f0f0] border-none h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="bg-[#f4f0f0] border-none h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="bg-[#f4f0f0] border-none h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input 
                    id="pincode" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleChange} 
                    required 
                    className="bg-[#f4f0f0] border-none h-14"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  className="bg-[#f4f0f0] border-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                    className="bg-[#f4f0f0] border-none h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    required 
                    className="bg-[#f4f0f0] border-none h-14"
                  />
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
                  className="bg-[#f4f0f0] border-none"
                />
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-[#181111] text-xl font-semibold mb-4">Payment Method</h2>

            <RadioGroup 
              value={formData.paymentMethod} 
              onValueChange={handlePaymentMethodChange} 
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-5 w-5" />
                  <span>Credit/Debit Card (Razorpay)</span>
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
              <div className="mt-4 p-4 bg-[#f4f0f0] rounded-md">
                <p className="text-sm text-[#886364]">
                  You will be redirected to Razorpay's secure payment gateway to complete your payment.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-[#181111] text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-[#886364]">Items ({cart.items.length})</span>
                <span className="text-[#181111]">{formatCurrency(cart.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#886364]">Shipping</span>
                <span className="text-[#181111]">{cart.subtotal > 2000 ? "Free" : formatCurrency(150)}</span>
              </div>

              <div className="border-t border-[#e5dcdc] pt-3 flex justify-between font-semibold">
                <span className="text-[#181111]">Total</span>
                <span className="text-[#181111]">{formatCurrency(cart.subtotal > 2000 ? cart.subtotal : cart.subtotal + 150)}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-[#e92932] text-white" 
              onClick={handleSubmit} 
              disabled={isSubmitting || (formData.paymentMethod === "card" && !razorpayLoaded)}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#886364]">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}