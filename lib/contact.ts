import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, where } from "firebase/firestore"
import { db } from "./firebase-config"

export interface ContactMessage {
  id?: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  timestamp: Date
  status: "unread" | "read" | "replied"
  adminNotes?: string
}

// Submit a new contact message
export async function submitContactMessage(messageData: Omit<ContactMessage, "id">): Promise<string> {
  try {
    const messagesRef = collection(db, "contactMessages")

    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: new Date(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error submitting contact message:", error)
    throw error
  }
}

// Get all contact messages (admin only)
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  try {
    const messagesRef = collection(db, "contactMessages")
    const q = query(messagesRef, orderBy("timestamp", "desc"))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as ContactMessage[]
  } catch (error) {
    console.error("Error getting contact messages:", error)
    return []
  }
}

// Update message status (admin only)
export async function updateMessageStatus(messageId: string, status: ContactMessage["status"]): Promise<void> {
  try {
    const messageRef = doc(db, "contactMessages", messageId)

    await updateDoc(messageRef, {
      status,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating message status:", error)
    throw error
  }
}

// Add admin notes to a message
export async function addAdminNotes(messageId: string, notes: string): Promise<void> {
  try {
    const messageRef = doc(db, "contactMessages", messageId)

    await updateDoc(messageRef, {
      adminNotes: notes,
      status: "replied",
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error adding admin notes:", error)
    throw error
  }
}

// Get unread messages count
export async function getUnreadMessagesCount(): Promise<number> {
  try {
    const messagesRef = collection(db, "contactMessages")
    const q = query(messagesRef, where("status", "==", "unread"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  } catch (error) {
    console.error("Error getting unread messages count:", error)
    return 0
  }
}
