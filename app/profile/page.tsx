"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/firebase/auth-context"
import { AlertCircle } from "lucide-react"
import { ProfileInformation } from "@/components/profile/profile-information"
import { ProfileSecurity } from "@/components/profile/profile-security"
import { ProfileAddresses } from "@/components/profile/profile-addresses"
import { ProfileOrders } from "@/components/profile/profile-orders"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("information")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short delay to prevent flash of unauthenticated state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

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
          You need to be logged in to view your profile.
        </p>
        <Button onClick={() => router.push("/auth/login?redirect=/profile")}>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="information" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="container px-6">
              <TabsList className="bg-transparent h-14 p-0 w-full justify-start gap-6 overflow-x-auto">
                <TabsTrigger
                  value="information"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-14 px-0"
                >
                  Personal Information
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-14 px-0"
                >
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-14 px-0"
                >
                  Addresses
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-14 px-0"
                >
                  Orders
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="p-6">
            <TabsContent value="information" className="mt-0">
              <ProfileInformation />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <ProfileSecurity />
            </TabsContent>

            <TabsContent value="addresses" className="mt-0">
              <ProfileAddresses />
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <ProfileOrders />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
