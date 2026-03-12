"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Edit, Plus, ArrowLeft, Award, Trophy } from "lucide-react"

interface Certification {
  id: string
  title: string
  issuer: string
  issue_date: string
  image: string
  description: string
  credential_url: string
  type: 'certification' | 'award'
  visible: boolean
  display_order: number
}

export default function AdminCertificationsPage() {
  const router = useRouter()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Certification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const emptyItem: Omit<Certification, 'id'> = {
    title: "",
    issuer: "",
    issue_date: "",
    image: "",
    description: "",
    credential_url: "",
    type: 'certification',
    visible: true,
    display_order: 0
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/loginlocal")
      return
    }
    fetchCertifications()
  }, [router])

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/certifications')
      const data = await res.json()
      setCertifications(data)
    } catch (error) {
      console.error('Error fetching certifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: Partial<Certification>) => {
    try {
      const method = item.id ? 'PUT' : 'POST'
      const res = await fetch('/api/certifications', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })

      if (res.ok) {
        await fetchCertifications()
        setIsDialogOpen(false)
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error saving certification:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/certifications?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchCertifications()
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  const handleToggleVisibility = async (item: Certification) => {
    await handleSave({ ...item, visible: !item.visible })
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const certs = certifications.filter(c => c.type === 'certification')
  const awards = certifications.filter(c => c.type === 'award')

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Manage Certifications & Awards</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem?.id ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              </DialogHeader>
              <CertificationForm
                item={editingItem || emptyItem}
                onSave={handleSave}
                onCancel={() => {
                  setIsDialogOpen(false)
                  setEditingItem(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Certifications Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Certifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => (
              <CertificationCard
                key={cert.id}
                item={cert}
                onEdit={() => {
                  setEditingItem(cert)
                  setIsDialogOpen(true)
                }}
                onDelete={() => handleDelete(cert.id)}
                onToggleVisibility={() => handleToggleVisibility(cert)}
              />
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Awards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award) => (
              <CertificationCard
                key={award.id}
                item={award}
                onEdit={() => {
                  setEditingItem(award)
                  setIsDialogOpen(true)
                }}
                onDelete={() => handleDelete(award.id)}
                onToggleVisibility={() => handleToggleVisibility(award)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CertificationCard({ item, onEdit, onDelete, onToggleVisibility }: {
  item: Certification
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  return (
    <Card className={!item.visible ? 'opacity-50' : ''}>
      <CardHeader className="p-0">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-sm mb-2 line-clamp-2">{item.title}</CardTitle>
        <p className="text-xs text-muted-foreground mb-2">{item.issuer}</p>
        <p className="text-xs text-muted-foreground mb-4">{item.issue_date}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={item.visible} onCheckedChange={onToggleVisibility} />
            <span className="text-xs">{item.visible ? 'Visible' : 'Hidden'}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CertificationForm({ item, onSave, onCancel }: {
  item: Partial<Certification>
  onSave: (item: Partial<Certification>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(item)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: 'certification' | 'award') => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="certification">Certification</SelectItem>
            <SelectItem value="award">Award</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Issuer/Organization</Label>
        <Input
          value={formData.issuer}
          onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Issue Date</Label>
        <Input
          value={formData.issue_date}
          onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
          placeholder="2024 or Q1 2024"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label>Image URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="/certification.png"
        />
      </div>

      <div>
        <Label>Credential URL</Label>
        <Input
          value={formData.credential_url}
          onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.visible}
          onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
        />
        <Label>Visible on site</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
