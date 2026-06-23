import nodemailer from 'nodemailer'

/**
 * Creates and returns a Nodemailer transporter.
 * If EMAIL_HOST is defined in env variables, it configures a custom SMTP server (like Resend).
 * Otherwise, it falls back to the default Gmail SMTP service.
 */
export function getEmailTransporter() {
  const host = process.env.EMAIL_HOST
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 465
  const secure = process.env.EMAIL_SECURE !== undefined ? process.env.EMAIL_SECURE === 'true' : port === 465
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASSWORD

  if (!user || !pass) {
    throw new Error('Email credentials (EMAIL_USER and EMAIL_PASSWORD) are not configured.')
  }

  if (host) {
    console.log(`[EmailService] Creating custom SMTP transporter for ${host}:${port} (secure: ${secure})`)
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })
  }

  console.log('[EmailService] Falling back to standard Gmail SMTP service')
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  })
}

/**
 * Helper to construct the From field.
 * Uses EMAIL_FROM if defined, otherwise falls back to EMAIL_USER.
 */
export function getEmailFrom(displayName: string = 'Saqlein Shaikh | Portfolio'): string {
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'saqleinsheikh43@gmail.com'
  return `"${displayName}" <${fromEmail}>`
}
