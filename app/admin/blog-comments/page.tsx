"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Trash2, MessageCircle, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Comment {
  id: string
  blog_id: string
  user_name: string
  user_email: string
  comment: string
  approved: boolean
  created_at: string
}

interface Blog {
  id: string
  title: string
  slug: string
  likes_count: number
  comments_count: number
}

export default function AdminBlogCommentsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState<string>("all")

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      fetchBlogs()
      fetchAllComments()
    }
  }, [router])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      setBlogs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    }
  }

  const fetchAllComments = async () => {
    try {
      // Fetch comments for all blogs
      const response = await fetch('/api/blogs')
      const blogsData = await response.json()
      
      if (Array.isArray(blogsData)) {
        const allComments: Comment[] = []
        
        for (const blog of blogsData) {
          const commentsResponse = await fetch(`/api/blog-comments?blogId=${blog.id}&admin=true`)
          const commentsData = await commentsResponse.json()
          if (Array.isArray(commentsData)) {
            allComments.push(...commentsData)
          }
        }
        
        setComments(allComments)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/blog-comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved: true })
      })

      if (response.ok) {
        setComments(comments.map(c => 
          c.id === id ? { ...c, approved: true } : c
        ))
        // Refresh blogs to update counts
        fetchBlogs()
      }
    } catch (error) {
      console.error('Failed to approve comment:', error)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this comment?')) return

    try {
      const response = await fetch(`/api/blog-comments?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== id))
        fetchBlogs()
      }
    } catch (error) {
      console.error('Failed to reject comment:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/blog-comments?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== id))
        fetchBlogs()
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const getBlogTitle = (blogId: string) => {
    const blog = blogs.find(b => b.id === blogId)
    return blog ? blog.title : 'Unknown Blog'
  }

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  const pendingComments = comments.filter(c => !c.approved)
  const approvedComments = comments.filter(c => c.approved)
  const filteredPending = selectedBlog === "all" 
    ? pendingComments 
    : pendingComments.filter(c => c.blog_id === selectedBlog)
  const filteredApproved = selectedBlog === "all"
    ? approvedComments
    : approvedComments.filter(c => c.blog_id === selectedBlog)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">Blog Comments & Likes</h1>
              <p className="text-sm text-muted-foreground">
                {pendingComments.length} pending, {approvedComments.length} approved
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {blogs.slice(0, 3).map((blog) => (
            <Card key={blog.id} className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-1">{blog.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {blog.likes_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {blog.comments_count || 0}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter by Blog */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Filter by Blog:</label>
          <select
            value={selectedBlog}
            onChange={(e) => setSelectedBlog(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Blogs</option>
            {blogs.map((blog) => (
              <option key={blog.id} value={blog.id}>{blog.title}</option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({filteredPending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({filteredApproved.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {filteredPending.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending comments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPending.map((comment) => (
                  <Card key={comment.id} className="border-orange-500/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Pending</Badge>
                            <span className="text-sm font-medium text-primary">
                              {getBlogTitle(comment.blog_id)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                              {comment.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold">{comment.user_name}</h3>
                              <p className="text-sm text-muted-foreground">{comment.user_email}</p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground mb-2">{comment.comment}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600" 
                            onClick={() => handleApprove(comment.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleReject(comment.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {filteredApproved.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No approved comments yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApproved.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-primary line-clamp-1">
                          {getBlogTitle(comment.blog_id)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                          {comment.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{comment.user_name}</h3>
                          <p className="text-xs text-muted-foreground">{comment.user_email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">{comment.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
