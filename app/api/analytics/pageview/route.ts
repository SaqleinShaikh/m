import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, path, title, heartbeat, duration } = body

    if (!sessionId || !path) {
      return NextResponse.json({ error: 'Session ID and path are required' }, { status: 400 })
    }

    // Check if there is an active page view for this path and session in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    
    const { data: recentViews, error: fetchError } = await supabaseAdmin
      .from('analytics_page_views')
      .select('id, duration, created_at')
      .eq('session_id', sessionId)
      .eq('path', path)
      .gt('created_at', thirtyMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.warn('Error fetching recent page view:', fetchError.message)
      // Return success true to avoid breaking frontend if tables are missing
      return NextResponse.json({ success: false, error: fetchError.message })
    }

    if (recentViews && recentViews.length > 0) {
      const activeView = recentViews[0]
      let newDuration = activeView.duration

      if (heartbeat) {
        // Increment by heartbeat interval (e.g., 10 seconds)
        newDuration += 10
      } else if (duration !== undefined) {
        // Explicitly set duration
        newDuration = duration
      }

      const { error: updateError } = await supabaseAdmin
        .from('analytics_page_views')
        .update({
          duration: newDuration,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeView.id)

      if (updateError) {
        console.error('Error updating page view duration:', updateError.message)
        return NextResponse.json({ success: false, error: updateError.message })
      }
    } else {
      // Create new page view
      const { error: insertError } = await supabaseAdmin
        .from('analytics_page_views')
        .insert({
          session_id: sessionId,
          path,
          title: title || path,
          duration: duration || 0
        })

      if (insertError) {
        console.error('Error inserting page view:', insertError.message)
        return NextResponse.json({ success: false, error: insertError.message })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics pageview tracking error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
