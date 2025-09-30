-- FIX EVENTS TABLE DATE COLUMNS
-- This script ensures all date columns have proper values and removes NOT NULL constraints if needed

DO $$
BEGIN
    -- Check if starts_at column exists and has NOT NULL constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
            AND table_name = 'events' 
            AND column_name = 'starts_at'
            AND is_nullable = 'NO'
    ) THEN
        -- Remove NOT NULL constraint from starts_at
        ALTER TABLE public.events ALTER COLUMN starts_at DROP NOT NULL;
        RAISE NOTICE 'Removed NOT NULL constraint from starts_at column';
    END IF;

    -- Check if ends_at column exists and has NOT NULL constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
            AND table_name = 'events' 
            AND column_name = 'ends_at'
            AND is_nullable = 'NO'
    ) THEN
        -- Remove NOT NULL constraint from ends_at
        ALTER TABLE public.events ALTER COLUMN ends_at DROP NOT NULL;
        RAISE NOTICE 'Removed NOT NULL constraint from ends_at column';
    END IF;

    -- Update any null starts_at values with start_date values
    UPDATE public.events 
    SET starts_at = start_date 
    WHERE starts_at IS NULL AND start_date IS NOT NULL;

    -- Update any null ends_at values with end_date values
    UPDATE public.events 
    SET ends_at = end_date 
    WHERE ends_at IS NULL AND end_date IS NOT NULL;

    RAISE NOTICE 'Updated null date values';

    -- Verify the fix
    SELECT 
        'starts_at null count' as column_name,
        COUNT(*) as null_count
    FROM public.events 
    WHERE starts_at IS NULL
    UNION ALL
    SELECT 
        'ends_at null count' as column_name,
        COUNT(*) as null_count
    FROM public.events 
    WHERE ends_at IS NULL;

END $$;

-- Final verification query
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name IN ('start_date', 'end_date', 'starts_at', 'ends_at')
ORDER BY column_name;
