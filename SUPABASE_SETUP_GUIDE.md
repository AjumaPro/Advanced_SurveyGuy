# 🚀 Complete Supabase Setup Guide for SurveyGuy

This guide will help you connect all Supabase configurations for the SurveyGuy application.

## 📋 Prerequisites

1. **Supabase Project**: You should have a Supabase project created
2. **Environment Variables**: `.env.local` file with Supabase credentials
3. **Database Access**: Access to Supabase SQL Editor

## 🔧 Step 1: Environment Configuration

Your `.env.local` file should contain:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://waasqqbklnhfrbzfuvzn.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXNxcWJrbG5oZnJiemZ1dnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjQ5ODcsImV4cCI6MjA3MzgwMDk4N30.W0CHR_5kQi6JL7p5qJ2hrHkqme0QWEsxSS4zIlzqv7Q
```

✅ **Status**: Already configured!

## 🗄️ Step 2: Database Schema Setup

1. **Open Supabase Dashboard** → Go to your project
2. **Navigate to SQL Editor**
3. **Run the setup script**: Copy and paste the contents of `complete-supabase-setup.sql`
4. **Execute the script** to create all tables, policies, and functions

### Key Tables Created:
- `profiles` - User profiles and roles
- `surveys` - Survey data
- `survey_responses` - Survey responses
- `templates` - Survey templates
- `events` - Event management
- `event_registrations` - Event registrations
- `notifications` - User notifications
- `analytics` - Usage analytics

## 🔐 Step 3: Authentication Setup

### Enable Email Authentication:
1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Configure **Site URL**: `http://localhost:3000`
4. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`

### Email Templates (Optional):
- Customize signup/reset email templates in **Authentication** → **Email Templates**

## 👤 Step 4: Create Admin User

1. **Sign up** with your admin email: `infoajumapro@gmail.com`
2. **Verify email** (check your inbox)
3. **Update role** in SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'infoajumapro@gmail.com';
```

## 🧪 Step 5: Test Configuration

### Test Pages Available:

1. **Connection Test**: `http://localhost:3000/supabase-test`
   - Tests database connection
   - Verifies table structure
   - Checks RLS policies

2. **Login Test**: `http://localhost:3000/login-test`
   - Tests authentication flow
   - Creates test accounts
   - Verifies AuthContext

3. **Main Login**: `http://localhost:3000/login`
   - Production login page

### Expected Test Results:

✅ **Green (Success)**:
- Basic connection
- Environment variables loaded
- Database connection successful
- Auth service working
- All required tables exist
- RLS policies working

⚠️ **Yellow (Warning)**:
- Minor issues that don't break functionality
- Missing optional features

❌ **Red (Error)**:
- Critical issues that need fixing

## 🔒 Step 6: Security Configuration

### Row Level Security (RLS):
- All tables have RLS enabled
- Users can only access their own data
- Public data is accessible to everyone
- Admin/Super admin roles have elevated access

### API Security:
- Anon key is safe for client-side use
- Service role key should never be exposed
- All database operations go through RLS

## 📱 Step 7: Frontend Integration

### AuthContext Features:
- ✅ User authentication (login/logout/signup)
- ✅ Session management
- ✅ Role-based access control
- ✅ Profile management
- ✅ Real-time auth state changes

### Supabase Client Features:
- ✅ Database queries with RLS
- ✅ Real-time subscriptions
- ✅ File storage (ready for implementation)
- ✅ Edge functions (ready for implementation)

## 🚨 Troubleshooting

### Common Issues:

1. **"Table doesn't exist"**
   - Run the `complete-supabase-setup.sql` script
   - Check if tables were created in the public schema

2. **"RLS policy violation"**
   - Verify user is authenticated
   - Check if user profile exists
   - Ensure correct user ID in policies

3. **"Invalid JWT"**
   - Check environment variables
   - Verify Supabase URL and anon key
   - Restart development server

4. **"Email not confirmed"**
   - Check email inbox for confirmation
   - Enable auto-confirm in Supabase settings (for development)

5. **"Permission denied"**
   - Verify RLS policies
   - Check user role and permissions
   - Ensure authenticated user

### Debug Steps:

1. **Check Browser Console** for JavaScript errors
2. **Use Test Pages** to isolate issues
3. **Check Supabase Logs** in the dashboard
4. **Verify Database State** in Table Editor

## 🎯 Next Steps

After setup is complete:

1. **Test all authentication flows**
2. **Create sample surveys and events**
3. **Test user roles and permissions**
4. **Configure email templates**
5. **Set up production environment**

## 📞 Support

If you encounter issues:

1. **Use test pages** to diagnose problems
2. **Check Supabase documentation**
3. **Review browser console errors**
4. **Check database logs in Supabase dashboard**

---

## ✅ Quick Verification Checklist

- [ ] Environment variables loaded
- [ ] Database schema created
- [ ] RLS policies active
- [ ] Admin user created and role updated
- [ ] Authentication working
- [ ] Test pages passing
- [ ] Main application accessible

**Status**: 🟢 All configurations connected and ready to use!
