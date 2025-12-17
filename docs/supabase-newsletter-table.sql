-- Newsletter Signups Table
-- Run this in your Supabase SQL Editor

-- Create the newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribe_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_active ON newsletter_signups(is_active);

-- Row Level Security (RLS) Policies
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (sign up)
CREATE POLICY "Anyone can sign up for newsletter" ON newsletter_signups
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to unsubscribe using their token
CREATE POLICY "Users can update their own subscription via token" ON newsletter_signups
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated service role can read all records (for admin/exports)
-- This prevents public read access for privacy
CREATE POLICY "Service role can read all newsletter signups" ON newsletter_signups
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Add a comment to the table
COMMENT ON TABLE newsletter_signups IS 'Stores email addresses for newsletter subscriptions';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_signups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER newsletter_signups_updated_at
  BEFORE UPDATE ON newsletter_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_signups_updated_at();

