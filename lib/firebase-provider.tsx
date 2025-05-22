"use client"

import { type ReactNode, useEffect } from "react"
import { getAnalytics } from "firebase/analytics"
import { AuthProvider } from "./auth-context"
import { CartProvider } from "@/lib/hooks/use-cart"
import { app } from "./firebase/firebase-config"

export function FirebaseProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize Analytics only in browser environment
    if (typeof window !== "undefined") {
      getAnalytics(app)
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
