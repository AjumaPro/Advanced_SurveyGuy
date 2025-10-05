-- Create forms table and related dependencies
-- This script creates the forms table and other required tables for payment forms

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    fields JSONB NOT NULL DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE,
    time TIME,
    location TEXT,
    capacity INTEGER,
    price DECIMAL(10,2) DEFAULT 0,
    fields JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attendee_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    position TEXT,
    ticket_type TEXT DEFAULT 'Standard',
    dietary_requirements TEXT,
    special_requirements TEXT,
    registration_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for forms table
DROP POLICY IF EXISTS "Forms are viewable by everyone" ON forms;
CREATE POLICY "Forms are viewable by everyone" ON forms FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own forms" ON forms;
CREATE POLICY "Users can view their own forms" ON forms FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own forms" ON forms;
CREATE POLICY "Users can insert their own forms" ON forms FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own forms" ON forms;
CREATE POLICY "Users can update their own forms" ON forms FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own forms" ON forms;
CREATE POLICY "Users can delete their own forms" ON forms FOR DELETE USING (auth.uid() = user_id);

-- Create policies for events table
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON events;
CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Create policies for event_registrations table
DROP POLICY IF EXISTS "Users can view their own registrations" ON event_registrations;
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Event owners can view registrations" ON event_registrations;
CREATE POLICY "Event owners can view registrations" ON event_registrations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM events 
        WHERE events.id = event_registrations.event_id 
        AND events.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can register for events" ON event_registrations;
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own registrations" ON event_registrations;
CREATE POLICY "Users can update their own registrations" ON event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_is_public ON forms(is_public);
CREATE INDEX IF NOT EXISTS idx_forms_is_active ON forms(is_active);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

-- Create updated_at triggers
DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
CREATE TRIGGER update_forms_updated_at
    BEFORE UPDATE ON forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_registrations_updated_at ON event_registrations;
CREATE TRIGGER update_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
