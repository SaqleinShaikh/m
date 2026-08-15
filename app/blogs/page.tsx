import type { Metadata } from "next"
import { supabaseAdmin } from "@/lib/supabase"
import BlogsListClient from "./blogs-list-client"

// ISR: cache for 60 seconds, regenerate on next request after expiry
export const revalidate = 60

export const metadata: Metadata = {
  title: "Blog | Saqlein Shaikh",
  description: "Browse all articles by Saqlein Shaikh – Mendix Developer, UX thinker, and technology enthusiast.",
}

export default async function BlogsPage() {
  const { data: blogs, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, read_time, published_date, image, likes_count, comments_count")
    .eq("visible", true)
    .order("created_at", { ascending: false })

  const posts = error ? [] : (blogs ?? [])

  return <BlogsListClient initialBlogs={posts} />
}
