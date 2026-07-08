import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .select('setting_key, setting_value')
      .like('setting_key', 'social_%')

    if (error) throw error

    // convert to intermediate structured list
    const platformData: Record<string, { url: string; enabled: boolean }> = {}
    
    data?.forEach(row => {
      const key = row.setting_key.replace('social_', '')
      if (key.endsWith('_enabled')) {
        const platform = key.replace('_enabled', '')
        if (!platformData[platform]) {
          platformData[platform] = { url: '', enabled: true }
        }
        platformData[platform].enabled = row.setting_value === 'true'
      } else {
        const platform = key
        if (!platformData[platform]) {
          platformData[platform] = { url: '', enabled: true }
        }
        platformData[platform].url = row.setting_value
      }
    })

    if (isAdmin) {
      // return array of { platform, url, enabled }
      const result = Object.entries(platformData).map(([platform, val]) => ({
        platform,
        url: val.url,
        enabled: val.enabled
      }))
      return NextResponse.json(result)
    } else {
      // return flat object of only enabled links
      const result: Record<string, string> = {}
      Object.entries(platformData).forEach(([platform, val]) => {
        if (val.enabled && val.url) {
          result[platform] = val.url
        }
      })
      
      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'public, max-age=10, s-maxage=60, stale-while-revalidate=600'
        }
      })
    }
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // body is array of { platform, url, enabled } or legacy object
    let items: { platform: string; url: string; enabled: boolean }[] = []

    if (Array.isArray(body)) {
      items = body
    } else if (typeof body === 'object' && body !== null) {
      // convert legacy format
      items = Object.entries(body).map(([platform, url]) => ({
        platform,
        url: typeof url === 'string' ? url : '',
        enabled: true
      }))
    } else {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // 1. Get all current social keys in DB
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('admin_settings')
      .select('setting_key')
      .like('setting_key', 'social_%')

    if (selectError) throw selectError

    // 2. Identify keys to delete (those not present in the new list)
    const newKeys = new Set<string>()
    items.forEach((item: any) => {
      const plat = item.platform.toLowerCase().trim()
      if (plat) {
        newKeys.add(`social_${plat}`)
        newKeys.add(`social_${plat}_enabled`)
      }
    })

    const keysToDelete = existing
      ? existing
          .map(row => row.setting_key)
          .filter(key => !newKeys.has(key))
      : []

    if (keysToDelete.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('admin_settings')
        .delete()
        .in('setting_key', keysToDelete)
      if (deleteError) throw deleteError
    }

    // 3. Upsert the new list
    const upsertRows: { setting_key: string; setting_value: string }[] = []
    items.forEach((item: any) => {
      const plat = item.platform.toLowerCase().trim()
      if (plat) {
        upsertRows.push({ setting_key: `social_${plat}`, setting_value: item.url || "" })
        upsertRows.push({ setting_key: `social_${plat}_enabled`, setting_value: String(item.enabled) })
      }
    })

    if (upsertRows.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from('admin_settings')
        .upsert(upsertRows, { onConflict: 'setting_key' })
      if (upsertError) throw upsertError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating social links:', error)
    return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 })
  }
}
