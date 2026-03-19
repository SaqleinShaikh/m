import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // This endpoint should be protected in production
    // For now, we'll just run the initialization

    // Check if tables already exist
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('testimonials')
      .select('id')
      .limit(1)

    if (!tablesError) {
      return NextResponse.json({ 
        message: 'Database already initialized',
        status: 'success'
      })
    }

    return NextResponse.json({ 
      message: 'Please run the SQL script in Supabase SQL Editor',
      instructions: [
        '1. Go to your Supabase project dashboard',
        '2. Click on "SQL Editor" in the left sidebar',
        '3. Click "New Query"',
        '4. Copy the contents of supabase/init.sql',
        '5. Paste and run the query',
        '6. Database will be initialized with all tables and policies'
      ],
      status: 'pending'
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check database status
    const checks = []

    // Check endorsements/testimonials table
    const { error: endorsementsError } = await supabaseAdmin
      .from('testimonials')
      .select('id')
      .limit(1)
    checks.push({ table: 'endorsements', exists: !endorsementsError })

    // Check blog_posts table
    const { error: blogsError } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .limit(1)
    checks.push({ table: 'blog_posts', exists: !blogsError })

    // Check email_messages table
    const { error: emailsError } = await supabaseAdmin
      .from('email_messages')
      .select('id')
      .limit(1)
    checks.push({ table: 'email_messages', exists: !emailsError })

    // Check admin_settings table
    const { error: settingsError } = await supabaseAdmin
      .from('admin_settings')
      .select('id')
      .limit(1)
    checks.push({ table: 'admin_settings', exists: !settingsError })

    const allTablesExist = checks.every(check => check.exists)

    return NextResponse.json({
      status: allTablesExist ? 'initialized' : 'not_initialized',
      tables: checks,
      message: allTablesExist 
        ? 'Database is properly initialized' 
        : 'Some tables are missing. Please run the init.sql script.'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check database status' },
      { status: 500 }
    )
  }
}
