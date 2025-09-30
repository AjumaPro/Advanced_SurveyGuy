-- =============================================
-- FIX PUBLISHING FUNCTIONALITY
-- Add missing published_at field to surveys table
-- =============================================

-- Add published_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'surveys' 
        AND column_name = 'published_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.surveys ADD COLUMN published_at TIMESTAMPTZ;
        
        -- Update existing published surveys to have a published_at timestamp
        UPDATE public.surveys 
        SET published_at = updated_at 
        WHERE status = 'published' AND published_at IS NULL;
        
        RAISE NOTICE 'Added published_at column to surveys table and updated existing published surveys';
    ELSE
        RAISE NOTICE 'published_at column already exists in surveys table';
    END IF;
END $$;

-- Verify the surveys table structure
SELECT 
    'Surveys table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'surveys' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test publishing functionality
SELECT 
    'Current surveys status distribution:' as info,
    status,
    COUNT(*) as count,
    COUNT(published_at) as with_published_timestamp
FROM public.surveys 
GROUP BY status
ORDER BY status;

-- Success message
SELECT 'Publishing database fix completed successfully! The published_at field has been added.' as final_status;
