import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import BlogDetailClient from "./blog-client"

// ISR: cache this page for 60 seconds, then re-generate on next request
export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * generateMetadata runs on the SERVER at request time.
 * LinkedIn, Twitter, Google and all crawlers will see these tags
 * because the HTML is rendered before JS runs.
 * Uses supabaseAdmin to bypass RLS so OG tags always populate.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://saqleinshaikh.in"

  try {
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("title, excerpt, image, author, category, published_date, slug")
      .eq("slug", slug)
      .eq("visible", true)
      .single()

    if (error || !post) {
      return {
        title: "Blog | Saqlein Shaikh",
        description: "Read the latest articles by Saqlein Shaikh – Mendix Developer at Deloitte.",
      }
    }

    const title = `${post.title} | Saqlein Shaikh`
    const description = post.excerpt || `Read "${post.title}" by ${post.author || "Saqlein Shaikh"}.`
    const canonicalUrl = `${baseUrl}/blogs/${post.slug}`

    // Resolve the cover image to an absolute URL
    let imageUrl = post.image || ""
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
    }

    return {
      title,
      description,
      authors: [{ name: post.author || "Saqlein Shaikh" }],
      openGraph: {
        type: "article",
        url: canonicalUrl,
        title,
        description,
        siteName: "Saqlein Shaikh Portfolio",
        ...(imageUrl
          ? {
              images: [
                {
                  url: imageUrl,
                  width: 1200,
                  height: 630,
                  alt: post.title,
                },
              ],
            }
          : {}),
        publishedTime: post.published_date,
        authors: [post.author || "Saqlein Shaikh"],
        tags: post.category ? [post.category] : [],
      },
      twitter: {
        card: imageUrl ? "summary_large_image" : "summary",
        title,
        description,
        ...(imageUrl ? { images: [imageUrl] } : {}),
        creator: "@SaqleinShaikh",
      },
      alternates: {
        canonical: canonicalUrl,
      },
    }
  } catch {
    return {
      title: "Blog | Saqlein Shaikh",
      description: "Read the latest articles by Saqlein Shaikh – Mendix Developer at Deloitte.",
    }
  }
}

/**
 * Server Component — fetches the full post on the server and passes it
 * as `initialPost` to the client component. This means the article HTML
 * is embedded in the first server response — no loading spinner on direct
 * links or social shares.
 */
export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params

  const { data: post, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("visible", true)
    .single()

  if (error || !post) {
    notFound()
  }

  return <BlogDetailClient initialPost={post} />
}
