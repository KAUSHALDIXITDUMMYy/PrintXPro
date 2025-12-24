"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProductsTab } from "@/components/admin/admin-products-tab"
import { AdminOrdersTab } from "@/components/admin/admin-orders-tab"
import { AdminUsersTab } from "@/components/admin/admin-users-tab"
import { AdminMessagesTab } from "@/components/admin/admin-messages-tab"
import { House, Cube, Truck, Users, Gear } from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="relative flex min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif" }}>
      {/* Sidebar */}
      <div className="w-80 p-4 border-r border-[#e4dddd]">
        <h1 className="text-[#171212] text-base font-medium leading-normal mb-6">Admin Panel</h1>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${activeTab === "dashboard" ? 'bg-[#f4f1f1]' : ''}`}
          >
            <House className="text-[#171212] h-6 w-6" />
            <p className="text-[#171212] text-sm font-medium leading-normal">Dashboard</p>
          </button>
          
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${activeTab === "products" ? 'bg-[#f4f1f1]' : ''}`}
          >
            <Cube className="text-[#171212] h-6 w-6" />
            <p className="text-[#171212] text-sm font-medium leading-normal">Products</p>
          </button>
          
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${activeTab === "orders" ? 'bg-[#f4f1f1]' : ''}`}
          >
            <Truck className="text-[#171212] h-6 w-6" />
            <p className="text-[#171212] text-sm font-medium leading-normal">Orders</p>
          </button>
          
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${activeTab === "users" ? 'bg-[#f4f1f1]' : ''}`}
          >
            <Users className="text-[#171212] h-6 w-6" />
            <p className="text-[#171212] text-sm font-medium leading-normal">Customers</p>
          </button>
          
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${activeTab === "settings" ? 'bg-[#f4f1f1]' : ''}`}
          >
            <Gear className="text-[#171212] h-6 w-6" />
            <p className="text-[#171212] text-sm font-medium leading-normal">Settings</p>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[960px] p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="space-y-6">
            <h1 className="text-[#171212] text-3xl font-bold mb-6">Dashboard</h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] rounded-xl border border-[#e4dddd] p-6">
                <p className="text-[#171212] text-base font-medium mb-2">Total Sales</p>
                <p className="text-[#171212] text-2xl font-bold">$12,500</p>
              </div>
              
              <div className="flex-1 min-w-[200px] rounded-xl border border-[#e4dddd] p-6">
                <p className="text-[#171212] text-base font-medium mb-2">Total Orders</p>
                <p className="text-[#171212] text-2xl font-bold">350</p>
              </div>
              
              <div className="flex-1 min-w-[200px] rounded-xl border border-[#e4dddd] p-6">
                <p className="text-[#171212] text-base font-medium mb-2">Total Customers</p>
                <p className="text-[#171212] text-2xl font-bold">200</p>
              </div>
            </div>

            <h2 className="text-[#171212] text-2xl font-bold mt-8 mb-4">Recent Orders</h2>
            {/* Orders table would go here */}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <AdminProductsTab />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <AdminOrdersTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="rounded-xl border border-[#e4dddd] p-6">
              <h2 className="text-[#171212] text-xl font-bold mb-4">Settings</h2>
              <p className="text-[#82686a]">Settings content goes here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}