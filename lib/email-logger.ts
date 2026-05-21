import { supabaseAdmin } from './supabase'

export type EmailType = 
  | 'contact_notification' 
  | 'contact_auto_response' 
  | 'endorsement_submission' 
  | 'endorsement_approval' 
  | 'password_reset' 
  | 'unknown'

interface LogEmailParams {
  sender: string
  recipient: string
  subject: string
  emailType: EmailType
  status: 'sent' | 'fail'
  errorMessage?: string | null
}

/**
 * Logs a system-triggered email's metadata and delivery status to Supabase.
 * Safe to call from Next.js server-side files (API routes).
 */
export async function logEmailTrigger(params: LogEmailParams) {
  try {
    const { sender, recipient, subject, emailType, status, errorMessage } = params

    console.log(`[EmailLogger] Logging system email trigger:`, {
      type: emailType,
      recipient,
      status
    })

    const { data, error } = await supabaseAdmin
      .from('email_logs')
      .insert({
        sender,
        recipient,
        subject,
        email_type: emailType,
        status,
        error_message: errorMessage || null
      })
      .select()
      .single()

    if (error) {
      console.error('[EmailLogger] Failed to insert log row in Supabase:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('[EmailLogger] Unexpected error while logging email trigger:', err)
    return { success: false, error: err }
  }
}
