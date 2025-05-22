"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/firebase/auth-context"
import { getOrderById } from "@/lib/firebase/orders"
import { formatCurrency, formatDate } from "@/lib/utils"
import { AlertCircle, ArrowLeft, Package, Truck, CreditCard, CheckCircle2 } from "lucide-react"
import type { Order } from "@/lib/firebase/orders"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const fetchedOrder = await getOrderById(params.id)

        if (!fetchedOrder) {
          setError("Order not found")
          return
        }

        // Check if the order belongs to the current user
        if (fetchedOrder.userId !== user.uid) {
          setError("You don't have permission to view this order")
          return
        }

        setOrder(fetchedOrder)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, user])

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "outline"
      case "processing":
        return "secondary"
      case "shipped":
        return "default"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
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
          You need to be logged in to view order details.
        </p>
        <Button onClick={() => router.push(`/auth/login?redirect=/orders/${params.id}`)}>Sign In</Button>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">{error || "Failed to load order details"}</p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-muted-foreground">Placed on {formatDate(new Date(order.timestamp as any))}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status) as any} className="text-base px-3 py-1.5">
          {getStatusIcon(order.status)}
          <span className="ml-2">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            <div className="divide-y">
              {order.products.map((item, index) => (
                <div key={index} className="p-6 flex flex-col sm:flex-row gap-4">
                  <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=96&width=96"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-muted-foreground">Qty: {item.quantity}</div>
                      <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-muted-foreground">
                    <p>{order.address.name}</p>
                    <p>{order.address.address}</p>
                    <p>
                      {order.address.city}, {order.address.state} {order.address.pincode}
                    </p>
                    <p>{order.address.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Shipping Method</h3>
                  <div className="text-muted-foreground">
                    <p>Standard Shipping</p>
                    <p>Estimated delivery: 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.totalAmount - order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {order.paymentMethod === "card" ? (
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="font-medium">
                  {order.paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}
                </span>
              </div>
              <div className="text-muted-foreground">
                <p>Status: {order.paymentStatus || "pending"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
