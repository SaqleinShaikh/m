"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Mail, Lock, CheckCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("saqleinsheikh43@gmail.com")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "https://www.linkedin.com/in/saqlein-shaikh",
    github: "https://github.com/saqleinshaikh",
    twitter: ""
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      // Load saved email from localStorage
      const savedEmail = localStorage.getItem("adminEmail")
      if (savedEmail) {
        setAdminEmail(savedEmail)
      }
      fetchSocialLinks()
    }
  }, [router])

  const fetchSocialLinks = async () => {
    try {
      const resp = await fetch('/api/social-links')
      const data = await resp.json()
      setSocialLinks(prev => ({
        ...prev,
        ...data
      }))
    } catch(err) {
      console.error(err)
    }
  }

  const handleUpdateSocials = async () => {
    try {
      await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks)
      })
      setSuccess("Social links updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch(err) {
      setError("Failed to update social links")
    }
  }

  const handleUpdateEmail = () => {
    if (!adminEmail || !adminEmail.includes("@")) {
      setError("Please enter a valid email address")
      return
    }
    
    localStorage.setItem("adminEmail", adminEmail)
    setSuccess("Email updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleUpdatePassword = () => {
    setError("")
    
    if (currentPassword !== "S@qlein050505") {
      setError("Current password is incorrect")
      return
    }
    
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    // In production, this would update the password in a database
    setSuccess("Password updated successfully!")
    setNewPassword("")
    setConfirmPassword("")
    setCurrentPassword("")
    setTimeout(() => setSuccess(""), 3000)
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your admin account settings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Admin Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">
                  This email will be used for password recovery and receiving notifications
                </p>
              </div>
              <Button onClick={handleUpdateEmail}>
                <Save className="h-4 w-4 mr-2" />
                Update Email
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-2"
                />
              </div>
              <Button onClick={handleUpdatePassword}>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Social Links Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-linkedin" className="text-sm font-medium">LinkedIn</Label>
                <Input
                  id="social-linkedin"
                  type="text"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-github" className="text-sm font-medium">GitHub</Label>
                <Input
                  id="social-github"
                  type="text"
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-twitter" className="text-sm font-medium">Twitter / X</Label>
                <Input
                  id="social-twitter"
                  type="text"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="mt-2"
                />
              </div>
              <Button onClick={handleUpdateSocials}>
                <Save className="h-4 w-4 mr-2" />
                Save Social Links
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
