"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle } from "lucide-react"

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  read_time: string
  published_date: string
  image: string
  likes_count: number
  comments_count: number
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching blogs:', err)
        setBlogs([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-muted-foreground">Loading blogs...</p>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-balance">All Blogs</h1>
        <p className="text-muted-foreground mt-2">Browse every post in one place.</p>
      </header>

      <section aria-label="All blog posts" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
            <Card className="modern-card overflow-hidden">
              {post.image ? (
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-40 object-cover" />
              ) : null}
              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:text-secondary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                  {post.category ? <span>{post.category}</span> : null}
                  {post.read_time ? <span>• {post.read_time}</span> : null}
                  {post.published_date ? <span>• {new Date(post.published_date).toLocaleDateString()}</span> : null}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {post.likes_count || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.comments_count || 0}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  )
}
