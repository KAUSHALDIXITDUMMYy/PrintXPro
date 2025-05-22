"use client"

import type React from "react"

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
    // Filter users client-side for simplicity
  }

  const handlePromoteUser = async (userId: string) => {
    if (!currentUser) return

    try {
      const success = await promoteToAdmin(userId, currentUser.uid)

      if (success) {
        // Update local state
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

    // Prevent demoting yourself
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
        // Update local state
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
      <div className="flex justify-end mb-6">
        <form onSubmit={handleSearch} className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {user.role === "admin" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDemoteUser(user.id)}
                          disabled={user.id === currentUser?.uid}
                          className="text-destructive"
                        >
                          <ShieldOff className="mr-2 h-4 w-4" />
                          Remove Admin
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handlePromoteUser(user.id)}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
