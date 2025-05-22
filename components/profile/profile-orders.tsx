"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserOrders } from "@/lib/firebase/orders"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Package, Eye, ShoppingBag } from "lucide-react"
import type { Order } from "@/lib/firebase/orders"

export function ProfileOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userOrders = await getUserOrders(user.uid)
        setOrders(userOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Order History</h2>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                    <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {formatDate(new Date(order.timestamp as any))}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(order.totalAmount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.products.reduce((sum, item) => sum + item.quantity, 0)} items
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {order.products.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.productId}`} className="font-medium hover:underline line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                      <div className="text-sm">{formatCurrency(item.price)}</div>
                    </div>
                  </div>
                ))}
                {order.products.length > 3 && (
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      +{order.products.length - 3} more {order.products.length - 3 === 1 ? "item" : "items"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
