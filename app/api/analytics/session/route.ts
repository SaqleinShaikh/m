import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

const SALT = process.env.SUPABASE_SERVICE_ROLE_KEY || 'analytics-local-salt-key-12345'

function parseUserAgent(uaString: string) {
  let deviceType = 'Desktop'
  let os = 'Unknown OS'
  let browser = 'Unknown Browser'

  if (/mobile/i.test(uaString)) {
    deviceType = 'Mobile'
  } else if (/tablet|ipad/i.test(uaString)) {
    deviceType = 'Tablet'
  }

  if (/windows/i.test(uaString)) {
    os = 'Windows'
  } else if (/macintosh|mac os x/i.test(uaString)) {
    os = 'macOS'
  } else if (/iphone|ipad|ipod/i.test(uaString)) {
    os = 'iOS'
  } else if (/android/i.test(uaString)) {
    os = 'Android'
  } else if (/linux/i.test(uaString)) {
    os = 'Linux'
  }

  if (/chrome|crios/i.test(uaString) && !/edge|edg/i.test(uaString) && !/opr/i.test(uaString)) {
    browser = 'Chrome'
  } else if (/safari/i.test(uaString) && !/chrome|crios/i.test(uaString)) {
    browser = 'Safari'
  } else if (/firefox|fxios/i.test(uaString)) {
    browser = 'Firefox'
  } else if (/edge|edg/i.test(uaString)) {
    browser = 'Edge'
  } else if (/opr/i.test(uaString)) {
    browser = 'Opera'
  }

  return { deviceType, os, browser }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, referrer, screenSize } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const xForwardedFor = request.headers.get('x-forwarded-for')
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : '127.0.0.1'
    const ipHash = crypto.createHash('sha256').update(ip + SALT).digest('hex')
    const userAgent = request.headers.get('user-agent') || ''

    const { deviceType, os, browser } = parseUserAgent(userAgent)

    let country = request.headers.get('x-vercel-ip-country') || null
    let region = request.headers.get('x-vercel-ip-country-region') || null
    let city = request.headers.get('x-vercel-ip-city') || null

    if (country) country = decodeURIComponent(country)
    if (region) region = decodeURIComponent(region)
    if (city) city = decodeURIComponent(city)

    const isLocalIp = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')
    
    if ((!country || !city) && !isLocalIp) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 800) // Reduced to 800ms to stay extremely fast
        
        const geoResponse = await fetch(`https://freeipapi.com/api/json/${ip}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json()
          if (geoData && geoData.countryName) {
            country = geoData.countryName
            region = geoData.regionName || null
            city = geoData.cityName || null
          }
        }
      } catch (err) {
        console.error('GeoIP lookup failed/timed out:', err)
      }
    }

    country = country || (isLocalIp ? 'Local Development' : 'Unknown')
    region = region || (isLocalIp ? 'Local Region' : 'Unknown')
    city = city || (isLocalIp ? 'Local City' : 'Unknown')

    const { error } = await supabaseAdmin
      .from('analytics_sessions')
      .upsert({
        session_id: sessionId,
        ip_hash: ipHash,
        country,
        region,
        city,
        user_agent: userAgent,
        referrer: referrer || null,
        device_type: deviceType,
        browser,
        os,
        screen_size: screenSize || null
      }, {
        onConflict: 'session_id'
      })

    if (error) {
      console.warn('Could not save session. DB table may not be initialized:', error.message)
      return NextResponse.json({ 
        success: false, 
        message: 'Database tables not initialized. Please run the analytics.sql migration in your Supabase console.',
        error: error.message 
      }, { status: 200 })
    }

    return NextResponse.json({ success: true, location: { country, region, city } })
  } catch (error: any) {
    console.error('Analytics session tracking error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
