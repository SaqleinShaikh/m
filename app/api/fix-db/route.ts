import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: existing, error: err1 } = await supabaseAdmin
      .from('navigation_settings')
      .select('*')
      .eq('section_key', 'testimonials')
      .single()

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('navigation_settings')
        .update({
          section_key: 'endorsements',
          section_name: 'Endorsements'
        })
        .eq('section_key', 'testimonials')
      
      if (error) throw error

      return NextResponse.json({ success: true, message: 'Updated testimonials to endorsements' })
    }

    return NextResponse.json({ success: true, message: 'Nothing to update' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
