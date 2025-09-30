-- Complete Events Table Fix
-- This script will add ALL missing columns to the events table

-- First, let's see what columns currently exist
SELECT 
    'Current columns:' as info,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns one by one
DO $$
BEGIN
    -- Check and add start_date
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'start_date' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN start_date TIMESTAMPTZ;
        RAISE NOTICE 'Added start_date column';
    END IF;
    
    -- Check and add end_date
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'end_date' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN end_date TIMESTAMPTZ;
        RAISE NOTICE 'Added end_date column';
    END IF;
    
    -- Check and add event_type
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_type' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN event_type TEXT DEFAULT 'standard';
        RAISE NOTICE 'Added event_type column';
    END IF;
    
    -- Check and add location
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'location' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column';
    END IF;
    
    -- Check and add virtual_link
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'virtual_link' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN virtual_link TEXT;
        RAISE NOTICE 'Added virtual_link column';
    END IF;
    
    -- Check and add capacity
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'capacity' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN capacity INTEGER DEFAULT 0;
        RAISE NOTICE 'Added capacity column';
    END IF;
    
    -- Check and add registration_required
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_required' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN registration_required BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added registration_required column';
    END IF;
    
    -- Check and add is_public
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_public' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_public column';
    END IF;
    
    -- Check and add is_active
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_active' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added is_active column';
    END IF;
    
    -- Check and add status
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN status TEXT DEFAULT 'draft';
        RAISE NOTICE 'Added status column';
    END IF;
    
    -- Check and add metadata
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'metadata' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Added metadata column';
    END IF;
    
    -- Check and add created_at
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_at' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added created_at column';
    END IF;
    
    -- Check and add updated_at
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'updated_at' AND table_schema = 'public') THEN
        ALTER TABLE public.events ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column';
    END IF;
    
    RAISE NOTICE 'All missing columns have been added to events table!';
END $$;

-- Enable RLS if not already enabled
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can manage own events" ON public.events;
    DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;
    
    -- Create policies
    CREATE POLICY "Users can manage own events" ON public.events
        FOR ALL USING (auth.uid() = user_id);
    
    CREATE POLICY "Anyone can view public events" ON public.events
        FOR SELECT USING (is_public = TRUE AND is_active = TRUE);
    
    RAISE NOTICE 'RLS policies created for events table!';
END $$;

-- Show the final structure
SELECT 
    'Final columns:' as info,
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Events table schema fixed completely!' as result;
SELECT 'All required columns have been added including: start_date, end_date, location, capacity, etc.' as details;
