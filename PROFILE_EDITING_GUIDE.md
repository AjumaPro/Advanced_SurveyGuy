# Profile Editing Setup Guide

## Step 1: Fix Database Issues

1. **Open Supabase SQL Editor**
2. **Copy and paste** the entire content of `ENABLE_PROFILE_EDITING.sql`
3. **Run the script** - this will:
   - Fix the infinite recursion error
   - Create proper RLS policies
   - Add missing columns
   - Create/update your profile

## Step 2: Test Profile Editing

1. **Refresh your browser** at `localhost:3000/app/account`
2. **Click "Test DB"** button to verify database connection
3. **Click "Edit Profile"** button
4. **Make changes** to any field (Full Name, Phone, Company, etc.)
5. **Click "Save Changes"**

## Step 3: Verify It Works

You should see:
- ✅ **Loading toast**: "Saving profile..."
- ✅ **Success toast**: "Profile updated successfully! 🎉"
- ✅ **Form exits edit mode**
- ✅ **Changes are saved and displayed**

## Troubleshooting

### If you still see errors:

1. **Check browser console** (F12 → Console) for detailed error messages
2. **Run the database test** using the "Test DB" button
3. **Try creating a new profile** if the update fails

### Common Issues:

- **"Permission denied"**: RLS policies need to be fixed
- **"Profile not found"**: Profile needs to be created
- **"Infinite recursion"**: Database policies need to be reset

## Features Available:

- ✅ **Edit all profile fields** (except email)
- ✅ **Real-time validation**
- ✅ **Loading states**
- ✅ **Error handling**
- ✅ **Auto-profile creation**
- ✅ **Success feedback**

## Profile Fields You Can Edit:

- **Full Name** (required)
- **Phone**
- **Company**
- **Website**
- **Location**
- **Bio**
- **Timezone**
- **Notification Preferences**

The email field is read-only for security reasons.
