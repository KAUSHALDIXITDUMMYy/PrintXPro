"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { saveProduct } from "@/lib/firebase/products"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { FirebaseStorage } from "firebase/storage"
import { Loader2, Image as ImageIcon } from "lucide-react"
import { Product } from "@/lib/types"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  materials: z.array(z.string()).min(1, "At least one material is required"),
  stock: z.number().min(0, "Stock must be positive"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  featured: z.boolean().default(false),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSaved: () => void
  storage: FirebaseStorage
}

export function ProductForm({ product, onSaved, storage }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [materials, setMaterials] = useState<string>(product?.materials?.join(", ") || "")

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      brand: product?.brand || "",
      price: product?.price || 0,
      description: product?.description || "",
      materials: product?.materials || [],
      stock: product?.stock || 0,
      category: product?.category || "",
      rating: product?.rating || 0,
      featured: product?.featured || false,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File, productId: string) => {
    const storageRef = ref(storage, `products/${productId}/${file.name}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true)
      
      let imageUrl = product?.imageUrl || ""
      
      // Upload new image if one was selected
      if (imageFile) {
        const productId = product?.id || Date.now().toString()
        imageUrl = await uploadImage(imageFile, productId)
      }
      
      // Delete old image if it was replaced
      if (product?.imageUrl && imageFile && product.imageUrl !== imageUrl) {
        const oldImageRef = ref(storage, product.imageUrl)
        await deleteObject(oldImageRef).catch(console.error)
      }
      
      const materialsArray = materials.split(",").map(m => m.trim()).filter(m => m)
      
      const productData: Product = {
        ...data,
        materials: materialsArray,
        imageUrl,
        id: product?.id || Date.now().toString(),
        createdAt: product?.createdAt || Date.now(),
        updatedAt: Date.now(),
        reviewCount: product?.reviewCount || 0
      }
      
      await saveProduct(productData)
      onSaved()
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Materials (comma separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cotton, Polyester, etc."
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.materials?.message}</FormMessage>
            </FormItem>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Product Image</FormLabel>
              <div className="mt-2 flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button type="button" variant="outline">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Enter rating"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}