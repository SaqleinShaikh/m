import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'

async function sendEndorsementNotification(endorsement: {
  name: string
  email: string
  endorsement: string
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
    const adminLoginUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/loginlocal`
    const fromName = 'Saqlein Shaikh | Portfolio'
    const hasImage = !!(endorsement.image && endorsement.image.length > 100)
    let attachments: any[] = []
    let imageSrc = ''

    if (hasImage && endorsement.image) {
      if (endorsement.image.startsWith('data:image')) {
        const matches = endorsement.image.match(/^data:(image\/[a-zA-Z0-9]+);base64,/)
        if (matches) {
          const base64Data = endorsement.image.split(',')[1]
          attachments.push({
            filename: 'profile.jpg',
            content: base64Data,
            encoding: 'base64',
            cid: 'profilephoto'
          })
          imageSrc = 'cid:profilephoto'
        } else {
          imageSrc = endorsement.image
        }
      } else {
        imageSrc = endorsement.image
      }
    }

    // ── Admin notification ──────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: 'saqleinsheikh43@gmail.com',
      subject: `New Endorsement Request from ${endorsement.name}`,
      attachments,
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
      .photo-cell { display: block !important; margin-bottom: 10px !important; }
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
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;" class="header-title">New Endorsement Request</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:20px;" class="content-body">

          <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.5;">
            A new endorsement has been submitted and is awaiting your approval.
          </p>

          <!-- Submitter details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:20px;">
            <tr><td style="padding:15px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Submitted By</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  ${hasImage
                    ? `<td class="photo-cell" style="padding-right:15px;vertical-align:top;width:52px;"><img src="${imageSrc}" alt="" width="52" height="52" style="border-radius:50%;object-fit:cover;display:block;border:2px solid #667eea;" /></td>`
                    : `<td class="photo-cell" style="padding-right:15px;vertical-align:top;width:52px;"><div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);text-align:center;line-height:52px;font-size:20px;font-weight:700;color:#ffffff;">${endorsement.name.charAt(0).toUpperCase()}</div></td>`
                  }
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1e293b;">${endorsement.name}</p>
                    ${endorsement.designation ? `<p style="margin:3px 0 0;font-size:13px;color:#667eea;">${endorsement.designation}${endorsement.organization ? ` &middot; ${endorsement.organization}` : ''}</p>` : ''}
                    <p style="margin:3px 0 0;font-size:13px;color:#64748b;word-break:break-all;">${endorsement.email}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Endorsement content -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #667eea;border-radius:0 6px 6px 0;margin-bottom:20px;">
            <tr><td style="padding:15px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Endorsement</p>
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;font-style:italic;">"${endorsement.endorsement}"</p>
            </td></tr>
          </table>

          <!-- Meta row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:20px;">
            <tr>
              <td class="meta-cell" style="padding:12px;border-right:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Submitted</p>
                <p style="margin:4px 0 0;font-size:12px;color:#475569;">${submittedAt}</p>
              </td>
              <td class="meta-cell" style="padding:12px;border-right:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Photo</p>
                <p style="margin:4px 0 0;font-size:12px;color:#475569;">${hasImage ? 'Uploaded' : 'Not uploaded'}</p>
              </td>
              <td class="meta-cell" style="padding:12px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Status</p>
                <p style="margin:4px 0 0;font-size:12px;color:#d97706;">Pending</p>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;">
              <a href="${adminLoginUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">
                Review Endorsement
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

    // ── Confirmation email to submitter ─────────────────────────────────────
    const portfolioUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: endorsement.email,
      subject: `We received your endorsement – Saqlein Shaikh`,
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
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Thank you, ${endorsement.name}!</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:28px 32px;">

          <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;">
            Your endorsement has been successfully received and is currently under review. I personally review every submission to ensure quality and authenticity.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7;">
            Once approved, your endorsement will appear on my portfolio website for visitors to see. You will receive an email notification when it goes live!
          </p>

          <!-- Submission summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #667eea;border-radius:0 6px 6px 0;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Your Submission</p>
              ${endorsement.designation ? `<p style="margin:0 0 6px;font-size:13px;color:#475569;"><strong>Role:</strong> ${endorsement.designation}${endorsement.organization ? ` at ${endorsement.organization}` : ''}</p>` : ''}
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;font-style:italic;">"${endorsement.endorsement}"</p>
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

    console.log('Endorsement emails sent successfully')
  } catch (err) {
    console.error('Failed to send endorsement emails:', err)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'
    
    // Use admin client if requesting all endorsements (for admin panel)
    const client = adminView ? supabaseAdmin : supabase
    
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching endorsements:', error)
      throw error
    }

    const mappedData = data?.map(item => ({
      ...item,
      endorsement: item.testimonial // map DB column to frontend name
    })) || []

    return NextResponse.json(mappedData)
  } catch (error) {
    console.error('Error fetching endorsements:', error)
    return NextResponse.json({ error: 'Failed to fetch endorsements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Received endorsement submission:', { name: body.name, email: body.email })
    
    // Use supabaseAdmin to bypass RLS for insertion
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name: body.name,
        email: body.email,
        designation: body.designation || '',
        organization: body.organization || '',
        testimonial: body.endorsement, // use original column name
        image: body.image || '',
        rating: 5,
        approved: false
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error inserting endorsement:', error)
      throw error
    }
    
    console.log('Endorsement inserted successfully:', data.id)
    const returnedData = { ...data, endorsement: data.testimonial }
    
    // Send email notification to admin
    await sendEndorsementNotification({
      name: body.name,
      email: body.email,
      endorsement: body.endorsement,
      designation: body.designation,
      organization: body.organization,
      image: body.image,
    })
    
    // Also save to email_messages for notification
    const { error: emailError } = await supabaseAdmin
      .from('email_messages')
      .insert({
        type: 'endorsement',
        from_name: body.name,
        from_email: body.email,
        message: body.endorsement,
        read: false
      })
    
    if (emailError) {
      console.error('Error saving to email_messages:', emailError)
      // Don't fail the request if email notification fails
    }
    
    return NextResponse.json(returnedData, { status: 201 })
  } catch (error: any) {
    console.error('Error creating endorsement:', error)
    return NextResponse.json({ 
      error: 'Failed to create endorsement',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // Check if this is an approval action (approved changing to true)
    let wasApproved = false
    if (body.approved === true) {
      // Fetch current state to check if it was previously unapproved
      const { data: current } = await supabaseAdmin
        .from('testimonials')
        .select('approved, email, name, designation, organization, testimonial, image')
        .eq('id', body.id)
        .single()
      
      if (current && !current.approved) {
        wasApproved = true
      }
    }
    
    const updatePayload = { ...body }
    if (updatePayload.endorsement !== undefined) {
      updatePayload.testimonial = updatePayload.endorsement
      delete updatePayload.endorsement
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updatePayload)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error
    
    const updatedData = { ...data, endorsement: data.testimonial }
    
    // Send approval notification email if endorsement was just approved
    if (wasApproved && data) {
      sendApprovalNotification(updatedData).catch(err => 
        console.error('Failed to send approval notification:', err)
      )
    }
    
    return NextResponse.json(updatedData)
  } catch (error) {
    console.error('Error updating endorsement:', error)
    return NextResponse.json({ error: 'Failed to update endorsement' }, { status: 500 })
  }
}

async function sendApprovalNotification(endorsement: {
  name: string
  email: string
  designation?: string
  organization?: string
  endorsement: string
  image?: string
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  })

  const portfolioUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  const fromName = 'Saqlein Shaikh | Portfolio'

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.EMAIL_USER}>`,
    to: endorsement.email,
    subject: `Your endorsement is now live! – Saqlein Shaikh`,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td>

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#10b981,#059669);border-radius:8px 8px 0 0;">
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Saqlein Shaikh &middot; Portfolio</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">🎉 Your Endorsement is Live!</h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:28px 32px;">

          <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;">
            Hi ${endorsement.name},
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;">
            Great news! Your endorsement has been reviewed and approved. It is now live on my portfolio website for everyone to see.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7;">
            Thank you so much for taking the time to share your experience. Your support truly means a lot!
          </p>

          <!-- Endorsement summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;border-radius:0 6px 6px 0;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Your Full Details Submitted</p>
              <p style="margin:0 0 6px;font-size:13px;color:#475569;"><strong>Name:</strong> ${endorsement.name}</p>
              ${endorsement.designation ? `<p style="margin:0 0 6px;font-size:13px;color:#475569;"><strong>Role:</strong> ${endorsement.designation}</p>` : ''}
              ${endorsement.organization ? `<p style="margin:0 0 10px;font-size:13px;color:#475569;"><strong>Organization:</strong> ${endorsement.organization}</p>` : ''}
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;font-style:italic;">"${endorsement.endorsement}"</p>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="text-align:center;">
              <a href="${portfolioUrl}/#endorsements" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                View Your Endorsement
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

  console.log('Approval notification sent to:', endorsement.email)
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
    console.error('Error deleting endorsement:', error)
    return NextResponse.json({ error: 'Failed to delete endorsement' }, { status: 500 })
  }
}
