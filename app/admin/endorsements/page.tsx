"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Eye, Trash2, Star, Edit, Save, Link as LinkIcon, Copy, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Endorsement {
  id: string
  name: string
  email: string
  designation: string
  organization: string
  endorsement: string
  image: string
  rating: number
  approved: boolean
  created_at: string
  updated_at: string
}

export default function AdminEndorsementsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [selectedEndorsement, setSelectedEndorsement] = useState<Endorsement | null>(null)
  const [editingEndorsement, setEditingEndorsement] = useState<Endorsement | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    designation: "",
    organization: "",
    endorsement: "",
    rating: 5,
    created_at: "",
    image: "",
  })
  const [editImagePreview, setEditImagePreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      fetchEndorsements()
    }
  }, [router])

  const fetchEndorsements = async () => {
    try {
      const response = await fetch('/api/endorsements?admin=true')
      const data = await response.json()
      setEndorsements(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch endorsements:', error)
      setEndorsements([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const endorsement = endorsements.find(t => t.id === id)
      if (!endorsement) return

      const response = await fetch('/api/endorsements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...endorsement, approved: true })
      })

      if (response.ok) {
        setEndorsements(endorsements.map(t =>
          t.id === id ? { ...t, approved: true } : t
        ))
      } else {
        const err = await response.json()
        alert(`Failed to approve: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to approve endorsement:', error)
      alert('Failed to approve endorsement. Check console for details.')
    }
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    const id = deleteConfirmId
    setDeleteConfirmId(null)
    setDeleting(id)
    try {
      console.log('Sending DELETE request for id:', id)
      const response = await fetch(`/api/endorsements?id=${id}`, {
        method: 'DELETE'
      })
      console.log('DELETE response status:', response.status)

      if (response.ok) {
        console.log('Delete successful, removing from list')
        setEndorsements(prev => prev.filter(t => t.id !== id))
      } else {
        const err = await response.json()
        console.error('Delete failed:', err)
        alert(`Failed to delete: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete endorsement:', error)
      alert('Failed to delete endorsement. Check console for details.')
    } finally {
      setDeleting(null)
    }
  }

  const openEditModal = (endorsement: Endorsement) => {
    setEditingEndorsement(endorsement)
    setEditForm({
      name: endorsement.name || "",
      email: endorsement.email || "",
      designation: endorsement.designation || "",
      organization: endorsement.organization || "",
      endorsement: endorsement.endorsement || "",
      rating: endorsement.rating || 5,
      created_at: endorsement.created_at ? endorsement.created_at.split('T')[0] : "",
      image: endorsement.image || "",
    })
    setEditImagePreview(endorsement.image || "")
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        alert("Please upload a valid image file (JPG, PNG, or WebP)")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setEditForm(prev => ({ ...prev, image: base64 }))
        setEditImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setEditForm(prev => ({ ...prev, image: "" }))
    setEditImagePreview("")
  }

  const handleSaveEdit = async () => {
    if (!editingEndorsement) return
    if (!editForm.name.trim() || !editForm.endorsement.trim()) {
      alert("Name and endorsement message are required.")
      return
    }

    setSaving(true)
    try {
      const payload = {
        id: editingEndorsement.id,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        designation: editForm.designation.trim(),
        organization: editForm.organization.trim(),
        endorsement: editForm.endorsement.trim(),
        rating: editForm.rating,
        approved: editingEndorsement.approved,
        image: editForm.image,
        created_at: editForm.created_at ? new Date(editForm.created_at).toISOString() : editingEndorsement.created_at,
      }

      const response = await fetch('/api/endorsements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const updated = await response.json()
        setEndorsements(prev => prev.map(t =>
          t.id === editingEndorsement.id ? { ...t, ...updated } : t
        ))
        setEditingEndorsement(null)
      } else {
        const err = await response.json()
        alert(`Failed to save: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to save endorsement:', error)
      alert('Failed to save. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={interactive ? () => setEditForm(prev => ({ ...prev, rating: i + 1 })) : undefined}
      />
    ))
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/endorse`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  const pendingEndorsements = endorsements.filter(t => !t.approved)
  const approvedEndorsements = endorsements.filter(t => t.approved)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold font-serif text-primary">Endorsements Management</h1>
                <p className="text-sm text-muted-foreground">
                  {pendingEndorsements.length} pending, {approvedEndorsements.length} approved
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleCopyLink} className="hidden sm:flex items-center gap-2">
              {copiedLink ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
              {copiedLink ? "Copied!" : "Copy Invite Link"}
            </Button>
          </div>
          <div className="mt-4 sm:hidden">
            <Button variant="outline" onClick={handleCopyLink} className="w-full flex items-center justify-center gap-2">
              {copiedLink ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
              {copiedLink ? "Copied!" : "Copy Invite Link"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Endorsements */}
        {pendingEndorsements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-serif mb-6">Pending Approval</h2>
            <div className="space-y-4">
              {pendingEndorsements.map((endorsement) => (
                <Card key={endorsement.id} className="border-orange-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {endorsement.image ? (
                            <img
                              src={endorsement.image}
                              alt={endorsement.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-white font-bold text-lg">
                              {endorsement.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{endorsement.name}</h3>
                            <p className="text-sm text-muted-foreground">{endorsement.email}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium">{endorsement.designation}</p>
                          <p className="text-sm text-muted-foreground">{endorsement.organization}</p>
                        </div>
                        <div className="flex items-center gap-1 mb-3">{renderStars(endorsement.rating)}</div>
                        <p className="text-sm text-foreground italic">"{endorsement.endorsement}"</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted: {new Date(endorsement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4 flex-wrap justify-end">
                        <Button size="sm" variant="outline" onClick={() => setSelectedEndorsement(endorsement)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditModal(endorsement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(endorsement.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirmId(endorsement.id)}
                          disabled={deleting === endorsement.id}
                        >
                          {deleting === endorsement.id ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              Deleting...
                            </span>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Approved Endorsements */}
        <div>
          <h2 className="text-2xl font-bold font-serif mb-6">Approved Endorsements</h2>
          {approvedEndorsements.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No approved endorsements yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedEndorsements.map((endorsement) => (
                <Card key={endorsement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {endorsement.image ? (
                          <img
                            src={endorsement.image}
                            alt={endorsement.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-white font-bold text-lg">
                            {endorsement.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{endorsement.name}</h3>
                          <p className="text-xs text-muted-foreground">{endorsement.designation}</p>
                          {endorsement.organization && (
                            <p className="text-xs text-muted-foreground">{endorsement.organization}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(endorsement)} title="Edit endorsement">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(endorsement.id)}
                          disabled={deleting === endorsement.id}
                          title="Delete endorsement"
                        >
                          {deleting === endorsement.id ? (
                            <svg className="animate-spin h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">{renderStars(endorsement.rating)}</div>
                    <p className="text-sm text-foreground line-clamp-3 italic">"{endorsement.endorsement}"</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(endorsement.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* View Details Dialog */}
      <Dialog open={!!selectedEndorsement} onOpenChange={() => setSelectedEndorsement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Endorsement Details</DialogTitle>
          </DialogHeader>
          {selectedEndorsement && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedEndorsement.image ? (
                  <img
                    src={selectedEndorsement.image}
                    alt={selectedEndorsement.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-white font-bold text-2xl">
                    {selectedEndorsement.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedEndorsement.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEndorsement.email}</p>
                  <p className="text-sm font-medium">{selectedEndorsement.designation}</p>
                  <p className="text-sm text-muted-foreground">{selectedEndorsement.organization}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">{renderStars(selectedEndorsement.rating)}</div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Endorsement</p>
                <p className="text-base whitespace-pre-wrap italic">"{selectedEndorsement.endorsement}"</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(selectedEndorsement.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Edit Dialog */}
      <Dialog open={!!editingEndorsement} onOpenChange={() => setEditingEndorsement(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Edit Endorsement</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Profile Image</Label>
              <div className="flex items-center gap-4">
                {editImagePreview ? (
                  <img src={editImagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-accent/20" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-white font-bold text-2xl">
                    {editForm.name ? editForm.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleEditImageChange}
                    className="text-sm h-10 file:border-0 file:bg-accent/10 file:text-accent file:px-3 file:py-1 file:rounded-md cursor-pointer"
                  />
                  {editImagePreview && (
                    <Button variant="outline" size="sm" onClick={handleRemoveImage} className="w-fit text-xs">
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-image-url" className="text-xs text-muted-foreground">Or paste image URL:</Label>
                <Input
                  id="edit-image-url"
                  placeholder="https://example.com/photo.jpg"
                  value={editForm.image.startsWith('data:') ? '' : editForm.image}
                  onChange={(e) => {
                    setEditForm(prev => ({ ...prev, image: e.target.value }))
                    setEditImagePreview(e.target.value)
                  }}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-semibold">Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-semibold">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            {/* Designation & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-designation" className="text-sm font-semibold">Designation</Label>
                <Input
                  id="edit-designation"
                  value={editForm.designation}
                  onChange={(e) => setEditForm(prev => ({ ...prev, designation: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-organization" className="text-sm font-semibold">Organization</Label>
                <Input
                  id="edit-organization"
                  value={editForm.organization}
                  onChange={(e) => setEditForm(prev => ({ ...prev, organization: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            {/* Endorsement Message */}
            <div className="space-y-2">
              <Label htmlFor="edit-endorsement" className="text-sm font-semibold">Endorsement Message *</Label>
              <Textarea
                id="edit-endorsement"
                value={editForm.endorsement}
                onChange={(e) => setEditForm(prev => ({ ...prev, endorsement: e.target.value }))}
                rows={5}
                className="resize-none text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground text-right">{editForm.endorsement.length} characters</p>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Rating</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(editForm.rating, true)}
                </div>
                <span className="text-sm text-muted-foreground ml-2">{editForm.rating}/5</span>
              </div>
            </div>

            {/* Submission Date */}
            <div className="space-y-2">
              <Label htmlFor="edit-date" className="text-sm font-semibold">Submission Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.created_at}
                onChange={(e) => setEditForm(prev => ({ ...prev, created_at: e.target.value }))}
                className="h-10 w-fit"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingEndorsement(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Endorsement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this endorsement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
