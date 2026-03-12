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
import { Trash2, Edit, Plus, ArrowLeft } from "lucide-react"

interface Project {
  id: string
  title: string
  short_description: string
  full_description: string
  image: string
  technologies: string[]
  functionality: string[]
  github_url: string
  live_url: string
  visible: boolean
  display_order: number
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const emptyProject: Omit<Project, 'id'> = {
    title: "",
    short_description: "",
    full_description: "",
    image: "",
    technologies: [],
    functionality: [],
    github_url: "#",
    live_url: "#",
    visible: true,
    display_order: 0
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/loginlocal")
      return
    }
    fetchProjects()
  }, [router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (project: Partial<Project>) => {
    try {
      const method = project.id ? 'PUT' : 'POST'
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })

      if (res.ok) {
        await fetchProjects()
        setIsDialogOpen(false)
        setEditingProject(null)
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleToggleVisibility = async (project: Project) => {
    await handleSave({ ...project, visible: !project.visible })
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
            <h1 className="text-3xl font-bold">Manage Projects</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProject(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject?.id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              </DialogHeader>
              <ProjectForm
                project={editingProject || emptyProject}
                onSave={handleSave}
                onCancel={() => {
                  setIsDialogOpen(false)
                  setEditingProject(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className={!project.visible ? 'opacity-50' : ''}>
              <CardHeader>
                <img
                  src={project.image || '/placeholder.svg'}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.short_description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={project.visible}
                      onCheckedChange={() => handleToggleVisibility(project)}
                    />
                    <span className="text-sm">{project.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProject(project)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.id)}
                    >
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

function ProjectForm({ project, onSave, onCancel }: {
  project: Partial<Project>
  onSave: (project: Partial<Project>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(project)
  const [techInput, setTechInput] = useState("")
  const [funcInput, setFuncInput] = useState("")

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

  const addFunctionality = () => {
    if (funcInput.trim()) {
      setFormData({
        ...formData,
        functionality: [...(formData.functionality || []), funcInput.trim()]
      })
      setFuncInput("")
    }
  }

  const removeFunctionality = (index: number) => {
    setFormData({
      ...formData,
      functionality: formData.functionality?.filter((_, i) => i !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Short Description</Label>
        <Textarea
          value={formData.short_description}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Full Description</Label>
        <Textarea
          value={formData.full_description}
          onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div>
        <Label>Image URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="/project-image.png"
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

      <div>
        <Label>Key Features</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={funcInput}
            onChange={(e) => setFuncInput(e.target.value)}
            placeholder="Add feature"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFunctionality())}
          />
          <Button type="button" onClick={addFunctionality}>Add</Button>
        </div>
        <div className="space-y-2">
          {formData.functionality?.map((func, i) => (
            <div key={i} className="bg-secondary px-3 py-2 rounded flex items-center justify-between">
              <span className="text-sm">{func}</span>
              <button type="button" onClick={() => removeFunctionality(i)} className="text-red-500">×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>GitHub URL</Label>
          <Input
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
          />
        </div>
        <div>
          <Label>Live URL</Label>
          <Input
            value={formData.live_url}
            onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
          />
        </div>
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
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  )
}
