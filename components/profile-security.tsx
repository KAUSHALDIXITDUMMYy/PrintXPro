"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/firebase/auth-context"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"

export function ProfileSecurity() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsChanging(true)

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email!, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error: any) {
      console.error("Error changing password:", error)

      if (error.code === "auth/wrong-password") {
        toast({
          title: "Incorrect password",
          description: "The current password you entered is incorrect.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Password change failed",
          description: "Failed to change your password. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Shield className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Account Security</h2>
          <p className="text-muted-foreground">Manage your password and account security settings</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={isChanging}>
            {isChanging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Password Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use a minimum of 8 characters</li>
          <li>• Include at least one uppercase letter</li>
          <li>• Include at least one number</li>
          <li>• Include at least one special character</li>
          <li>• Avoid using easily guessable information like birthdays</li>
        </ul>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Forgot Password?</h3>
        <p className="text-muted-foreground mb-4">If you've forgotten your password, you can reset it via email.</p>
        <Button variant="outline" asChild>
          <a href="/auth/forgot-password">Reset Password via Email</a>
        </Button>
      </div>
    </div>
  )
}
