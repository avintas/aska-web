-- User Authentication & Points System Tables
-- Run this in your Supabase SQL Editor
-- Creates: user_profiles, user_stats, user_points, username_vocabulary

-- ============================================================================
-- 0. USERNAME_VOCABULARY TABLE
-- ============================================================================
-- Stores vocabulary words for Xbox-style username generation
CREATE TABLE IF NOT EXISTS username_vocabulary (
  id SERIAL PRIMARY KEY,
  word VARCHAR(50) NOT NULL UNIQUE,
  word_type VARCHAR(20) NOT NULL CHECK (word_type IN ('adjective', 'noun')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for username_vocabulary
CREATE INDEX IF NOT EXISTS idx_username_vocab_type ON username_vocabulary(word_type);

-- Insert hockey-themed vocabulary words
INSERT INTO username_vocabulary (word, word_type) VALUES
-- Adjectives
('Swift', 'adjective'),
('Bold', 'adjective'),
('Fierce', 'adjective'),
('Noble', 'adjective'),
('Rapid', 'adjective'),
('Mighty', 'adjective'),
('Sharp', 'adjective'),
('Brave', 'adjective'),
('Elite', 'adjective'),
('Prime', 'adjective'),
('True', 'adjective'),
('Pure', 'adjective'),
('Wild', 'adjective'),
('Cool', 'adjective'),
('Fast', 'adjective'),
('Strong', 'adjective'),
('Solid', 'adjective'),
('Bright', 'adjective'),
('Dark', 'adjective'),
('Ice', 'adjective'),
-- Nouns (Hockey-themed)
('Puck', 'noun'),
('Blade', 'noun'),
('Stick', 'noun'),
('Net', 'noun'),
('Rink', 'noun'),
('Ice', 'noun'),
('Goal', 'noun'),
('Shot', 'noun'),
('Save', 'noun'),
('Check', 'noun'),
('Faceoff', 'noun'),
('PowerPlay', 'noun'),
('HatTrick', 'noun'),
('Slapshot', 'noun'),
('Wrister', 'noun'),
('Deke', 'noun'),
('Breakaway', 'noun'),
('Rebound', 'noun'),
('Assist', 'noun'),
('Shutout', 'noun'),
('Warrior', 'noun'),
('Champion', 'noun'),
('Legend', 'noun'),
('Hero', 'noun'),
('Star', 'noun'),
('Captain', 'noun'),
('Boss', 'noun'),
('Philosopher', 'noun'),
('Heart', 'noun')
ON CONFLICT (word) DO NOTHING;

-- Row Level Security for username_vocabulary (public read-only)
ALTER TABLE username_vocabulary ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read vocabulary (needed for username generation)
CREATE POLICY "Public can read vocabulary" ON username_vocabulary
  FOR SELECT
  USING (true);

-- Comment
COMMENT ON TABLE username_vocabulary IS 'Vocabulary words for Xbox-style username generation';

-- ============================================================================
-- 1. USER_PROFILES TABLE
-- ============================================================================
-- Stores core user profile information (shared across all apps)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Row Level Security for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
-- Note: Profiles are usually created automatically via trigger on auth.users signup,
-- but this policy allows manual creation as a fallback
CREATE POLICY "Users can create their own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Public can read usernames/display names (for leaderboards, etc.)
CREATE POLICY "Public can read usernames" ON user_profiles
  FOR SELECT
  USING (true);

-- Comment
COMMENT ON TABLE user_profiles IS 'Core user profile information shared across all apps';

-- ============================================================================
-- 2. USER_STATS TABLE
-- ============================================================================
-- Stores aggregated user statistics per app (for quick lookups)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  app_id VARCHAR(50) NOT NULL DEFAULT 'hockey',
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_activities INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, app_id)
);

