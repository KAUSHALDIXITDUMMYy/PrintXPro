"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/firebase/auth-context"
import { getProductReviews, addProductReview } from "@/lib/firebase/reviews"
import { formatDate } from "@/lib/utils"
import { Star, User } from "lucide-react"
import type { Review } from "@/lib/types"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const fetchedReviews = await getProductReviews(productId)
      setReviews(fetchedReviews)

      // Calculate average rating
      if (fetchedReviews.length > 0) {
        const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0)
        setAverageRating(totalRating / fetchedReviews.length)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review.",
        variant: "destructive",
      })
      return
    }

    if (!newReview.trim()) {
      toast({
        title: "Review required",
        description: "Please enter your review before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      await addProductReview(productId, {
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "User",
        rating,
        comment: newReview,
        timestamp: new Date(),
      })

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      setNewReview("")
      setRating(5)
      fetchReviews()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="mr-2">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this product..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              disabled={!user}
            />
            {!user && <p className="text-sm text-muted-foreground mt-2">Please sign in to leave a review.</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || !user}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

        {reviews.length > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-2">
              based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="bg-muted rounded-full p-2 mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{review.userName}</h4>
                  <p className="text-xs text-muted-foreground">{formatDate(review.timestamp)}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
