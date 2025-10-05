-- Create a simple payment form for testing
-- This script creates a form with payment fields in the database

DO $$ 
BEGIN
    -- Create forms table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'forms') THEN
        CREATE TABLE forms (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            fields JSONB NOT NULL,
            settings JSONB DEFAULT '{}',
            is_public BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Forms are viewable by everyone" ON forms FOR SELECT USING (is_public = true);
        CREATE POLICY "Users can insert their own forms" ON forms FOR INSERT WITH CHECK (true);
        CREATE POLICY "Users can update their own forms" ON forms FOR UPDATE USING (true);
        CREATE POLICY "Users can delete their own forms" ON forms FOR DELETE USING (true);
        
        RAISE NOTICE 'Created forms table';
    ELSE
        RAISE NOTICE 'Forms table already exists';
    END IF;
    
    -- Create a test payment form
    INSERT INTO forms (id, title, description, fields, settings, is_public)
    VALUES (
        '550e8400-e29b-41d4-a716-446655440000'::uuid,
        'Payment Test Form',
        'Test form with payment functionality',
        '[
            {
                "id": "name",
                "type": "text",
                "label": "Full Name",
                "required": true,
                "placeholder": "Enter your full name"
            },
            {
                "id": "email",
                "type": "email",
                "label": "Email Address",
                "required": true,
                "placeholder": "Enter your email address"
            },
            {
                "id": "amount",
                "type": "payment",
                "label": "Payment Amount",
                "required": true,
                "placeholder": "Enter amount",
                "defaultAmount": 100,
                "description": "Enter the amount you wish to pay"
            },
            {
                "id": "description",
                "type": "textarea",
                "label": "Payment Description",
                "required": true,
                "placeholder": "Describe what this payment is for"
            }
        ]'::jsonb,
        '{
            "isPublic": true,
            "allowMultipleSubmissions": false,
            "requireLogin": false,
            "showProgress": true,
            "theme": "default"
        }'::jsonb,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        fields = EXCLUDED.fields,
        settings = EXCLUDED.settings,
        updated_at = NOW();
    
    RAISE NOTICE 'Payment test form created/updated';
    
    -- Create another payment form for different testing
    INSERT INTO forms (id, title, description, fields, settings, is_public)
    VALUES (
        '550e8400-e29b-41d4-a716-446655440001'::uuid,
        'Event Registration with Payment',
        'Register for our event and pay securely',
        '[
            {
                "id": "name",
                "type": "text",
                "label": "Full Name",
                "required": true,
                "placeholder": "Enter your full name"
            },
            {
                "id": "email",
                "type": "email",
                "label": "Email Address",
                "required": true,
                "placeholder": "Enter your email address"
            },
            {
                "id": "phone",
                "type": "phone",
                "label": "Phone Number",
                "required": false,
                "placeholder": "Enter your phone number"
            },
            {
                "id": "event_fee",
                "type": "payment",
                "label": "Event Registration Fee",
                "required": true,
                "placeholder": "Enter amount",
                "defaultAmount": 50,
                "description": "Registration fee for the event"
            },
            {
                "id": "dietary",
                "type": "textarea",
                "label": "Dietary Requirements",
                "required": false,
                "placeholder": "Any dietary requirements or allergies"
            }
        ]'::jsonb,
        '{
            "isPublic": true,
            "allowMultipleSubmissions": false,
            "requireLogin": false,
            "showProgress": true,
            "theme": "default"
        }'::jsonb,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        fields = EXCLUDED.fields,
        settings = EXCLUDED.settings,
        updated_at = NOW();
    
    RAISE NOTICE 'Event registration payment form created/updated';
    
    -- Display created forms
    RAISE NOTICE 'Created forms:';
    FOR rec IN SELECT id, title FROM forms WHERE is_public = true ORDER BY created_at DESC
    LOOP
        RAISE NOTICE 'Form ID: %, Title: %', rec.id, rec.title;
    END LOOP;
    
END $$;
