import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title: body.title,
        slug: slug,
        excerpt: body.excerpt,
        content: body.content,
        image: body.image || '/placeholder.svg',
        author: body.author || 'Saqlein Shaikh',
        category: body.category || 'Technology',
        visible: body.visible !== undefined ? body.visible : false,
        published_date: body.date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) throw error
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(body)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
