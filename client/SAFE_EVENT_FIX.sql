-- SAFE EVENT FIX - Handles existing policies and tables
-- Run this in Supabase SQL Editor to fix all event creation issues

-- Step 1: Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can manage own events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Event owners can view registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Anyone can register for public events" ON public.event_registrations;

-- Step 2: Drop and recreate the events table with the correct schema
DROP TABLE IF EXISTS public.events CASCADE;

-- Create the events table with the correct schema
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

-- Create RLS policies for events
CREATE POLICY "Users can manage own events" ON public.events
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public events" ON public.events
    FOR SELECT USING (is_public = TRUE AND is_active = TRUE);

-- Create indexes for events
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);

-- Step 3: Handle event_registrations table
-- Drop existing table if it exists
DROP TABLE IF EXISTS public.event_registrations CASCADE;

-- Create event_registrations table
CREATE TABLE public.event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    additional_info JSONB DEFAULT '{}'::jsonb,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for event_registrations
CREATE POLICY "Users can view own registrations" ON public.event_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Event owners can view registrations" ON public.event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_registrations.event_id 
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can register for public events" ON public.event_registrations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = event_registrations.event_id 
            AND events.is_public = TRUE 
            AND events.is_active = TRUE
        )
    );

-- Create indexes for event_registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations(email);

-- Success message
SELECT 'Events system fixed successfully!' as result;
SELECT 'Tables created: events, event_registrations' as tables;
SELECT 'All policies and indexes created' as status;
