import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

interface UserData {
  name: string
  email: string
  role: "admin" | "user"
  createdAt: Date
  updatedAt?: Date
  phone?: string
  address?: string
}

// Create a new user document
export async function createUser(userId: string, userData: UserData): Promise<void> {
  try {
    const db = getFirestore()
    const userRef = doc(db, "users", userId)

    // Check if user already exists
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Get user data
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const db = getFirestore()
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return userDoc.data() as UserData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

// Update user data
export async function updateUserData(userId: string, userData: Partial<UserData>): Promise<void> {
  try {
    const db = getFirestore()
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user data:", error)
    throw error
  }
}
