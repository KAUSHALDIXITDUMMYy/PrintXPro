"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress } from "@/lib/firebase/addresses"
import { Loader2, Plus, Pencil, Trash2, Home, Building, MapPin } from "lucide-react"

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export function ProfileAddresses() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userAddresses = await getUserAddresses(user.uid)
        setAddresses(userAddresses)
      } catch (error) {
        console.error("Error fetching addresses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    })
  }

  const handleAddAddress = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address)
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteAddress = (address: Address) => {
    setSelectedAddress(address)
    setIsDeleteDialogOpen(true)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setIsSaving(true)
      const newAddress = await addUserAddress(user.uid, formData)

      // Update local state
      setAddresses((prev) => [...prev, newAddress])

      setIsAddDialogOpen(false)
      resetForm()

      toast({
        title: "Address added",
        description: "Your address has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Failed to add address",
        description: "There was an error adding your address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedAddress) return

    try {
      setIsSaving(true)
      await updateUserAddress(user.uid, selectedAddress.id, formData)

      // Update local state
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === selectedAddress.id ? { ...addr, ...formData, id: addr.id } : addr)),
      )

      setIsEditDialogOpen(false)

      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating address:", error)
      toast({
        title: "Failed to update address",
        description: "There was an error updating your address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!user || !selectedAddress) return

    try {
      setIsSaving(true)
      await deleteUserAddress(user.uid, selectedAddress.id)

      // Update local state
      setAddresses((prev) => prev.filter((addr) => addr.id !== selectedAddress.id))

      setIsDeleteDialogOpen(false)

      toast({
        title: "Address deleted",
        description: "Your address has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Failed to delete address",
        description: "There was an error deleting your address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Shipping Addresses</h2>
          <p className="text-muted-foreground">Manage your shipping addresses for faster checkout</p>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddAddress} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-6">Add your first address to make checkout easier.</p>
          <Button onClick={handleAddAddress}>Add Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 relative ${address.isDefault ? "border-primary" : ""}`}
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-start gap-3">
                {address.isDefault ? (
                  <Home className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                ) : (
                  <Building className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{address.name}</h3>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <p className="text-sm mt-2">{address.address}</p>
                  <p className="text-sm">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteAddress(address)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>Add a new shipping address to your account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update your shipping address details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea id="edit-address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input id="edit-city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input id="edit-state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pincode">PIN Code</Label>
                <Input id="edit-pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="edit-isDefault">Set as default address</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Address"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
