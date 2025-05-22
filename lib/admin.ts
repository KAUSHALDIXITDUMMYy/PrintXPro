import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase/firebase-config"

// Check if a user is an admin
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return userDoc.data().role === "admin"
    }

    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
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

    const userRef = doc(db, "users", userId)

    await userRef.update({
      role: "admin",
    })

    return true
  } catch (error) {
    console.error("Error promoting user to admin:", error)
    return false
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

    const userRef = doc(db, "users", userId)

    await userRef.update({
      role: "user",
    })

    return true
  } catch (error) {
    console.error("Error demoting admin:", error)
    return false
  }
}
