"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Heart, MessageCircle, Send } from "lucide-react"
import EmailPromptDialog from "@/components/email-prompt-dialog"

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  read_time: string
  published_date: string
  image: string
  likes_count: number
  comments_count: number
}

interface Comment {
  id: string
  user_name: string
  user_email: string
  comment: string
  created_at: string
  approved: boolean
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<Blog | null>(null)
  const [recommended, setRecommended] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [hasLiked, setHasLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    comment: ""
  })

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const foundPost = data.find((b: Blog) => b.slug === slug)
          if (foundPost) {
            setPost(foundPost)
            setLikesCount(foundPost.likes_count || 0)
            setRecommended(data.filter((b: Blog) => b.slug !== slug).slice(0, 3))
            // Fetch comments
            fetchComments(foundPost.id)
            // Check if user has liked
            checkUserLike(foundPost.id)
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching blog:', err)
        setLoading(false)
      })
  }, [slug])

  const fetchComments = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blog-comments?blogId=${blogId}`)
      const data = await response.json()
      setComments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const checkUserLike = (blogId: string) => {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      fetch(`/api/blog-likes?blogId=${blogId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const liked = data.some((like: any) => like.user_email === userEmail)
            setHasLiked(liked)
          }
        })
        .catch(err => console.error('Error checking like:', err))
    }
  }

  const handleLike = async () => {
    if (!post) return

    const userEmail = localStorage.getItem('userEmail')

    // If no email, show dialog
    if (!userEmail) {
      setShowEmailPrompt(true)
      return
    }

    await toggleLike(userEmail)
  }

  const handleEmailSubmit = async (email: string) => {
    localStorage.setItem('userEmail', email)
    setShowEmailPrompt(false)
    await toggleLike(email)
  }

  const toggleLike = async (userEmail: string) => {
    if (!post) return

    try {
      if (hasLiked) {
        // Unlike
        const response = await fetch(`/api/blog-likes?blogId=${post.id}&userEmail=${userEmail}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setHasLiked(false)
          setLikesCount(prev => prev - 1)
        }
      } else {
        // Like
        const response = await fetch('/api/blog-likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blogId: post.id,
            userName: userEmail.split('@')[0], // Use email prefix as name
            userEmail
          })
        })
        if (response.ok) {
          setHasLiked(true)
          setLikesCount(prev => prev + 1)
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to like')
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Failed to update like')
    }
  }

  const handleSubmitComment = async () => {
    if (!post || !newComment.name || !newComment.email || !newComment.comment) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/blog-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: post.id,
          userName: newComment.name,
          userEmail: newComment.email,
          comment: newComment.comment
        })
      })

      if (response.ok) {
        alert('Thank you! Your comment has been submitted and will appear after approval.')
        setNewComment({ name: "", email: "", comment: "" })
        // Save user info for future
        localStorage.setItem('userName', newComment.name)
        localStorage.setItem('userEmail', newComment.email)
      } else {
        alert('Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment')
    }
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EmailPromptDialog
        open={showEmailPrompt}
        onClose={() => setShowEmailPrompt(false)}
        onSubmit={handleEmailSubmit}
      />
      
      <article>
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-pretty">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
            {post.category ? <span>{post.category}</span> : null}
            {post.read_time ? <span>• {post.read_time}</span> : null}
            {post.published_date ? <span>• {new Date(post.published_date).toLocaleDateString()}</span> : null}
          </div>
        </header>
        {post.image ? (
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        ) : null}
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Like and Comment Stats */}
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border">
          <Button
            variant={hasLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="gap-2"
          >
            <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-serif font-semibold mb-6">Comments</h2>
        
        {/* Add Comment Form */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comment-name">Name *</Label>
                <Input
                  id="comment-name"
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment-email">Email *</Label>
                <Input
                  id="comment-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={newComment.email}
                  onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-text">Comment *</Label>
              <Textarea
                id="comment-text"
                placeholder="Share your thoughts..."
                value={newComment.comment}
                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitComment} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Comment
            </Button>
          </div>
        </Card>

        {/* Display Comments */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                    {comment.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.comment}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Recommended posts */}
      {recommended.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recommended reads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recommended.map((rec) => (
              <Link key={rec.id} href={`/blogs/${rec.slug}`} className="group">
                <Card className="modern-card p-4">
                  <h3 className="font-medium group-hover:text-secondary transition-colors">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{rec.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                    {rec.category ? <span>{rec.category}</span> : null}
                    {rec.read_time ? <span>• {rec.read_time}</span> : null}
                    {rec.published_date ? <span>• {new Date(rec.published_date).toLocaleDateString()}</span> : null}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
