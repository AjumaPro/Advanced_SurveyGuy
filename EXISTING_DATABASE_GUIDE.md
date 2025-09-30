# 🗄️ Working with Your Existing Supabase Database

This guide helps you integrate SurveyGuy with your existing Supabase database, ensuring compatibility while preserving your current data.

## 🔍 Step 1: Inspect Your Current Database

### **Test Pages Available:**

1. **Database Inspector**: `http://localhost:3000/database-inspector`
   - ✅ Shows all existing tables
   - ✅ Displays table structure and sample data
   - ✅ Checks RLS policies
   - ✅ Identifies missing tables

2. **Supabase Connection Test**: `http://localhost:3000/supabase-test`
   - ✅ Tests database connection
   - ✅ Verifies authentication
   - ✅ Checks table access

3. **Login Test**: `http://localhost:3000/login-test`
   - ✅ Tests authentication flow
   - ✅ Verifies user creation
   - ✅ Checks AuthContext integration

## 🛠️ Step 2: Database Migration Options

### **Option A: Safe Migration (Recommended)**

Run the **database-migration-script.sql** in your Supabase SQL Editor:

```sql
-- This script safely:
-- ✅ Creates missing tables
-- ✅ Adds missing columns to existing tables
-- ✅ Preserves all existing data
-- ✅ Sets up RLS policies
-- ✅ Creates necessary functions and triggers
-- ✅ Syncs auth.users with profiles table
```

**Benefits:**
- 🔒 **Safe**: Won't delete existing data
- 🔄 **Idempotent**: Can run multiple times
- 📊 **Comprehensive**: Adds all SurveyGuy features
- 🔐 **Secure**: Sets up proper RLS policies

### **Option B: Inspection First**

1. **Run inspection functions** from `database-inspection-functions.sql`:
   ```sql
   -- Check what you have:
   SELECT * FROM database_health_check();
   SELECT * FROM get_schema_tables();
   SELECT * FROM get_rls_status();
   ```

2. **Review results** in Database Inspector page

3. **Then run migration** based on what's missing

### **Option C: Fresh Setup**

If you want to start fresh (⚠️ **Will delete existing data**):
```sql
-- Run complete-supabase-setup.sql for fresh installation
```

## 📋 Step 3: Common Existing Database Scenarios

### **Scenario 1: You have `profiles` table**
✅ **Migration script will:**
- Add missing columns (role, plan, is_active, etc.)
- Keep existing data intact
- Sync with auth.users table
- Add proper RLS policies

### **Scenario 2: You have `surveys` table**
✅ **Migration script will:**
- Add missing columns (questions, settings, status, etc.)
- Preserve existing surveys
- Add RLS policies for security
- Enable public survey sharing

### **Scenario 3: You have custom tables**
✅ **Migration script will:**
- Leave your custom tables untouched
- Add only SurveyGuy required tables
- Work alongside your existing schema

### **Scenario 4: You have different column names**
⚠️ **Manual adjustment needed:**
- Review migration script
- Modify column names to match your schema
- Or create views to map between schemas

## 🔐 Step 4: Authentication Integration

### **If you have existing users:**

1. **Check auth/profile sync:**
   ```sql
   SELECT * FROM check_profile_auth_sync();
   ```

2. **Update user roles:**
   ```sql
   -- Make yourself super admin
   UPDATE public.profiles 
   SET role = 'super_admin' 
   WHERE email = 'your-email@example.com';
   ```

3. **Test login** at `http://localhost:3000/login-test`

### **If you need new admin user:**

1. **Sign up** through the app: `http://localhost:3000/register`
2. **Verify email** (check inbox)
3. **Update role** in database:
   ```sql
   UPDATE public.profiles 
   SET role = 'super_admin' 
   WHERE email = 'your-new-email@example.com';
   ```

## 🚨 Step 5: Troubleshooting Common Issues

### **Issue 1: "Table doesn't exist"**
**Solution:**
- Run migration script to create missing tables
- Check Database Inspector to see what exists

### **Issue 2: "RLS policy violation"**
**Solution:**
- Migration script creates proper RLS policies
- Check RLS status: `SELECT * FROM get_rls_status();`
- Ensure user is authenticated

### **Issue 3: "Profile not found"**
**Solution:**
- Migration script syncs auth.users with profiles
- Manually create profile if needed:
  ```sql
  INSERT INTO profiles (id, email, role) 
  VALUES (auth.uid(), 'your-email@example.com', 'user');
  ```

### **Issue 4: "Cannot access data"**
**Solution:**
- Check user permissions
- Verify RLS policies
- Ensure proper authentication

## 📊 Step 6: Verify Integration

### **Run these checks:**

1. **Database Health:**
   ```sql
   SELECT * FROM database_health_check();
   ```

2. **Table Status:**
   ```sql
   SELECT * FROM get_rls_status();
   ```

3. **User Sync:**
   ```sql
   SELECT * FROM check_profile_auth_sync();
   ```

4. **Test Authentication:**
   - Visit: `http://localhost:3000/login-test`
   - Try login with existing credentials

5. **Test App Features:**
   - Visit: `http://localhost:3000/app/dashboard`
   - Create a survey
   - Check user profile

## 🎯 Step 7: Feature Compatibility

### **Your Existing Data:**
- ✅ **Preserved**: All existing data remains intact
- ✅ **Enhanced**: Gets new SurveyGuy features
- ✅ **Secure**: Protected by RLS policies

### **New Features Added:**
- 📊 **Survey Management**: Create and manage surveys
- 🎪 **Event Management**: Organize events and registrations
- 📋 **Templates**: Reusable survey templates
- 🔔 **Notifications**: User notification system
- 📈 **Analytics**: Usage tracking and insights
- 👥 **User Roles**: Admin, user, super_admin roles
- 💳 **Subscriptions**: Plan management (free, pro, enterprise)

### **API Compatibility:**
- ✅ **Supabase Client**: Full integration with existing queries
- ✅ **Real-time**: Subscriptions work with existing tables
- ✅ **Auth**: Seamless authentication integration
- ✅ **Storage**: Ready for file uploads (if needed)

## 🔄 Step 8: Migration Checklist

- [ ] **Backup existing data** (recommended)
- [ ] **Run Database Inspector** to see current state
- [ ] **Run migration script** in Supabase SQL Editor
- [ ] **Check migration results** with health check
- [ ] **Create/update admin user** role
- [ ] **Test authentication** on login test page
- [ ] **Test app functionality** on main app
- [ ] **Verify data integrity** in existing tables
- [ ] **Configure additional settings** as needed

## 📞 Support

If you encounter issues:

1. **Check test pages** for specific error messages
2. **Review Supabase logs** in dashboard
3. **Run health check queries** to diagnose issues
4. **Check browser console** for JavaScript errors

---

## ✅ Quick Start Commands

**1. Inspect existing database:**
```bash
# Visit: http://localhost:3000/database-inspector
```

**2. Run migration (in Supabase SQL Editor):**
```sql
-- Copy and paste: database-migration-script.sql
```

**3. Test integration:**
```bash
# Visit: http://localhost:3000/supabase-test
# Visit: http://localhost:3000/login-test
# Visit: http://localhost:3000/app/dashboard
```

**4. Create admin user:**
```sql
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

Your existing database is now fully integrated with SurveyGuy! 🎉
