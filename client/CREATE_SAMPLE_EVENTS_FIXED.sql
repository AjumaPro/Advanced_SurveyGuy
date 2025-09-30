-- CREATE SAMPLE EVENTS FOR TESTING (FIXED VERSION)
-- This script creates sample events with valid status values that comply with the CHECK constraint

-- First, let's check if we have any users
SELECT 'Checking users...' AS status;
SELECT id, email FROM auth.users LIMIT 1;

-- Check the current status constraint
SELECT 'Checking status constraint...' AS status;
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.events'::regclass 
    AND contype = 'c' 
    AND conname LIKE '%status%';

-- Create sample events with VALID status values only
-- Valid statuses: 'draft', 'published', 'cancelled', 'completed'

INSERT INTO public.events (
    id,
    user_id,
    title,
    description,
    status,
    is_template,
    is_public,
    start_date,
    end_date,
    starts_at,
    ends_at,
    location,
    capacity,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Tech Conference 2024',
    'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
    'published',
    false,
    true,
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days' + INTERVAL '8 hours',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days' + INTERVAL '8 hours',
    'Convention Center, Downtown',
    500,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Web Development Workshop',
    'Hands-on workshop covering modern web development techniques and best practices.',
    'published',
    false,
    true,
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '15 days' + INTERVAL '4 hours',
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '15 days' + INTERVAL '4 hours',
    'Tech Hub, Innovation District',
    50,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Virtual Marketing Summit',
    'Learn from marketing experts in this comprehensive online summit.',
    'published',
    false,
    true,
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '6 hours',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '6 hours',
    'Online (Zoom)',
    200,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Business Networking Event',
    'Connect with fellow professionals and expand your business network.',
    'published',
    false,
    true,
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days' + INTERVAL '3 hours',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days' + INTERVAL '3 hours',
    'Business Center, Downtown',
    100,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Data Science Meetup',
    'Monthly meetup for data science enthusiasts to share knowledge and projects.',
    'published',
    false,
    false,
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '20 days' + INTERVAL '2 hours',
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '20 days' + INTERVAL '2 hours',
    'University Campus, Room 101',
    30,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Completed Workshop',
    'A workshop that has already finished.',
    'completed',
    false,
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '3 hours',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '3 hours',
    'Community Center',
    25,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Draft Event',
    'An event that is still being planned.',
    'draft',
    false,
    false,
    NOW() + INTERVAL '45 days',
    NOW() + INTERVAL '45 days' + INTERVAL '5 hours',
    NOW() + INTERVAL '45 days',
    NOW() + INTERVAL '45 days' + INTERVAL '5 hours',
    'TBD',
    100,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the events were created
SELECT 'Sample events created successfully!' AS status;
SELECT 
    title,
    status,
    location,
    capacity,
    start_date,
    is_template,
    is_public
FROM public.events 
WHERE is_template = false 
ORDER BY created_at DESC 
LIMIT 10;

-- Count events by status
SELECT 
    status,
    COUNT(*) as count
FROM public.events 
WHERE is_template = false
GROUP BY status
ORDER BY count DESC;

-- Show events that will appear in Published Events section
SELECT 'Events that will show in Published Events section:' AS info;
SELECT 
    title,
    status,
    start_date,
    location
FROM public.events 
WHERE is_template = false 
    AND (status = 'published' OR status IS NULL)
ORDER BY start_date ASC;

