"use client"

import { type ReactNode, useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { AuthProvider } from "./auth-context"
import { CartProvider } from "@/lib/hooks/use-cart"

const firebaseConfig = {
  apiKey: "AIzaSyAf8Yt3eZnwwnka8DgY5-odzMuGiZiKW8c",
  authDomain: "hoophoop-e1422.firebaseapp.com",
  projectId: "hoophoop-e1422",
  storageBucket: "hoophoop-e1422.firebasestorage.app",
  messagingSenderId: "1006543231381",
  appId: "1:1006543231381:web:3b6a0d9fad120878387e9c",
  measurementId: "G-N1B3QP4YRG",
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)

    // Initialize Analytics only in browser environment
    if (typeof window !== "undefined") {
      getAnalytics(app)
    }

    setIsInitialized(true)
  }, [])

  if (!isInitialized) {
    return null
  }

  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
