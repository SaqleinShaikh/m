# Admin System Setup Guide

## Overview
This portfolio now includes a complete admin system with database functionality and email notifications.

## Features Implemented

### 1. Admin Authentication
- **Login URL**: `/loginlocal`
- **Username**: `AppAdmin`
- **Password**: `S@qlein050505`
- **Forgot Password**: Email-based password reset

### 2. Admin Dashboard (`/admin/dashboard`)
- Overview of all admin functions
- Quick statistics
- Logout functionality
- View site button

### 3. Email Management (`/admin/emails`)
- View all emails from contact form
- View testimonial submissions
- Mark as read/unread
- Delete emails

### 4. Testimonials Management (`/admin/testimonials`)
- Approve/reject pending testimonials
- View all approved testimonials
- Delete testimonials
- Full testimonial details view

### 5. Blog Management (`/admin/blogs`)
- Create new blog posts
- Edit existing posts
- Delete posts
- Toggle visibility (publish/draft)
- Only visible posts appear on main site

### 6. Settings (`/admin/settings`)
- Change admin email
- Change password
- Email used for password recovery

## Email Configuration

To enable email functionality for password reset:

### Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords": https://myaccount.google.com/apppasswords
5. Select "Mail" and "Windows Computer" (or Other)
6. Click "Generate"
7. Copy the 16-character password

### Step 2: Update .env.local File

Open `.env.local` and update:

```env
EMAIL_USER=saqleinsheikh43@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
```

Replace `your-16-character-app-password-here` with the app password you generated.

### Step 3: Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Database Structure

The application uses a JSON-based file system database located in the `/data` folder:

- `testimonials.json` - All testimonials (pending and approved)
- `blogs.json` - All blog posts with visibility flags
- `emails.json` - All email messages from contact forms
- `admin-settings.json` - Admin credentials and settings

### Migrating to a Real Database

The current structure can easily be migrated to:
- **PostgreSQL** with Prisma
- **MongoDB** with Mongoose
- **MySQL** with any ORM
- **Supabase** for serverless

All API routes are already structured to support database migration.

## API Routes

### Testimonials
- `GET /api/testimonials` - Fetch all testimonials
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials` - Update testimonial
- `DELETE /api/testimonials?id={id}` - Delete testimonial

### Blogs
- `GET /api/blogs` - Fetch all blogs
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs` - Update blog
- `DELETE /api/blogs?id={id}` - Delete blog

### Email
- `POST /api/send-reset-email` - Send password reset email

## Security Notes

1. **Current Implementation**: Uses localStorage for session management
2. **Production Recommendations**:
   - Implement JWT tokens
   - Use HTTP-only cookies
   - Add CSRF protection
   - Implement rate limiting
   - Use environment variables for all secrets
   - Add server-side session validation

## Testing the System

1. **Login**: Navigate to `/loginlocal`
2. **Test Password Reset**: 
   - Click "Forgot Password"
   - Enter: `saqleinsheikh43@gmail.com`
   - Check your email for reset link
3. **Test Testimonials**:
   - Submit a testimonial from main site
   - Login to admin
   - Approve/reject from `/admin/testimonials`
4. **Test Blogs**:
   - Create a blog post from `/admin/blogs`
   - Toggle visibility
   - Check main site to see only visible posts

## Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct
- Check `.env.local` file exists and has correct values
- Restart development server after changing `.env.local`
- Check console for error messages

### Database Not Working
- Ensure `/data` folder has write permissions
- Check console for file system errors
- Verify API routes are accessible

### Authentication Issues
- Clear browser localStorage
- Check browser console for errors
- Verify credentials are correct

## Future Enhancements

- [ ] Rich text editor for blog posts
- [ ] Image upload functionality
- [ ] Email templates customization
- [ ] Analytics dashboard
- [ ] Content scheduling
- [ ] Multi-user support
- [ ] Role-based access control
