"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Plus, Search, Filter, Building, Mail } from "lucide-react"

interface Endorsement {
  id: string
  name: string
  designation: string
  organization: string
  endorsement: string
  image: string
  rating: number
  approved: boolean
  email: string
  created_at?: string
}

function EndorsementCard({ endorsement }: { endorsement: Endorsement }) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/95 backdrop-blur-sm border-accent/20 overflow-hidden relative flex flex-col h-full">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-70"></div>
      
      <CardContent className="p-6 flex flex-col flex-1">
        {/* Header: Photo + Info + Date */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div className="flex items-center gap-4">
            {/* Avatar with fallback */}
            <div className="relative flex-shrink-0">
              {endorsement.image && endorsement.image.length > 20 ? (
                <img
                  src={endorsement.image}
                  alt={endorsement.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-accent/20 shadow-sm bg-muted flex items-center justify-center text-xs"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                    target.nextElementSibling?.classList.add('flex');
                  }}
                />
              ) : null}
              <div 
                className={`w-14 h-14 rounded-full border-2 border-accent/20 shadow-sm bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground items-center justify-center text-xl font-bold ${(!endorsement.image || endorsement.image.length <= 20) ? 'flex' : 'hidden'}`}
              >
                {endorsement.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {/* Name and Title */}
            <div>
              <h3 className="font-bold text-foreground text-lg leading-tight">{endorsement.name}</h3>
              {endorsement.designation && (
                <p className="text-sm text-primary font-medium mt-0.5">{endorsement.designation}</p>
              )}
              {endorsement.organization && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{endorsement.organization}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date (Right aligned) */}
          {endorsement.created_at && (
            <div className="text-xs text-muted-foreground whitespace-nowrap pt-1">
              {new Date(endorsement.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {renderStars(endorsement.rating || 5)}
        </div>

        {/* Quote content */}
        <div className="relative flex-1">
          <svg className="absolute -top-2 -left-2 w-6 h-6 text-accent/20 transform -translate-x-1 -translate-y-1" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="text-sm text-foreground/90 leading-relaxed italic relative z-10 pl-6">
            "{endorsement.endorsement}"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EndorsementsSection() {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllEndorsements, setShowAllEndorsements] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("All")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageConsent, setImageConsent] = useState(false)
  const [newEndorsement, setNewEndorsement] = useState({
    name: "",
    email: "",
    designation: "",
    organization: "",
    endorsement: "",
    image: "",
  })

  useEffect(() => {
    fetchEndorsements()
  }, [])

  const fetchEndorsements = async () => {
    try {
      const response = await fetch('/api/endorsements')
      const data = await response.json()
      setEndorsements(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch endorsements:', error)
      setEndorsements([])
    } finally {
      setLoading(false)
    }
  }

  const organizations = ["All", ...Array.from(new Set(endorsements.map((t) => t.organization)))]
  const approvedEndorsements = endorsements.filter((t) => t.approved)

  const filteredEndorsements = approvedEndorsements.filter((endorsement) => {
    const matchesSearch =
      endorsement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endorsement.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endorsement.endorsement.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganization = selectedOrganization === "All" || endorsement.organization === selectedOrganization
    return matchesSearch && matchesOrganization
  })

  const displayedEndorsements = showAllEndorsements ? filteredEndorsements : approvedEndorsements.slice(0, 6)

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

  const handleSubmitEndorsement = async () => {
    if (!newEndorsement.name || !newEndorsement.email || !newEndorsement.endorsement) {
      alert("Please fill in all required fields (Name, Email, and Endorsement)")
      return
    }
    if (!imageFile && !imageConsent) {
      alert("Please either upload your profile image or provide consent to use your image from social media")
      return
    }

    setIsSubmitting(true)
    try {
      const imageUrl = imageFile ? imagePreview : ""
      const response = await fetch('/api/endorsements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEndorsement, image: imageUrl, rating: 5, approved: false })
      })
      const data = await response.json()
      if (response.ok) {
        setSubmitSuccess(true)
        setNewEndorsement({ name: "", email: "", designation: "", organization: "", endorsement: "", image: "" })
        setImageFile(null)
        setImagePreview("")
        setImageConsent(false)
        fetchEndorsements()
      } else {
        alert(`Failed to submit: ${data.details || data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert("Failed to submit endorsement. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Stars logic moved to EndorsementCard 

  if (loading) {
    return (
      <section id="endorsements" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading endorsements...</p>
        </div>
      </section>
    )
  }

  if (showAllEndorsements) {
    return (
      <section id="endorsements" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold font-serif text-primary mb-4">All Endorsements</h2>
              <p className="text-lg text-muted-foreground">What colleagues and clients say about my work</p>
            </div>
            <Button onClick={() => setShowAllEndorsements(false)} variant="outline">
              Back to Main
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search endorsements..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEndorsements.map((endorsement) => (
              <EndorsementCard key={endorsement.id} endorsement={endorsement} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="endorsements" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-primary mb-4">Endorsements</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What colleagues and clients say about my work and professional approach
          </p>
        </div>

        {/* Add Endorsement Button */}
        <div className="flex justify-center mb-12">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Endorsement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto px-4 sm:px-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-primary sm:text-3xl mt-4 sm:mt-0">Add Your Endorsement</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pb-6">

                {/* Success state */}
                {submitSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Endorsement Submitted!</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Thank you for sharing your experience. Your endorsement has been sent for review and a confirmation email has been sent to you. It will appear on the website once approved.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="endorsement-name" className="text-sm font-semibold">Full Name *</Label>
                    <Input
                      id="endorsement-name"
                      placeholder="Your full name"
                      value={newEndorsement.name}
                      onChange={(e) => setNewEndorsement({ ...newEndorsement, name: e.target.value })}
                      className="mt-2 h-11 border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endorsement-email" className="text-sm font-semibold">Email Address *</Label>
                    <Input
                      id="endorsement-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={newEndorsement.email}
                      onChange={(e) => setNewEndorsement({ ...newEndorsement, email: e.target.value })}
                      className="mt-2 h-11 border-accent/20 focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="endorsement-designation" className="text-sm font-semibold">Designation</Label>
                    <Input
                      id="endorsement-designation"
                      placeholder="Your job title"
                      value={newEndorsement.designation}
                      onChange={(e) => setNewEndorsement({ ...newEndorsement, designation: e.target.value })}
                      className="mt-2 h-11 border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endorsement-organization" className="text-sm font-semibold">Organization</Label>
                    <Input
                      id="endorsement-organization"
                      placeholder="Company name"
                      value={newEndorsement.organization}
                      onChange={(e) => setNewEndorsement({ ...newEndorsement, organization: e.target.value })}
                      className="mt-2 h-11 border-accent/20 focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="endorsement-image" className="text-sm font-semibold">Profile Image (JPG/JPEG only)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="endorsement-image"
                      type="file"
                      accept=".jpg,.jpeg"
                      onChange={handleImageChange}
                      className="mt-2 text-sm border-accent/20 file:border-0 file:bg-accent/10 file:text-accent file:px-4 file:py-1 file:-mr-4 file:rounded-md cursor-pointer h-12"
                    />
                    {imagePreview && (
                      <div className="flex-shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-accent" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a JPG or JPEG image (max 5MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endorsement-content" className="text-sm font-semibold">Your Endorsement *</Label>
                  <Textarea
                    id="endorsement-content"
                    placeholder="Share your experience working with Saqlein... (max 200 words)"
                    value={newEndorsement.endorsement}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, endorsement: e.target.value })}
                    rows={5}
                    maxLength={1000}
                    className="resize-none mt-2 border-accent/20 focus:border-accent p-3 sm:p-4 text-base leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${newEndorsement.endorsement.length >= 950 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      {newEndorsement.endorsement.length}/1000
                    </span>
                  </div>
                </div>

                {!imageFile && newEndorsement.endorsement.length > 0 && (
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
                            I authorize Saqlein Shaikh to use my profile image from LinkedIn or other social media platforms to display alongside my endorsement on this website.
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
                        Your endorsement will be sent to Saqlein for approval. Only approved endorsements will appear on
                        the website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                  <Button
                    onClick={handleSubmitEndorsement}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 h-12 text-base font-medium order-1 sm:order-2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground transition-all"
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
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="w-full sm:flex-1 h-12 text-base order-2 sm:order-1">
                    Cancel
                  </Button>
                </div>
                </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch">
          {displayedEndorsements.map((endorsement) => (
            <EndorsementCard key={endorsement.id} endorsement={endorsement} />
          ))}
        </div>

        {/* Show All Endorsements Button */}
        <div className="text-center">
          <Button onClick={() => setShowAllEndorsements(true)} variant="outline" size="lg">
            Show All Endorsements
          </Button>
        </div>
      </div>
    </section>
  )
}
