# Create Survey in Supabase Dashboard

## Problem
The QR code isn't working because the survey `85ec5b20-5af6-4479-8bd8-34ae409e2d64` doesn't exist in the database.

## Solution
Create the survey directly in the Supabase dashboard to bypass RLS restrictions.

## Steps

### 1. Access Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Navigate to your project: `waasqqbklnhfrbzfuvzn`
- Go to **Table Editor** → **surveys**

### 2. Create New Survey
Click **Insert** → **Insert row** and fill in:

```json
{
  "id": "85ec5b20-5af6-4479-8bd8-34ae409e2d64",
  "title": "Customer Feedback Survey",
  "description": "Please help us improve our service by completing this quick survey",
  "questions": [
    {
      "id": "q1",
      "type": "rating",
      "question": "How satisfied are you with our service?",
      "required": true,
      "settings": {"max": 5},
      "options": [
        {"label": "Very Satisfied", "value": 5},
        {"label": "Satisfied", "value": 4},
        {"label": "Neutral", "value": 3},
        {"label": "Dissatisfied", "value": 2},
        {"label": "Very Dissatisfied", "value": 1}
      ]
    },
    {
      "id": "q2",
      "type": "paragraph",
      "question": "What can we do to improve your experience?",
      "required": false,
      "placeholder": "Please share your feedback..."
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "question": "How did you hear about us?",
      "required": true,
      "options": [
        {"label": "Social Media", "value": "social"},
        {"label": "Search Engine", "value": "search"},
        {"label": "Friend/Recommendation", "value": "referral"},
        {"label": "Advertisement", "value": "ad"},
        {"label": "Other", "value": "other"}
      ]
    }
  ],
  "status": "published",
  "user_id": "00000000-0000-0000-0000-000000000000",
  "created_at": "2025-01-03T12:00:00.000Z",
  "updated_at": "2025-01-03T12:00:00.000Z"
}
```

### 3. Save the Survey
- Click **Save** to insert the survey
- The survey should now exist in the database

### 4. Test the QR Code
- Go to your survey app
- Generate a QR code for survey ID: `85ec5b20-5af6-4479-8bd8-34ae409e2d64`
- Test the QR code on your mobile device
- It should now work!

## Alternative: Use SQL Editor

If the Table Editor doesn't work, use the **SQL Editor**:

```sql
INSERT INTO surveys (
  id,
  title,
  description,
  questions,
  status,
  user_id,
  created_at,
  updated_at
) VALUES (
  '85ec5b20-5af6-4479-8bd8-34ae409e2d64',
  'Customer Feedback Survey',
  'Please help us improve our service by completing this quick survey',
  '[
    {
      "id": "q1",
      "type": "rating",
      "question": "How satisfied are you with our service?",
      "required": true,
      "settings": {"max": 5},
      "options": [
        {"label": "Very Satisfied", "value": 5},
        {"label": "Satisfied", "value": 4},
        {"label": "Neutral", "value": 3},
        {"label": "Dissatisfied", "value": 2},
        {"label": "Very Dissatisfied", "value": 1}
      ]
    },
    {
      "id": "q2",
      "type": "paragraph",
      "question": "What can we do to improve your experience?",
      "required": false,
      "placeholder": "Please share your feedback..."
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "question": "How did you hear about us?",
      "required": true,
      "options": [
        {"label": "Social Media", "value": "social"},
        {"label": "Search Engine", "value": "search"},
        {"label": "Friend/Recommendation", "value": "referral"},
        {"label": "Advertisement", "value": "ad"},
        {"label": "Other", "value": "other"}
      ]
    }
  ]'::jsonb,
  'published',
  '00000000-0000-0000-0000-000000000000',
  NOW(),
  NOW()
);
```

## Verification

After creating the survey, verify it exists:

```sql
SELECT id, title, status FROM surveys WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';
```

The survey should appear with status 'published'.

## Test URL

Once created, test this URL directly in your browser:
https://ajumapro.com/survey/85ec5b20-5af6-4479-8bd8-34ae409e2d64

It should load the survey instead of "Survey Not Found".
