# 🚀 Deployment Guide - Stitches Invoice Generator

## Quick Deploy to Vercel

### Step 1: GitHub Setup

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com) and sign in
   - Click "New repository" (green button)
   - Repository name: `stitches-invoice-generator`
   - Description: `AI-powered invoice generator with Supabase authentication`
   - Make it **Public**
   - **Don't** initialize with README (we already have files)
   - Click "Create repository"

2. **Upload Files to GitHub**
   - Copy all files from this folder to your GitHub repository
   - You can drag and drop files or use GitHub Desktop

### Step 2: Vercel Deployment

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"

2. **Import Repository**
   - Find and select `stitches-invoice-generator`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gjpaeyimzwmooiansfrp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcGFleWltendtb29pYW5zZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTcwNzgsImV4cCI6MjA3MjkzMzA3OH0.ImjDlMoFGg9VpRfisHHl8ZmZ9vFOkLp8pLrr-ENrYFQ
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Step 3: Update Supabase Settings

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project

2. **Update Authentication Settings**
   - Go to **Authentication** → **Settings**
   - **Site URL**: `https://your-project-name.vercel.app`
   - **Redirect URLs**: Add these URLs (one per line):
     ```
     https://your-project-name.vercel.app/auth/callback
     https://your-project-name.vercel.app/dashboard
     https://your-project-name.vercel.app/reset-password
     ```
   - Click "Save"

### Step 4: Test Your Deployment

1. **Visit your live site**
2. **Test sign-up/sign-in**
3. **Create a test invoice**
4. **Verify PDF generation**

## 🌐 Custom Domain (Optional)

### Get a Cheap Domain

**Recommended Domain Providers:**
- **Namecheap**: `.xyz` domains for $0.99/year
- **Porkbun**: `.xyz` domains for $1.17/year
- **Cloudflare**: `.com` domains for $9.15/year

### Setup Custom Domain

1. **Buy your domain**
2. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS instructions

3. **Update Supabase**:
   - Update Site URL and Redirect URLs with your custom domain

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json

2. **Authentication Not Working**
   - Verify Supabase URL and keys are correct
   - Check redirect URLs in Supabase settings

3. **PDF Generation Issues**
   - Check browser console for errors
   - Verify jsPDF is working

### Getting Help

- Check the main README.md file
- Open a GitHub issue
- Contact support

## 🎉 You're Live!

Your Stitches Invoice Generator is now deployed and ready to use!

**Next Steps:**
- Share your app with users
- Monitor usage in Vercel dashboard
- Set up analytics (optional)
- Consider upgrading to paid plans for more features

---

**Deployment Checklist:**
- [ ] GitHub repository created
- [ ] Files uploaded to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Supabase settings updated
- [ ] Custom domain configured (optional)
- [ ] App tested and working