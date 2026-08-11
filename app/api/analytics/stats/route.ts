import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'

    let startDate = new Date()
    if (timeframe === '24h') {
      startDate.setDate(startDate.getDate() - 1)
    } else if (timeframe === '30d') {
      startDate.setDate(startDate.getDate() - 30)
    } else {
      startDate.setDate(startDate.getDate() - 7)
    }
    const startDateString = startDate.toISOString()

    // 1. Fetch total sessions with location & device info
    const { data: sessionsData, error: sessionsError } = await supabaseAdmin
      .from('analytics_sessions')
      .select('session_id, country, created_at, device_type, browser, os, screen_size')
      .gt('created_at', startDateString)

    if (sessionsError) {
      console.warn('Analytics stats query failed. Database tables may not exist yet:', sessionsError.message)
      return NextResponse.json({ 
        error: 'Database not initialized', 
        message: 'Please run the analytics.sql script in your Supabase SQL Editor.',
        tablesMissing: true
      }, { status: 200 })
    }

    const totalSessions = sessionsData?.length || 0

    // 2. Fetch total page views count
    const { count: totalPageViews } = await supabaseAdmin
      .from('analytics_page_views')
      .select('*', { head: true, count: 'exact' })
      .gt('created_at', startDateString)

    // 3. Fetch sum of durations
    const { data: durationData } = await supabaseAdmin
      .from('analytics_page_views')
      .select('duration')
      .gt('created_at', startDateString)

    const totalDuration = durationData?.reduce((acc, row) => acc + row.duration, 0) || 0
    const avgDuration = totalSessions ? Math.round(totalDuration / totalSessions) : 0

    // 4. Calculate unique countries count
    const uniqueCountries = new Set(sessionsData?.map(c => c.country).filter(Boolean)).size

    // 5. Fetch live active users (sessions with page views updated in the last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: activeSessions } = await supabaseAdmin
      .from('analytics_page_views')
      .select('session_id')
      .gt('updated_at', fiveMinutesAgo)

    const liveActiveUsers = new Set(activeSessions?.map(s => s.session_id)).size

    // 6. Fetch top pages
    const { data: pageViewsList } = await supabaseAdmin
      .from('analytics_page_views')
      .select('path, title, duration')
      .gt('created_at', startDateString)

    const topPagesMap: Record<string, { path: string; title: string; views: number; totalTime: number }> = {}
    pageViewsList?.forEach(pv => {
      if (!topPagesMap[pv.path]) {
        topPagesMap[pv.path] = { path: pv.path, title: pv.title || pv.path, views: 0, totalTime: 0 }
      }
      topPagesMap[pv.path].views++
      topPagesMap[pv.path].totalTime += pv.duration
    })

    const topPages = Object.values(topPagesMap)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // 7. Calculate device, browser, OS, and location statistics
    const countryStatsMap: Record<string, number> = {}
    const deviceStatsMap: Record<string, number> = {}
    const browserStatsMap: Record<string, number> = {}
    const osStatsMap: Record<string, number> = {}
    const screenStatsMap: Record<string, number> = {}

    sessionsData?.forEach(s => {
      const country = s.country || 'Unknown'
      const device = s.device_type || 'Desktop'
      const browser = s.browser || 'Unknown'
      const os = s.os || 'Unknown OS'
      const screen = s.screen_size || 'Unknown'

      countryStatsMap[country] = (countryStatsMap[country] || 0) + 1
      deviceStatsMap[device] = (deviceStatsMap[device] || 0) + 1
      browserStatsMap[browser] = (browserStatsMap[browser] || 0) + 1
      osStatsMap[os] = (osStatsMap[os] || 0) + 1
      screenStatsMap[screen] = (screenStatsMap[screen] || 0) + 1
    })

    const countryStats = Object.entries(countryStatsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    const deviceStats = Object.entries(deviceStatsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const browserStats = Object.entries(browserStatsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    const osStats = Object.entries(osStatsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    const screenStats = Object.entries(screenStatsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    // 8. Fetch visits chart data (group by date)
    const { data: chartViews } = await supabaseAdmin
      .from('analytics_page_views')
      .select('created_at')
      .gt('created_at', startDateString)

    const chartDataMap: Record<string, { date: string; visits: number; pageviews: number }> = {}

    // Initialize chart dates
    const dateLimit = timeframe === '24h' ? 24 : timeframe === '30d' ? 30 : 7
    for (let i = dateLimit - 1; i >= 0; i--) {
      const d = new Date()
      let dateKey = ''
      if (timeframe === '24h') {
        d.setHours(d.getHours() - i)
        dateKey = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        d.setDate(d.getDate() - i)
        dateKey = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
      }
      chartDataMap[dateKey] = { date: dateKey, visits: 0, pageviews: 0 }
    }

    // Populate chart dates
    sessionsData?.forEach(s => {
      const d = new Date(s.created_at)
      const dateKey = timeframe === '24h'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
      if (chartDataMap[dateKey]) {
        chartDataMap[dateKey].visits++
      }
    })

    chartViews?.forEach(v => {
      const d = new Date(v.created_at)
      const dateKey = timeframe === '24h'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
      if (chartDataMap[dateKey]) {
        chartDataMap[dateKey].pageviews++
      }
    })

    const chartData = Object.values(chartDataMap)

    // 9. Fetch detailed visitor log (recent sessions with their page views)
    const { data: recentSessions } = await supabaseAdmin
      .from('analytics_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)

    const { data: sessionPageViews } = await supabaseAdmin
      .from('analytics_page_views')
      .select('session_id, path, title, duration, created_at')
      .in('session_id', recentSessions?.map(s => s.session_id) || [])
      .order('created_at', { ascending: true })

    const visitorLogs = recentSessions?.map(session => {
      const pvs = sessionPageViews?.filter(pv => pv.session_id === session.session_id) || []
      const totalTime = pvs.reduce((acc, pv) => acc + pv.duration, 0)
      return {
        id: session.id,
        sessionId: session.session_id,
        country: session.country,
        region: session.region,
        city: session.city,
        userAgent: session.user_agent,
        referrer: session.referrer,
        createdAt: session.created_at,
        deviceType: session.device_type || 'Desktop',
        browser: session.browser || 'Unknown',
        os: session.os || 'Unknown OS',
        screenSize: session.screen_size || 'Unknown',
        pageFlow: pvs.map(pv => ({
          path: pv.path,
          title: pv.title,
          duration: pv.duration,
          visitedAt: pv.created_at
        })),
        totalTime
      }
    }) || []

    return NextResponse.json({
      success: true,
      stats: {
        totalVisits: totalSessions,
        totalPageViews: totalPageViews || 0,
        avgDuration,
        uniqueLocations: uniqueCountries,
        liveActiveUsers
      },
      chartData,
      topPages,
      countryStats,
      deviceStats,
      browserStats,
      osStats,
      screenStats,
      visitorLogs
    })

  } catch (error: any) {
    console.error('Analytics stats fetching error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics statistics', details: error.message }, { status: 500 })
  }
}
