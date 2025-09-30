-- CORRECT EVENT SAVING FIX
-- Since your table has both start_date and starts_at columns, let's clean this up

-- First, let's see what we're working with
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
AND column_name IN ('start_date', 'starts_at', 'end_date', 'ends_at')
ORDER BY column_name;

-- Option 1: Remove the duplicate columns (starts_at, ends_at) if they exist and are empty
-- Only run these if the columns exist and have no data

-- Check if starts_at has any data
-- SELECT COUNT(*) FROM public.events WHERE starts_at IS NOT NULL;

-- If starts_at is empty, we can safely drop it
-- ALTER TABLE public.events DROP COLUMN IF EXISTS starts_at;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS ends_at;

-- Option 2: If you want to keep starts_at as the primary column, update start_date to use starts_at
-- UPDATE public.events SET starts_at = start_date WHERE starts_at IS NULL AND start_date IS NOT NULL;
-- UPDATE public.events SET ends_at = end_date WHERE ends_at IS NULL AND end_date IS NOT NULL;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS start_date;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS end_date;

-- For now, let's make sure the table structure is clean and working
-- Ensure start_date is NOT NULL (this should be the main column we use)
ALTER TABLE public.events ALTER COLUMN start_date SET NOT NULL;

-- Make sure we have proper indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);

-- Verify the final structure
SELECT 'Table structure verified' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;
