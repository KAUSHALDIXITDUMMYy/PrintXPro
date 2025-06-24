import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { db } from "./firebase-config"

interface AddressInput {
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface Address extends AddressInput {
  id: string
}

// Get all addresses for a user
export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.addresses || []
    }

    return []
  } catch (error) {
    console.error("Error getting user addresses:", error)
    return []
  }
}

// Add a new address for a user
export async function addUserAddress(userId: string, addressData: AddressInput): Promise<Address> {
  try {
    const userRef = doc(db, "users", userId)

    // Generate a unique ID for the address
    const addressId = uuidv4()
    const newAddress: Address = {
      ...addressData,
      id: addressId,
    }

    // Get current addresses to handle default address logic
    const currentAddresses = await getUserAddresses(userId)

    // If this is the first address or it's marked as default, update other addresses
    if (newAddress.isDefault || currentAddresses.length === 0) {
      // If this is the first address, make it default
      if (currentAddresses.length === 0) {
        newAddress.isDefault = true
      }

      // Remove default flag from other addresses
      const updatedAddresses = currentAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }))

      // Add the new address
      updatedAddresses.push(newAddress)

      // Update the user document with all addresses
      await updateDoc(userRef, {
        addresses: updatedAddresses,
      })
    } else {
      // Just add the new address without changing others
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress),
      })
    }

    return newAddress
  } catch (error) {
    console.error("Error adding user address:", error)
    throw error
  }
}

// Update an existing address
export async function updateUserAddress(userId: string, addressId: string, addressData: AddressInput): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)

    // Get current addresses
    const currentAddresses = await getUserAddresses(userId)

    // Find the address to update
    const addressIndex = currentAddresses.findIndex((addr) => addr.id === addressId)

    if (addressIndex === -1) {
      throw new Error("Address not found")
    }

    // Create updated address
    const updatedAddress: Address = {
      ...addressData,
      id: addressId,
    }

    // Handle default address logic
    if (updatedAddress.isDefault) {
      // Remove default flag from other addresses
      currentAddresses.forEach((addr) => {
        if (addr.id !== addressId) {
          addr.isDefault = false
        }
      })
    } else if (currentAddresses[addressIndex].isDefault) {
      // If this was the default address and default is being removed,
      // make sure at least one address is default
      if (currentAddresses.length > 1) {
        // Find another address to make default
        const nextDefaultIndex = addressIndex === 0 ? 1 : 0
        currentAddresses[nextDefaultIndex].isDefault = true
      } else {
        // If this is the only address, keep it as default
        updatedAddress.isDefault = true
      }
    }

    // Update the address in the array
    currentAddresses[addressIndex] = updatedAddress

    // Update the user document
    await updateDoc(userRef, {
      addresses: currentAddresses,
    })
  } catch (error) {
    console.error("Error updating user address:", error)
    throw error
  }
}

// Delete an address
export async function deleteUserAddress(userId: string, addressId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)

    // Get current addresses
    const currentAddresses = await getUserAddresses(userId)

    // Find the address to delete
    const addressToDelete = currentAddresses.find((addr) => addr.id === addressId)

    if (!addressToDelete) {
      throw new Error("Address not found")
    }

    // Remove the address
    const remainingAddresses = currentAddresses.filter((addr) => addr.id !== addressId)

    // If the deleted address was the default and there are other addresses,
    // make another address the default
    if (addressToDelete.isDefault && remainingAddresses.length > 0) {
      remainingAddresses[0].isDefault = true
    }

    // Update the user document
    await updateDoc(userRef, {
      addresses: remainingAddresses,
    })
  } catch (error) {
    console.error("Error deleting user address:", error)
    throw error
  }
}
