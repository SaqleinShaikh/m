import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getEmailTransporter, getEmailFrom } from '@/lib/email-service'
import { logEmailTrigger } from '@/lib/email-logger'
import path from 'path'

async function sendResumeRequestNotification(requestData: {
  name: string
  email: string
  reason: string
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return

  try {
    const transporter = getEmailTransporter()

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    const portfolioUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const adminLoginUrl = `${portfolioUrl}/loginlocal`
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'saqleinsheikh43@gmail.com'
    const bccEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || undefined

    // Send notification to Admin
    await transporter.sendMail({
      from: getEmailFrom('Saqlein Shaikh | Portfolio'),
      to: 'saqleinsheikh43@gmail.com',
      bcc: bccEmail,
      subject: `New Resume Download Request from ${requestData.name}`,
      text: `New Resume Download Request\n\nA user has submitted a request to download your resume.\n\nDetails:\nName: ${requestData.name}\nEmail: ${requestData.email}\nReason for Request: "${requestData.reason}"\nSubmitted At: ${submittedAt}\n\nPlease review this request in the admin dashboard:\n${adminLoginUrl}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .header-title { font-size: 18px !important; }
      .content-body { padding: 15px !important; }
      .meta-cell { display: block !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid #e2e8f0 !important; }
      .meta-cell:last-child { border-bottom: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;" class="container">
    <tr><td>

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px 8px 0 0;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Portfolio Admin</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;" class="header-title">New Resume Request</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:20px;" class="content-body">

          <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.5;">
            A user has submitted a request to download your resume.
          </p>

          <!-- Requester Details Card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;width:100% !important;table-layout:fixed;overflow:hidden;">
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;">
                <tr>
                  <td style="vertical-align:top;padding-bottom:15px;">
                    <p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:#1e293b;">${requestData.name}</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#64748b;line-height:1.4;">${requestData.email}</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;width:100% !important;">
                <tr><td style="padding-top:15px;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Reason for Request:</p>
                  <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;font-style:italic;">"${requestData.reason}"</p>
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Meta row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:20px;">
            <tr>
              <td class="meta-cell" style="padding:12px;border-right:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Submitted</p>
                <p style="margin:4px 0 0;font-size:12px;color:#475569;">${submittedAt}</p>
              </td>
              <td class="meta-cell" style="padding:12px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Status</p>
                <p style="margin:4px 0 0;font-size:12px;color:#d97706;">Pending Approval</p>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;">
              <a href="${adminLoginUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">
                Review Resume Requests
              </a>
            </td></tr>
          </table>

        </td></tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:15px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">Automated notification</p>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`,
    })

    // Log success
    await logEmailTrigger({
      sender: fromEmail,
      recipient: 'saqleinsheikh43@gmail.com',
      subject: `New Resume Download Request from ${requestData.name}`,
      emailType: 'unknown',
      status: 'sent'
    })

  } catch (sendErr: any) {
    console.error('Failed to send admin resume request email:', sendErr)
    try {
      const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'saqleinsheikh43@gmail.com'
      await logEmailTrigger({
        sender: fromEmail,
        recipient: 'saqleinsheikh43@gmail.com',
        subject: `New Resume Download Request from ${requestData.name}`,
        emailType: 'unknown',
        status: 'fail',
        errorMessage: sendErr?.message || String(sendErr)
      })
    } catch (logErr) {
      console.error('Failed to log failed admin resume notification:', logErr)
    }
  }
}

async function sendResumeApprovedNotification(requestData: {
  name: string
  email: string
  reason: string
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return

  try {
    const transporter = getEmailTransporter()

    const portfolioUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'saqleinsheikh43@gmail.com'
    const bccEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || undefined

    const resumePath = path.join(process.cwd(), 'public', 'Saqlein-Shaikh.pdf')

    // Send Resume PDF to Requester
    await transporter.sendMail({
      from: getEmailFrom('Saqlein Shaikh | Portfolio'),
      to: requestData.email,
      bcc: bccEmail,
      subject: `Your Resume Request is Approved! – Saqlein Shaikh`,
      text: `Hi ${requestData.name},\n\nGreat news! Your request to download my resume has been approved. I have attached the PDF version of my resume to this email.\n\nIf you have any further questions or would like to discuss potential opportunities, feel free to visit my website at ${portfolioUrl} or reply directly to this email.\n\nBest regards,\nSaqlein Shaikh\nMendix Developer · Deloitte`,
      attachments: [
        {
          filename: 'Saqlein-Shaikh-Resume.pdf',
          path: resumePath
        }
      ],
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:20px;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;width:100%;table-layout:fixed;">
    <tr><td>

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#10b981,#059669);border-radius:8px 8px 0 0;">
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Saqlein Shaikh &middot; Portfolio</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">🎉 Resume Request Approved!</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:28px 32px;">

          <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;">
            Hi ${requestData.name},
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;">
            Great news! Your request to download my resume has been approved. I have attached the PDF version of my resume to this email.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7;">
            If you have any further questions or would like to discuss potential opportunities, feel free to visit my website or reply directly to this email.
          </p>

          <!-- CTA to View Site -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="text-align:center;">
              <a href="${portfolioUrl}" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                Visit My Portfolio
              </a>
            </td></tr>
          </table>

          <p style="margin:16px 0 0;font-size:15px;color:#1e293b;font-weight:600;">
            Best regards,<br>
            <span style="color:#10b981;">Saqlein Shaikh</span><br>
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

    // Log success
    await logEmailTrigger({
      sender: fromEmail,
      recipient: requestData.email,
      subject: `Your Resume Request is Approved! – Saqlein Shaikh`,
      emailType: 'unknown',
      status: 'sent'
    })

  } catch (sendErr: any) {
    console.error('Failed to send resume approval email:', sendErr)
    try {
      const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'saqleinsheikh43@gmail.com'
      await logEmailTrigger({
        sender: fromEmail,
        recipient: requestData.email,
        subject: `Your Resume Request is Approved! – Saqlein Shaikh`,
        emailType: 'unknown',
        status: 'fail',
        errorMessage: sendErr?.message || String(sendErr)
      })
    } catch (logErr) {
      console.error('Failed to log failed resume approval email:', logErr)
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'

    if (!adminView) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('resume_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching resume requests:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error in GET /api/resume-requests:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch resume requests',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.reason) {
      return NextResponse.json({ error: 'Name, email, and reason are required' }, { status: 400 })
    }

    // Insert request
    const { data, error } = await supabaseAdmin
      .from('resume_requests')
      .insert({
        name: body.name,
        email: body.email,
        reason: body.reason,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error inserting resume request:', error)
      throw error
    }

    // Send admin notification
    await sendResumeRequestNotification({
      name: body.name,
      email: body.email,
      reason: body.reason
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/resume-requests:', error)
    return NextResponse.json({ 
      error: 'Failed to create resume request',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    if (!['approved', 'rejected'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Fetch existing request
    const { data: requestRecord, error: fetchError } = await supabaseAdmin
      .from('resume_requests')
      .select('*')
      .eq('id', body.id)
      .single()

    if (fetchError || !requestRecord) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Update status
    const { data, error } = await supabaseAdmin
      .from('resume_requests')
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating resume request:', error)
      throw error
    }

    // If approved, trigger email delivery
    if (body.status === 'approved') {
      await sendResumeApprovedNotification({
        name: data.name,
        email: data.email,
        reason: data.reason
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in PUT /api/resume-requests:', error)
    return NextResponse.json({ 
      error: 'Failed to update resume request',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
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
      .from('resume_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting resume request:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/resume-requests:', error)
    return NextResponse.json({ 
      error: 'Failed to delete resume request',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
