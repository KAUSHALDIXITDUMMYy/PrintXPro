"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye } from "lucide-react"
import type { Order } from "@/lib/firebase/orders"
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/orders"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

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

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

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
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
      setOrders(updatedOrders)

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
      case "pending": return "outline"
      case "processing": return "secondary"
      case "shipped": return "default"
      case "delivered": return "success"
      case "cancelled": return "destructive"
      default: return "outline"
    }
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchQuery("")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#171212] text-3xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px] bg-[#f4f1f1] border-none">
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

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#82686a]" />
            <Input
              type="search"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#f4f1f1] border-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#e4dddd] overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-[#171212]">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-[#82686a]">{order.address.name}</TableCell>
                  <TableCell className="text-[#82686a]">{formatDate(new Date(order.timestamp as any))}</TableCell>
                  <TableCell className="text-[#82686a]">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      className="bg-[#f4f1f1] text-[#171212] hover:bg-[#e4dddd] w-full"
                    >
                      {order.status}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewOrder(order)}
                      className="text-[#82686a]"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                  <p className="text-sm text-[#82686a]">
                    Placed on {formatDate(new Date(selectedOrder.timestamp as any))}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order["status"])}
                  >
                    <SelectTrigger className="w-[180px] bg-[#f4f1f1] border-none">
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
                    <div className="bg-[#f4f1f1] p-3 rounded-md">
                      <p>{selectedOrder.address.name}</p>
                      <p>{selectedOrder.address.email}</p>
                      <p>{selectedOrder.address.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="bg-[#f4f1f1] p-3 rounded-md">
                      <p>{selectedOrder.address.address}</p>
                      <p>
                        {selectedOrder.address.city}, {selectedOrder.address.state}
                      </p>
                      <p>PIN: {selectedOrder.address.pincode}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="bg-[#f4f1f1] p-3 rounded-md">
                    <ul className="divide-y">
                      {selectedOrder.products.map((item, index) => (
                        <li key={index} className="py-2 flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-[#82686a]">Qty: {item.quantity}</p>
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
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}