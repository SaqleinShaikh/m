import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const emailType = searchParams.get('emailType') || ''
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    console.log('[EmailLogs API] GET request received:', { search, status, emailType, limit, offset })

    // Build the query for fetching logs
    let query = supabaseAdmin
      .from('email_logs')
      .select('*', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (emailType) {
      query = query.eq('email_type', emailType)
    }
    if (search) {
      query = query.or(`recipient.ilike.%${search}%,subject.ilike.%${search}%,sender.ilike.%${search}%,error_message.ilike.%${search}%`)
    }

    const { data: logs, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[EmailLogs API] Error fetching email logs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Now let's calculate aggregated statistics for widgets
    // To make this highly efficient, we can retrieve status counts and type counts from the table
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('email_logs')
      .select('status, email_type')

    let stats = {
      total: 0,
      sent: 0,
      failed: 0,
      byType: {
        contact_notification: 0,
        contact_auto_response: 0,
        endorsement_submission: 0,
        endorsement_approval: 0,
        password_reset: 0,
        unknown: 0,
      }
    }

    if (statsError) {
      console.error('[EmailLogs API] Error fetching email stats:', statsError)
    } else if (statsData) {
      stats.total = statsData.length
      statsData.forEach(row => {
        if (row.status === 'sent') {
          stats.sent++
        } else if (row.status === 'fail') {
          stats.failed++
        }

        const type = row.email_type as keyof typeof stats.byType
        if (type in stats.byType) {
          stats.byType[type]++
        } else {
          stats.byType.unknown++
        }
      })
    }

    return NextResponse.json({
      logs: logs || [],
      totalCount: count || 0,
      stats
    })
  } catch (error: any) {
    console.error('[EmailLogs API] Unexpected error in GET route:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch email logs' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (clearAll) {
      console.log('[EmailLogs API] Clearing all email logs')
      const { error } = await supabaseAdmin
        .from('email_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all records

      if (error) {
        console.error('[EmailLogs API] Error clearing all email logs:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'All logs cleared successfully' })
    }

    if (!id) {
      return NextResponse.json({ error: 'Log ID or clearAll parameter is required' }, { status: 400 })
    }

    console.log('[EmailLogs API] Deleting log ID:', id)
    const { error } = await supabaseAdmin
      .from('email_logs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[EmailLogs API] Error deleting log:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Log deleted successfully' })
  } catch (error: any) {
    console.error('[EmailLogs API] Unexpected error in DELETE route:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete email log(s)' }, { status: 500 })
  }
}
