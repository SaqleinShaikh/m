import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'

async function sendTestimonialNotification(testimonial: {
  name: string
  email: string
  testimonial: string
  designation?: string
  organization?: string
  image?: string
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    })

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    const adminLoginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/loginlocal`
    const fromName = 'Saqlein Shaikh | Portfolio'
    const hasImage = !!(testimonial.image && testimonial.image.length > 100)

    // ── Admin notification ──────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: 'saqleinsheikh43@gmail.com',
      subject: `New Testimonial Request from ${testimonial.name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td>

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px 8px 0 0;">
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Portfolio Admin</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">New Testimonial Request</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:28px 32px;">

          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">
            A new testimonial has been submitted and is awaiting your approval.
          </p>

          <!-- Submitter details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:20px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Submitted By</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  ${hasImage
                    ? `<td style="padding-right:16px;vertical-align:top;"><img src="${testimonial.image}" alt="" width="52" height="52" style="border-radius:50%;object-fit:cover;display:block;border:2px solid #667eea;" /></td>`
                    : `<td style="padding-right:16px;vertical-align:top;"><div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);text-align:center;line-height:52px;font-size:20px;font-weight:700;color:#ffffff;">${testimonial.name.charAt(0).toUpperCase()}</div></td>`
                  }
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1e293b;">${testimonial.name}</p>
                    ${testimonial.designation ? `<p style="margin:3px 0 0;font-size:13px;color:#667eea;">${testimonial.designation}${testimonial.organization ? ` &middot; ${testimonial.organization}` : ''}</p>` : ''}
                    <p style="margin:3px 0 0;font-size:13px;color:#64748b;">${testimonial.email}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Testimonial content -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #667eea;border-radius:0 6px 6px 0;margin-bottom:20px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Testimonial</p>
              <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;font-style:italic;">"${testimonial.testimonial}"</p>
            </td></tr>
          </table>

          <!-- Meta row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:28px;">
            <tr>
              <td style="padding:14px 20px;border-right:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Submitted</p>
                <p style="margin:4px 0 0;font-size:13px;color:#475569;">${submittedAt} IST</p>
              </td>
              <td style="padding:14px 20px;border-right:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Photo</p>
                <p style="margin:4px 0 0;font-size:13px;color:#475569;">${hasImage ? 'Uploaded' : 'Not uploaded'}</p>
              </td>
              <td style="padding:14px 20px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Status</p>
                <p style="margin:4px 0 0;font-size:13px;color:#d97706;">Pending Approval</p>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;">
              <a href="${adminLoginUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                Review &amp; Approve Testimonial
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">Admin Dashboard &rarr; Testimonials</p>
            </td></tr>
          </table>

        </td></tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:16px 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Automated notification from Saqlein Shaikh's portfolio website.</p>
          <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} Saqlein Shaikh. All rights reserved.</p>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`,
    })

    // ── Confirmation email to submitter ─────────────────────────────────────
    const portfolioUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: testimonial.email,
      subject: `We received your testimonial – Saqlein Shaikh`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td>

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px 8px 0 0;">
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Saqlein Shaikh &middot; Portfolio</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Thank you, ${testimonial.name}!</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:28px 32px;">

          <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;">
            Your testimonial has been successfully received and is currently under review. I personally review every submission to ensure quality and authenticity.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7;">
            Once approved, your testimonial will appear on my portfolio website for visitors to see. You will not receive a separate notification when it goes live, but feel free to check back anytime.
          </p>

          <!-- Submission summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #667eea;border-radius:0 6px 6px 0;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Your Submission</p>
              ${testimonial.designation ? `<p style="margin:0 0 6px;font-size:13px;color:#475569;"><strong>Role:</strong> ${testimonial.designation}${testimonial.organization ? ` at ${testimonial.organization}` : ''}</p>` : ''}
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;font-style:italic;">"${testimonial.testimonial}"</p>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="text-align:center;">
              <a href="${portfolioUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                Visit My Portfolio
              </a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;">
            Thank you again for taking the time to share your experience. It truly means a lot.
          </p>
          <p style="margin:16px 0 0;font-size:15px;color:#1e293b;font-weight:600;">
            Best regards,<br>
            <span style="color:#667eea;">Saqlein Shaikh</span><br>
            <span style="font-size:13px;font-weight:400;color:#64748b;">Mendix Developer &middot; Deloitte</span>
          </p>

        </td></tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:16px 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated message from Saqlein Shaikh's portfolio website.</p>
          <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} Saqlein Shaikh. All rights reserved.</p>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`,
    })

    console.log('Testimonial emails sent successfully')
  } catch (err) {
    console.error('Failed to send testimonial emails:', err)
  }
}

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
    
    // Send email notification to admin
    await sendTestimonialNotification({
      name: body.name,
      email: body.email,
      testimonial: body.testimonial,
      designation: body.designation,
      organization: body.organization,
      image: body.image,
    })
    
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
