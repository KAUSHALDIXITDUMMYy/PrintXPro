import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"

interface OrderProduct {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface OrderAddress {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  userId: string
  products: OrderProduct[]
  totalAmount: number
  shippingFee: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "card" | "cod"
  paymentStatus?: "pending" | "paid" | "failed"
  address: OrderAddress
  notes?: string
  timestamp: Date | Timestamp
}

// Create a new order
export async function createOrder(orderData: Omit<Order, "id">): Promise<{ id: string }> {
  try {
    const db = getFirestore()
    const ordersRef = collection(db, "orders")

    const docRef = await addDoc(ordersRef, {
      ...orderData,
      timestamp: serverTimestamp(),
    })

    return { id: docRef.id }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get a single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const db = getFirestore()
    const orderRef = doc(db, "orders", orderId)
    const orderDoc = await getDoc(orderRef)

    if (orderDoc.exists()) {
      const data = orderDoc.data()
      return {
        id: orderDoc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as Order
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}

// Get all orders for a user
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const db = getFirestore()
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("timestamp", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as Order
    })
  } catch (error) {
    console.error("Error getting user orders:", error)
    return []
  }
}

// Get all orders (admin only)
export async function getAllOrders(): Promise<Order[]> {
  try {
    const db = getFirestore()
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as Order
    })
  } catch (error) {
    console.error("Error getting all orders:", error)
    return []
  }
}

// Update order status (admin only)
export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
  try {
    const db = getFirestore()
    const orderRef = doc(db, "orders", orderId)

    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Update payment status (admin only)
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed",
): Promise<void> {
  try {
    const db = getFirestore()
    const orderRef = doc(db, "orders", orderId)

    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating payment status:", error)
    throw error
  }
}
