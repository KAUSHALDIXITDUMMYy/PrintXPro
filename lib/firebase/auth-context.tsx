"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth"
import { createUser } from "./users"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  createUser: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email, password)
  }

  const createUserWithName = async (email: string, password: string, name: string) => {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update the user's profile with the provided name
    await updateProfile(userCredential.user, {
      displayName: name,
    })

    // Create user document in Firestore
    await createUser(userCredential.user.uid, {
      name,
      email,
      role: "user",
      createdAt: new Date(),
    })

    return userCredential.user
  }

  const signInWithGoogle = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)

    // Check if this is a new user and create a Firestore document if needed
    await createUser(userCredential.user.uid, {
      name: userCredential.user.displayName || "User",
      email: userCredential.user.email || "",
      role: "user",
      createdAt: new Date(),
    })

    return userCredential.user
  }

  const signOut = async () => {
    const auth = getAuth()
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        createUser: createUserWithName,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
