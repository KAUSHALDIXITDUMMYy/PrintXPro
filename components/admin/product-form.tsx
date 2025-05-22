"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { addProduct, updateProduct, uploadProductImage } from "@/lib/firebase/products"
import { X, Upload, Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  onSaved: () => void
}

export function ProductForm({ product, onSaved }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "PrintXpro.com",
    price: 0,
    description: "",
    materials: ["PLA+"],
    imageUrl: "",
    stock: 0,
    category: "",
    rating: 5,
    featured: false,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price,
        description: product.description,
        materials: product.materials,
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: product.category,
        rating: product.rating,
        featured: product.featured || false,
      })
      setImagePreview(product.imageUrl)
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(product ? product.imageUrl : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      let imageUrl = formData.imageUrl

      // Upload image if a new one is selected
      if (imageFile) {
        const productId = product ? product.id : `temp-${Date.now()}`
        imageUrl = await uploadProductImage(imageFile, productId)
      }

      const productData = {
        ...formData,
        imageUrl,
      }

      if (product) {
        // Update existing product
        await updateProduct(product.id, productData)
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        })
      } else {
        // Add new product
        await addProduct(productData)
        toast({
          title: "Product added",
          description: "The product has been successfully added.",
        })
      }

      onSaved()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = ["Toys", "Decor", "Industrial", "Personalized", "Gadgets", "Art"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={formData.rating.toString()} onValueChange={(value) => handleSelectChange("rating", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Product preview"
                    className="mx-auto h-48 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to upload</p>
                </div>
              )}
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSaved}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>Save Product</>
          )}
        </Button>
      </div>
    </form>
  )
}
