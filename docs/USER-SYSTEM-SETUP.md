# User Authentication & Points System - Setup Instructions

## ✅ What's Included

This migration creates the complete user system infrastructure:

1. ✅ `username_vocabulary` - Vocabulary words for Xbox-style username generation
2. ✅ `user_profiles` - Core user profile (username, display_name, avatar)
3. ✅ `user_stats` - Aggregated statistics per app (points, streaks)
4. ✅ `user_points` - Immutable point transaction ledger
5. ✅ Row Level Security (RLS) policies
6. ✅ Automatic triggers for stats updates
7. ✅ Xbox-style username generation (Adjective + Noun combinations)
8. ✅ Helper functions for awarding points

---

## 🚀 Setup Steps

### Step 1: Create the Database Tables in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy the entire contents of `docs/supabase-user-tables.sql`
6. Paste it into the SQL Editor
7. Click **"Run"** or press `Ctrl+Enter`

You should see: `Success. No rows returned`

### Step 2: Verify the Tables Were Created

1. In Supabase Dashboard, go to **Table Editor**
2. You should see four new tables:
   - `username_vocabulary` - Vocabulary words for username generation
   - `user_profiles` - Core user profile
   - `user_stats` - Aggregated statistics per app
   - `user_points` - Point transaction ledger

3. Verify the columns for each table:

**username_vocabulary:**
- `id` (SERIAL, primary key)
- `word` (VARCHAR, unique)
- `word_type` (VARCHAR, 'adjective' or 'noun')
- `created_at` (TIMESTAMPTZ)

**user_profiles:**
- `user_id` (UUID, primary key, references auth.users)
- `username` (VARCHAR, unique)
- `display_name` (VARCHAR)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**user_stats:**
- `user_id` (UUID, part of primary key)
- `app_id` (VARCHAR, part of primary key, default 'hockey')
- `total_points` (INTEGER, default 0)
- `current_streak` (INTEGER, default 0)
- `longest_streak` (INTEGER, default 0)
- `total_activities` (INTEGER, default 0)
- `last_activity_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**user_points:**
- `id` (BIGSERIAL, primary key)
- `user_id` (UUID, references user_profiles)
- `app_id` (VARCHAR, default 'hockey')
- `points` (INTEGER)
- `activity_type` (VARCHAR)
- `activity_id` (BIGINT)
- `description` (TEXT)
- `earned_at` (TIMESTAMPTZ)

### Step 3: Verify RLS Policies

1. In the Table Editor, click on each table
2. Click the **"RLS"** tab
3. Verify policies exist:

**user_profiles:**
- ✅ "Users can view their own profile" (SELECT)
- ✅ "Users can create their own profile" (INSERT)
- ✅ "Users can update their own profile" (UPDATE)
- ✅ "Public can read usernames" (SELECT - for leaderboards)

**user_stats:**
- ✅ "Users can view their own stats" (SELECT)
- ✅ "Users can create their own stats" (INSERT)
- ✅ "Users can update their own stats" (UPDATE)
- ✅ "Public can read stats for leaderboards" (SELECT)

**user_points:**
- ✅ "Users can view their own points" (SELECT)
- ✅ "Service role can insert points" (INSERT)

### Step 4: Verify Triggers & Functions

1. In Supabase Dashboard, go to **Database** → **Functions**
2. You should see these functions:
   - `update_user_profiles_updated_at()`
   - `update_user_stats_updated_at()`
   - `create_user_stats_on_profile_create()`
   - `update_user_stats_on_points()`
   - `award_points()` (helper function)

3. Go to **Database** → **Triggers**
4. Verify triggers exist:
   - `user_profiles_updated_at`
   - `user_stats_updated_at`
   - `create_user_stats_trigger`
   - `update_stats_on_points_trigger`

---

## 📝 Usage Notes

### Awarding Points

**Important:** Points should ONLY be awarded server-side (never trust client calculations).

**Option 1: Use the helper function (recommended)**
```sql
SELECT award_points(
  'user-uuid-here',
  'hockey',           -- app_id
  10,                 -- points
  'trivia_correct',   -- activity_type
  123,                -- activity_id (optional)
  'Correct answer'    -- description (optional)
);
```

**Option 2: Insert directly (stats auto-update via trigger)**
```sql
INSERT INTO user_points (user_id, app_id, points, activity_type, activity_id, description)
VALUES ('user-uuid', 'hockey', 10, 'trivia_correct', 123, 'Correct answer');
```

### Username Generation

Usernames are automatically generated in Xbox-style format:
- **Format:** Adjective + Noun (e.g., "SwiftPuck", "BoldBlade", "FierceNet")
- **Vocabulary:** Words are stored in `username_vocabulary` table
- **Uniqueness:** If combination is taken, system tries new random combination or appends numbers
- **Customization:** Users can update their username later via profile settings

To add more vocabulary words:
```sql
INSERT INTO username_vocabulary (word, word_type) VALUES
('NewAdjective', 'adjective'),
('NewNoun', 'noun');
```

### Activity Types

Suggested activity types:
- `trivia_correct` - Correct trivia answer
- `trivia_streak` - Streak bonus
- `daily_login` - Daily login bonus
- `achievement_unlocked` - Achievement reward
- `share_content` - Sharing content
- `referral` - User referral

### App IDs

Currently default is `'hockey'`. To add new apps:
- Insert new row in `user_stats` with different `app_id`
- Points will automatically track per app

---

## 🔒 Security Considerations

1. **Points are immutable** - No UPDATE/DELETE policies on `user_points`
2. **Server-side only** - Points can only be inserted via service role
3. **RLS enabled** - Users can only see/modify their own data
4. **Public read for leaderboards** - Usernames and stats are readable for leaderboard features

---

## 🧪 Testing

After setup, you can test:

1. **Create a test user profile:**
```sql
-- First, create a user via Supabase Auth (or use existing)
-- Then create profile:
INSERT INTO user_profiles (user_id, username, display_name)
VALUES ('your-user-uuid', 'testuser', 'Test User');
```

2. **Award test points:**
```sql
SELECT award_points('your-user-uuid', 'hockey', 50, 'test', NULL, 'Test points');
```

3. **Check stats updated:**
```sql
SELECT * FROM user_stats WHERE user_id = 'your-user-uuid';
```

4. **View point history:**
```sql
SELECT * FROM user_points WHERE user_id = 'your-user-uuid' ORDER BY earned_at DESC;
```

---

## 🚨 Troubleshooting

**Issue: "Policy violation" when inserting points**
- Solution: Points must be inserted via server-side code using service role key, not from client

**Issue: Stats not updating**
- Check that triggers are enabled in Supabase Dashboard
- Verify `update_stats_on_points_trigger` exists

**Issue: Profile creation fails**
- Ensure user exists in `auth.users` first
- Check RLS policies are correct

---

## 📚 Next Steps

After tables are created, you'll need to:

1. **Set up Passwordless Authentication** (Email token/magic link)
   - See `docs/PASSWORDLESS-AUTH-GUIDE.md` for complete implementation
   - Uses Supabase OTP (no passwords needed!)
   - Magic links or 6-digit codes sent via email
   - Profile created automatically on first sign-in

2. Create API routes/server actions for awarding points
3. Update Navbar component to fetch and display user data
4. Create user profile page

**Recommended:** Start with passwordless auth - it's simpler and better UX than password-based auth!

