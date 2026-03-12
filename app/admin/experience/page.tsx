"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Edit, Plus, ArrowLeft, Briefcase } from "lucide-react"

interface Experience {
  id: string
  company: string
  position: string
  duration: string
  location: string
  description: string
  technologies: string[]
  is_current: boolean
  visible: boolean
  display_order: number
}

export default function AdminExperiencePage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Experience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const emptyItem: Omit<Experience, 'id'> = {
    company: "",
    position: "",
    duration: "",
    location: "",
    description: "",
    technologies: [],
    is_current: false,
    visible: true,
    display_order: 0
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/loginlocal")
      return
    }
    fetchExperiences()
  }, [router])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience')
      const data = await res.json()
      setExperiences(data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: Partial<Experience>) => {
    try {
      const method = item.id ? 'PUT' : 'POST'
      const res = await fetch('/api/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })

      if (res.ok) {
        await fetchExperiences()
        setIsDialogOpen(false)
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error saving experience:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/experience?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchExperiences()
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleToggleVisibility = async (item: Experience) => {
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
            <h1 className="text-3xl font-bold">Manage Experience</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem?.id ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
              </DialogHeader>
              <ExperienceForm
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <Card key={exp.id} className={!exp.visible ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{exp.position}</CardTitle>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                  </div>
                  {exp.is_current && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{exp.duration} • {exp.location}</p>
                <p className="text-sm mb-4 line-clamp-3">{exp.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={exp.visible} onCheckedChange={() => handleToggleVisibility(exp)} />
                    <span className="text-sm">{exp.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(exp)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.id)}>
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

function ExperienceForm({ item, onSave, onCancel }: {
  item: Partial<Experience>
  onSave: (item: Partial<Experience>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(item)
  const [techInput, setTechInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()]
      })
      setTechInput("")
    }
  }

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Company</Label>
        <Input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Position</Label>
        <Input
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Duration</Label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="Jan 2020 - Present"
            required
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, Country"
            required
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div>
        <Label>Technologies</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add technology"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" onClick={addTechnology}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies?.map((tech, i) => (
            <span key={i} className="bg-secondary px-3 py-1 rounded flex items-center gap-2">
              {tech}
              <button type="button" onClick={() => removeTechnology(i)} className="text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_current}
          onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked })}
        />
        <Label>Current Position</Label>
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
        <Button type="submit">Save Experience</Button>
      </div>
    </form>
  )
}
