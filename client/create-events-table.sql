-- Create Events Table (Simple Version)
-- Run this if the events table doesn't exist or has wrong schema

-- Drop the table if it exists (be careful - this will delete all data!)
DROP TABLE IF EXISTS public.events CASCADE;

-- Create the events table with correct schema
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

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own events" ON public.events
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public events" ON public.events
    FOR SELECT USING (is_public = TRUE AND is_active = TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);

-- Success message
SELECT 'Events table created successfully with all required columns!' as result;
SELECT 'Columns: id, user_id, title, description, event_type, start_date, end_date, location, virtual_link, capacity, registration_required, is_public, is_active, status, metadata, created_at, updated_at' as columns;
