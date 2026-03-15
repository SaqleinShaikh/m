import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    console.log('Contact form submission received:', { name, email, messageLength: message?.length });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed: missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email configuration exists
    console.log('Checking email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email configuration missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    console.log('Creating email transporter...');
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Test the connection
    console.log('Testing email connection...');
    await transporter.verify();
    console.log('Email connection verified successfully');

    // Email to you (notification)
    const notificationEmail = {
      from: `"Saqlein Shaikh | Portfolio" <${process.env.EMAIL_USER}>`,
      to: 'saqleinsheikh43@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #007bff; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              This message was sent from your portfolio website contact form.
              You can reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    };

    // Auto-response email to the sender
    const autoResponseEmail = {
      from: `"Saqlein Shaikh | Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for reaching out - Saqlein Shaikh`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for your message</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header with gradient background -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                Saqlein Shaikh
              </h1>
              <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
                Mendix Developer | Portfolio
              </p>
            </div>

            <!-- Main content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                Thank you for reaching out, ${name}!
              </h2>
              
              <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px;">
                I appreciate you taking the time to contact me through my portfolio website. Your message has been received and I'm excited to learn more about your inquiry.
              </p>
              
              <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px;">
                I review all messages personally and will get back to you as soon as possible, typically within 24-48 hours. In the meantime, I encourage you to explore more about my work and experience.
              </p>

              <!-- Call-to-action button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-portfolio-url.com'}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                  Explore My Portfolio
                </a>
              </div>

              <!-- What to explore section -->
              <div style="background-color: #f7fafc; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                  While you wait, explore:
                </h3>
                <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 15px;">
                  <li style="margin-bottom: 8px;">🚀 <strong>My Projects:</strong> Innovative Mendix applications and solutions</li>
                  <li style="margin-bottom: 8px;">💼 <strong>Professional Experience:</strong> Journey at Deloitte and beyond</li>
                  <li style="margin-bottom: 8px;">🛠️ <strong>Technical Skills:</strong> Mendix development expertise and certifications</li>
                  <li style="margin-bottom: 8px;">📝 <strong>Blog Posts:</strong> Insights on development and technology trends</li>
                  <li style="margin-bottom: 8px;">⭐ <strong>Client Testimonials:</strong> Feedback from successful collaborations</li>
                </ul>
              </div>

              <!-- Contact info -->
              <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="color: #2d3748; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                  Need immediate assistance?
                </h4>
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  📧 Email: saqleinsheikh43@gmail.com<br>
                  📱 Phone: +91 88309 83065<br>
                  💼 LinkedIn: <a href="https://www.linkedin.com/in/saqlein-shaikh" style="color: #667eea; text-decoration: none;">linkedin.com/in/saqlein-shaikh</a>
                </p>
              </div>

              <p style="color: #4a5568; margin: 25px 0 0 0; font-size: 16px;">
                Thank you again for your interest. I look forward to connecting with you soon!
              </p>
              
              <p style="color: #2d3748; margin: 15px 0 0 0; font-size: 16px; font-weight: 600;">
                Best regards,<br>
                <span style="color: #667eea;">Saqlein Shaikh</span><br>
                <span style="color: #718096; font-size: 14px; font-weight: 400;">Mendix Developer | Deloitte</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #2d3748; padding: 25px 30px; text-align: center;">
              <p style="color: #a0aec0; margin: 0; font-size: 14px;">
                This is an automated response from Saqlein Shaikh's portfolio website.
              </p>
              <p style="color: #718096; margin: 8px 0 0 0; font-size: 12px;">
                © ${new Date().getFullYear()} Saqlein Shaikh. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('Sending notification email to admin...');
    // Send notification email to you
    const notificationResult = await transporter.sendMail(notificationEmail);
    console.log('Notification email sent successfully:', notificationResult.messageId);

    console.log('Sending auto-response email to sender...');
    // Send auto-response email to the sender
    const autoResponseResult = await transporter.sendMail(autoResponseEmail);
    console.log('Auto-response email sent successfully:', autoResponseResult.messageId);

    return NextResponse.json(
      { message: 'Emails sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Detailed error sending contact emails:', error);
    
    // More specific error messages
    let errorMessage = 'Failed to send email. Please try again later.';
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Email authentication failed. Please check email configuration.';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Unable to connect to email server. Please try again later.';
      }
      console.error('Error details:', error.message);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}