"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { checkIsAdmin } from "@/lib/firebase/admin"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const adminStatus = await checkIsAdmin(user.uid)
        setIsAdmin(adminStatus)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [user])

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
          You need to be logged in to access the admin dashboard.
        </p>
        <Button onClick={() => router.push("/auth/login?redirect=/admin")}>Sign In</Button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          You don't have permission to access the admin dashboard. Only users with admin privileges can access this
          page.
        </p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return <AdminDashboard />
}
