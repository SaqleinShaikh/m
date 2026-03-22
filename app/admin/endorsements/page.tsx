"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Eye, Trash2, Star, Edit, Save, Link as LinkIcon, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Endorsement {
  id: string  // UUID from Supabase
  name: string
  email: string
  designation: string
  organization: string
  endorsement: string
  image: string
  rating: number
  approved: boolean
  created_at: string  // snake_case from Supabase
  updated_at: string
}

export default function AdminEndorsementsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [selectedEndorsement, setSelectedEndorsement] = useState<Endorsement | null>(null)
  const [editingEndorsement, setEditingEndorsement] = useState<Endorsement | null>(null)
  const [editDate, setEditDate] = useState("")
  const [loading, setLoading] = useState(true)
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
      console.log('Fetched endorsements:', data)
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
      }
    } catch (error) {
      console.error('Failed to approve endorsement:', error)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this endorsement?')) return

    try {
      const response = await fetch(`/api/endorsements?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEndorsements(endorsements.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to reject endorsement:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this endorsement?')) return

    try {
      const response = await fetch(`/api/endorsements?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEndorsements(endorsements.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete endorsement:', error)
    }
  }

  const handleEditDate = async () => {
    if (!editingEndorsement || !editDate) return;

    try {
      const response = await fetch('/api/endorsements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingEndorsement, created_at: editDate })
      })

      if (response.ok) {
        setEndorsements(endorsements.map(t =>
          t.id === editingEndorsement.id ? { ...t, created_at: editDate } : t
        ))
        setEditingEndorsement(null)
      }
    } catch (error) {
      console.error('Failed to update date:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
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
                          <img
                            src={endorsement.image || "/placeholder.svg"}
                            alt={endorsement.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
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
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedEndorsement(endorsement)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingEndorsement(endorsement)
                          setEditDate(endorsement.created_at.split('T')[0])
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(endorsement.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(endorsement.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Reject
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
                        <img
                          src={endorsement.image || "/placeholder.svg"}
                          alt={endorsement.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{endorsement.name}</h3>
                          <p className="text-xs text-muted-foreground">{endorsement.designation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => {
                          setEditingEndorsement(endorsement)
                          setEditDate(endorsement.created_at.split('T')[0])
                        }}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(endorsement.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">{renderStars(endorsement.rating)}</div>
                    <p className="text-sm text-foreground line-clamp-3 italic">"{endorsement.endorsement}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedEndorsement} onOpenChange={() => setSelectedEndorsement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Endorsement Details</DialogTitle>
          </DialogHeader>
          {selectedEndorsement && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEndorsement.image || "/placeholder.svg"}
                  alt={selectedEndorsement.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
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
                  Submitted: {new Date(selectedEndorsement.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingEndorsement} onOpenChange={() => setEditingEndorsement(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Submission Date</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-date">Submission Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEndorsement(null)}>Cancel</Button>
            <Button onClick={handleEditDate} className="bg-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Save Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
