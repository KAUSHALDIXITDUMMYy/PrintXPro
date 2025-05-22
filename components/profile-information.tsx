"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserData, updateUserData } from "@/lib/firebase/users"
import { updateProfile } from "firebase/auth"
import { Loader2, User } from "lucide-react"

export function ProfileInformation() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userData = await getUserData(user.uid)

        if (userData) {
          setFormData({
            name: userData.name || user.displayName || "",
            email: userData.email || user.email || "",
            phone: userData.phone || "",
          })
        } else {
          setFormData({
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      setIsSaving(true)

      // Update Firestore user data
      await updateUserData(user.uid, {
        name: formData.name,
        phone: formData.phone,
      })

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.name,
      })

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{formData.name || "User"}</h2>
          <p className="text-muted-foreground">{formData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" value={formData.email} disabled />
          <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
