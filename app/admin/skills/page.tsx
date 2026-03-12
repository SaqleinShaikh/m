"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Edit, Plus, ArrowLeft, Code, Wrench } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Skill {
  id: string
  name: string
  proficiency: number
  category: 'language' | 'tool' | 'framework'
  subcategory: string
  visible: boolean
  display_order: number
}

export default function AdminSkillsPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Skill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const emptyItem: Omit<Skill, 'id'> = {
    name: "",
    proficiency: 50,
    category: 'language',
    subcategory: "",
    visible: true,
    display_order: 0
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/loginlocal")
      return
    }
    fetchSkills()
  }, [router])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json()
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: Partial<Skill>) => {
    try {
      const method = item.id ? 'PUT' : 'POST'
      const res = await fetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })

      if (res.ok) {
        await fetchSkills()
        setIsDialogOpen(false)
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchSkills()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const handleToggleVisibility = async (item: Skill) => {
    await handleSave({ ...item, visible: !item.visible })
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const languages = skills.filter(s => s.category === 'language')
  const tools = skills.filter(s => s.category === 'tool')
  const frameworks = skills.filter(s => s.category === 'framework')

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Manage Skills</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingItem?.id ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
              </DialogHeader>
              <SkillForm
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

        {/* Languages */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Languages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {languages.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => {
                  setEditingItem(skill)
                  setIsDialogOpen(true)
                }}
                onDelete={() => handleDelete(skill.id)}
                onToggleVisibility={() => handleToggleVisibility(skill)}
              />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => {
                  setEditingItem(skill)
                  setIsDialogOpen(true)
                }}
                onDelete={() => handleDelete(skill.id)}
                onToggleVisibility={() => handleToggleVisibility(skill)}
              />
            ))}
          </div>
        </div>

        {/* Frameworks */}
        {frameworks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Frameworks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {frameworks.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={() => {
                    setEditingItem(skill)
                    setIsDialogOpen(true)
                  }}
                  onDelete={() => handleDelete(skill.id)}
                  onToggleVisibility={() => handleToggleVisibility(skill)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SkillCard({ skill, onEdit, onDelete, onToggleVisibility }: {
  skill: Skill
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  return (
    <Card className={!skill.visible ? 'opacity-50' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{skill.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{skill.subcategory}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Proficiency</span>
            <span>{skill.proficiency}%</span>
          </div>
          <Progress value={skill.proficiency} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={skill.visible} onCheckedChange={onToggleVisibility} />
            <span className="text-xs">{skill.visible ? 'Visible' : 'Hidden'}</span>
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

function SkillForm({ item, onSave, onCancel }: {
  item: Partial<Skill>
  onSave: (item: Partial<Skill>) => void
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
        <Label>Skill Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Python"
          required
        />
      </div>

      <div>
        <Label>Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value: 'language' | 'tool' | 'framework') => 
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="language">Language</SelectItem>
            <SelectItem value="tool">Tool</SelectItem>
            <SelectItem value="framework">Framework</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Subcategory</Label>
        <Input
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          placeholder="Programming Language, Database, etc."
        />
      </div>

      <div>
        <Label>Proficiency ({formData.proficiency}%)</Label>
        <Input
          type="range"
          min="0"
          max="100"
          value={formData.proficiency}
          onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
          className="w-full"
        />
        <Progress value={formData.proficiency} className="h-2 mt-2" />
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
        <Button type="submit">Save Skill</Button>
      </div>
    </form>
  )
}
