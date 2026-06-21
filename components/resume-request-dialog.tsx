"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, User, Send, CheckCircle, ShieldCheck, AlertCircle, Sparkles } from "lucide-react"

interface ResumeRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ResumeRequestDialog({ open, onOpenChange }: ResumeRequestDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim() || !email.trim() || !reason.trim()) {
      setErrorMsg("All fields are required.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/resume-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        setName("")
        setEmail("")
        setReason("")
      } else {
        setErrorMsg(data.error || "Failed to submit request. Please try again.")
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state on close after animation
    setTimeout(() => {
      setSubmitSuccess(false)
      setErrorMsg(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-card/75 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-3xl overflow-hidden p-0 gap-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
        
        {submitSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/20 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-200/50 dark:border-green-800/50 relative">
              <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping opacity-20" />
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-200 tracking-tight">
                Request Submitted!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                Thank you. Your request to download Saqlein's resume has been sent for review.
              </p>
            </div>

            <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/10 backdrop-blur-sm text-xs leading-relaxed text-foreground/80 font-bold">
              💡 The resume will be sent to your email address automatically once Saqlein approves your request.
            </div>

            <Button 
              onClick={handleClose} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground py-6 text-sm font-semibold rounded-xl shadow-lg transition-all"
            >
              Close Window
            </Button>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            <DialogHeader className="text-center sm:text-left space-y-1">
              <DialogTitle className="text-2xl font-serif font-extrabold text-foreground flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                Request Resume Download
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm font-medium">
                To download Saqlein's resume, please submit your contact details and a brief reason.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="req-name" className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <User className="w-4 h-4 text-primary" /> Full Name
                </Label>
                <Input
                  id="req-name"
                  placeholder="Eg. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="req-email" className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <Mail className="w-4 h-4 text-primary" /> Email Address
                </Label>
                <Input
                  id="req-email"
                  type="email"
                  placeholder="jane.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="req-reason" className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <Mail className="w-4 h-4 text-primary" /> Reason for Request
                </Label>
                <Textarea
                  id="req-reason"
                  placeholder="E.g., Reviewing for a Senior Mendix Developer opening at TechCorp..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="resize-none bg-background/50 border-input/40 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground rounded-xl p-3 text-sm leading-relaxed"
                  required
                />
              </div>

              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3 flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="font-semibold">{errorMsg}</p>
                </div>
              )}

              {/* Secure trust badge */}
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-xl flex items-start gap-3 border border-emerald-500/15">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">
                  <strong>Notice:</strong> The resume will be sent directly to your email address once your request is reviewed and approved by Saqlein.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 h-11 rounded-xl text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 h-11 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
