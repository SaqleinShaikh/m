import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (use only in API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string
          name: string
          email: string
          designation: string
          organization: string
          testimonial: string
          image: string
          rating: number
          approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          image: string
          author: string
          category: string
          visible: boolean
          published_date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      email_messages: {
        Row: {
          id: string
          type: 'contact' | 'testimonial'
          from_name: string
          from_email: string
          subject: string | null
          message: string
          phone: string | null
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['email_messages']['Insert']>
      }
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['admin_settings']['Insert']>
      }
    }
  }
}
