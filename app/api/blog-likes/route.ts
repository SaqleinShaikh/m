import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Get likes for a blog
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blogId')
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('blog_likes')
      .select('*')
      .eq('blog_id', blogId)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching blog likes:', error)
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}

// POST - Add a like
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { blogId, userName, userEmail } = body

    if (!blogId || !userName || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('blog_likes')
      .insert({
        blog_id: blogId,
        user_name: userName,
        user_email: userEmail
      })
      .select()
      .single()

    if (error) {
      // Check if it's a duplicate like
      if (error.code === '23505') {
        return NextResponse.json({ error: 'You have already liked this blog' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding like:', error)
    return NextResponse.json({ error: 'Failed to add like' }, { status: 500 })
  }
}

// DELETE - Remove a like
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blogId')
    const userEmail = searchParams.get('userEmail')

    if (!blogId || !userEmail) {
      return NextResponse.json({ error: 'Blog ID and user email are required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('blog_likes')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_email', userEmail)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing like:', error)
    return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 })
  }
}
