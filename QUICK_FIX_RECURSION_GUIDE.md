# 🚨 QUICK FIX: Infinite Recursion Error

## Problem
You're seeing: **"Database connection failed: infinite recursion detected in policy for relation 'profiles'"**

## Solution (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `waasqqbklnhfrbzfuvzn`
3. Click **SQL Editor** in left sidebar

### Step 2: Run the Fix
1. Click **"+ New Query"**
2. Copy ALL contents from: `FIX_PROFILES_RECURSION_NOW.sql`
3. Paste into SQL editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

### Step 3: Wait for Success Message
You should see:
```
✅ Infinite recursion FIXED!
✅ RLS policies recreated without recursion
✅ Schema cache refreshed
```

### Step 4: Refresh Your Browser
1. Go back to your app at `localhost:3000`
2. Press **Ctrl+R** (Windows) or **Cmd+R** (Mac)
3. Navigate to `/app/account`
4. **Error should be gone!** ✅

---

## What This Does

The fix:
1. ✅ Disables RLS temporarily
2. ✅ Removes ALL problematic policies
3. ✅ Creates simple, non-recursive policies
4. ✅ Uses JWT token directly (no table lookups)
5. ✅ Re-enables RLS safely
6. ✅ Refreshes schema cache

**Result:** No more infinite recursion!

---

## If Still Having Issues

### Option A: Run Alternative Fix
Try: `SIMPLE_FIX_RECURSION.sql` (simpler version)

### Option B: Disable RLS Temporarily
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```
**Warning:** Only for testing, not for production!

### Option C: Check Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

## Prevention

The recursion happens when:
- Policy checks `profiles.role` 
- Which triggers policy again
- Which checks `profiles.role` again
- **Infinite loop!**

**Solution:** Use JWT token directly (no table access)

---

## Contact

If fix doesn't work:
- **Email:** infoajumapro@gmail.com
- **Phone:** +233 24 973 9599

---

**File to run:** `FIX_PROFILES_RECURSION_NOW.sql`  
**Time to fix:** 2 minutes  
**Difficulty:** Easy (just copy & paste)

