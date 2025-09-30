-- INSTANT EVENT SAVING FIX
-- The issue is column name mismatch: code uses "start_date" but table uses "starts_at"

-- Option 1: Update table to match code (RECOMMENDED)
ALTER TABLE public.events 
RENAME COLUMN starts_at TO start_date;

-- If ends_at exists, rename it too
ALTER TABLE public.events 
RENAME COLUMN ends_at TO end_date;

-- Verify the column names
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;
