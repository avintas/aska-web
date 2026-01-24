# Google Authentication Guide
## Add "Sign in with Google" Button

Google OAuth is **very easy** to add with Supabase - it's built-in and works alongside email auth!

---

## ✅ Why Add Google Auth?

**Benefits:**
- ✅ **Even faster** - One click, no email/code needed
- ✅ **Familiar** - Users trust Google sign-in
- ✅ **Automatic profile** - Gets name/avatar from Google
- ✅ **Works with existing system** - Same database triggers, same profile creation

**Best Practice:** Offer **both** options:
- "Sign in with Google" (fastest)
- "Sign in with Email" (magic link/code)

---

## 🚀 Setup Steps (15 minutes)

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
   (Get your Supabase project URL from Supabase Dashboard)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

That's it! Supabase handles the rest.

### Step 3: Update Your Auth Component

Add Google button to your existing `AuthModal.tsx`:

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      // User will be redirected to Google, then back to callback
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      // Show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
          </div>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSignIn}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
```

---

## 🔄 How It Works

### Google OAuth Flow:

1. **User clicks "Sign in with Google"**
2. **Redirected to Google** → User signs in with Google account
3. **Google redirects back** → To `/auth/callback` with code
4. **Supabase exchanges code** → Creates session
5. **Database trigger fires** → Creates `user_profiles` automatically
6. **Profile populated** → Name/avatar from Google (if available)
7. **User logged in** → Navbar shows username/points

### What Gets Created:

When user signs in with Google:
- ✅ User record in `auth.users` (with Google email)
- ✅ Profile in `user_profiles` (Xbox-style username generated)
- ✅ Stats in `user_stats` (points start at 0)
- ✅ Optional: `display_name` and `avatar_url` from Google profile

---

## 🎨 Profile Data from Google

Your database trigger can optionally use Google profile data:

```sql
-- Updated trigger function (optional enhancement)
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_username VARCHAR(50);
  v_display_name VARCHAR(100);
  v_avatar_url TEXT;
  -- ... username generation logic ...
BEGIN
  -- Get display name from Google (if available)
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    v_username  -- Fallback to generated username
  );
  
  -- Get avatar from Google (if available)
  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';
  
  -- Create profile
  INSERT INTO user_profiles (user_id, username, display_name, avatar_url)
  VALUES (NEW.id, v_username, v_display_name, v_avatar_url)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ✅ Benefits Over Email Auth

| Feature | Google OAuth | Email Magic Link |
|---------|-------------|------------------|
| Speed | ⚡ One click | 📧 Check email, click link |
| Friction | Very low | Low |
| Profile data | ✅ Name/avatar auto-filled | ❌ Manual entry |
| Trust | High (Google) | Medium |
| Works offline | ❌ Needs internet | ✅ Can use code |

**Best Practice:** Offer **both** - let users choose!

---

## 🧪 Testing

1. **Test Google sign-in:**
   - Click "Sign in with Google"
   - Should redirect to Google
   - Sign in → Should redirect back
   - Check `user_profiles` table → Should see new profile

2. **Test profile creation:**
   - Verify username is generated (Xbox-style)
   - Check if `display_name` and `avatar_url` are populated from Google

3. **Test both methods:**
   - Sign in with Google → Works
   - Sign in with email → Works
   - Both create profiles the same way

---

## 🚨 Troubleshooting

**Issue: "Redirect URI mismatch"**
- Solution: Make sure redirect URI in Google Console matches exactly:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

**Issue: Google button doesn't redirect**
- Check Supabase Dashboard → Authentication → Providers → Google is enabled
- Verify Client ID and Secret are correct

**Issue: Profile not created**
- Check database trigger exists: `create_user_profile_trigger`
- Verify trigger is enabled in Supabase Dashboard

---

## 📚 Summary

**Google OAuth is:**
- ✅ Very easy to set up (15 minutes)
- ✅ Built into Supabase (no custom code needed)
- ✅ Works with your existing system (same triggers, same tables)
- ✅ Better UX (one click vs email/code)
- ✅ Optional alongside email auth

**Recommendation:** Add Google OAuth as the **primary** option, keep email as **secondary** option. Users will appreciate the choice!

