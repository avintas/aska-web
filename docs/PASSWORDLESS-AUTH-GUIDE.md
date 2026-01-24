# Passwordless Authentication Guide
## Email Token Authentication (Nike.com Style)

This guide explains how to implement passwordless authentication using Supabase's built-in OTP (One-Time Password) system. Users receive a magic link or code via email - no passwords required!

---

## 🎯 How It Works

### Option 1: Magic Link (Recommended)
1. User enters email → Supabase sends magic link to email
2. User clicks link → Automatically logged in
3. Profile created automatically via database trigger

### Option 2: 6-Digit Code
1. User enters email → Supabase sends 6-digit code to email
2. User enters code → Verified and logged in
3. Profile created automatically via database trigger

**Both methods are built into Supabase - no custom email service needed!**

---

## ⚙️ Supabase Configuration

### Step 1: Enable Email Auth in Supabase Dashboard

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Ensure **Email** provider is enabled
3. Configure email templates (optional - customize the email users receive)

### Step 2: Configure Email Templates

**Magic Link Template:**
```
Subject: Sign in to OnlyHockey

Click the link below to sign in:
{{ .ConfirmationURL }}

This link expires in 1 hour.
```

**OTP Code Template:**
```
Subject: Your OnlyHockey sign-in code

Your code is: {{ .Token }}

This code expires in 10 minutes.
```

### Step 3: Set Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL:** `https://onlyhockey.com` (production)
   - **Redirect URLs:** 
     - `https://onlyhockey.com/auth/callback`
     - `http://localhost:3001/auth/callback` (development)

---

## 💻 Frontend Implementation

### Step 1: Create Auth Components

**File: `src/components/AuthModal.tsx`**

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Option 1: Magic Link (recommended)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Option 2: 6-Digit Code (alternative)
      // const { error } = await supabase.auth.signInWithOtp({
      //   email,
      //   options: {
      //     shouldCreateUser: true,
      //   },
      // });

      if (error) throw error;

      setMessage("Check your email for the magic link!");
      // For 6-digit code: setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (error) throw error;

      // Success! User is logged in, profile created automatically
      onClose();
      window.location.reload(); // Refresh to show logged-in state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        {step === "email" ? (
          <form onSubmit={handleSendCode}>
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
            {message && <p className="text-green-500 text-sm mb-2">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Enter Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
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
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full mt-2 text-sm text-gray-600"
            >
              Back to email
            </button>
          </form>
        )}

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

### Step 2: Create Auth Callback Page

**File: `src/app/auth/callback/route.ts`**

```typescript
import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to home page after successful auth
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
```

### Step 3: Create Client Supabase Utility

**File: `src/utils/supabase/client.ts`**

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Step 4: Update Navbar with Auth

**File: `src/components/Navbar.tsx`** (update existing)

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AuthModal } from "./AuthModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <>
      <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-orange-500 transition-colors"
            >
              OnlyHockey
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hidden sm:inline ${
                  pathname === "/"
                    ? "text-blue-600 dark:text-orange-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Home
              </Link>

              {user && profile ? (
                <>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {profile.username}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {profile.total_points || 0} P
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-blue-600 dark:text-orange-500 hover:underline"
                >
                  Sign In
                </button>
              )}

              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
```

---

## 🔄 Authentication Flow

### Magic Link Flow (Recommended)

1. **User clicks "Sign In"** → Modal opens
2. **User enters email** → Clicks "Send Magic Link"
3. **Supabase sends email** → User receives magic link
4. **User clicks link** → Redirected to `/auth/callback`
5. **Callback exchanges code** → Creates session
6. **Database trigger fires** → Creates `user_profiles` automatically
7. **User is logged in** → Navbar shows username and points

### 6-Digit Code Flow (Alternative)

1. **User clicks "Sign In"** → Modal opens
2. **User enters email** → Clicks "Send Code"
3. **Supabase sends email** → User receives 6-digit code
4. **User enters code** → Clicks "Verify"
5. **Code verified** → Creates session
6. **Database trigger fires** → Creates `user_profiles` automatically
7. **User is logged in** → Navbar shows username and points

---

## ✅ Benefits

1. **No passwords** - Users don't need to remember passwords
2. **Secure** - Magic links expire, codes are time-limited
3. **Automatic profile creation** - Database trigger handles it
4. **Better UX** - Faster signup, less friction
5. **Built-in** - Supabase handles email sending

---

## 🧪 Testing

1. **Test magic link flow:**
   - Enter email → Check email inbox → Click link → Should log in

2. **Test code flow:**
   - Enter email → Check email for code → Enter code → Should log in

3. **Test profile creation:**
   - After first login → Check `user_profiles` table → Should see Xbox-style username

4. **Test session persistence:**
   - Log in → Close browser → Reopen → Should still be logged in

---

## 🚨 Troubleshooting

**Issue: Email not received**
- Check Supabase Dashboard → Authentication → Email Templates
- Verify email provider is configured
- Check spam folder

**Issue: Magic link doesn't work**
- Verify redirect URL is configured in Supabase
- Check callback route exists at `/auth/callback`

**Issue: Profile not created**
- Check database trigger exists: `create_user_profile_trigger`
- Verify trigger is enabled in Supabase Dashboard

**Issue: Username not generated**
- Check `username_vocabulary` table has words
- Verify trigger function: `create_user_profile_on_signup()`

---

## 📚 Next Steps

After implementing auth:

1. ✅ Update Navbar to show user info
2. ✅ Create profile page (`/profile`)
3. ✅ Add username editing capability
4. ✅ Implement points system
5. ✅ Add logout functionality

The database tables are already set up - just implement the frontend auth flow!

