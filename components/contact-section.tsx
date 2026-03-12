"use client"

import type React from "react"
import emailjs from "@emailjs/browser"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, Linkedin, Send, MapPin, Clock, CheckCircle } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setIsSubmitting(true)
    setError(null)

    const serviceId = "service_4vxbqfl"
    const templateId = "template_m2lnt5e"
    const publicKey = "bnqqD--4sr0yUKWfx"

    if (!serviceId || !templateId || !publicKey) {
      setError(
        "Email is not configured. Add NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in Project Settings.",
      )
      setIsSubmitting(false)
      return
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message + 'From' + formData.email,
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          to_email: "saqleinsheikh43@gmail.com",
        },
        publicKey,
      )

      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error("[v0] EmailJS send error:", err)
      setError("Failed to send message. Please try again in a moment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-primary mb-4">Contact Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's connect and discuss opportunities, collaborations, or just have a conversation about technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-serif text-primary mb-6">Get In Touch</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I'm always open to discussing new opportunities, interesting projects, or just connecting with fellow
                developers. Feel free to reach out through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Email</h4>
                  <a
                    href="mailto:saqlein.shaikh@email.com"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    saqleinsheikh43@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Phone</h4>
                  <a href="tel:+918830983065" className="text-muted-foreground hover:text-accent transition-colors">
                    +91 88309 83065
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Linkedin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">LinkedIn</h4>
                  <a
                    href="https://www.linkedin.com/in/saqlein-shaikh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    linkedin.com/in/saqlein-shaikh
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Location</h4>
                  <p className="text-muted-foreground">Nashik, Maharashtra, India</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Availability</h4>
                  <p className="text-muted-foreground">Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold font-serif text-primary mb-6">Send Me a Message</h3>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-600 text-sm">I'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project, opportunity, or just say hello..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    maxLength={1000}
                    className="mt-1 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.message.length}/1000 characters</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  By sending a message, you agree to be contacted regarding your inquiry. Your information will be kept
                  confidential.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
