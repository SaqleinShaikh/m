import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .select('setting_key, setting_value')
      .like('setting_key', 'social_%')

    if (error) throw error

    // convert to object
    const links: Record<string, string> = {}
    data?.forEach(row => {
      links[row.setting_key.replace('social_', '')] = row.setting_value
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // body is { linkedin: "...", github: "..." }
    
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        // upsert
        await supabaseAdmin
          .from('admin_settings')
          .upsert({ 
            setting_key: `social_${key}`, 
            setting_value: value 
          }, { onConflict: 'setting_key' })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating social links:', error)
    return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 })
  }
}
