# Google OAuth Setup - Step-by-Step Guide

Complete walkthrough for setting up Google Sign-In with Supabase.

---

## 🎯 Overview

We need to:
1. Create Google OAuth credentials (Client ID & Secret)
2. Configure them in Supabase
3. Set redirect URLs
4. Test it works

**Time:** ~15 minutes

---

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### 1.2 Create or Select Project

**Option A: Create New Project**
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click **"New Project"**
3. Enter project name: `OnlyHockey` (or any name)
4. Click **"Create"**
5. Wait for project to be created
6. Select the new project from dropdown

**Option B: Use Existing Project**
1. Click the project dropdown
2. Select your existing project

---

## Step 2: Enable Google+ API

### 2.1 Navigate to APIs & Services

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"** (or "Enabled APIs and services")

### 2.2 Enable Google+ API

1. Search for: `Google+ API`
2. Click on **"Google+ API"**
3. Click **"Enable"** button
4. Wait for it to enable (may take a few seconds)

**Note:** You might see a message about Google+ being deprecated. That's okay - we're just using it for OAuth, which still works.

---

## Step 3: Create OAuth Credentials

### 3.1 Go to Credentials

1. In left sidebar: **APIs & Services** → **Credentials**
2. You should see the Credentials page

### 3.2 Create OAuth Consent Screen (First Time Only)

**If you see "OAuth consent screen" warning:**
1. Click **"OAuth consent screen"** (or "Configure Consent Screen")
2. Choose **"External"** (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in required fields:
   - **App name:** `OnlyHockey`
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **"Save and Continue"**
6. On "Scopes" page → Click **"Save and Continue"** (no changes needed)
7. On "Test users" page → Click **"Save and Continue"** (skip for now)
8. Review → Click **"Back to Dashboard"**

**If you already have consent screen configured:** Skip to Step 3.3

### 3.3 Create OAuth Client ID

1. Go back to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** (top of page)
3. Select **"OAuth client ID"**

### 3.4 Configure OAuth Client

1. **Application type:** Select **"Web application"**

2. **Name:** Enter `OnlyHockey Web` (or any name)

3. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Add: `https://your-project-id.supabase.co`
   - (Find your project ID in Supabase Dashboard → Settings → API)
   - Example: `https://abcdefghijklmnop.supabase.co`

4. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Add: `https://your-project-id.supabase.co/auth/v1/callback`
   - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
   
   **Important:** Replace `your-project-id` with your actual Supabase project ID!

5. Click **"CREATE"**

### 3.5 Copy Credentials

You'll see a popup with:
- **Your Client ID** (long string ending in `.apps.googleusercontent.com`)
- **Your Client Secret** (shorter string)

**IMPORTANT:** Copy both of these! You'll need them in the next step.

**Option:** Click "DOWNLOAD JSON" to save them, or copy to a text file temporarily.

---

## Step 4: Configure Supabase

### 4.1 Get Your Supabase Project URL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Find **"Project URL"** - it looks like: `https://abcdefghijklmnop.supabase.co`
5. Copy this URL (you'll need it)

### 4.2 Enable Google Provider

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Scroll down to find **"Google"**
3. Click the toggle to **Enable** it

### 4.3 Add Credentials

1. **Client ID (for Google OAuth):**
   - Paste your Google Client ID here
   - Should end in `.apps.googleusercontent.com`

2. **Client Secret (for Google OAuth):**
   - Paste your Google Client Secret here

3. Click **"Save"** at the bottom

### 4.4 Configure Redirect URLs

1. Still in Supabase Dashboard → **Authentication** → **URL Configuration**

2. **Site URL:**
   - Development: `http://localhost:3001`
   - Production: Your actual domain (e.g., `https://onlyhockey.com`)

3. **Redirect URLs:**
   - Click **"Add URL"**
   - Add: `http://localhost:3001/auth/callback` (for development)
   - Add: `https://yourdomain.com/auth/callback` (for production)
   - Click **"Save"**

---

## Step 5: Update Google OAuth Settings (Important!)

### 5.1 Add Localhost Redirect (for Development)

Go back to Google Cloud Console:

1. **APIs & Services** → **Credentials**
2. Click on your OAuth client (the one you just created)
3. Under **"Authorized redirect URIs"**, add:
   - `http://localhost:3001/auth/callback`
4. Click **"SAVE"**

**Why:** This allows Google OAuth to work in local development.

---

## Step 6: Test It!

### 6.1 Start Your Dev Server

```bash
npm run dev
```

### 6.2 Test Sign-In

1. Open your site: `http://localhost:3001`
2. Click **"Sign In"** in the Navbar
3. Click **"Sign in with Google"**
4. You should be redirected to Google
5. Sign in with your Google account
6. You should be redirected back to your site
7. Check Navbar → Should show your username!

### 6.3 Verify Database

1. Go to Supabase Dashboard → **Table Editor**
2. Open `user_profiles` table
3. You should see a new row with:
   - Your `user_id` (UUID)
   - Xbox-style `username` (e.g., "SwiftPuck")
   - `display_name` (from Google, if available)

4. Open `user_stats` table
5. You should see stats row with `total_points: 0`

---

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth Client ID created
- [ ] Client ID and Secret copied
- [ ] Supabase Google provider enabled
- [ ] Credentials added to Supabase
- [ ] Redirect URLs configured (both Google and Supabase)
- [ ] Test sign-in works
- [ ] Profile created in database
- [ ] Username appears in Navbar

---

## 🚨 Troubleshooting

### Issue: "Redirect URI mismatch"

**Error:** `redirect_uri_mismatch`

**Solution:**
1. Check Google Cloud Console → Credentials → Your OAuth client
2. Verify redirect URI is exactly: `https://your-project-id.supabase.co/auth/v1/callback`
3. Make sure no trailing slashes
4. Make sure it matches your Supabase project URL exactly

### Issue: "Google Sign In button doesn't redirect"

**Solution:**
1. Check Supabase Dashboard → Authentication → Providers → Google is **enabled**
2. Verify Client ID and Secret are correct (no extra spaces)
3. Check browser console for errors
4. Make sure you're using the correct Supabase project URL

### Issue: "Profile not created after sign-in"

**Solution:**
1. Check Supabase Dashboard → Database → Triggers
2. Verify `create_user_profile_trigger` exists and is enabled
3. Check Supabase Dashboard → Database → Functions
4. Verify `create_user_profile_on_signup()` function exists

### Issue: "Can't find Supabase Project URL"

**Solution:**
1. Supabase Dashboard → Settings → API
2. Look for **"Project URL"** (not Project ID)
3. It should be: `https://[random-letters].supabase.co`

---

## 📝 Quick Reference

### Google Cloud Console
- **URL:** https://console.cloud.google.com/
- **Credentials:** APIs & Services → Credentials
- **OAuth Client:** Web application type

### Supabase Dashboard
- **URL:** https://supabase.com/dashboard
- **Auth Providers:** Authentication → Providers → Google
- **Redirect URLs:** Authentication → URL Configuration

### Your Redirect URI Format
```
https://[your-project-id].supabase.co/auth/v1/callback
```

### Local Development Redirect
```
http://localhost:3001/auth/callback
```

---

## 🎉 You're Done!

Once Google OAuth is working:
- Users can sign in with one click
- Profiles are created automatically
- Xbox-style usernames are generated
- Everything is ready for points system!

**Next Steps:**
- Test email magic link auth
- Implement points awarding system
- Create user profile page

