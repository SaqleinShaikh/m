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
import { Trash2, Edit, Plus, ArrowLeft, GraduationCap } from "lucide-react"

interface Education {
  id: string
  degree: string
  year: string
  location: string
  description: string
  icon: string
  visible: boolean
  display_order: number
}

export default function AdminEducationPage() {
  const router = useRouter()
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Education | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const emptyItem: Omit<Education, 'id'> = {
    degree: "",
    year: "",
    location: "",
    description: "",
    icon: "GraduationCap",
    visible: true,
    display_order: 0
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/loginlocal")
      return
    }
    fetchEducation()
  }, [router])

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/education')
      const data = await res.json()
      setEducation(data)
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: Partial<Education>) => {
    try {
      const method = item.id ? 'PUT' : 'POST'
      const res = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })

      if (res.ok) {
        await fetchEducation()
        setIsDialogOpen(false)
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error saving education:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return

    try {
      const res = await fetch(`/api/education?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchEducation()
      }
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const handleToggleVisibility = async (item: Education) => {
    await handleSave({ ...item, visible: !item.visible })
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Manage Education</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem?.id ? 'Edit Education' : 'Add New Education'}</DialogTitle>
              </DialogHeader>
              <EducationForm
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu) => (
            <Card key={edu.id} className={!edu.visible ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{edu.degree}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{edu.year} • {edu.location}</p>
                <p className="text-sm mb-4 line-clamp-3">{edu.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={edu.visible} onCheckedChange={() => handleToggleVisibility(edu)} />
                    <span className="text-sm">{edu.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(edu)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(edu.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function EducationForm({ item, onSave, onCancel }: {
  item: Partial<Education>
  onSave: (item: Partial<Education>) => void
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
        <Label>Degree/Certificate</Label>
        <Input
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          placeholder="Bachelor of Science in Computer Science"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Year</Label>
          <Input
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2021"
            required
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="University Name"
            required
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div>
        <Label>Icon</Label>
        <Select
          value={formData.icon}
          onValueChange={(value) => setFormData({ ...formData, icon: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
            <SelectItem value="Award">Award</SelectItem>
          </SelectContent>
        </Select>
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
        <Button type="submit">Save Education</Button>
      </div>
    </form>
  )
}
