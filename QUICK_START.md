# Quick Start Guide

## 🚀 Start the Application

```bash
npm run dev
```

Access at: **http://localhost:3001**

---

## 🔐 Admin Login

1. Go to: **http://localhost:3001/loginlocal**
2. Enter credentials:
   - **Username:** `AppAdmin`
   - **Password:** `S@qlein050505`
3. Click Login

---

## 📊 Admin Dashboard

After login, you'll see the dashboard with these sections:

### Content Management
- **Projects** - Manage portfolio projects
- **Certifications & Awards** - Manage certifications and awards
- **Experience** - Manage work experience
- **Education** - Manage education entries
- **Skills** - Manage technical skills

### Communication
- **Email Messages** - View contact form submissions
- **Testimonials** - Approve/reject testimonials
- **Blog Posts** - Create and manage blog articles

### Settings
- **Settings** - Change admin email and password

---

## ✏️ How to Add Content

### Example: Adding a New Project

1. Click **"Projects"** card on dashboard
2. Click **"Add Project"** button
3. Fill in the form:
   - Title: "My New Project"
   - Short Description: Brief overview
   - Full Description: Detailed description
   - Image URL: "/project-image.png"
   - Technologies: Add tags (Mendix, PostgreSQL, etc.)
   - Key Features: Add feature list
   - GitHub URL: Your repo URL
   - Live URL: Deployed site URL
   - Toggle "Visible on site" ON
4. Click **"Save Project"**
5. Done! Project appears on your portfolio immediately

### Same Process for All Sections
- Click section card
- Click "Add New" button
- Fill form
- Save
- Content appears on site

---

## 🎨 Managing Visibility

Every content item has a visibility toggle:
- **ON** = Visible on public site
- **OFF** = Hidden from public (draft mode)

Use this to:
- Work on content before publishing
- Temporarily hide outdated content
- Test changes before going live

---

## 🗑️ Deleting Content

1. Find the item you want to delete
2. Click the **trash icon** (🗑️)
3. Confirm deletion
4. Item removed from database

**Warning:** Deletion is permanent!

---

## ✏️ Editing Content

1. Find the item you want to edit
2. Click the **edit icon** (✏️)
3. Modify fields in the form
4. Click **"Save"**
5. Changes appear immediately

---

## 🔄 Workflow Tips

### Adding Multiple Items
- Keep the admin page open
- Add items one by one
- Use visibility toggle to hide drafts
- Enable visibility when ready

### Organizing Content
- Use display_order field for sorting (future feature)
- Keep descriptions concise
- Use high-quality images
- Test on mobile devices

### Best Practices
- ✅ Add descriptive titles
- ✅ Use clear, concise descriptions
- ✅ Include relevant technologies
- ✅ Add proper image URLs
- ✅ Toggle visibility appropriately
- ✅ Test changes on live site

---

## 📱 Testing Your Changes

After adding/editing content:

1. Open new tab
2. Go to **http://localhost:3001**
3. Scroll to relevant section
4. Verify content appears correctly
5. Test on mobile view (browser dev tools)

---

## 🔒 Security

### Logout
- Click **"Logout"** button in dashboard header
- You'll be redirected to home page
- Session cleared from browser

### Changing Password
1. Go to **Settings** page
2. Enter new password
3. Click **"Save Settings"**
4. Use new password for next login

---

## 🆘 Troubleshooting

### Can't Login?
- Check username: `AppAdmin` (case-sensitive)
- Check password: `S@qlein050505`
- Clear browser cache
- Try incognito/private window

### Content Not Showing?
- Check visibility toggle is ON
- Refresh the page
- Check browser console for errors
- Verify data saved in admin panel

### Images Not Loading?
- Check image URL is correct
- Ensure image exists in `/public` folder
- Use format: `/image-name.png`
- Check file name matches exactly

---

## 📞 Quick Reference

| Action | Location | Button |
|--------|----------|--------|
| Login | `/loginlocal` | Login button |
| Dashboard | `/admin/dashboard` | Auto after login |
| Add Content | Any admin page | "Add New" button |
| Edit Content | Any admin page | Edit icon (✏️) |
| Delete Content | Any admin page | Trash icon (🗑️) |
| Toggle Visibility | Any admin page | Switch toggle |
| Logout | Dashboard header | "Logout" button |
| View Site | Dashboard header | "View Site" button |

---

## 🎯 Common Tasks

### Publishing a Blog Post
1. Go to `/admin/blogs`
2. Click "Add Blog"
3. Fill in title, content, category
4. Add tags and read time
5. Set published date
6. Toggle visibility ON
7. Save

### Approving a Testimonial
1. Go to `/admin/testimonials`
2. Find pending testimonial
3. Click "Approve" button
4. Testimonial appears on site

### Updating Skills
1. Go to `/admin/skills`
2. Find skill to update
3. Click edit icon
4. Adjust proficiency slider
5. Save changes

---

## 💡 Pro Tips

1. **Use Draft Mode**: Toggle visibility OFF while working on content
2. **Preview Changes**: Open site in another tab to see updates
3. **Organize First**: Plan your content structure before adding
4. **Consistent Naming**: Use consistent naming for images and URLs
5. **Regular Backups**: Export data periodically (future feature)

---

**That's it! You're ready to manage your portfolio! 🎉**

For detailed documentation, see:
- `PROJECT_STATUS.md` - Complete project overview
- `ADMIN_PAGES_COMPLETE.md` - Admin features details
- `DATABASE_MIGRATION_COMPLETE.md` - Database information
