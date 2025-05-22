"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl?: string
  quantity: number
  material?: string
}

interface CartContextType {
  cart: {
    items: CartItem[]
    subtotal: number
  }
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ items: CartItem[]; subtotal: number }>({
    items: [],
    subtotal: 0,
  })

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((item) => item.id === newItem.id)

      let updatedItems

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        updatedItems = [...prevCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        }
      } else {
        // Item doesn't exist, add it
        updatedItems = [...prevCart.items, newItem]
      }

      const subtotal = calculateSubtotal(updatedItems)

      return {
        items: updatedItems,
        subtotal,
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== id)
      const subtotal = calculateSubtotal(updatedItems)

      return {
        items: updatedItems,
        subtotal,
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      const subtotal = calculateSubtotal(updatedItems)

      return {
        items: updatedItems,
        subtotal,
      }
    })
  }

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
