"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Mail, Lock, CheckCircle, Globe, Plus, Trash2, ImageIcon, Upload, Copy, Loader2, ExternalLink, Film, Video } from "lucide-react"
import { toast } from "sonner"

interface UploadedImage {
  name: string
  url: string
  size: number
  created_at?: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("saqleinsheikh43@gmail.com")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string; enabled: boolean }[]>([])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Image manager state
  const [images, setImages] = useState<UploadedImage[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Video manager state
  const [videos, setVideos] = useState<UploadedImage[]>([])
  const [videosLoading, setVideosLoading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [isDraggingVideo, setIsDraggingVideo] = useState(false)
  const [deleteVideoConfirm, setDeleteVideoConfirm] = useState<string | null>(null)
  const [videoUploadProgress, setVideoUploadProgress] = useState('')
  const videoFileInputRef = useRef<HTMLInputElement>(null)
  const videoDropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      const savedEmail = localStorage.getItem("adminEmail")
      if (savedEmail) {
        setAdminEmail(savedEmail)
      }
      fetchSocialLinks()
      fetchImages()
      fetchVideos()
    }
  }, [router])

  const fetchImages = async () => {
    setImagesLoading(true)
    try {
      const resp = await fetch('/api/upload-image')
      const data = await resp.json()
      if (Array.isArray(data)) {
        setImages(data)
      }
    } catch (err) {
      console.error('Failed to fetch images:', err)
    } finally {
      setImagesLoading(false)
    }
  }

  const fetchVideos = async () => {
    setVideosLoading(true)
    try {
      const resp = await fetch('/api/upload-video')
      const data = await resp.json()
      if (Array.isArray(data)) setVideos(data)
    } catch (err) {
      console.error('Failed to fetch videos:', err)
    } finally {
      setVideosLoading(false)
    }
  }

  const uploadVideoFiles = async (files: File[]) => {
    const videoFiles = files.filter(f => f.type.startsWith('video/'))
    if (videoFiles.length === 0) {
      toast.error('Please select video files only (MP4, WebM, MOV, etc.)')
      return
    }
    const oversized = videoFiles.filter(f => f.size > 50 * 1024 * 1024)
    if (oversized.length > 0) {
      toast.error(`Files too large (max 50 MB): ${oversized.map(f => f.name).join(', ')}`)
      return
    }
    setUploadingVideo(true)
    let successCount = 0
    let failCount = 0
    for (const file of videoFiles) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setVideoUploadProgress(`Uploading "${file.name}" (${sizeMB} MB)...`)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const resp = await fetch('/api/upload-video', { method: 'POST', body: formData })
        if (resp.ok) successCount++
        else failCount++
      } catch { failCount++ }
    }
    setUploadingVideo(false)
    setVideoUploadProgress('')
    if (successCount > 0) {
      toast.success(`${successCount} video${successCount > 1 ? 's' : ''} uploaded successfully`)
      await fetchVideos()
    }
    if (failCount > 0) toast.error(`${failCount} video${failCount > 1 ? 's' : ''} failed to upload`)
  }

  const handleDeleteVideo = async (name: string) => {
    try {
      const resp = await fetch(`/api/upload-video?name=${encodeURIComponent(name)}`, { method: 'DELETE' })
      if (resp.ok) {
        setVideos(prev => prev.filter(v => v.name !== name))
        toast.success('Video deleted')
      } else {
        toast.error('Failed to delete video')
      }
    } catch {
      toast.error('Failed to delete video')
    } finally {
      setDeleteVideoConfirm(null)
    }
  }

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      toast.error('Please select image files only')
      return
    }

    setUploading(true)
    let successCount = 0
    let failCount = 0

    for (const file of imageFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const resp = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })
        if (resp.ok) {
          successCount++
        } else {
          failCount++
        }
      } catch {
        failCount++
      }
    }

    setUploading(false)
    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully`)
      await fetchImages()
    }
    if (failCount > 0) {
      toast.error(`${failCount} image${failCount > 1 ? 's' : ''} failed to upload`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      uploadFiles(files)
    }
    // Reset input so same file can be re-uploaded
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    uploadFiles(files)
  }, [])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL copied to clipboard!')
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      toast.success('URL copied to clipboard!')
    }
  }

  const handleDeleteImage = async (name: string) => {
    try {
      const resp = await fetch(`/api/upload-image?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      })
      if (resp.ok) {
        setImages(prev => prev.filter(img => img.name !== name))
        toast.success('Image deleted')
      } else {
        toast.error('Failed to delete image')
      }
    } catch {
      toast.error('Failed to delete image')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const fetchSocialLinks = async () => {
    try {
      const resp = await fetch('/api/social-links?admin=true')
      const data = await resp.json()
      if (Array.isArray(data)) {
        setSocialLinks(data)
      } else if (typeof data === 'object' && data !== null) {
        const legacy = Object.entries(data).map(([platform, url]) => ({
          platform,
          url: url as string,
          enabled: true
        }))
        setSocialLinks(legacy)
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleUpdateSocials = async () => {
    try {
      const resp = await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks)
      })
      if (!resp.ok) throw new Error("Failed to save")
      setSuccess("Social links updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchSocialLinks()
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
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {socialLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No social media links added yet.</p>
                ) : (
                  socialLinks.map((link, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-border/50 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-2 min-w-[150px] w-full md:w-auto">
                        <Input
                          type="text"
                          value={link.platform}
                          onChange={(e) => {
                            const updated = [...socialLinks]
                            updated[idx].platform = e.target.value
                            setSocialLinks(updated)
                          }}
                          placeholder="Platform (e.g. github)"
                          className="font-semibold text-sm h-8"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <Input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...socialLinks]
                            updated[idx].url = e.target.value
                            setSocialLinks(updated)
                          }}
                          placeholder="https://..."
                          className="text-sm h-8"
                        />
                      </div>
                      <div className="flex items-center gap-4 self-stretch md:self-auto justify-between">
                        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={link.enabled}
                            onChange={(e) => {
                              const updated = [...socialLinks]
                              updated[idx].enabled = e.target.checked
                              setSocialLinks(updated)
                            }}
                            className="rounded border-border/60 text-primary focus:ring-primary h-4 w-4"
                          />
                          Enabled
                        </label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSocialLinks(socialLinks.filter((_, i) => i !== idx))
                          }}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Link Section */}
              <div className="border-t border-border pt-4 space-y-4">
                <h4 className="text-sm font-semibold">Add New Social Link</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    id="new-platform"
                    placeholder="Platform Name (e.g. facebook)"
                    className="flex-1"
                  />
                  <Input
                    id="new-url"
                    placeholder="https://facebook.com/..."
                    className="flex-1 sm:flex-2"
                  />
                  <Button
                    onClick={() => {
                      const platInput = document.getElementById("new-platform") as HTMLInputElement
                      const urlInput = document.getElementById("new-url") as HTMLInputElement
                      const plat = platInput?.value.trim()
                      const url = urlInput?.value.trim()
                      
                      if (!plat) {
                        alert("Please specify a platform name")
                        return
                      }
                      
                      setSocialLinks([
                        ...socialLinks,
                        { platform: plat, url: url || "", enabled: true }
                      ])
                      
                      if (platInput) platInput.value = ""
                      if (urlInput) urlInput.value = ""
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button>
                </div>
              </div>

              <Button onClick={handleUpdateSocials} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Social Links
              </Button>
            </CardContent>
          </Card>

          {/* Media Manager — Images + Videos */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5 text-purple-500" />
                Media Manager
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload images and videos, view all your media, and copy URLs to embed in blogs.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="images">
                <TabsList className="mb-4 bg-muted/40 border border-border/40">
                  <TabsTrigger value="images" className="flex items-center gap-2 data-[state=active]:text-accent">
                    <ImageIcon className="h-4 w-4" />
                    Images
                    {images.length > 0 && <span className="ml-1 text-xs opacity-60">({images.length})</span>}
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex items-center gap-2 data-[state=active]:text-purple-500">
                    <Film className="h-4 w-4" />
                    Videos
                    {videos.length > 0 && <span className="ml-1 text-xs opacity-60">({videos.length})</span>}
                  </TabsTrigger>
                </TabsList>

                {/* ── Images Tab ───────────────────────────────────────────────── */}
                <TabsContent value="images" className="space-y-5">
                  {/* Upload Drop Zone */}
                  <div
                    ref={dropZoneRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`
                      relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                      ${isDragging ? 'border-accent bg-accent/10 scale-[1.01]' : 'border-border/50 bg-muted/20 hover:border-accent/50 hover:bg-accent/5'}
                      ${uploading ? 'pointer-events-none opacity-70' : ''}
                    `}
                  >
                    {uploading ? (
                      <><Loader2 className="h-10 w-10 text-accent animate-spin" /><p className="text-sm font-medium text-muted-foreground">Uploading...</p></>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                          <Upload className="h-7 w-7 text-accent" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">Drop images here or click to browse</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF, WebP, SVG • Max 10 MB each</p>
                        </div>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  </div>

                  {/* Image Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold">Uploaded Images {images.length > 0 && <span className="ml-1 text-xs text-muted-foreground font-normal">({images.length})</span>}</h4>
                      <Button variant="ghost" size="sm" onClick={fetchImages} disabled={imagesLoading} className="text-xs h-7">
                        {imagesLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Refresh
                      </Button>
                    </div>
                    {imagesLoading ? (
                      <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 text-accent animate-spin" /></div>
                    ) : images.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No images uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {images.map((img) => (
                          <div key={img.name} className="group relative rounded-lg overflow-hidden border border-border/40 bg-muted/20 aspect-square hover:border-accent/40 transition-all duration-200 hover:shadow-md">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                              <p className="text-white text-xs font-medium text-center line-clamp-2 max-w-full px-1" title={img.name}>{img.name}</p>
                              {img.size > 0 && <p className="text-white/60 text-xs">{formatFileSize(img.size)}</p>}
                              <div className="flex gap-1 mt-1">
                                <Button size="sm" variant="secondary" className="h-7 px-2 text-xs bg-white/20 hover:bg-white/30 text-white border-0" onClick={(e) => { e.stopPropagation(); handleCopyUrl(img.url) }}>
                                  <Copy className="h-3 w-3 mr-1" />Copy URL
                                </Button>
                                <Button size="sm" variant="secondary" className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0" onClick={(e) => { e.stopPropagation(); window.open(img.url, '_blank') }}>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                {deleteConfirm === img.name ? (
                                  <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.name) }}>Confirm</Button>
                                ) : (
                                  <Button size="sm" variant="secondary" className="h-7 px-2 bg-red-500/80 hover:bg-red-500 text-white border-0" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(img.name) }}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-xs font-semibold text-accent mb-2">💡 How to use images in blogs</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Upload your image above</li>
                      <li>Hover and click <strong>Copy URL</strong></li>
                      <li>In the blog editor, click the 🖼️ Image toolbar button and paste the URL</li>
                      <li>Or paste a screenshot directly into the editor — it auto-uploads!</li>
                    </ol>
                  </div>
                </TabsContent>

                {/* ── Videos Tab ───────────────────────────────────────────────── */}
                <TabsContent value="videos" className="space-y-5">
                  {/* Video Upload Drop Zone */}
                  <div
                    ref={videoDropZoneRef}
                    onDrop={(e) => { e.preventDefault(); setIsDraggingVideo(false); uploadVideoFiles(Array.from(e.dataTransfer.files)) }}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true) }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingVideo(false) }}
                    onClick={() => !uploadingVideo && videoFileInputRef.current?.click()}
                    className={`
                      relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                      ${isDraggingVideo ? 'border-purple-500 bg-purple-500/10 scale-[1.01]' : 'border-border/50 bg-muted/20 hover:border-purple-500/50 hover:bg-purple-500/5'}
                      ${uploadingVideo ? 'pointer-events-none opacity-70' : ''}
                    `}
                  >
                    {uploadingVideo ? (
                      <>
                        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
                        <p className="text-sm font-medium text-muted-foreground text-center max-w-xs">{videoUploadProgress || 'Uploading video...'}</p>
                        <p className="text-xs text-muted-foreground">Large files may take a moment — please wait</p>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Film className="h-7 w-7 text-purple-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">Drop a video here or click to browse</p>
                          <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV, AVI, OGG • Max 50 MB</p>
                        </div>
                      </>
                    )}
                    <input ref={videoFileInputRef} type="file" accept="video/*" onChange={(e) => { const files = Array.from(e.target.files || []); if (files.length > 0) uploadVideoFiles(files); e.target.value = '' }} className="hidden" />
                  </div>

                  {/* Video Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold">Uploaded Videos {videos.length > 0 && <span className="ml-1 text-xs text-muted-foreground font-normal">({videos.length})</span>}</h4>
                      <Button variant="ghost" size="sm" onClick={fetchVideos} disabled={videosLoading} className="text-xs h-7">
                        {videosLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Refresh
                      </Button>
                    </div>
                    {videosLoading ? (
                      <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 text-purple-500 animate-spin" /></div>
                    ) : videos.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No videos uploaded yet.</p>
                        <p className="text-xs mt-1">Upload your first screen recording or demo video above.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {videos.map((vid) => (
                          <div key={vid.name} className="group relative rounded-xl overflow-hidden border border-border/40 bg-black hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg">
                            <video src={vid.url} className="w-full aspect-video object-contain bg-black" preload="metadata" />
                            <div className="p-3 bg-card/90 border-t border-border/40">
                              <p className="text-xs font-medium truncate" title={vid.name}>{vid.name}</p>
                              {vid.size > 0 && <p className="text-xs text-muted-foreground mt-0.5">{formatFileSize(vid.size)}</p>}
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs flex-1 border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-600" onClick={() => handleCopyUrl(vid.url)}>
                                  <Copy className="h-3 w-3 mr-1" />Copy URL
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 px-2 border-border/40" onClick={() => window.open(vid.url, '_blank')}>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                {deleteVideoConfirm === vid.name ? (
                                  <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => handleDeleteVideo(vid.name)}>Confirm Delete</Button>
                                ) : (
                                  <Button size="sm" variant="outline" className="h-7 px-2 border-red-500/30 hover:bg-red-500/10 hover:text-red-500" onClick={() => setDeleteVideoConfirm(vid.name)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                    <p className="text-xs font-semibold text-purple-600 mb-2">📹 How to use videos in blogs</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Upload your screen recording or demo video above (MP4 works best)</li>
                      <li>Click <strong>Copy URL</strong> on the uploaded video</li>
                      <li>In the blog editor, click the 🎬 Film button (purple) in the toolbar</li>
                      <li>The video will appear as an embedded player — visitors can play it inline</li>
                      <li>Or drag a video file directly into the editor — it auto-uploads!</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
