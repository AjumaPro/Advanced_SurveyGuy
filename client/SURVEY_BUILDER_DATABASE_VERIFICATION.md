# 🔧 SURVEY BUILDER & DATABASE VERIFICATION GUIDE

## 🎯 **COMPREHENSIVE SOLUTION FOR SURVEY BUILDER ISSUES**

### 🔧 **POTENTIAL ISSUES IDENTIFIED**

Based on your feedback about the survey builder not allowing question selection/editing, here are the most likely causes and solutions:

---

## 🚀 **SURVEY BUILDER FUNCTIONALITY CHECK**

### **✅ Survey Builder Features (Should Work):**

#### **📝 Question Selection:**
- **Click any question** in the left panel to select it
- **Selected question** should highlight with blue border
- **Question editor** should appear on the right side
- **"Select a Question"** message when no question selected

#### **✏️ Question Editing:**
- **Title editing** in the question editor
- **Description editing** for additional context
- **Answer options** editing for multiple choice/checkbox questions
- **Question settings** (required, validation, etc.)
- **Question type** changing with dropdown

#### **🎨 Visual Indicators:**
- **Blue border** around selected question
- **Question numbers** (Q1, Q2, etc.)
- **Question type badges** showing question type
- **Required indicators** for mandatory questions

---

## 🧪 **TESTING STEPS**

### **✅ 1. Test Survey Builder:**

#### **Access Survey Builder:**
```
URL: http://localhost:3000/app/builder
Expected: Professional survey builder interface
```

#### **Test Question Selection:**
1. **Add a question** using the "+" button or question type library
2. **Click on the question** in the left panel
3. **Expected**: Blue border around question, editor opens on right
4. **Edit**: Question title, description, or options
5. **Save**: Changes should persist

#### **Test Question Types:**
- **Text Input** - Single line text
- **Textarea** - Multi-line text
- **Multiple Choice** - Radio buttons with options
- **Checkbox** - Multiple selections
- **Rating** - Star rating scale
- **Scale** - Number scale
- **Emoji Scale** - Emoji-based rating

### **✅ 2. Verify Database Tables:**

#### **Quick Database Check:**
```
URL: http://localhost:3000/database-verify
Expected: Table status verification page
```

#### **Check Required Tables:**
- **Core Tables**: profiles, surveys, survey_responses, templates
- **Billing Tables**: subscription_plans, subscription_history, invoices, payment_methods
- **Feature Tables**: api_keys, sso_configurations, survey_branding, team_members
- **Analytics Tables**: analytics, notifications

#### **If Tables Missing:**
1. **Open**: Supabase Dashboard → SQL Editor
2. **Copy**: Contents of `client/complete-supabase-setup.sql`
3. **Paste**: Into SQL Editor and run
4. **Verify**: All tables created successfully

---

## 🔧 **SURVEY BUILDER TROUBLESHOOTING**

### **❌ If Questions Can't Be Selected:**

#### **Possible Causes:**
1. **JavaScript errors** preventing click handlers
2. **CSS issues** hiding clickable areas
3. **State management** problems with question selection
4. **Component loading** issues with lazy loading

#### **🛠️ Quick Fixes:**

##### **1. Check Browser Console:**
```javascript
// Open Developer Tools (F12)
// Look for JavaScript errors in Console tab
// Common errors: Component loading failures, API errors
```

##### **2. Clear Browser Cache:**
```bash
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Or clear browser cache and reload
```

##### **3. Check Network Tab:**
```javascript
// Open Developer Tools → Network tab
// Look for failed API calls or component loading errors
// Verify all chunks load successfully
```

### **❌ If Question Editor Doesn't Open:**

#### **Possible Causes:**
1. **ProfessionalQuestionEditor** component not loading
2. **Lazy loading** timeout or failure
3. **Props not passed** correctly to editor
4. **State update** issues with selectedQuestion

#### **🛠️ Quick Fixes:**

##### **1. Force Component Load:**
```javascript
// In browser console, check if component exists:
console.log('ProfessionalQuestionEditor loaded:', !!window.ProfessionalQuestionEditor);
```

##### **2. Check Question Data:**
```javascript
// In survey builder, check if questions have proper structure:
console.log('Survey questions:', survey.questions);
console.log('Selected question:', selectedQuestion);
```

---

## 📊 **DATABASE TABLES VERIFICATION**

### **✅ Required Tables for Full Functionality:**

#### **Core Survey System (8 tables):**
1. **profiles** - User accounts and roles
2. **surveys** - Survey definitions
3. **survey_responses** - Response data
4. **templates** - Survey templates
5. **events** - Event management
6. **event_registrations** - Event attendees
7. **notifications** - User notifications
8. **analytics** - Usage analytics

#### **Billing & Subscriptions (4 tables):**
9. **subscription_plans** - Available plans
10. **subscription_history** - User subscriptions
11. **invoices** - Billing records
12. **payment_methods** - Payment info

#### **Advanced Features (5 tables):**
13. **api_keys** - Developer access
14. **sso_configurations** - Enterprise SSO
15. **survey_branding** - Custom styling
16. **team_members** - Collaboration
17. **file_uploads** - File management

