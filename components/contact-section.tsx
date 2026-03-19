"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "https://www.linkedin.com/in/saqlein-shaikh"
  })

  // Fetch social links on mount
  useEffect(() => {
    fetch('/api/social-links')
      .then(res => res.json())
      .then(data => {
        if (data && data.linkedin) {
          setSocialLinks(prev => ({ ...prev, ...data }))
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error('Contact form error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
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
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {socialLinks.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
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
                    <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-2 h-12 border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-2 h-12 border-accent/20 focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-semibold">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project, opportunity, or just say hello..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    maxLength={1000}
                    className="mt-2 resize-none border-accent/20 focus:border-accent p-4 text-base leading-relaxed"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${formData.message.length >= 950 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className="w-full h-14 text-lg bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-accent-foreground transition-all shadow-lg font-medium"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
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
