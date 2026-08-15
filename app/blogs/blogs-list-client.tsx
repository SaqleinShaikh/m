"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle } from "lucide-react"
import { usePageTransition } from "@/components/page-transition-loader"
import { useEffect } from "react"

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

interface Props {
  initialBlogs: Blog[]
}

export default function BlogsListClient({ initialBlogs }: Props) {
  const router = useRouter()
  const { endTransition, startTransition } = usePageTransition()

  useEffect(() => {
    endTransition()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBlogClick = (slug: string) => {
    startTransition()
    router.push(`/blogs/${slug}`)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-balance">All Blogs</h1>
        <p className="text-muted-foreground mt-2">Browse every post in one place.</p>
      </header>

      {initialBlogs.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No blog posts yet. Check back soon!</p>
      ) : (
        <section aria-label="All blog posts" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBlogs.map((post) => (
            <div
              key={post.id}
              className="group cursor-pointer"
              onClick={() => handleBlogClick(post.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBlogClick(post.slug) }}
              aria-label={`Open blog: ${post.title}`}
            >
              <Card className="modern-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : null}
                <div className="p-4">
                  <h2 className="text-lg font-semibold group-hover:text-secondary transition-colors">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                    {post.category ? <span>{post.category}</span> : null}
                    {post.read_time ? <span>• {post.read_time}</span> : null}
                    {post.published_date ? <span>• {new Date(post.published_date).toLocaleDateString('en-GB')}</span> : null}
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
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
