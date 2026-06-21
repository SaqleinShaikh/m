"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Trash2, Mail, Calendar, Info, Search, Filter } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

interface ResumeRequest {
  id: string
  name: string
  email: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export default function AdminResumeRequestsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [requests, setRequests] = useState<ResumeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      fetchRequests()
    }
  }, [router])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/resume-requests?admin=true')
      const data = await response.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch resume requests:', error)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActioningId(id)
    try {
      const response = await fetch('/api/resume-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      if (response.ok) {
        const updated = await response.json()
        setRequests(prev => prev.map(req => req.id === id ? updated : req))
      } else {
        const err = await response.json()
        alert(`Failed to update request: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to update resume request:', error)
      alert('Failed to update resume request. Check console for details.')
    } finally {
      setActioningId(null)
    }
  }

  const handleDeleteRequest = async () => {
    if (!deleteConfirmId) return
    const id = deleteConfirmId
    setDeleteConfirmId(null)
    setActioningId(id)
    try {
      const response = await fetch(`/api/resume-requests?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== id))
      } else {
        const err = await response.json()
        alert(`Failed to delete: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete request:', error)
      alert('Failed to delete request. Check console for details.')
    } finally {
      setActioningId(null)
    }
  }

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || req.status === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const approvedRequests = requests.filter(req => req.status === 'approved')
  const rejectedRequests = requests.filter(req => req.status === 'rejected')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">Resume Requests</h1>
              <p className="text-sm text-muted-foreground">
                {pendingRequests.length} pending, {approvedRequests.length} approved, {rejectedRequests.length} rejected
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card/50 p-4 rounded-2xl border border-border/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-border/50 bg-background/50 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 border border-border/50 rounded-xl bg-background/50 text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary w-full sm:w-40"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No resume requests found.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <Card key={req.id} className={`border-border/50 overflow-hidden relative ${req.status === 'pending' ? 'ring-1 ring-orange-500/20' : ''}`}>
                
                {/* Visual Status Indicator Line */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  req.status === 'approved' ? 'bg-green-500' :
                  req.status === 'rejected' ? 'bg-destructive' : 'bg-orange-500'
                }`} />

                <CardContent className="p-6 pl-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      
                      {/* Submitter Identity Row */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-bold text-lg text-foreground">{req.name}</h3>
                        <a href={`mailto:${req.email}`} className="text-sm text-primary flex items-center gap-1 hover:underline">
                          <Mail className="w-3.5 h-3.5" />
                          {req.email}
                        </a>
                        <Badge variant={
                          req.status === 'approved' ? 'default' :
                          req.status === 'rejected' ? 'destructive' : 'secondary'
                        } className={
                          req.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''
                        }>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Reason Description */}
                      <div className="bg-muted/30 p-4 rounded-xl border border-border/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reason for Request:</p>
                        <p className="text-sm text-foreground italic leading-relaxed">"{req.reason}"</p>
                      </div>

                      {/* Request Metadata */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Created: {new Date(req.created_at).toLocaleString()}
                        </span>
                        {req.status !== 'pending' && (
                          <span className="flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            Processed: {new Date(req.updated_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center gap-2 self-end md:self-start">
                      {req.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/10 font-medium rounded-xl h-9 pl-3 pr-4"
                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                            disabled={actioningId !== null}
                          >
                            {actioningId === req.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1.5" />
                            ) : (
                              <Check className="h-4 w-4 mr-1.5" />
                            )}
                            Approve & Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive font-medium rounded-xl h-9"
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                            disabled={actioningId !== null}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-xl h-9 w-9 p-0"
                        onClick={() => setDeleteConfirmId(req.id)}
                        disabled={actioningId !== null}
                        title="Delete Request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume request record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
