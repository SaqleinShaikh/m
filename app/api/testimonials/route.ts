import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'
    
    // Use admin client if requesting all testimonials (for admin panel)
    const client = adminView ? supabaseAdmin : supabase
    
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Received testimonial submission:', { name: body.name, email: body.email })
    
    // Use supabaseAdmin to bypass RLS for insertion
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name: body.name,
        email: body.email,
        designation: body.designation || '',
        organization: body.organization || '',
        testimonial: body.testimonial,
        image: body.image || '',
        rating: 5,
        approved: false
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error inserting testimonial:', error)
      throw error
    }
    
    console.log('Testimonial inserted successfully:', data.id)
    
    // Also save to email_messages for notification
    const { error: emailError } = await supabaseAdmin
      .from('email_messages')
      .insert({
        type: 'testimonial',
        from_name: body.name,
        from_email: body.email,
        message: body.testimonial,
        read: false
      })
    
    if (emailError) {
      console.error('Error saving to email_messages:', emailError)
      // Don't fail the request if email notification fails
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ 
      error: 'Failed to create testimonial',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(body)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
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
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
