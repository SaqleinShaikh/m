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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, FileText, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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

function BlogCard({
  blog,
  onEdit,
  onToggleVisibility,
  onDelete,
}: {
  blog: BlogPost
  onEdit: (blog: BlogPost) => void
  onToggleVisibility: (blog: BlogPost) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card
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
              className={blog.visible ? "bg-green-500/90 backdrop-blur-sm" : "bg-amber-500/90 backdrop-blur-sm text-white"}
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
              onClick={() => onEdit(blog)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-accent/10 hover:border-accent/40"
              onClick={() => onToggleVisibility(blog)}
              title={blog.visible ? "Move to Drafts" : "Publish"}
            >
              {blog.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive"
              onClick={() => onDelete(blog.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminBlogsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

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

  const handleOpenDialog = async (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog)
      // Fetch full blog content (the list API excludes the content field for performance)
      let fullContent = ''
      try {
        const res = await fetch(`/api/blogs?slug=${blog.slug}`)
        if (res.ok) {
          const fullBlog = await res.json()
          fullContent = fullBlog.content || ''
        }
      } catch (err) {
        console.error('Failed to fetch blog content:', err)
      }
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: fullContent,
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
    setEditorKey(prev => prev + 1)
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields")
      return
    }

    setSaving(true)
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
        toast.success(editingBlog ? "Blog updated successfully" : "Blog created successfully")
      } else {
        toast.error("Failed to save blog")
      }
    } catch (error) {
      console.error('Failed to save blog:', error)
      toast.error("An error occurred while saving")
    } finally {
      setSaving(false)
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
        toast.success("Blog post deleted")
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
        toast.success(blog.visible ? "Moved to drafts" : "Published successfully")
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const publishedBlogs = blogs.filter(b => b.visible)
  const draftBlogs = blogs.filter(b => !b.visible)

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
                  <span className="text-green-500 font-medium">{publishedBlogs.length} published</span>
                  {" • "}
                  <span className="text-amber-500 font-medium">{draftBlogs.length} drafts</span>
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
          <Tabs defaultValue="published" className="w-full">
            <TabsList className="mb-6 bg-card/60 backdrop-blur-sm border border-border/40 p-1 h-auto">
              <TabsTrigger
                value="published"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-sm px-4 py-2"
              >
                <Globe className="h-4 w-4" />
                Published
                <Badge variant="secondary" className="ml-1 bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                  {publishedBlogs.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="drafts"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-sm px-4 py-2"
              >
                <FileText className="h-4 w-4" />
                Drafts
                <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-600 border-amber-500/30 text-xs">
                  {draftBlogs.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published">
              {publishedBlogs.length === 0 ? (
                <Card className="border-dashed border-2 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No published posts</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Published posts will appear here and on your public website.
                    </p>
                    <Button
                      onClick={() => handleOpenDialog()}
                      className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create & Publish Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onEdit={handleOpenDialog}
                      onToggleVisibility={handleToggleVisibility}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts">
              {draftBlogs.length === 0 ? (
                <Card className="border-dashed border-2 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No drafts</h3>
                    <p className="text-muted-foreground text-sm">
                      Draft posts are saved here but not visible on your public website.
                      Create a new post without enabling "Publish" to save it as a draft.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      These posts are <strong>only visible to you</strong> as admin. They are not shown on your public website.
                      Use the <Eye className="h-3 w-3 inline" /> button to publish them.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {draftBlogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        onEdit={handleOpenDialog}
                        onToggleVisibility={handleToggleVisibility}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
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
              <Label htmlFor="image" className="text-sm font-semibold">Cover Image URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/blog-image.png or https://..."
                  className="border-accent/20 focus:border-accent"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Upload images in <strong>Admin → Settings → Image Manager</strong>, then copy the URL here.
              </p>
              {formData.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border/40 w-32 h-20">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
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
                  key={editorKey}
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog content here... You can paste formatted text with images!"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <div>
                <Label htmlFor="visible" className="text-sm font-medium cursor-pointer">
                  {formData.visible ? '🌍 Published — visible on website' : '📝 Draft — not visible on website'}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formData.visible
                    ? 'Toggle off to save as draft without publishing'
                    : 'Toggle on to publish this post to your website'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingBlog ? 'Update Post' : 'Create Post'
                )}
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
