"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getAllContactMessages, updateMessageStatus, addAdminNotes } from "@/lib/contact"
import { formatDate } from "@/lib/utils"
import { Search, Eye, MessageSquare, Mail, Phone } from "lucide-react"
import type { ContactMessage } from "@/lib/contact"

export function AdminMessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, statusFilter, messages])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const fetchedMessages = await getAllContactMessages()
      setMessages(fetchedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...messages]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((message) => message.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (message) =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.subject?.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query),
      )
    }

    setFilteredMessages(result)
  }

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    setAdminNotes(message.adminNotes || "")
    setIsViewDialogOpen(true)

    // Mark as read if it's unread
    if (message.status === "unread") {
      try {
        await updateMessageStatus(message.id!, "read")
        setMessages(messages.map((m) => (m.id === message.id ? { ...m, status: "read" } : m)))
      } catch (error) {
        console.error("Error updating message status:", error)
      }
    }
  }

  const handleStatusChange = async (messageId: string, status: ContactMessage["status"]) => {
    try {
      await updateMessageStatus(messageId, status)
      setMessages(messages.map((m) => (m.id === messageId ? { ...m, status } : m)))

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status })
      }

      toast({
        title: "Status updated",
        description: `Message status has been updated to ${status}.`,
      })
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedMessage) return

    try {
      setIsSavingNotes(true)
      await addAdminNotes(selectedMessage.id!, adminNotes)

      // Update local state
      const updatedMessage = { ...selectedMessage, adminNotes, status: "replied" as const }
      setSelectedMessage(updatedMessage)
      setMessages(messages.map((m) => (m.id === selectedMessage.id ? updatedMessage : m)))

      toast({
        title: "Notes saved",
        description: "Admin notes have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving admin notes:", error)
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingNotes(false)
    }
  }

  const getStatusBadgeVariant = (status: ContactMessage["status"]) => {
    switch (status) {
      case "unread":
        return "destructive"
      case "read":
        return "secondary"
      case "replied":
        return "success"
      default:
        return "outline"
    }
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchQuery("")
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== "all" || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
              Clear Filters
            </Button>
          )}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-[300px]"
          />
        </div>
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
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject || "No subject"}</TableCell>
                    <TableCell>{formatDate(message.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(message.status) as any}>{message.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="bg-muted p-3 rounded-md space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedMessage.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Message Details</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">
                        Received: {formatDate(selectedMessage.timestamp)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Subject: {selectedMessage.subject || "No subject"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Status:</span>
                        <Select
                          value={selectedMessage.status}
                          onValueChange={(value) =>
                            handleStatusChange(selectedMessage.id!, value as ContactMessage["status"])
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes or response details..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSaveNotes} disabled={isSavingNotes}>
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
