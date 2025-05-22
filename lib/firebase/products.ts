import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import type { Product } from "@/lib/types"

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = getFirestore()
    const docRef = doc(db, "products", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const productData = docSnap.data()

      // Get the latest review count and average rating
      const reviewsRef = collection(db, "reviews")
      const q = query(reviewsRef, where("productId", "==", id))
      const reviewsSnapshot = await getDocs(q)

      const reviewCount = reviewsSnapshot.size
      let avgRating = productData.rating || 5

      if (reviewCount > 0) {
        const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0)
        avgRating = totalRating / reviewCount
      }

      return {
        id: docSnap.id,
        ...productData,
        reviewCount,
        rating: avgRating,
      } as Product
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting product:", error)
    return null
  }
}

// Get products with optional filtering
export async function getProducts({
  category,
  minPrice,
  maxPrice,
  rating,
  search,
  lastVisible,
  pageSize = 12,
}: {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
  lastVisible?: QueryDocumentSnapshot<DocumentData>
  pageSize?: number
} = {}): Promise<Product[]> {
  try {
    const db = getFirestore()
    let q = query(collection(db, "products"), orderBy("name"))

    // Apply filters if provided
    if (category) {
      q = query(q, where("category", "==", category))
    }

    if (minPrice !== undefined) {
      q = query(q, where("price", ">=", minPrice))
    }

    if (maxPrice !== undefined) {
      q = query(q, where("price", "<=", maxPrice))
    }

    // Apply pagination
    if (lastVisible) {
      q = query(q, startAfter(lastVisible), limit(pageSize))
    } else {
      q = query(q, limit(pageSize))
    }

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]

    // Get real ratings for each product
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const reviewsRef = collection(db, "reviews")
        const reviewsQuery = query(reviewsRef, where("productId", "==", product.id))
        const reviewsSnapshot = await getDocs(reviewsQuery)

        const reviewCount = reviewsSnapshot.size
        let avgRating = product.rating || 5

        if (reviewCount > 0) {
          const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0)
          avgRating = totalRating / reviewCount
        }

        return {
          ...product,
          reviewCount,
          rating: avgRating,
        }
      }),
    )

    // Apply rating filter client-side after getting real ratings
    let filteredProducts = productsWithRatings
    if (rating !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.rating >= rating)
    }

    // Apply search filter client-side (Firestore doesn't support text search)
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)),
      )
    }

    return filteredProducts
  } catch (error) {
    console.error("Error getting products:", error)
    return []
  }
}

// Get featured products
export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  try {
    const db = getFirestore()
    const q = query(collection(db, "products"), where("featured", "==", true), limit(count))

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]

    // Get real ratings for each product
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const reviewsRef = collection(db, "reviews")
        const reviewsQuery = query(reviewsRef, where("productId", "==", product.id))
        const reviewsSnapshot = await getDocs(reviewsQuery)

        const reviewCount = reviewsSnapshot.size
        let avgRating = product.rating || 5

        if (reviewCount > 0) {
          const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0)
          avgRating = totalRating / reviewCount
        }

        return {
          ...product,
          reviewCount,
          rating: avgRating,
        }
      }),
    )

    return productsWithRatings
  } catch (error) {
    console.error("Error getting featured products:", error)
    return []
  }
}

// Get related products
export async function getRelatedProducts(currentProductId: string, category: string, count = 4): Promise<Product[]> {
  try {
    const db = getFirestore()
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      limit(count + 1), // Fetch one extra to account for filtering out current product
    )

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((product) => product.id !== currentProductId)
      .slice(0, count) as Product[]

    // Get real ratings for each product
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const reviewsRef = collection(db, "reviews")
        const reviewsQuery = query(reviewsRef, where("productId", "==", product.id))
        const reviewsSnapshot = await getDocs(reviewsQuery)

        const reviewCount = reviewsSnapshot.size
        let avgRating = product.rating || 5

        if (reviewCount > 0) {
          const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0)
          avgRating = totalRating / reviewCount
        }

        return {
          ...product,
          reviewCount,
          rating: avgRating,
        }
      }),
    )

    return productsWithRatings
  } catch (error) {
    console.error("Error getting related products:", error)
    return []
  }
}

// Get product categories with count
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  try {
    const db = getFirestore()
    const querySnapshot = await getDocs(collection(db, "products"))

    const categoryCounts: Record<string, number> = {}

    querySnapshot.docs.forEach((doc) => {
      const category = doc.data().category
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      }
    })

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }))
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

// Add a new product (admin only)
export async function addProduct(productData: Omit<Product, "id">): Promise<string> {
  try {
    const db = getFirestore()
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding product:", error)
    throw error
  }
}

// Update a product (admin only)
export async function updateProduct(id: string, productData: Partial<Product>): Promise<void> {
  try {
    const db = getFirestore()
    const docRef = doc(db, "products", id)
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

// Delete a product (admin only)
export async function deleteProduct(id: string): Promise<void> {
  try {
    const db = getFirestore()
    await deleteDoc(doc(db, "products", id))
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Upload product image
export async function uploadProductImage(file: File, productId: string): Promise<string> {
  try {
    const storage = getStorage()
    const storageRef = ref(storage, `products/${productId}/${file.name}`)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (error) {
    console.error("Error uploading product image:", error)
    throw error
  }
}

// Delete product image
export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const storage = getStorage()
    const imageRef = ref(storage, imageUrl)

    await deleteObject(imageRef)
  } catch (error) {
    console.error("Error deleting product image:", error)
    throw error
  }
}
