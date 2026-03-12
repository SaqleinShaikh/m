"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

interface EmailPromptDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  title?: string
  description?: string
}

export default function EmailPromptDialog({ 
  open, 
  onClose, 
  onSubmit,
  title = "Like this blog?",
  description = "Enter your email to like this blog post. We'll remember you for next time!"
}: EmailPromptDialogProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = () => {
    if (!email) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    onSubmit(email)
    setEmail("")
    setError("")
  }

  const handleClose = () => {
    setEmail("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-accent" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit()
                }
              }}
              className={error ? "border-red-500" : ""}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1">
              Continue
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
