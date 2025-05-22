import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { getProductById } from "./products"
import { db } from "./firebase/firebase-config"
import type { Product } from "@/lib/types"

// Add a product to user's wishlist
export async function addToWishlist(userId: string, productId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      wishlist: arrayUnion(productId),
    })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

// Remove a product from user's wishlist
export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      wishlist: arrayRemove(productId),
    })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

// Check if a product is in user's wishlist
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.wishlist && userData.wishlist.includes(productId)
    }

    return false
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}

// Get all products in user's wishlist
export async function getWishlistProducts(userId: string): Promise<Product[]> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()

      if (!userData.wishlist || userData.wishlist.length === 0) {
        return []
      }

      const productPromises = userData.wishlist.map((productId: string) => getProductById(productId))

      const products = await Promise.all(productPromises)

      // Filter out any null values (products that might have been deleted)
      return products.filter((product) => product !== null) as Product[]
    }

    return []
  } catch (error) {
    console.error("Error getting wishlist products:", error)
    return []
  }
}
