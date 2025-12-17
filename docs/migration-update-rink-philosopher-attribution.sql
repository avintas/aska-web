-- Migration: Update attribution field in collection_hockey_culture table
-- Purpose: Change "The Rink Philosopher" to "Rink Philosopher" for consistency
-- Date: 2025-12-16

-- Update all records where attribution = "The Rink Philosopher" to "Rink Philosopher"
UPDATE public.collection_hockey_culture
SET attribution = 'Rink Philosopher',
    updated_at = NOW()
WHERE attribution = 'The Rink Philosopher';

-- Verify the update (optional - uncomment to check results)
-- SELECT COUNT(*) as updated_count
-- FROM public.collection_hockey_culture
-- WHERE attribution = 'Rink Philosopher';

-- Check if any "The Rink Philosopher" records remain (should be 0)
-- SELECT COUNT(*) as remaining_count
-- FROM public.collection_hockey_culture
-- WHERE attribution = 'The Rink Philosopher';

