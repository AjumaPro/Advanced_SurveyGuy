-- Fix Events Table Schema
-- This script checks and creates/fixes the events table to match the expected schema

-- First, let's check what exists
DO $$
BEGIN
    -- Check if events table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events' AND table_schema = 'public') THEN
        RAISE NOTICE 'Events table does not exist. Creating it...';
        
        -- Create the events table
        CREATE TABLE public.events (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            event_type TEXT DEFAULT 'standard' CHECK (event_type IN ('standard', 'conference', 'workshop', 'webinar', 'custom')),
            start_date TIMESTAMPTZ NOT NULL,
            end_date TIMESTAMPTZ,
            location TEXT,
            virtual_link TEXT,
            capacity INTEGER DEFAULT 0,
            registration_required BOOLEAN DEFAULT TRUE,
            is_public BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        RAISE NOTICE 'Events table created successfully!';
    ELSE
        RAISE NOTICE 'Events table exists. Checking columns...';
        
        -- Check if start_date column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'start_date' AND table_schema = 'public') THEN
            RAISE NOTICE 'start_date column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN start_date TIMESTAMPTZ;
        END IF;
        
        -- Check if end_date column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'end_date' AND table_schema = 'public') THEN
            RAISE NOTICE 'end_date column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN end_date TIMESTAMPTZ;
        END IF;
        
        -- Check if event_type column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_type' AND table_schema = 'public') THEN
            RAISE NOTICE 'event_type column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN event_type TEXT DEFAULT 'standard';
        END IF;
        
        -- Check if capacity column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'capacity' AND table_schema = 'public') THEN
            RAISE NOTICE 'capacity column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN capacity INTEGER DEFAULT 0;
        END IF;
        
        -- Check if registration_required column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_required' AND table_schema = 'public') THEN
            RAISE NOTICE 'registration_required column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN registration_required BOOLEAN DEFAULT TRUE;
        END IF;
        
        -- Check if is_public column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_public' AND table_schema = 'public') THEN
            RAISE NOTICE 'is_public column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
        END IF;
        
        -- Check if is_active column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_active' AND table_schema = 'public') THEN
            RAISE NOTICE 'is_active column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        END IF;
        
        -- Check if status column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status' AND table_schema = 'public') THEN
            RAISE NOTICE 'status column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN status TEXT DEFAULT 'draft';
        END IF;
        
        -- Check if metadata column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'metadata' AND table_schema = 'public') THEN
            RAISE NOTICE 'metadata column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        END IF;
        
        -- Check if virtual_link column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'virtual_link' AND table_schema = 'public') THEN
            RAISE NOTICE 'virtual_link column missing. Adding it...';
            ALTER TABLE public.events ADD COLUMN virtual_link TEXT;
        END IF;
        
        RAISE NOTICE 'Events table columns checked and updated!';
    END IF;
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

-- Now let's check the final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Events table schema fixed successfully!' as result;
SELECT 'The events table now has all required columns including start_date and end_date.' as details;
