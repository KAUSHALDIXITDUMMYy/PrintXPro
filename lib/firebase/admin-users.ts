import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { checkIsAdmin } from "./admin"
import type { User } from "@/lib/types"

// Get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  try {
    const db = getFirestore()
    const usersRef = collection(db, "users")
    const snapshot = await getDocs(usersRef)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as User[]
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

// Promote a user to admin
export async function promoteToAdmin(userId: string, currentUserId: string): Promise<boolean> {
  try {
    // First check if the current user is an admin
    const isAdmin = await checkIsAdmin(currentUserId)

    if (!isAdmin) {
      throw new Error("Only admins can promote users")
    }

    const db = getFirestore()
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      role: "admin",
    })

    return true
  } catch (error) {
    console.error("Error promoting user to admin:", error)
    throw error
  }
}

// Demote an admin to regular user
export async function demoteFromAdmin(userId: string, currentUserId: string): Promise<boolean> {
  try {
    // First check if the current user is an admin
    const isAdmin = await checkIsAdmin(currentUserId)

    if (!isAdmin) {
      throw new Error("Only admins can demote users")
    }

    // Prevent demoting yourself
    if (userId === currentUserId) {
      throw new Error("You cannot demote yourself")
    }

    const db = getFirestore()
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      role: "user",
    })

    return true
  } catch (error) {
    console.error("Error demoting admin:", error)
    throw error
  }
}
