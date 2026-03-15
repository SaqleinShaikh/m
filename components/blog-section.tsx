"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  read_time: string
  image: string
  published_date: string
  visible: boolean
  likes_count: number
  comments_count: number
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
      <section id="blogs" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="blogs" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-primary mb-4">Latest Blogs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharing my thoughts, experiences, and insights from the world of technology and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {blogs.slice(0, 4).map((blog) => (
            <Card
              key={blog.slug}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm cursor-pointer"
              onClick={() => router.push(`/blogs/${blog.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  router.push(`/blogs/${blog.slug}`)
                }
              }}
              aria-label={`Open blog ${blog.title}`}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">{blog.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-serif text-primary mb-2 line-clamp-2 hover:text-accent">
                  <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.published_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {blog.read_time}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {blog.likes_count || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {blog.comments_count || 0}
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/blogs/${blog.slug}`) }}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    Read More →
                  </button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blogs">
            <Button variant="outline" size="lg">
              Show All Blogs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
