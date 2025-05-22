"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/firebase/auth-context"
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/firebase/wishlist"
import { Heart } from "lucide-react"

interface AddToWishlistButtonProps {
  productId: string
}

export function AddToWishlistButton({ productId }: AddToWishlistButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isInList, setIsInList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        try {
          const result = await isInWishlist(user.uid, productId)
          setIsInList(result)
        } catch (error) {
          console.error("Error checking wishlist:", error)
        }
      }
    }

    checkWishlist()
  }, [user, productId])

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      if (isInList) {
        await removeFromWishlist(user.uid, productId)
        toast({
          title: "Removed from wishlist",
          description: "The item has been removed from your wishlist.",
        })
      } else {
        await addToWishlist(user.uid, productId)
        toast({
          title: "Added to wishlist",
          description: "The item has been added to your wishlist.",
        })
      }

      setIsInList(!isInList)
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update your wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={isInList ? "text-red-500 border-red-200 hover:text-red-600 hover:border-red-300" : ""}
    >
      <Heart className={`h-5 w-5 ${isInList ? "fill-current" : ""}`} />
      <span className="sr-only">{isInList ? "Remove from wishlist" : "Add to wishlist"}</span>
    </Button>
  )
}
