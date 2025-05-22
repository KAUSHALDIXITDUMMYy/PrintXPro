import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore"
import type { Review } from "@/lib/types"

// Get reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const db = getFirestore()
    const q = query(collection(db, "reviews"), where("productId", "==", productId), orderBy("timestamp", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as Review
    })
  } catch (error) {
    console.error("Error getting product reviews:", error)
    return []
  }
}

// Add a review for a product
export async function addProductReview(
  productId: string,
  reviewData: Omit<Review, "id" | "productId">,
): Promise<string> {
  try {
    const db = getFirestore()
    const reviewsRef = collection(db, "reviews")

    const docRef = await addDoc(reviewsRef, {
      productId,
      ...reviewData,
      timestamp: serverTimestamp(),
    })

    // Update product rating and review count
    const productRef = doc(db, "products", productId)
    const productDoc = await getDoc(productRef)

    if (productDoc.exists()) {
      // Get all reviews for this product
      const q = query(collection(db, "reviews"), where("productId", "==", productId))
      const reviewsSnapshot = await getDocs(q)

      const reviewCount = reviewsSnapshot.size
      let avgRating = 5

      if (reviewCount > 0) {
        const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0)
        avgRating = totalRating / reviewCount
      }

      // Update the product with new rating and review count
      await updateDoc(productRef, {
        rating: avgRating,
        reviewCount: reviewCount,
      })
    }

    return docRef.id
  } catch (error) {
    console.error("Error adding product review:", error)
    throw error
  }
}

// Delete a review (admin or review author only)
export async function deleteReview(reviewId: string, userId: string): Promise<void> {
  try {
    const db = getFirestore()
    const reviewRef = doc(db, "reviews", reviewId)

    // Get the review to check if the user is the author
    const reviewDoc = await reviewRef.get()

    if (!reviewDoc.exists()) {
      throw new Error("Review not found")
    }

    const reviewData = reviewDoc.data()

    // Check if the user is the author of the review
    if (reviewData.userId !== userId) {
      // Check if the user is an admin
      // This would require additional logic to check admin status
      throw new Error("You don't have permission to delete this review")
    }

    await reviewRef.delete()
  } catch (error) {
    console.error("Error deleting review:", error)
    throw error
  }
}
