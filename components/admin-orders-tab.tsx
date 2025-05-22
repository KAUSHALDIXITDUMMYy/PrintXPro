"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye } from "lucide-react"
import type { Order } from "@/lib/firebase/orders"
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/orders"
import { formatCurrency, formatDate } from "@/lib/utils"
// Add these imports at the top
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Replace the existing component with this updated version
export function AdminOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    // Apply filters whenever search query or status filter changes
    applyFilters()
  }, [searchQuery, statusFilter, orders])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const fetchedOrders = await getAllOrders()
      setOrders(fetchedOrders)
      setFilteredOrders(fetchedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...orders]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.address.name.toLowerCase().includes(query) ||
          order.address.email.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(result)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, status)

      // Update local state
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
      setOrders(updatedOrders)

      // Update selected order if it's the one being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }

      toast({
        title: "Status updated",
        description: `Order status has been updated to ${status}.`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchQuery("")
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== "all" || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
              Clear Filters
            </Button>
          )}
        </div>

        <form onSubmit={handleSearch} className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
        </form>
      </div>

      {statusFilter !== "all" && (
        <div className="mb-4">
          <Badge variant={getStatusBadgeVariant(statusFilter as Order["status"]) as any} className="text-sm px-2 py-1">
            Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{order.address.name}</TableCell>
                    <TableCell>{formatDate(new Date(order.timestamp as any))}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(new Date(selectedOrder.timestamp as any))}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order["status"])}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p>{selectedOrder.address.name}</p>
                      <p>{selectedOrder.address.email}</p>
                      <p>{selectedOrder.address.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p>{selectedOrder.address.address}</p>
                      <p>
                        {selectedOrder.address.city}, {selectedOrder.address.state}
                      </p>
                      <p>PIN: {selectedOrder.address.pincode}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Payment Information</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p>Method: {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</p>
                      <p>Status: {selectedOrder.paymentStatus || "pending"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <ul className="divide-y">
                      {selectedOrder.products.map((item, index) => (
                        <li key={index} className="py-2 flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p>{formatCurrency(item.price * item.quantity)}</p>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t mt-4 pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedOrder.totalAmount - selectedOrder.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <div className="bg-muted p-3 rounded-md">
                        <p>{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
