export interface Product {
  id: string
  name: string
  brand: string
  price: number
  description: string
  materials: string[]
  imageUrl: string
  stock: number
  category: string
  rating: number
  reviewCount?: number
  featured?: boolean
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  timestamp: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  wishlist?: string[]
  createdAt: Date
}
