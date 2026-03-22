"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
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

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [blogs])

  const scrollByAmount = (dir: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section id="blogs" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </section>
    )
  }

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 bg-card/80 backdrop-blur-sm cursor-pointer h-full flex flex-col"
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
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">{blog.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-1">
        <CardTitle className="text-base sm:text-lg font-serif text-primary mb-2 line-clamp-2 hover:text-accent">
          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 flex-1">{blog.excerpt}</p>

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
  )

  return (
    <section id="blogs" className="py-12 sm:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-primary mb-3 sm:mb-4">Latest Blogs</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharing my thoughts, experiences, and insights from the world of technology and development
          </p>
        </div>

        {/* Mobile: Horizontal scrollable */}
        <div className="md:hidden relative mb-8">
          {/* Navigation arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/10 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-accent" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollByAmount(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/10 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-accent" />
            </button>
          )}

          {/* Gradient edge hints */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/80 to-transparent z-[5] pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/80 to-transparent z-[5] pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {blogs.slice(0, 4).map((blog) => (
              <div key={blog.slug} className="flex-shrink-0 w-[280px] snap-start">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>

          {/* Swipe hint */}
          <div className="flex justify-center items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ChevronLeft className="h-3 w-3" />
              Swipe to see more
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {blogs.slice(0, 4).map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
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
