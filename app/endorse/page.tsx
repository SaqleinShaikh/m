"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export default function EndorsePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.match(/image\/(jpeg|jpg)/)) {
        alert("Please upload only JPG or JPEG images")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitEndorsement = async (e: React.FormEvent) => {
    e.preventDefault()
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
      } else {
        alert(`Failed to submit: ${data.details || data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert("Failed to submit endorsement. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-green-200 bg-green-50 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-green-900">Endorsement Submitted!</h2>
            <p className="text-green-800 text-sm max-w-sm mx-auto leading-relaxed">
              Thank you for sharing your experience. Your endorsement has been sent to Saqlein for review. You will receive an email once it is approved and published on the website.
            </p>
            <p className="text-green-800 text-sm max-w-sm mx-auto leading-relaxed mt-2 font-medium">
              If you'd like to know more about me, feel free to visit my portfolio website below!
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => router.push('/')}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 py-6 text-base shadow-lg"
              >
                Visit Saqlein's Portfolio Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 text-primary animate-fade-in-down">
          <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Add Your Endorsement</h1>
          <p className="text-lg text-muted-foreground">
            Share your experience working with Saqlein Shaikh
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-card/80 border-accent/20 shadow-2xl">
          <CardHeader className="bg-accent/5 border-b border-accent/10 px-8 py-6">
            <CardTitle className="text-xl">Your Details</CardTitle>
            <CardDescription>This information will be displayed alongside your endorsement.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmitEndorsement} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="endorsement-name" className="text-sm font-semibold">Full Name *</Label>
                  <Input
                    id="endorsement-name"
                    placeholder="Your full name"
                    value={newEndorsement.name}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, name: e.target.value })}
                    className="mt-2 h-11 border-accent/20 focus:border-accent"
                    required
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
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="endorsement-designation" className="text-sm font-semibold">Job Title</Label>
                  <Input
                    id="endorsement-designation"
                    placeholder="e.g., Project Manager"
                    value={newEndorsement.designation}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, designation: e.target.value })}
                    className="mt-2 h-11 border-accent/20 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endorsement-organization" className="text-sm font-semibold">Organization</Label>
                  <Input
                    id="endorsement-organization"
                    placeholder="e.g., Deloitte"
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
                <p className="text-xs text-muted-foreground">Upload a JPG or JPEG image (max 5MB)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endorsement-content" className="text-sm font-semibold">Your Endorsement *</Label>
                <Textarea
                  id="endorsement-content"
                  placeholder="Share your experience working with Saqlein... (max 1000 characters)"
                  value={newEndorsement.endorsement}
                  onChange={(e) => setNewEndorsement({ ...newEndorsement, endorsement: e.target.value })}
                  rows={6}
                  maxLength={1000}
                  className="resize-none mt-2 text-base p-4 border-accent/20 focus:border-accent leading-relaxed"
                  required
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${newEndorsement.endorsement.length >= 950 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                    {newEndorsement.endorsement.length}/1000
                  </span>
                </div>
              </div>

              {!imageFile && newEndorsement.endorsement.length > 0 && (
                <div className="space-y-2 animate-fade-in bg-amber-500/10 dark:bg-amber-500/5 p-4 rounded-lg border border-amber-500/30">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="image-consent"
                      checked={imageConsent}
                      onChange={(e) => setImageConsent(e.target.checked)}
                      className="mt-1.5 h-6 w-6 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <Label htmlFor="image-consent" className="text-sm cursor-pointer text-amber-900 dark:text-amber-100 leading-relaxed font-medium">
                        I authorize Saqlein Shaikh to use my profile image from LinkedIn or other social media platforms to display alongside my endorsement on the website.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 mt-4 border border-border">
                <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground mb-1">Approval Process</p>
                  <p>Your endorsement will be sent to Saqlein for approval. Only approved endorsements will appear on the website.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Submitting...
                    </span>
                  ) : "Submit Endorsement"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
