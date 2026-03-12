"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Eye, Trash2, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Testimonial {
  id: string  // UUID from Supabase
  name: string
  email: string
  designation: string
  organization: string
  testimonial: string
  image: string
  rating: number
  approved: boolean
  created_at: string  // snake_case from Supabase
  updated_at: string
}

export default function AdminTestimonialsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      fetchTestimonials()
    }
  }, [router])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?admin=true')
      const data = await response.json()
      console.log('Fetched testimonials:', data)
      setTestimonials(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const testimonial = testimonials.find(t => t.id === id)
      if (!testimonial) return

      const response = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testimonial, approved: true })
      })

      if (response.ok) {
        setTestimonials(testimonials.map(t => 
          t.id === id ? { ...t, approved: true } : t
        ))
      }
    } catch (error) {
      console.error('Failed to approve testimonial:', error)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to reject testimonial:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  const pendingTestimonials = testimonials.filter(t => !t.approved)
  const approvedTestimonials = testimonials.filter(t => t.approved)

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
              <h1 className="text-2xl font-bold font-serif text-primary">Testimonials Management</h1>
              <p className="text-sm text-muted-foreground">
                {pendingTestimonials.length} pending, {approvedTestimonials.length} approved
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Testimonials */}
        {pendingTestimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-serif mb-6">Pending Approval</h2>
            <div className="space-y-4">
              {pendingTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-orange-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                            <p className="text-sm text-muted-foreground">{testimonial.email}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium">{testimonial.designation}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
                        </div>
                        <div className="flex items-center gap-1 mb-3">{renderStars(testimonial.rating)}</div>
                        <p className="text-sm text-foreground italic">"{testimonial.testimonial}"</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTestimonial(testimonial)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(testimonial.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(testimonial.id)}>
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

        {/* Approved Testimonials */}
        <div>
          <h2 className="text-2xl font-bold font-serif mb-6">Approved Testimonials</h2>
          {approvedTestimonials.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No approved testimonials yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedTestimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-xs text-muted-foreground">{testimonial.designation}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(testimonial.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 mb-2">{renderStars(testimonial.rating)}</div>
                    <p className="text-sm text-foreground line-clamp-3 italic">"{testimonial.testimonial}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTestimonial.image || "/placeholder.svg"}
                  alt={selectedTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedTestimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTestimonial.email}</p>
                  <p className="text-sm font-medium">{selectedTestimonial.designation}</p>
                  <p className="text-sm text-muted-foreground">{selectedTestimonial.organization}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">{renderStars(selectedTestimonial.rating)}</div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Testimonial</p>
                <p className="text-base whitespace-pre-wrap italic">"{selectedTestimonial.testimonial}"</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