### **🔧 Database Setup Commands:**

#### **1. Complete Setup (Recommended):**
```sql
-- Copy entire contents of: client/complete-supabase-setup.sql
-- Paste into Supabase SQL Editor and run
-- This creates all 17 tables + sample data + functions
```

#### **2. Verify Setup:**
```sql
-- Check if tables exist:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 🎯 **IMMEDIATE TESTING GUIDE**

### **🔥 Step-by-Step Verification:**

#### **1. Database Check:**
```bash
# Visit: http://localhost:3000/database-verify
# Expected: All 17 tables showing green checkmarks
# If red X's: Run the complete-supabase-setup.sql script
```

#### **2. Survey Builder Test:**
```bash
# Visit: http://localhost:3000/app/builder
# Click: "Add Question" or question type from library
# Click: On the added question in left panel
# Expected: Question editor opens on right side
# Edit: Question title, description, or options
# Verify: Changes save and persist
```

#### **3. Template System Test:**
```bash
# Visit: http://localhost:3000/app/sample-surveys
# Expected: 6 professional survey templates
# Click: "Use Template" on any template
# Expected: Redirects to survey builder with template loaded
```

#### **4. Billing System Test:**
```bash
# Visit: http://localhost:3000/app/billing
# Expected: Professional billing interface
# Super Admin: Should see purple plan control panel
# Regular User: Should see normal upgrade options
```

---

## 🚀 **EXPECTED FUNCTIONALITY**

### **✅ Survey Builder Should Allow:**
- ✅ **Question selection** by clicking questions in left panel
- ✅ **Question editing** with professional editor on right
- ✅ **Answer editing** for multiple choice/checkbox questions
- ✅ **Drag and drop** reordering of questions
- ✅ **Question type changes** with dropdown selector
- ✅ **Real-time preview** of survey appearance
- ✅ **Save functionality** with Supabase integration

### **✅ Database Should Have:**
- ✅ **All 17 tables** created and accessible
- ✅ **Sample surveys** populated in templates
- ✅ **Billing tables** ready for subscriptions
- ✅ **RLS policies** configured for security
- ✅ **Functions** for template cloning and management

---

## 🧪 **DEBUGGING COMMANDS**

### **🔍 If Survey Builder Issues Persist:**

#### **1. Check Component Loading:**
```javascript
// In browser console:
console.log('Components loaded:', {
  ProfessionalSurveyBuilder: !!window.ProfessionalSurveyBuilder,
  ProfessionalQuestionEditor: !!window.ProfessionalQuestionEditor
});
```

#### **2. Check Question State:**
```javascript
// In survey builder page:
console.log('Survey state:', survey);
console.log('Selected question:', selectedQuestion);
console.log('Questions array:', survey.questions);
```

#### **3. Force Component Refresh:**
```bash
# Clear browser cache completely
# Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
# Or try incognito/private browsing mode
```

---

## 🎯 **RESOLUTION STEPS**

### **🚀 Quick Resolution Process:**

#### **1. Verify Database (2 minutes):**
- **Visit**: `http://localhost:3000/database-verify`
- **Check**: All tables show green checkmarks
- **If missing**: Run `complete-supabase-setup.sql` in Supabase

#### **2. Test Survey Builder (3 minutes):**
- **Visit**: `http://localhost:3000/app/builder`
- **Add**: New question using question library
- **Click**: On question to select it
- **Edit**: Question properties in right panel
- **Save**: Survey to verify persistence

#### **3. Check Browser Console (1 minute):**
- **Open**: Developer Tools (F12)
- **Check**: Console for any JavaScript errors
- **Look**: For component loading failures
- **Verify**: No network request failures

### **✅ Expected Results:**
- **Database**: All 17 tables exist and accessible
- **Survey Builder**: Questions selectable and editable
- **Templates**: 6 sample surveys available
- **Billing**: Professional upgrade interface working
- **Super Admin**: Instant plan switching functional

---

## 🎉 **COMPREHENSIVE SOLUTION SUMMARY**

### **🔥 Your Advanced SurveyGuy Should Now Have:**

#### **📝 Professional Survey Builder:**
- **Question selection** by clicking in left panel
- **Professional editor** with all question types
- **Answer editing** for multiple choice questions
- **Real-time preview** and validation
- **Template integration** with sample surveys

#### **💳 Complete Billing System:**
- **Professional billing interface** with all features
- **Super admin instant** plan switching
- **Regular user upgrade** flow with payment simulation
- **Comprehensive billing** history and analytics

#### **👑 Super Admin Capabilities:**
- **Instant plan switching** across all pages
- **Complete user management** with CRUD operations
- **Database table verification** tools
- **Professional admin interface** throughout

**🎯 Test these URLs to verify everything is working:**
- **Survey Builder**: `http://localhost:3000/app/builder`
- **Database Verification**: `http://localhost:3000/database-verify`
- **Billing Upgrades**: `http://localhost:3000/app/billing`
- **Sample Templates**: `http://localhost:3000/app/sample-surveys`

**🔥 Your Advanced SurveyGuy should now be fully functional with professional survey building capabilities! 🚀**
