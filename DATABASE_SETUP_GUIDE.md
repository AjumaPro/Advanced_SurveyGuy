# Database Setup Guide

## 🚨 Missing Tables Issue Resolution

Based on the admin setup screenshots, you have several missing database tables that are causing functionality issues. Here's how to fix them:

## 📋 Missing Tables Identified

### ❌ Missing Tables:
- `subscription_plans`
- `invoices` 
- `payment_methods`
- `api_keys`
- `sso_configurations`
- `survey_branding`
- `team_members`
- `file_uploads`

### ✅ Existing Tables:
- `profiles`
- `analytics`
- `surveys`
- `survey_responses`
- `notifications`
- `subscription_history`

## 🔧 Schema Relationship Issues

**Error:** `Could not find a relationship between 'surveys' and 'survey_responses' in the schema cache`

This indicates that the foreign key relationships between tables are not properly established.

## 🛠️ Step-by-Step Fix

### Step 1: Create Missing Tables
1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `MISSING_DATABASE_TABLES.sql`
4. Click **Run** to execute the script

### Step 2: Fix Schema Relationships
1. In the same **SQL Editor**
2. Copy and paste the contents of `FIX_SCHEMA_RELATIONSHIPS.sql`
3. Click **Run** to execute the script

### Step 3: Verify Setup
1. Go back to your **Admin Setup** page
2. Click **"Verify Database Tables"** button
3. All tables should now show ✅ green checkmarks

## 📊 What Each Table Does

### `subscription_plans`
- Stores available subscription plans (Free, Pro, Enterprise)
- Defines pricing, limits, and features for each plan

### `invoices`
- Tracks billing and payment history
- Links users to their subscription plans

### `payment_methods`
- Stores user payment information (cards, bank accounts)
- Integrates with Stripe for payment processing

### `api_keys`
- Manages API access for users
- Controls permissions and rate limiting

### `sso_configurations`
- Handles Single Sign-On integrations
- Supports Google, Microsoft, SAML providers

### `survey_branding`
- Custom branding for surveys
- Logo, colors, fonts, custom CSS

### `team_members`
- Team collaboration features
- Role-based access control

### `file_uploads`
- File attachment functionality
- Image uploads, document attachments

## 🔐 Security Features Included

- **Row Level Security (RLS)** enabled on all tables
- **Proper foreign key relationships** with cascade deletes
- **Indexes** for optimal query performance
- **Triggers** for automatic timestamp updates
- **Policies** to ensure users can only access their own data

## 🧪 Testing After Setup

After running the scripts, test these features:

1. **Survey Creation** - Should work without schema errors
2. **Survey Publishing** - Status changes should work
3. **Response Collection** - Survey responses should save properly
4. **Analytics** - Response counting should work
5. **Admin Dashboard** - Should show proper user counts

## 🚨 Troubleshooting

### If you still get schema errors:
1. **Refresh your browser** - Clear cache and reload
2. **Wait 30 seconds** - Schema cache needs time to update
3. **Check Supabase logs** - Look for any error messages
4. **Verify foreign keys** - Ensure relationships are properly created

### If tables still show as missing:
1. **Check table names** - Ensure exact spelling matches
2. **Verify permissions** - Make sure you have admin access
3. **Check schema** - Tables might be in a different schema

## 📞 Support

If you continue to have issues:
1. Check the **Supabase Dashboard** for any error messages
2. Verify your **database connection** is working
3. Ensure you have **proper permissions** to create tables
4. Check that **RLS policies** are not blocking access

## ✅ Success Indicators

After successful setup, you should see:
- ✅ All tables showing green checkmarks in admin setup
- ✅ No more "schema cache" errors
- ✅ Survey creation and publishing working
- ✅ Response collection functioning
- ✅ Analytics showing proper data

The database will now be fully functional with all required tables and proper relationships established!
