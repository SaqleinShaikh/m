"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Plus, Search, Filter, Building, Mail } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  designation: string
  organization: string
  testimonial: string
  image: string
  rating: number
  approved: boolean
  email: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("All")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageConsent, setImageConsent] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    email: "",
    designation: "",
    organization: "",
    testimonial: "",
    image: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
      setTestimonials(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const organizations = ["All", ...Array.from(new Set(testimonials.map((t) => t.organization)))]
  const approvedTestimonials = testimonials.filter((t) => t.approved)

  const filteredTestimonials = approvedTestimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganization = selectedOrganization === "All" || testimonial.organization === selectedOrganization
    return matchesSearch && matchesOrganization
  })

  const displayedTestimonials = showAllTestimonials ? filteredTestimonials : approvedTestimonials.slice(0, 6)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg)/)) {
        alert("Please upload only JPG or JPEG images")
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.email || !newTestimonial.testimonial) {
      alert("Please fill in all required fields (Name, Email, and Testimonial)")
      return
    }
    if (!imageFile && !imageConsent) {
      alert("Please either upload your profile image or provide consent to use your image from social media")
      return
    }

    setIsSubmitting(true)
    try {
      const imageUrl = imageFile ? imagePreview : ""
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTestimonial, image: imageUrl, rating: 5, approved: false })
      })
      const data = await response.json()
      if (response.ok) {
        setSubmitSuccess(true)
        setNewTestimonial({ name: "", email: "", designation: "", organization: "", testimonial: "", image: "" })
        setImageFile(null)
        setImagePreview("")
        setImageConsent(false)
        fetchTestimonials()
      } else {
        alert(`Failed to submit: ${data.details || data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert("Failed to submit testimonial. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    )
  }

  if (showAllTestimonials) {
    return (
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold font-serif text-primary mb-4">All Testimonials</h2>
              <p className="text-lg text-muted-foreground">What colleagues and clients say about my work</p>
            </div>
            <Button onClick={() => setShowAllTestimonials(false)} variant="outline">
              Back to Main
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                {organizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* All Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{testimonial.name}</h3>
                      <p className="text-sm text-accent font-medium">{testimonial.designation}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{testimonial.organization}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">{renderStars(testimonial.rating)}</div>

                  <p className="text-sm text-foreground leading-relaxed italic">"{testimonial.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-primary mb-4">Testimonials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What colleagues and clients say about my work and professional approach
          </p>
        </div>

        {/* Add Testimonial Button */}
        <div className="flex justify-center mb-12">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-primary">Add Your Testimonial</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">

                {/* Success state */}
                {submitSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Testimonial Submitted!</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Thank you for sharing your experience. Your testimonial has been sent for review and a confirmation email has been sent to you. It will appear on the website once approved.
                    </p>
                    <button
                      onClick={() => { setSubmitSuccess(false); setIsAddModalOpen(false) }}
                      className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors font-medium mx-auto"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="testimonial-name"
                      placeholder="Your full name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="testimonial-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={newTestimonial.email}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, email: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-designation" className="text-sm font-medium">Designation</Label>
                    <Input
                      id="testimonial-designation"
                      placeholder="Your job title"
                      value={newTestimonial.designation}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, designation: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-organization" className="text-sm font-medium">Organization</Label>
                    <Input
                      id="testimonial-organization"
                      placeholder="Company name"
                      value={newTestimonial.organization}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, organization: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonial-image" className="text-sm font-medium">Profile Image (JPG/JPEG only)</Label>
                  <Input
                    id="testimonial-image"
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={handleImageChange}
                    className="mt-2"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a JPG or JPEG image (max 5MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonial-content" className="text-sm font-medium">Your Testimonial *</Label>
                  <Textarea
                    id="testimonial-content"
                    placeholder="Share your experience working with Saqlein... (max 200 words)"
                    value={newTestimonial.testimonial}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial: e.target.value })}
                    rows={6}
                    maxLength={1000}
                    className="resize-none mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {newTestimonial.testimonial.length}/1000 characters
                  </p>
                </div>

                {!imageFile && newTestimonial.testimonial.length > 0 && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg blur-sm"></div>
                      <div className="relative flex items-start gap-3 p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-lg shadow-md">
                        <input
                          type="checkbox"
                          id="image-consent"
                          checked={imageConsent}
                          onChange={(e) => setImageConsent(e.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-2 border-amber-400 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 cursor-pointer"
                        />
                        <div className="flex-1">
                          <Label htmlFor="image-consent" className="text-sm font-medium cursor-pointer text-amber-900 dark:text-amber-100 leading-relaxed">
                            I authorize Saqlein Shaikh to use my profile image from LinkedIn or other social media platforms to display alongside my testimonial on this website.
                          </Label>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic pl-1">
                      💡 Tip: Upload your image above to skip this consent
                    </p>
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-accent mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Note:</p>
                      <p>
                        Your testimonial will be sent to Saqlein for approval. Only approved testimonials will appear on
                        the website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmitTestimonial}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Please wait...
                      </span>
                    ) : "Submit for Approval"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="flex-1">
                    Cancel
                  </Button>
                </div>
                </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-primary">{testimonial.name}</h3>
                    <p className="text-sm text-accent font-medium">{testimonial.designation}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{testimonial.organization}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">{renderStars(testimonial.rating)}</div>

                <p className="text-sm text-foreground leading-relaxed italic">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show All Testimonials Button */}
        <div className="text-center">
          <Button onClick={() => setShowAllTestimonials(true)} variant="outline" size="lg">
            Show All Testimonials
          </Button>
        </div>
      </div>
    </section>
  )
}
