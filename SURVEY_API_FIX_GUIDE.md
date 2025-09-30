# Survey API Functions Fix Guide

## 🚨 Current Issue
The Survey API functions are failing with:
```
Could not find a relationship between 'surveys' and 'survey_responses' in the schema cache
```

## 🔧 Step-by-Step Fix

### Step 1: Run the Database Fix Script

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Fix Script**
   - Copy the entire contents of `SAFE_DATABASE_FIX.sql`
   - Paste it into the SQL Editor
   - Click "Run" button
   - Wait for completion (should show success messages)

### Step 2: Verify Tables Were Created

1. **Check Table List**
   - Go to "Table Editor" in Supabase
   - You should see these tables:
     - ✅ `surveys`
     - ✅ `survey_responses`
     - ✅ `subscription_plans`
     - ✅ `invoices`
     - ✅ `payment_methods`
     - ✅ `api_keys`
     - ✅ `sso_configurations`
     - ✅ `survey_branding`
     - ✅ `team_members`
     - ✅ `file_uploads`

### Step 3: Check Table Relationships

1. **Verify Foreign Keys**
   - In Table Editor, click on `survey_responses` table
   - Check that it has a `survey_id` column
   - Check that it has a `user_id` column
   - These should be foreign keys pointing to other tables

2. **Verify Surveys Table**
   - Click on `surveys` table
   - Check that it has a `user_id` column
   - Check that it has all required columns (title, description, questions, etc.)

### Step 4: Test the Fix

1. **Go Back to Your App**
   - Navigate to the Survey API Functions test page
   - Click "Get Surveys" - should now work
   - Click "Get Survey" - should now work

2. **Expected Results**
   - ✅ Get Surveys: Should show survey data
   - ✅ Get Survey: Should show individual survey data
   - ✅ Create Survey: Should continue working
   - ✅ Update Survey: Should continue working

## 🚨 If Still Not Working

### Option 1: Manual Table Creation
If the script didn't work, manually create the tables:

```sql
-- Create surveys table
CREATE TABLE surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Survey',
    description TEXT,
    questions JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_responses table
CREATE TABLE survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Option 2: Check Supabase Logs
1. Go to Supabase Dashboard → Logs
2. Look for any error messages
3. Check if there are permission issues

### Option 3: Refresh Schema Cache
Run this in SQL Editor:
```sql
NOTIFY pgrst, 'reload schema';
```

## 🔍 Troubleshooting

### Common Issues:

1. **Permission Denied**
   - Make sure you're logged in as the project owner
   - Check that you have admin access to the database

2. **Tables Already Exist**
   - The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
   - If tables exist but are missing columns, the script will add them

3. **Foreign Key Errors**
   - Make sure `auth.users` table exists
   - Check that user authentication is working

4. **Schema Cache Issues**
   - Wait 30 seconds after running the script
   - Refresh your browser
   - Try the `NOTIFY pgrst, 'reload schema';` command

## ✅ Success Indicators

After successful fix, you should see:
- ✅ All tables created in Supabase
- ✅ Get Surveys function working
- ✅ Get Survey function working
- ✅ No more schema cache errors
- ✅ Survey creation and management working

## 📞 Still Having Issues?

If you're still experiencing problems:
1. Check the Supabase Dashboard for error messages
2. Verify your database connection is working
3. Make sure you have proper permissions
4. Try running the script in smaller chunks

The key is ensuring that the `surveys` and `survey_responses` tables exist with proper foreign key relationships!
