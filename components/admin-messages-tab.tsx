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
      <h2 className="text-[#171212] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Customer Messages
      </h2>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-[#e4dddd]">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="h-10 text-[#171212] hover:bg-[#f4f1f1]"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#82686a]" />
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-[300px] border-[#e4dddd]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#171212]"></div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="flex overflow-hidden rounded-xl border border-[#e4dddd] bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="px-4 py-3 text-left text-[#171212] text-sm font-medium leading-normal">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-[#171212] text-sm font-medium leading-normal">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-[#171212] text-sm font-medium leading-normal">
                    Subject
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-[#171212] text-sm font-medium leading-normal">
                    Date
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-[#171212] text-sm font-medium leading-normal">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-[#171212] text-sm font-medium leading-normal">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-[#82686a]">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id} className="border-t border-t-[#e4dddd]">
                      <TableCell className="h-[72px] px-4 py-2 text-[#171212] text-sm font-normal leading-normal">
                        {message.name}
                      </TableCell>
                      <TableCell className="h-[72px] px-4 py-2 text-[#82686a] text-sm font-normal leading-normal">
                        {message.email}
                      </TableCell>
                      <TableCell className="h-[72px] px-4 py-2 text-[#82686a] text-sm font-normal leading-normal">
                        {message.subject || "No subject"}
                      </TableCell>
                      <TableCell className="h-[72px] px-4 py-2 text-[#82686a] text-sm font-normal leading-normal">
                        {formatDate(message.timestamp)}
                      </TableCell>
                      <TableCell className="h-[72px] px-4 py-2">
                        <Badge variant={getStatusBadgeVariant(message.status) as any}>
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="h-[72px] px-4 py-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewMessage(message)}
                          className="text-[#171212] hover:bg-[#f4f1f1]"
                        >
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
                    <h4 className="font-medium mb-2 text-[#171212]">Contact Information</h4>
                    <div className="bg-[#f4f1f1] p-3 rounded-md space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#82686a]" />
                        <span className="font-medium text-[#171212]">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#82686a]" />
                        <span className="text-[#82686a]">{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#82686a]" />
                          <span className="text-[#82686a]">{selectedMessage.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-[#171212]">Message Details</h4>
                    <div className="bg-[#f4f1f1] p-3 rounded-md">
                      <p className="text-sm text-[#82686a] mb-1">
                        Received: {formatDate(selectedMessage.timestamp)}
                      </p>
                      <p className="text-sm text-[#82686a] mb-2">
                        Subject: {selectedMessage.subject || "No subject"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#82686a]">Status:</span>
                        <Select
                          value={selectedMessage.status}
                          onValueChange={(value) =>
                            handleStatusChange(selectedMessage.id!, value as ContactMessage["status"])
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8 border-[#e4dddd]">
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
                  <h4 className="font-medium mb-2 text-[#171212]">Message</h4>
                  <div className="bg-[#f4f1f1] p-3 rounded-md">
                    <p className="whitespace-pre-wrap text-[#82686a]">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-[#171212]">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes or response details..."
                  rows={4}
                  className="border-[#e4dddd]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
              className="border-[#e4dddd] text-[#171212] hover:bg-[#f4f1f1]"
            >
              Close
            </Button>
            <Button 
              onClick={handleSaveNotes} 
              disabled={isSavingNotes}
              className="bg-[#171212] text-white hover:bg-[#171212]/90"
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}