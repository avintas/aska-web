-- Migration: Reset the in_set flag on source content tables
-- Purpose: Clear any lingering truthy in_set values so shareable content
-- and facts consistently reflect that they are not part of a set anymore
-- Date: 2026-01-24

-- Ensure shareables are marked as not in a set
UPDATE public.source_content_shareables
SET in_set = FALSE
WHERE in_set IS TRUE;

-- Ensure facts are marked as not in a set
UPDATE public.source_content_facts
SET in_set = FALSE
WHERE in_set IS TRUE;

-- Optional verification (uncomment to double-check)
-- SELECT COUNT(*) AS still_true
-- FROM public.source_content_shareables
-- WHERE in_set IS TRUE;
--
-- SELECT COUNT(*) AS still_true
-- FROM public.source_content_facts
-- WHERE in_set IS TRUE;
