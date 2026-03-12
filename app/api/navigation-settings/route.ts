import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Get navigation settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    
    console.log('Navigation settings API called, admin:', admin)
    
    // Use admin client if requesting all settings (for admin panel)
    const client = admin ? supabaseAdmin : supabase
    
    const { data, error } = await client
      .from('navigation_settings')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching navigation settings:', error)
      throw error
    }

    console.log('Navigation settings fetched:', data?.length || 0, 'items')
    console.log('Settings data:', data)

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching navigation settings:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation settings' }, { status: 500 })
  }
}

// PUT - Update navigation setting
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, enabled, display_order } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (enabled !== undefined) updateData.enabled = enabled
    if (display_order !== undefined) updateData.display_order = display_order

    const { data, error } = await supabaseAdmin
      .from('navigation_settings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating navigation setting:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating navigation setting:', error)
    return NextResponse.json({ error: 'Failed to update navigation setting' }, { status: 500 })
  }
}

// POST - Bulk update navigation settings
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 })
    }

    // Update each setting
    const promises = settings.map(setting => 
      supabaseAdmin
        .from('navigation_settings')
        .update({
          enabled: setting.enabled,
          display_order: setting.display_order
        })
        .eq('id', setting.id)
    )

    await Promise.all(promises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error bulk updating navigation settings:', error)
    return NextResponse.json({ error: 'Failed to update navigation settings' }, { status: 500 })
  }
}