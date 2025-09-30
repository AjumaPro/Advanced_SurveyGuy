-- Add missing columns to events table for professional event creation
-- This script adds columns that are commonly needed for event management

DO $$
BEGIN
    -- Add venue column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'venue'
    ) THEN
        ALTER TABLE public.events ADD COLUMN venue TEXT;
        RAISE NOTICE 'Added venue column to events table';
    ELSE
        RAISE NOTICE 'Venue column already exists in events table';
    END IF;

    -- Add price column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'price'
    ) THEN
        ALTER TABLE public.events ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added price column to events table';
    ELSE
        RAISE NOTICE 'Price column already exists in events table';
    END IF;

    -- Add currency column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.events ADD COLUMN currency TEXT DEFAULT 'USD';
        RAISE NOTICE 'Added currency column to events table';
    ELSE
        RAISE NOTICE 'Currency column already exists in events table';
    END IF;

    -- Add category column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'category'
    ) THEN
        ALTER TABLE public.events ADD COLUMN category TEXT;
        RAISE NOTICE 'Added category column to events table';
    ELSE
        RAISE NOTICE 'Category column already exists in events table';
    END IF;

    -- Add registration_fields column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'registration_fields'
    ) THEN
        ALTER TABLE public.events ADD COLUMN registration_fields JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added registration_fields column to events table';
    ELSE
        RAISE NOTICE 'Registration_fields column already exists in events table';
    END IF;

    -- Add event_settings column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'event_settings'
    ) THEN
        ALTER TABLE public.events ADD COLUMN event_settings JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Added event_settings column to events table';
    ELSE
        RAISE NOTICE 'Event_settings column already exists in events table';
    END IF;

    -- Add features column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'features'
    ) THEN
        ALTER TABLE public.events ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added features column to events table';
    ELSE
        RAISE NOTICE 'Features column already exists in events table';
    END IF;

    -- Add target_audience column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'target_audience'
    ) THEN
        ALTER TABLE public.events ADD COLUMN target_audience TEXT;
        RAISE NOTICE 'Added target_audience column to events table';
    ELSE
        RAISE NOTICE 'Target_audience column already exists in events table';
    END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_price ON public.events(price);
CREATE INDEX IF NOT EXISTS idx_events_currency ON public.events(currency);

-- Verification query
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name IN ('venue', 'price', 'currency', 'category', 'registration_fields', 'event_settings', 'features', 'target_audience')
ORDER BY column_name;
