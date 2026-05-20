"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, CheckCircle, Sparkles, User, Briefcase, Building2, MessageSquareHeart, Send, ShieldCheck, Camera, ImagePlus } from "lucide-react"

export default function EndorsePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
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

  const handleGenerateAI = async () => {
    if (!newEndorsement.endorsement || newEndorsement.endorsement.length < 5) {
      alert("Please enter a few words about your experience first so the AI can expand on it!")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-endorsement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newEndorsement.endorsement })
      })

      const data = await response.json()
      if (response.ok) {
        setNewEndorsement({ ...newEndorsement, endorsement: data.generatedText })
      } else {
        alert(data.error || "Failed to generate AI response")
      }
    } catch (error) {
      alert("Failed to connect to AI service. Please make sure the AI API key is configured.")
    } finally {
      setIsGenerating(false)
    }
  }

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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000" />

        <Card className="max-w-lg w-full text-center border-green-500/20 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl z-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />
          <CardContent className="pt-12 pb-10 px-8 sm:px-12 space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/20 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-200/50 dark:border-green-800/50 relative">
              <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping opacity-20" />
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2.5} />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-200 tracking-tight">
                Endorsement Sent!
              </h2>
              <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
                Thank you so much for sharing your experience. Your endorsement has been sent to Saqlein for review.
              </p>
            </div>

            <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/10 backdrop-blur-sm">
              <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                You will receive an email once it is approved and beautifully published on the website!
              </p>
            </div>

            <div className="pt-6">
              <Button
                onClick={() => router.push('/')}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary py-6 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl group"
              >
                Return to Portfolio
                <Sparkles className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 py-16 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-14 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6 shadow-inner ring-1 ring-primary/20 backdrop-blur-md">
            <MessageSquareHeart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
            Share Your Experience
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl mx-auto font-medium">
            Your insights and kind words mean a lot. Please use the form below to submit your professional endorsement.
          </p>
        </div>

        <Card className="backdrop-blur-2xl bg-card/60 border border-white/10 dark:border-white/5 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="bg-gradient-to-b from-muted/30 to-transparent border-b border-border/40 px-8 py-8 items-center text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Endorsement Details</CardTitle>
            <CardDescription className="text-base text-muted-foreground/80 mt-2 max-w-md mx-auto">
              This information will be beautifully featured on my portfolio website.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-10">
            <form onSubmit={handleSubmitEndorsement} className="space-y-8">

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5 group">
                  <Label htmlFor="endorsement-name" className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" /> Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endorsement-name"
                    placeholder=""
                    value={newEndorsement.name}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, name: e.target.value })}
                    className="h-12 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/40 transition-all hover:border-primary/50 shadow-sm rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2.5 group">
                  <Label htmlFor="endorsement-email" className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" /> Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endorsement-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={newEndorsement.email}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, email: e.target.value })}
                    className="h-12 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/40 transition-all hover:border-primary/50 shadow-sm rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5 group">
                  <Label htmlFor="endorsement-designation" className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                    <Briefcase className="w-4 h-4" /> Job Title
                  </Label>
                  <Input
                    id="endorsement-designation"
                    placeholder="E.g. Senior Project Manager"
                    value={newEndorsement.designation}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, designation: e.target.value })}
                    className="h-12 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/40 transition-all hover:border-primary/50 shadow-sm rounded-xl"
                  />
                </div>
                <div className="space-y-2.5 group">
                  <Label htmlFor="endorsement-organization" className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                    <Building2 className="w-4 h-4" /> Organization
                  </Label>
                  <Input
                    id="endorsement-organization"
                    placeholder="E.g. TechCorp Solutions"
                    value={newEndorsement.organization}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, organization: e.target.value })}
                    className="h-12 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/40 transition-all hover:border-primary/50 shadow-sm rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3 p-5 rounded-2xl bg-muted/20 border border-muted-foreground/10">
                <Label htmlFor="endorsement-image" className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <Camera className="w-4 h-4" /> Profile Photo <span className="text-xs text-muted-foreground font-normal ml-2">(JPG/JPEG only, Max 5MB)</span>
                </Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
                  <div className="relative group/avatar cursor-pointer">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden bg-background/50 transition-all group-hover/avatar:border-primary/80 group-hover/avatar:bg-primary/5">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="w-8 h-8 text-muted-foreground/40 group-hover/avatar:text-primary/60 transition-colors" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <Input
                      id="endorsement-image"
                      type="file"
                      accept=".jpg,.jpeg"
                      onChange={handleImageChange}
                      className="h-12 text-sm border-input/40 file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:px-4 file:py-1 file:rounded-full file:mr-4 hover:file:bg-primary/20 cursor-pointer bg-background/50 shadow-sm rounded-xl w-full transition-all hover:border-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2.5 group">
                <Label htmlFor="endorsement-content" className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                  <MessageSquareHeart className="w-4 h-4" /> Your Message <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="endorsement-content"
                    placeholder="Share a few thoughts about working together... (the AI tool connects your thoughts into a professional summary!)"
                    value={newEndorsement.endorsement}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, endorsement: e.target.value })}
                    rows={6}
                    maxLength={1000}
                    className="resize-none h-36 md:h-44 text-base p-5 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/40 transition-all hover:border-primary/50 shadow-sm rounded-2xl pb-14 leading-relaxed"
                    required
                  />
                  <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center pointer-events-none">
                    <span className={`text-xs ml-2 px-2 py-1 rounded-md backdrop-blur-md ${newEndorsement.endorsement.length >= 950 ? 'bg-destructive/10 text-destructive font-bold' : 'bg-background/80 text-muted-foreground font-medium'}`}>
                      {newEndorsement.endorsement.length} / 1000
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleGenerateAI}
                      disabled={isGenerating || newEndorsement.endorsement.length === 0}
                      className="rounded-full shadow-md bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/20 transition-all pointer-events-auto group/btn pl-3 pr-4 h-9"
                      title="Enhance your message with AI"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                          <span className="font-semibold text-sm">AI Enhance</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Consent Box */}
              {!imageFile && newEndorsement.endorsement.length > 0 && (
                <div className="animate-fade-in-up bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-5 rounded-2xl border border-amber-500/20 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        id="image-consent"
                        checked={imageConsent}
                        onChange={(e) => setImageConsent(e.target.checked)}
                        className="h-5 w-5 rounded border-amber-400/50 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0 cursor-pointer transition-all hover:border-amber-400"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="image-consent" className="text-sm cursor-pointer text-amber-900/90 dark:text-amber-100/90 leading-relaxed font-medium block">
                        I authorize to use my profile image from LinkedIn or other professional social media platforms to beautifully display alongside my endorsement.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Note */}
              <div className="bg-primary/5 p-5 rounded-2xl flex items-start gap-3 border border-primary/10 shadow-inner">
                <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-sm text-foreground/80 leading-relaxed">
                  <p className="font-semibold text-foreground mb-1">Secure & Moderated</p>
                  <p>Your endorsement will be securely sent for review. Only vetted and approved endorsements will appear live on the portfolio website.</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 md:h-16 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-4 focus-visible:ring-primary/30 rounded-2xl group overflow-hidden relative"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />

                  {isSubmitting ? (
                    <span className="flex items-center gap-3 relative z-10">
                      <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-b-transparent rounded-full" />
                      Submitting your words...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                      Submit Endorsement <Send className="w-5 h-5 ml-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
