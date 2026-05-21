"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, CheckCircle, Sparkles, User, Briefcase, Building2, MessageSquareHeart, Send, ShieldCheck, Camera, ImagePlus, AlertCircle } from "lucide-react"

const compressProfileImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const targetSize = 150
      canvas.width = targetSize
      canvas.height = targetSize
      
      if (ctx) {
        // Draw centered and cropped square image (avatar layout)
        const minSide = Math.min(img.width, img.height)
        const sx = (img.width - minSide) / 2
        const sy = (img.height - minSide) / 2
        
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } else {
        resolve(base64Str)
      }
    }
    img.onerror = () => {
      resolve(base64Str)
    }
    img.src = base64Str
  })
}

export default function EndorsePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageConsent, setImageConsent] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [newEndorsement, setNewEndorsement] = useState({
    name: "",
    email: "",
    designation: "",
    organization: "",
    endorsement: "",
    image: "",
  })

  const fallbackTemplates = [
    {
      label: "Technical & Code Quality",
      text: "Saqlein is a fantastic developer who delivers top-tier code and solves complex engineering challenges with ease. His work has greatly improved our systems' performance and reliability.",
    },
    {
      label: "Collaboration & Teamwork",
      text: "It was a pleasure collaborating with Saqlein. He brings incredible energy to the team, excels in technical communication, and always ensures project success through strong cooperation.",
    },
    {
      label: "Creative Design & UI Polish",
      text: "Saqlein has an exceptional eye for detail and modern design. He seamlessly transformed our requirements into a highly polished, fully responsive, and user-friendly web interface.",
    },
    {
      label: "Reliable Delivery & Results",
      text: "Highly recommend Saqlein! He is incredibly dependable, communicates clearly at every milestone, and always delivers exceptional results on time.",
    }
  ]

  const handleGenerateAI = async () => {
    if (!newEndorsement.endorsement || newEndorsement.endorsement.length < 5) {
      setAiError("Please enter a few words about your experience first so the AI can expand on it!")
      return
    }

    setIsGenerating(true)
    setAiError(null)
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
        const errMsg = data.error || "Failed to generate AI response"
        console.error('[AI Enhance Error] API returned error status:', errMsg)
        
        // Auto fallback to random template
        const randomTpl = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
        setNewEndorsement({ ...newEndorsement, endorsement: randomTpl.text })
        setAiError("AI Enhance is temporarily offline. We have automatically populated a professional template for you inside the message box below!")
      }
    } catch (error: any) {
      const errMsg = error.message || "Failed to connect to AI service."
      console.error('[AI Enhance Error] Connection or execution failed:', error)
      
      // Auto fallback to random template
      const randomTpl = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
      setNewEndorsement({ ...newEndorsement, endorsement: randomTpl.text })
      setAiError("AI Enhance is temporarily offline. We have automatically populated a professional template for you inside the message box below!")
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
        const originalBase64 = reader.result as string
        compressProfileImage(originalBase64).then((compressed) => {
          setImagePreview(compressed)
          console.log('[Image Compression] Original size:', Math.round(originalBase64.length / 1024), 'KB, Compressed size:', Math.round(compressed.length / 1024), 'KB')
        })
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

            <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/10 backdrop-blur-sm space-y-3">
              <p className="text-foreground/80 text-sm leading-relaxed font-bold">
                You will receive a confirmation email shortly, and another once it is approved and published!
              </p>
              <p className="text-muted-foreground/90 text-xs leading-relaxed italic font-medium">
                💡 Tip: If you don't see our email in your inbox within a few minutes, please check your <strong>Spam</strong> folder and mark it as "Not Spam" to ensure you receive future approval updates.
              </p>
            </div>

             <div className="pt-6">
              <Button
                onClick={() => {
                  setIsNavigating(true)
                  router.push('/')
                }}
                disabled={isNavigating}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary py-6 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl group disabled:opacity-75 disabled:pointer-events-none"
              >
                {isNavigating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                    <span>Returning to Portfolio...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Return to Portfolio</span>
                    <Sparkles className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
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
                    placeholder="Eg. Saqlein Shaikh"
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
                  <MessageSquareHeart className="w-4 h-4 text-primary" /> Your Message <span className="text-destructive">*</span>
                </Label>
                <div className="space-y-3">
                  <Textarea
                    id="endorsement-content"
                    placeholder="Share a few thoughts about working together... (the AI tool connects your thoughts into a professional summary!)"
                    value={newEndorsement.endorsement}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, endorsement: e.target.value })}
                    rows={6}
                    maxLength={1000}
                    className="resize-none h-36 md:h-44 text-base p-5 bg-background/40 dark:bg-background/20 border border-border/80 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary text-foreground font-medium placeholder:text-muted-foreground/40 transition-all duration-300 hover:border-primary/50 shadow-inner rounded-2xl leading-relaxed break-words"
                    required
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5 pt-1.5">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs bg-muted/50 dark:bg-muted/20 px-3.5 py-2 rounded-full border border-border/40 font-medium text-muted-foreground w-fit shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${newEndorsement.endorsement.length >= 950 ? 'bg-destructive animate-pulse' : 'bg-primary/60'}`} />
                      <span className={newEndorsement.endorsement.length >= 950 ? 'text-destructive font-bold' : ''}>
                        {newEndorsement.endorsement.length} / 1000 characters
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAI}
                      disabled={isGenerating || newEndorsement.endorsement.length === 0}
                      className="w-full sm:w-auto rounded-full shadow-md bg-gradient-to-r from-violet-600/10 to-indigo-600/10 dark:from-violet-500/10 dark:to-indigo-500/10 hover:from-violet-600/20 hover:to-indigo-600/20 text-primary border border-primary/20 hover:border-primary/45 transition-all duration-300 group/btn pl-4 pr-5 h-9 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:hover:from-violet-600/10 disabled:hover:to-indigo-600/10 cursor-pointer"
                      title="Enhance your message with AI"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
                          <span className="font-semibold text-sm">AI Enhance</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  {aiError && (
                    <div className="space-y-4 pt-2">
                      {/* Premium Warning Alert Box */}
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm animate-fade-in-up">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                        <div className="space-y-1">
                          <p className="font-bold">AI Service Offline (Auto-Fallback Active)</p>
                          <p className="text-xs font-medium leading-relaxed">{aiError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent Box */}
              {!imageFile && newEndorsement.endorsement.length > 0 && (
                <div className="animate-fade-in-up bg-card/90 dark:bg-card/40 p-5 rounded-2xl border-2 border-amber-500/30 dark:border-amber-500/20 shadow-md backdrop-blur-md transition-all duration-300 hover:border-amber-500/50">
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        id="image-consent"
                        checked={imageConsent}
                        onChange={(e) => setImageConsent(e.target.checked)}
                        className="h-5 w-5 rounded border-amber-500/50 text-amber-600 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer transition-all hover:border-amber-500 accent-amber-600"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="image-consent" className="text-sm cursor-pointer text-amber-800 dark:text-amber-200 leading-relaxed font-bold block">
                        I authorize Saqlein Shaikh to use my profile image from LinkedIn or other professional social media platforms to beautifully display alongside my endorsement.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Note (Trust Badge) */}
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-5 rounded-2xl flex items-start gap-4 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm transition-all hover:border-emerald-500/30 duration-300">
                <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 animate-pulse" />
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed pt-0.5">
                  <p className="font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                    Secure & Moderated
                  </p>
                  <p className="text-emerald-600/90 dark:text-emerald-400/80 font-medium">Your endorsement will be securely sent for review. Only vetted and approved endorsements will appear live on the portfolio website.</p>
                </div>
              </div>

              {/* Submit Button & Layout Spacer */}
              <div className="pt-4 pb-2 mb-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 md:h-16 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/95 hover:to-accent/95 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all outline-none focus-visible:ring-4 focus-visible:ring-primary/30 rounded-2xl group overflow-hidden relative border border-white/10 cursor-pointer"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-shimmer" />

                  {isSubmitting ? (
                    <span className="flex items-center gap-3 relative z-10">
                      <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-b-transparent rounded-full" />
                      Submitting your words...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                      Submit Endorsement <Send className="w-5 h-5 ml-1.5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Mobile anti-overlap viewport helper */}
              <div className="h-10 md:hidden" />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
