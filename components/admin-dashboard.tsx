"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProductsTab } from "@/components/admin/admin-products-tab"
import { AdminOrdersTab } from "@/components/admin/admin-orders-tab"
import { AdminUsersTab } from "@/components/admin/admin-users-tab"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <AdminProductsTab />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <AdminOrdersTab />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <AdminUsersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
