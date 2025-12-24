"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/firebase/auth-context"
import { getAllUsers, promoteToAdmin, demoteFromAdmin } from "@/lib/firebase/admin-users"
import { formatDate } from "@/lib/utils"
import { Search, ShieldCheck, ShieldOff } from "lucide-react"
import type { User } from "@/lib/types"

export function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user: currentUser } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handlePromoteUser = async (userId: string) => {
    if (!currentUser) return

    try {
      const success = await promoteToAdmin(userId, currentUser.uid)

      if (success) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: "admin" } : user)))
        toast({
          title: "User promoted",
          description: "User has been promoted to admin.",
        })
      }
    } catch (error) {
      console.error("Error promoting user:", error)
      toast({
        title: "Error",
        description: "Failed to promote user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDemoteUser = async (userId: string) => {
    if (!currentUser) return

    if (userId === currentUser.uid) {
      toast({
        title: "Action not allowed",
        description: "You cannot demote yourself from admin.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await demoteFromAdmin(userId, currentUser.uid)

      if (success) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: "user" } : user)))
        toast({
          title: "User demoted",
          description: "Admin privileges have been removed from the user.",
        })
      }
    } catch (error) {
      console.error("Error demoting user:", error)
      toast({
        title: "Error",
        description: "Failed to demote user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#171212] text-3xl font-bold">Customers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#82686a]" />
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#f4f1f1] border-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#e4dddd] overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-[#171212]">{user.name}</TableCell>
                  <TableCell className="text-[#82686a]">{user.email}</TableCell>
                  <TableCell className="text-[#82686a]">5</TableCell>
                  <TableCell className="text-[#82686a]">$250</TableCell>
                  <TableCell className="text-[#82686a]">{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}