-- Indexes for user_stats
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_app_id ON user_stats(app_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(app_id, total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_activity ON user_stats(last_activity_at DESC);

-- Row Level Security for user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own stats (via triggers/functions)
CREATE POLICY "Users can create their own stats" ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own stats (via triggers/functions)
CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Public can read stats for leaderboards (points, streaks)
CREATE POLICY "Public can read stats for leaderboards" ON user_stats
  FOR SELECT
  USING (true);

-- Comment
COMMENT ON TABLE user_stats IS 'Aggregated user statistics per app (cached for performance)';

-- ============================================================================
-- 3. USER_POINTS TABLE
-- ============================================================================
-- Stores individual point transactions (immutable ledger)
CREATE TABLE IF NOT EXISTS user_points (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  app_id VARCHAR(50) NOT NULL DEFAULT 'hockey',
  points INTEGER NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  activity_id BIGINT,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_points
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_app_id ON user_points(app_id);
CREATE INDEX IF NOT EXISTS idx_user_points_earned_at ON user_points(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_activity ON user_points(activity_type, activity_id);

-- Row Level Security for user_points
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own point history
CREATE POLICY "Users can view their own points" ON user_points
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can insert points (via server-side functions only)
-- Note: Points should NEVER be inserted directly from client - use server actions/API routes
CREATE POLICY "Service role can insert points" ON user_points
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy: No updates or deletes (immutable ledger)
-- Intentionally no UPDATE or DELETE policies

-- Comment
COMMENT ON TABLE user_points IS 'Immutable ledger of all point transactions per user per app';

-- ============================================================================
-- 4. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp (for user_profiles)
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles updated_at
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Function to update updated_at timestamp (for user_stats)
CREATE OR REPLACE FUNCTION update_user_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_stats updated_at
CREATE TRIGGER user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_updated_at();

-- Function to automatically create user_profile when user signs up in auth.users
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_username VARCHAR(50);
  v_counter INTEGER := 0;
  v_adjective VARCHAR(50);
  v_noun VARCHAR(50);
  v_base_username VARCHAR(50);
  v_max_attempts INTEGER := 50;
BEGIN
  -- Generate Xbox-style username: Adjective + Noun (e.g., "SwiftPuck", "BoldBlade")
  -- Randomly select one adjective and one noun from vocabulary
  SELECT word INTO v_adjective
  FROM username_vocabulary
  WHERE word_type = 'adjective'
  ORDER BY RANDOM()
  LIMIT 1;
  
  SELECT word INTO v_noun
  FROM username_vocabulary
  WHERE word_type = 'noun'
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Fallback if vocabulary is empty (shouldn't happen, but safety check)
  IF v_adjective IS NULL THEN
    v_adjective := 'Swift';
  END IF;
  
  IF v_noun IS NULL THEN
    v_noun := 'Player';
  END IF;
  
  -- Combine: Adjective + Noun (e.g., "SwiftPuck")
  v_base_username := v_adjective || v_noun;
  
  -- Ensure username is unique by appending numbers if needed
  v_username := v_base_username;
  WHILE EXISTS (SELECT 1 FROM user_profiles WHERE username = v_username) AND v_counter < v_max_attempts LOOP
    v_counter := v_counter + 1;
    
    -- Try different combinations if base combo is taken
    IF v_counter <= 10 THEN
      -- Append number: "SwiftPuck1", "SwiftPuck2", etc.
      v_username := v_base_username || v_counter::TEXT;
    ELSE
      -- Try new random combination
      SELECT word INTO v_adjective
      FROM username_vocabulary
      WHERE word_type = 'adjective'
      ORDER BY RANDOM()
      LIMIT 1;
      
      SELECT word INTO v_noun
      FROM username_vocabulary
      WHERE word_type = 'noun'
      ORDER BY RANDOM()
      LIMIT 1;
      
      v_base_username := COALESCE(v_adjective, 'Swift') || COALESCE(v_noun, 'Player');
      v_username := v_base_username;
    END IF;
  END LOOP;
  
  -- Final fallback: use UUID suffix if still not unique
  IF EXISTS (SELECT 1 FROM user_profiles WHERE username = v_username) THEN
    v_username := v_base_username || SUBSTRING(REPLACE(NEW.id::TEXT, '-', ''), 1, 6);
  END IF;
  
  -- Create profile (bypasses RLS via SECURITY DEFINER)
  INSERT INTO user_profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    v_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', v_username)
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users to auto-create profile
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_on_signup();

-- Function to automatically create user_stats row when user_profiles is created
CREATE OR REPLACE FUNCTION create_user_stats_on_profile_create()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, app_id)
  VALUES (NEW.user_id, 'hockey')
  ON CONFLICT (user_id, app_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default stats when profile is created
CREATE TRIGGER create_user_stats_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats_on_profile_create();

-- Function to update user_stats when points are earned
-- This should be called from server-side code after inserting into user_points
CREATE OR REPLACE FUNCTION update_user_stats_on_points()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, app_id, total_points, total_activities, last_activity_at)
  VALUES (NEW.user_id, NEW.app_id, NEW.points, 1, NEW.earned_at)
  ON CONFLICT (user_id, app_id)
  DO UPDATE SET
    total_points = user_stats.total_points + NEW.points,
    total_activities = user_stats.total_activities + 1,
    last_activity_at = NEW.earned_at,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stats when points are inserted
CREATE TRIGGER update_stats_on_points_trigger
  AFTER INSERT ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_points();

-- ============================================================================
-- 5. HELPER FUNCTIONS (Optional - for server-side use)
-- ============================================================================

-- Function to award points (call from server-side code)
-- Usage: SELECT award_points('user-uuid', 10, 'trivia_correct', 'hockey', 123, 'Correct answer');
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_activity_type VARCHAR(100),
  p_app_id VARCHAR(50) DEFAULT 'hockey',
  p_activity_id BIGINT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
  v_point_id BIGINT;
BEGIN
  -- Insert into points ledger
  INSERT INTO user_points (user_id, app_id, points, activity_type, activity_id, description)
  VALUES (p_user_id, p_app_id, p_points, p_activity_type, p_activity_id, p_description)
  RETURNING id INTO v_point_id;
  
  -- Stats are automatically updated via trigger
  RETURN v_point_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. PROFILE CREATION: Profiles are automatically created when a user signs up
--    via Supabase Auth. The trigger on auth.users creates user_profiles,
--    which then triggers creation of user_stats. Users don't need to manually
--    create profiles - it happens automatically on signup.
--
-- 2. Points should ONLY be awarded via server-side functions/API routes
--    Never trust client-side point calculations
--
-- 3. Use the award_points() function or insert directly into user_points
--    (stats will auto-update via trigger)
--
-- 4. For streak calculations, you'll need additional logic in your application
--    (check last_activity_at and update current_streak accordingly)
--
-- 5. To add new apps, just insert new rows in user_stats with different app_id
--
-- 6. All point transactions are immutable (no UPDATE/DELETE policies)
--
-- 7. Username generation: Xbox-style random generation using vocabulary table.
--    Format: Adjective + Noun (e.g., "SwiftPuck", "BoldBlade", "FierceNet").
--    If combination is taken, appends numbers or tries new random combination.
--    Users can update username later via profile settings.

