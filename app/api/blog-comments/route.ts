import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Get comments for a blog
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blogId')
    const admin = searchParams.get('admin') === 'true'
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const client = admin ? supabaseAdmin : supabase
    let query = client
      .from('blog_comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: false })

    // Non-admin users only see approved comments
    if (!admin) {
      query = query.eq('approved', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching blog comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST - Add a comment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { blogId, userName, userEmail, comment } = body

    if (!blogId || !userName || !userEmail || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('blog_comments')
      .insert({
        blog_id: blogId,
        user_name: userName,
        user_email: userEmail,
        comment: comment,
        approved: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}

// PUT - Update comment (approve/reject)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, approved } = body

    if (!id || approved === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('blog_comments')
      .update({ approved })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

// DELETE - Delete a comment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('blog_comments')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
