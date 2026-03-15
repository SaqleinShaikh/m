# Contact Form Email Setup Guide

## 🔧 Issue Fixed

I've updated your contact form to use a proper API route instead of EmailJS. The contact form will now send emails directly through your Gmail account using Nodemailer.

## 📧 Gmail App Password Setup

To make the contact form work, you need to set up a Gmail App Password:
agmb avkk xomo pbcq

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "2-Step Verification"
3. Follow the steps to enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "Portfolio Website" as the name
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
In your `.env.local` file, replace this line:
```
EMAIL_PASSWORD=your-gmail-app-password-here
```

With your actual app password:
```
EMAIL_PASSWORD=abcd efgh ijkl mnop
```
(Remove the spaces when you paste it)

## 🚀 What's Changed

### New API Route
- Created `/api/send-contact-email` route
- Uses Nodemailer with Gmail SMTP
- Proper error handling and validation
- Professional email formatting

### Updated Contact Form
- Removed EmailJS dependency
- Now uses the new API route
- Better error messages
- Improved user feedback

### Email Features
- **Professional formatting** with HTML styling
- **Reply-to functionality** - you can reply directly to the sender
- **Contact details** clearly displayed
- **Message formatting** with line breaks preserved
- **Security validation** for email format and required fields

## 📋 Environment Variables Required

Make sure these are set in your `.env.local`:

```bash
# Email Configuration
EMAIL_USER=saqleinsheikh43@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# Admin Email (where contact forms are sent)
ADMIN_EMAIL=saqleinsheikh43@gmail.com
```

## 🧪 Testing the Contact Form

After setting up the app password:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test the contact form**:
   - Go to your website's contact section
   - Fill out the form with test data
   - Submit the form
   - Check your Gmail inbox for the message

3. **Expected behavior**:
   - Form shows "Sending..." while processing
   - Success message appears after sending
   - You receive a professionally formatted email
   - You can reply directly to the sender's email

## 🔒 Security Features

- **Input validation** on both client and server
- **Email format validation** using regex
- **XSS protection** with proper HTML escaping
- **Rate limiting** through Vercel's built-in protection
- **Environment variable protection** for sensitive data

## 🎯 Deployment Notes

When deploying to Vercel:

1. **Add environment variables** in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `EMAIL_USER` and `EMAIL_PASSWORD`

2. **Redeploy** after adding variables:
   ```bash
   vercel --prod
   ```

## 🆘 Troubleshooting

### Common Issues:

1. **"Email service not configured" error**:
   - Check that `EMAIL_USER` and `EMAIL_PASSWORD` are set
   - Restart your development server

2. **"Authentication failed" error**:
   - Verify your Gmail app password is correct
   - Make sure 2-Step Verification is enabled
   - Try generating a new app password

3. **Emails not received**:
   - Check your spam folder
   - Verify the email address in the API route is correct
   - Test with a different email provider

4. **Form submission fails**:
   - Check browser console for errors
   - Verify all required fields are filled
   - Check network tab for API response

## ✅ Success Indicators

You'll know it's working when:
- Contact form submits without errors
- Success message appears after submission
- You receive formatted emails in your Gmail
- Reply-to functionality works correctly

The contact form is now much more reliable and professional than the previous EmailJS setup!