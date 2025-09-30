# Billing Tables Setup Guide

## 🎯 Issue
The billing page is showing errors because the `subscription_history` table and other billing-related tables don't exist in your Supabase database.

## 🛠️ Solution
Run the SQL script to create the missing billing tables.

## 📋 Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: `waasqqbklnhfrbzfuvzn`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy the contents of `client/add-billing-tables.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify Success**
   - You should see success messages
   - Check that all tables were created
   - Verify the sample data was inserted

### Option 2: Using Supabase CLI (Advanced)

```bash
# If you have Supabase CLI installed
supabase db reset
supabase db push

# Or run the specific migration
psql "postgresql://postgres:[YOUR-PASSWORD]@db.waasqqbklnhfrbzfuvzn.supabase.co:5432/postgres" -f client/add-billing-tables.sql
```

## 📊 Tables Being Created

1. **`subscription_history`**
   - Stores all user subscription records
   - Tracks plan changes, billing cycles, payments
   - Used by billing page for history and current subscription

2. **`payment_methods`**
   - Stores user payment methods (cards, etc.)
   - Secure storage with masked information
   - Used for payment management

3. **`invoices`**
   - Professional invoice generation
   - PDF links and payment tracking
   - Used by invoice manager

4. **`notification_preferences`**
   - User notification settings
   - Billing alerts and preferences
   - Used by billing settings

5. **`usage_tracking`**
   - Track user resource usage
   - Monthly limits and analytics
   - Used by usage tracker

## 🔧 What This Fixes

After running the SQL script:
- ✅ Billing page will load without errors
- ✅ All billing features will work properly
- ✅ Analytics and usage tracking will function
- ✅ Invoice management will be available
- ✅ Payment methods can be managed

## 🎯 Expected Results

Once the tables are created, you should see:
- **Billing Overview**: Shows $0.00 for new users (correct)
- **Free Plan**: Displays current free plan status
- **No Errors**: All database error messages should disappear
- **Full Functionality**: All billing features will work

## 🚨 Important Notes

- The script is safe to run multiple times (uses `IF NOT EXISTS`)
- Sample data is only created for `infoajumapro@gmail.com` user
- All tables have proper RLS (Row Level Security) policies
- Indexes are created for optimal performance

## 🔍 Troubleshooting

If you still see errors after running the script:

1. **Check the debug page**: Visit `/app/billing-debug`
2. **Verify tables exist**: Run this query in Supabase SQL editor:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%subscription%';
   ```
3. **Check RLS policies**: Ensure you're logged in as the correct user
4. **Review console logs**: Check browser console for detailed error messages

---

**Status**: Ready to run  
**Estimated time**: 2-3 minutes  
**Risk level**: Low (safe to execute)
