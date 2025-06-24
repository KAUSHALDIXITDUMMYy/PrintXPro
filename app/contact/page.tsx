"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { submitContactMessage } from "@/lib/contact"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date(),
        status: "unread",
      })

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting contact message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to discuss a custom project? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      123 Innovation Street
                      <br />
                      Tech Park, Bangalore
                      <br />
                      Karnataka 560001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                    <p className="text-muted-foreground">+91 87654 32109</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Email</h3>
                    <p className="text-muted-foreground">info@printxpro.com</p>
                    <p className="text-muted-foreground">support@printxpro.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 text-card-foreground">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-card-foreground">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-card-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-card-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-card-foreground">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-card-foreground">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or inquiry..."
                    rows={6}
                    required
                    className="bg-background border-input resize-none"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto" size="lg">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-3 text-card-foreground">What materials do you use?</h3>
              <p className="text-muted-foreground">
                We use high-quality PLA+, ABS, PETG, and specialty materials for different applications. All materials
                are eco-friendly and safe.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-3 text-card-foreground">How long does printing take?</h3>
              <p className="text-muted-foreground">
                Printing time varies based on size and complexity. Most orders are completed within 3-7 business days.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-3 text-card-foreground">Do you offer custom designs?</h3>
              <p className="text-muted-foreground">
                Yes! We offer custom design services. Share your ideas and our team will help bring them to life.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-3 text-card-foreground">What's your return policy?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day return policy for defective items. Custom orders are non-returnable unless defective.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
