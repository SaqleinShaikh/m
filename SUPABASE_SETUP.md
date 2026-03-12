# 🚀 Supabase Database Setup Guide

## ✅ Step 1: Run the Database Initialization Script

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - URL: https://supabase.com/dashboard/project/tcrumuaehotwssovpkfb

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query" button

3. **Copy and Run the SQL Script**
   - Open the file `supabase/init.sql` in your project
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click "Run" button (or press Ctrl+Enter)

4. **Verify Success**
   - You should see a success message
   - Check the "Table Editor" to see all created tables

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref tcrumuaehotwssovpkfb

# Run migrations
supabase db push
```

## ✅ Step 2: Verify Database Setup

### Check via API Route

1. Start your development server:
```bash
npm run dev
```

2. Visit: http://localhost:3001/api/init-database

3. You should see:
```json
{
  "status": "initialized",
  "tables": [
    { "table": "testimonials", "exists": true },
    { "table": "blog_posts", "exists": true },
    { "table": "email_messages", "exists": true },
    { "table": "admin_settings", "exists": true }
  ],
  "message": "Database is properly initialized"
}
```

### Check via Supabase Dashboard

1. Go to "Table Editor" in your Supabase dashboard
2. You should see these tables:
   - ✅ testimonials
   - ✅ blog_posts
   - ✅ email_messages
   - ✅ admin_settings
   - ✅ projects
   - ✅ certifications

## 📊 Database Schema Overview

### 1. testimonials
Stores all testimonial submissions (pending and approved)
- `id` - UUID primary key
- `name` - Person's name
- `email` - Contact email
- `designation` - Job title
- `organization` - Company name
- `testimonial` - The testimonial text
- `image` - Profile image URL
- `rating` - 1-5 stars
- `approved` - Boolean (false by default)
- `created_at`, `updated_at` - Timestamps

### 2. blog_posts
Stores all blog posts with visibility control
- `id` - UUID primary key
- `title` - Blog title
- `slug` - URL-friendly slug (unique)
- `excerpt` - Short description
- `content` - Full blog content
- `image` - Featured image URL
- `author` - Author name
- `category` - Blog category
- `visible` - Boolean (controls public visibility)
- `published_date` - Publication date
- `created_at`, `updated_at` - Timestamps

### 3. email_messages
Stores all contact form and testimonial submissions
- `id` - UUID primary key
- `type` - 'contact' or 'testimonial'
- `from_name` - Sender's name
- `from_email` - Sender's email
- `subject` - Email subject (optional)
- `message` - Message content
- `phone` - Phone number (optional)
- `read` - Boolean (false by default)
- `created_at` - Timestamp

### 4. admin_settings
Stores admin configuration
- `id` - UUID primary key
- `setting_key` - Unique setting identifier
- `setting_value` - Setting value
- `updated_at` - Timestamp

Default settings:
- `admin_email`: saqleinsheikh43@gmail.com
- `admin_username`: AppAdmin
- `admin_password`: S@qlein050505

### 5. projects
Stores portfolio projects
- `id` - UUID primary key
- `title` - Project name
- `description` - Project description
- `image` - Project image URL
- `technologies` - Array of tech stack
- `github_url` - GitHub repository URL
- `live_url` - Live demo URL
- `visible` - Boolean
- `display_order` - Sort order
- `created_at`, `updated_at` - Timestamps

### 6. certifications
Stores certifications and awards
- `id` - UUID primary key
- `title` - Certification name
- `issuer` - Issuing organization
- `issue_date` - Date received
- `image` - Certificate image URL
- `credential_url` - Verification URL
- `visible` - Boolean
- `display_order` - Sort order
- `created_at`, `updated_at` - Timestamps

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with these policies:

**Public Access:**
- ✅ Can view approved testimonials
- ✅ Can view visible blog posts
- ✅ Can view visible projects
- ✅ Can view visible certifications
- ✅ Can submit new testimonials
- ✅ Can send contact messages

**Admin Access (via service_role key):**
- ✅ Full CRUD access to all tables
- ✅ Can approve/reject testimonials
- ✅ Can toggle visibility of content
- ✅ Can manage all data

### Automatic Features
- ✅ Auto-generated UUIDs for all records
- ✅ Automatic timestamp updates
- ✅ Indexed columns for fast queries
- ✅ Data validation constraints

## 🧪 Testing the Database

### 1. Test Testimonial Submission
```bash
curl -X POST http://localhost:3001/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "designation": "Developer",
    "organization": "Test Company",
    "testimonial": "Great work!"
  }'
```

### 2. Test Blog Creation (Admin)
```bash
curl -X POST http://localhost:3001/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog Post",
    "excerpt": "This is a test",
    "content": "Full content here",
    "category": "Technology",
    "visible": true
  }'
```

### 3. Check via Admin Dashboard
1. Login at: http://localhost:3001/loginlocal
2. Navigate to Testimonials or Blogs
3. Verify data appears correctly

## 🔄 Data Migration

### From JSON Files to Supabase

If you have existing data in JSON files, you can migrate it:

1. **Export existing data:**
```javascript
// In your browser console or Node script
const testimonials = JSON.parse(localStorage.getItem('testimonials'))
console.log(JSON.stringify(testimonials))
```

2. **Import to Supabase:**
```sql
-- In Supabase SQL Editor
INSERT INTO testimonials (name, email, designation, organization, testimonial, rating, approved)
VALUES 
  ('Name 1', 'email1@example.com', 'Title', 'Company', 'Testimonial text', 5, true),
  ('Name 2', 'email2@example.com', 'Title', 'Company', 'Testimonial text', 5, true);
```

## 📈 Monitoring & Maintenance

### View Database Statistics
1. Go to Supabase Dashboard
2. Click "Database" → "Statistics"
3. Monitor:
   - Table sizes
   - Query performance
   - Connection usage

### Backup Strategy
Supabase automatically backs up your database:
- Point-in-time recovery available
- Daily backups retained
- Can restore from any point in last 7 days

### Performance Optimization
- Indexes are already created on frequently queried columns
- Use `.select('specific, columns')` instead of `.select('*')`
- Enable caching for public data
- Use pagination for large datasets

## 🐛 Troubleshooting

### Issue: Tables not created
**Solution:** Re-run the init.sql script in SQL Editor

### Issue: Permission denied errors
**Solution:** Check RLS policies are correctly set

### Issue: API routes returning errors
**Solution:** 
1. Verify .env.local has correct Supabase credentials
2. Restart development server
3. Check browser console for detailed errors

### Issue: Data not appearing in admin
**Solution:**
1. Check if data exists in Supabase Table Editor
2. Verify API routes are working (check Network tab)
3. Clear browser cache and localStorage

## 🎯 Next Steps

1. ✅ Run init.sql script
2. ✅ Verify tables are created
3. ✅ Test API endpoints
4. ✅ Login to admin dashboard
5. ✅ Create test blog post
6. ✅ Submit test testimonial
7. ✅ Verify data appears correctly

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in Dashboard → Logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure development server is restarted after .env changes

---

**Database is now ready to use! 🎉**
