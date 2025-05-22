"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { sendPasswordResetEmail } from "firebase/auth"
import { getAuth } from "firebase/auth"
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      setIsSuccess(true)
    } catch (error: any) {
      console.error("Password reset error:", error)

      if (error.code === "auth/user-not-found") {
        toast({
          title: "Email not found",
          description: "No account exists with this email address.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Reset failed",
          description: "Failed to send password reset email. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" asChild className="mb-6 pl-0">
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                inbox and follow the instructions to reset your password.
              </p>
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Return to Login</Link>
                </Button>
                <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
                  Try another email
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center text-sm mt-4">
                <span className="text-muted-foreground">Remember your password? </span>
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
