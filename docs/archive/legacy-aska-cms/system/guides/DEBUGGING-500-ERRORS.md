# Debugging 500 Errors - Supabase Connection Issues

## Quick Diagnosis Steps

### Step 1: Check Environment Variables

Visit this URL on your production site:
```
https://your-domain.com/api/public/debug/env-check
```

**Expected Response:**
```json
{
  "success": true,
  "env": {
    "hasSupabaseUrl": true,
    "supabaseUrlLength": 50,
    "hasSupabaseKey": true,
    "supabaseKeyLength": 100,
    "supabaseUrlStartsWith": "https://xxxxx.supabase.co"
  }
}
```

**If you see `false` values:**
- ❌ Environment variables are NOT set in Vercel
- ✅ **Fix:** Add them in Vercel dashboard

### Step 2: Check Database Tables

Visit this URL:
```
https://your-domain.com/api/public/debug/shareables
```

**This shows:**
- Whether tables exist
- How many rows are in each table
- Whether any published content exists
- Any database errors

### Step 3: Check Browser Console

Open browser console (F12) and look for:
- Error messages with `details` field
- Messages like "Missing required environment variables"
- Messages like "Database connection failed"

---

## Common Issues & Fixes

### Issue 1: Missing Environment Variables in Vercel

**Symptoms:**
- All API routes return 500 errors
- Error message: "Missing required environment variables"

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anonymous key
3. Redeploy

**Where to find Supabase credentials:**
- Go to Supabase Dashboard → Your Project → Settings → API
- Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
- Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue 2: Wrong Credentials

**Symptoms:**
- 500 errors with database connection errors
- Error message: "Database connection failed"

**Fix:**
1. Verify credentials in Supabase Dashboard
2. Make sure you're using the **anon key** (not service role key)
3. Update in Vercel and redeploy

### Issue 3: No Published Content

**Symptoms:**
- API returns 404 or empty data
- Tables have data but nothing shows

**Fix:**
- Check that content has `status = 'published'`
- In Supabase, run:
  ```sql
  SELECT COUNT(*) FROM pub_shareables_facts WHERE status = 'published';
  SELECT COUNT(*) FROM pub_shareables_motivational WHERE status = 'published';
  ```

### Issue 4: Tables Don't Exist

**Symptoms:**
- Error: "relation does not exist"
- Debug endpoint shows table errors

**Fix:**
- Create tables in Supabase
- Check migration files in `sql/` directory

---

## Testing Locally

### Check Local Environment Variables

Create/verify `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Test API Endpoints Locally

```bash
# Start dev server
npm run dev

# Test endpoints
curl http://localhost:3000/api/public/debug/env-check
curl http://localhost:3000/api/public/debug/shareables
curl http://localhost:3000/api/public/shareables/facts
```

---

## Next Steps

1. ✅ Check `/api/public/debug/env-check` - Verify env vars
2. ✅ Check `/api/public/debug/shareables` - Verify tables
3. ✅ Check browser console - See actual errors
4. ✅ Fix environment variables in Vercel
5. ✅ Redeploy

