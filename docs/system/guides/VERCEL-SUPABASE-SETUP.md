# Vercel + Supabase Setup Checklist

## ✅ Step-by-Step Fix for 500 Errors

### Step 1: Verify Environment Variables in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project: **aska-web-sable**
3. Go to **Settings** → **Environment Variables**
4. Check if these exist:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**If they DON'T exist → Add them (see Step 2)**

**If they DO exist → Check if values are correct (see Step 3)**

---

### Step 2: Add Missing Environment Variables

#### Get Your Supabase Credentials:

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Go to **Settings** (gear icon) → **API**
4. Copy these values:

**A. Project URL:**
- Look for **"Project URL"** section
- Copy the full URL (e.g., `https://xxxxx.supabase.co`)
- This goes into `NEXT_PUBLIC_SUPABASE_URL`

**B. Anon Key:**
- Look for **"Project API keys"** section
- Find **"anon public"** key
- Click **"Reveal"** if hidden
- Copy the full key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- This goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Add to Vercel:

1. In Vercel → Settings → Environment Variables
2. Click **"Add New"**
3. Add first variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
4. Click **"Add New"** again
5. Add second variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon key
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

---

### Step 3: Verify Values Are Correct

**Common Mistakes:**
- ❌ Using service role key instead of anon key
- ❌ Missing `https://` in URL
- ❌ Extra spaces or quotes around values
- ❌ Wrong project selected in Supabase

**Correct Format:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.xxxxx
```

---

### Step 4: Redeploy

After adding/updating environment variables:

1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** on the latest deployment
3. OR push a new commit to trigger redeploy

**Important:** Environment variables are only applied on new deployments!

---

### Step 5: Test

After redeploy, test these URLs:

1. **Environment Check:**
   ```
   https://aska-web-sable.vercel.app/api/public/debug/env-check
   ```
   Should show: `hasSupabaseUrl: true, hasSupabaseKey: true`

2. **Shareables Debug:**
   ```
   https://aska-web-sable.vercel.app/api/public/debug/shareables
   ```
   Should show table information

3. **Actual Pages:**
   - `/the-code` - Should load motivational content
   - `/did-you-know` - Should load facts content
   - `/shareables` - Should load wisdom & greetings

---

## 🔍 Debugging If Still Not Working

### Check Browser Network Tab:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Click on failed request (e.g., `shareables/facts`)
5. Check **Response** tab - should show error details

### Check Vercel Logs:

1. Vercel Dashboard → Your Project → **Deployments**
2. Click latest deployment
3. Click **"View Function Logs"**
4. Look for errors starting with:
   - `❌ Missing Supabase environment variables`
   - `Error fetching published facts shareables`
   - `Database connection failed`

### Common Error Messages:

| Error Message | Meaning | Fix |
|--------------|---------|-----|
| `Missing required environment variables` | Env vars not set | Add them in Vercel |
| `relation "pub_shareables_facts" does not exist` | Table doesn't exist | Create table in Supabase |
| `permission denied for table` | RLS policy issue | Check RLS policies |
| `Invalid API key` | Wrong key | Use anon key, not service role |

---

## ✅ Success Indicators

When working correctly:
- ✅ `/api/public/debug/env-check` shows both variables as `true`
- ✅ `/api/public/debug/shareables` shows table data
- ✅ Pages load content (not "Content Unavailable")
- ✅ No 500 errors in browser console

---

## 📝 Quick Reference

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Where to Find:**
- Supabase Dashboard → Settings → API

**Where to Add:**
- Vercel Dashboard → Project → Settings → Environment Variables

**After Adding:**
- Must redeploy for changes to take effect

