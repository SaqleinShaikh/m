"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/rich-text-editor'), {
  ssr: false,
  loading: () => (
    <div className="border border-border rounded-lg p-4 min-h-[300px] bg-muted/30">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  )
})

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  published_date: string
  category: string
  visible: boolean
  created_at: string
  updated_at: string
}

export default function AdminBlogsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    visible: false,
    published_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      fetchBlogs()
    }
  }, [router])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      setBlogs(data)
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        image: blog.image,
        category: blog.category,
        visible: blog.visible,
        published_date: blog.published_date
      })
    } else {
      setEditingBlog(null)
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "",
        visible: false,
        published_date: new Date().toISOString().split('T')[0]
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const url = '/api/blogs'
      const method = editingBlog ? 'PUT' : 'POST'
      const body = editingBlog 
        ? { ...editingBlog, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchBlogs()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to save blog:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBlogs(blogs.filter(b => b.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const handleToggleVisibility = async (blog: BlogPost) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, visible: !blog.visible })
      })

      if (response.ok) {
        setBlogs(blogs.map(b => 
          b.id === blog.id ? { ...b, visible: !b.visible } : b
        ))
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/admin/dashboard")}
                className="hover:bg-accent/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Blog Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {blogs.filter(b => b.visible).length} published • {blogs.filter(b => !b.visible).length} drafts
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blogs.length === 0 ? (
          <Card className="border-dashed border-2 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first blog post</p>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card 
                key={blog.id} 
                className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.image || '/placeholder.svg'}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge 
                        variant={blog.visible ? "default" : "secondary"}
                        className={blog.visible ? "bg-green-500/90 backdrop-blur-sm" : "bg-gray-500/90 backdrop-blur-sm"}
                      >
                        {blog.visible ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs border-accent/30">
                        {blog.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{blog.published_date}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-accent/10 hover:border-accent/40" 
                        onClick={() => handleOpenDialog(blog)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-accent/10 hover:border-accent/40"
                        onClick={() => handleToggleVisibility(blog)}
                      >
                        {blog.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive" 
                        onClick={() => handleDelete(blog.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-accent/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter an engaging blog title"
                className="mt-2 border-accent/20 focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Technology, Mendix"
                  className="mt-2 border-accent/20 focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_date" className="text-sm font-semibold">Published Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="mt-2 border-accent/20 focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/blog-image.png"
                className="mt-2 border-accent/20 focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-sm font-semibold">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description that appears in blog listings"
                rows={3}
                className="mt-2 border-accent/20 focus:border-accent resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold">Content *</Label>
              <div className="mt-2">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog content here... You can paste formatted text with images!"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: You can copy-paste content from Word, Google Docs, or any website with formatting and images!
              </p>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <Label htmlFor="visible" className="text-sm font-medium cursor-pointer">
                Publish immediately (make visible on website)
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
              >
                {editingBlog ? 'Update Post' : 'Create Post'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)} 
                className="flex-1 border-accent/30 hover:bg-accent/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
