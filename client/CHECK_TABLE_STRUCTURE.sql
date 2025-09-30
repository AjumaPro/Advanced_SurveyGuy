-- CHECK ACTUAL TABLE STRUCTURE
-- Run this to see what columns exist in your events table

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check if there are any existing events
SELECT COUNT(*) as total_events FROM public.events;

-- Show a sample of existing data structure
SELECT * FROM public.events LIMIT 1;

