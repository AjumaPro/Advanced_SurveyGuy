# Question Types & Models - Comprehensive Review

## 📊 Executive Summary

**Total Question Types:** 24 types across 5 categories  
**Status:** ⚠️ **ISSUES FOUND** - Inconsistencies and missing implementations  
**Priority:** 🔴 **HIGH** - Affects survey creation and response collection

---

## 🔍 Analysis Results

### ✅ **WORKING CORRECTLY** (15 types)

#### **Text Input Types** (4 types)
1. ✅ **text** - Short text input (Free)
2. ✅ **textarea** - Long text input (Free)
3. ✅ **email** - Email with validation (Free)
4. ✅ **number** - Numeric input (Free)

**Status:** All implemented and validated correctly

#### **Choice Types** (3 types)
5. ✅ **radio** - Single choice (Free)
6. ✅ **checkbox** - Multiple choice (Free)
7. ✅ **dropdown** - Dropdown selection (Free)

**Status:** All working with proper validation

#### **Rating & Scale Types** (2 types)
8. ✅ **rating** - Star rating 1-5 (Free)
9. ✅ **nps** - Net Promoter Score 0-10 (Pro)

**Status:** Implemented correctly

#### **Emoji Types** (6 types)
10. ✅ **emoji_satisfaction** - Emoji satisfaction scale (Free)
11. ✅ **emoji_agreement** - Emoji agreement scale (Free)
12. ✅ **emoji_quality** - Emoji quality rating (Free)
13. ✅ **emoji_mood** - Emoji mood tracker (Free)
14. ✅ **emoji_difficulty** - Emoji difficulty rating (Free)
15. ✅ **emoji_likelihood** - Emoji likelihood (Pro)

**Status:** All working with SVG emoji support

---

### ⚠️ **HAS ISSUES** (9 types)

#### **Issue #1: Inconsistent Type Naming**

**Problem:** Multiple naming conventions used across codebase

```javascript
// In questionTypes.js
type: 'emoji_satisfaction'  // snake_case

// In templates.js  
type: 'rating'              // lowercase

// In QuestionUpload.js
type: 'multiple_choice'     // snake_case with hyphen

// In validation
type: 'multiple_choice'     // different format
```

**Files Affected:**
- `client/src/utils/questionTypes.js`
- `client/src/data/templates.js`
- `client/src/data/questionTemplates.js`
- `client/src/components/QuestionUpload.js`

**Impact:** 🟡 **MEDIUM**
- Type mismatches cause rendering failures
- Validation doesn't work for some types
- Templates may not load correctly

**Fix Required:**
```javascript
// Standardize to snake_case everywhere
const TYPE_NAME_MAP = {
  'multiple-choice': 'multiple_choice',
  'emoji-scale': 'emoji_scale',
  'yes-no': 'yes_no',
  // ... map all variants
};
```

---

#### **Issue #2: Missing Question Types**

**Problem:** Types referenced but not fully implemented

16. ⚠️ **emoji_scale** - Generic emoji scale
   - ✅ Defined in questionTypes.js
   - ❌ Missing specific emoji set
   - ❌ No validation rules

17. ⚠️ **emoji_custom** - Custom emoji scale (Pro)
   - ✅ Defined with SVG support
   - ⚠️ UI not implemented for custom selection
   - ⚠️ No emoji upload feature

18. ⚠️ **svg_emoji_satisfaction** - SVG satisfaction (Pro)
   - ✅ Defined
   - ⚠️ Overlaps with emoji_satisfaction
   - ⚠️ Redundant type

19. ⚠️ **svg_emoji_mood** - SVG mood (Pro)
   - ✅ Defined
   - ⚠️ Overlaps with emoji_mood  
   - ⚠️ Redundant type

**Impact:** 🟡 **MEDIUM**
- Users can select type but can't configure properly
- No rendering support for some types
- Confusion between similar types

---

#### **Issue #3: Advanced Types Missing Renderers**

20. ⚠️ **scale** - Likert Scale (Pro)
   - ✅ Defined
   - ⚠️ No dedicated renderer component
   - ⚠️ Falls back to generic scale

21. ⚠️ **matrix** - Matrix questions (Enterprise)
   - ✅ Defined
   - ⚠️ Partial implementation
   - ⚠️ No proper answer validation

22. ⚠️ **ranking** - Ranking questions (Enterprise)
   - ✅ Defined  
   - ❌ No drag-and-drop UI implemented
   - ❌ No rendering component

23. ⚠️ **slider** - Slider input (Enterprise)
   - ✅ Defined
   - ⚠️ Basic implementation only
   - ⚠️ Missing value labels

24. ⚠️ **file** - File upload (Enterprise)
   - ✅ Defined
   - ❌ File storage not configured
   - ❌ No Supabase Storage integration

**Impact:** 🔴 **HIGH**
- Enterprise features don't work
- Users can't create these question types
- No response collection for these types

---

#### **Issue #4: Missing Types in Database**

**Problem:** Types in code but not in templates/validation

```javascript
// In templates.js
type: 'yes-no'           // ❌ Not in questionTypes.js

// In questionTemplates.js  
type: 'likert'           // ❌ Should be 'scale'
type: 'thumbs'           // ❌ Not defined anywhere
```

**Impact:** 🔴 **HIGH**
- Templates fail to load
- Surveys can't be created from templates
- Validation errors

---

#### **Issue #5: Missing Database Question Table**

**Problem:** No dedicated `questions` table in database schema

**Current:** Questions stored as JSONB in surveys.questions column

```sql
-- In complete-supabase-setup.sql
questions JSONB DEFAULT '[]'::jsonb,  -- All questions in one field
```

**Impact:** 🟡 **MEDIUM**
- Can't query individual questions efficiently
- Can't reuse questions across surveys  
- No question library functionality
- Difficult to version questions

---

### ⚠️ **VALIDATION ISSUES**

#### **Issue #6: Incomplete Validation Rules**

**Missing validation for:**
- `emoji_custom` - No validation
- `svg_emoji_satisfaction` - No validation
- `svg_emoji_mood` - No validation
- `scale` - Exists in questionTypes but missing in validation
- `ranking` - No validation
- `time` - No validation
- `datetime` - No validation
- `file` - Validation exists but incomplete

**Impact:** 🟡 **MEDIUM**
- Invalid questions can be saved
- Poor user experience
- Data quality issues

---

## 🔧 **RECOMMENDED FIXES**

### Fix #1: Standardize Type Names (Priority: HIGH)

```javascript
// File: client/src/utils/questionTypeNormalizer.js

export const STANDARD_QUESTION_TYPES = {
  // Text
  'text': 'text',
  'textarea': 'textarea',
  'long-text': 'textarea',
  'long_text': 'textarea',
  
  // Email & Phone
  'email': 'email',
  'phone': 'phone',
  'number': 'number',
  
  // Choice
  'radio': 'radio',
  'single-choice': 'radio',
  'single_choice': 'radio',
  'multiple-choice': 'checkbox',
  'multiple_choice': 'checkbox',
  'checkbox': 'checkbox',
  'dropdown': 'dropdown',
  'select': 'dropdown',
  
  // Rating
  'rating': 'rating',
  'star-rating': 'rating',
  'star_rating': 'rating',
  'scale': 'scale',
  'likert': 'scale',
  'nps': 'nps',
  
  // Emoji
  'emoji-scale': 'emoji_scale',
  'emoji_scale': 'emoji_scale',
  'emoji-satisfaction': 'emoji_satisfaction',
  'emoji_satisfaction': 'emoji_satisfaction',
  
  // Yes/No
  'yes-no': 'yes_no',
  'yes_no': 'yes_no',
  'yes/no': 'yes_no',
  'boolean': 'yes_no',
  
  // Advanced
  'matrix': 'matrix',
  'ranking': 'ranking',
  'slider': 'slider',
  'file': 'file',
  'date': 'date',
  'time': 'time',
  'datetime': 'datetime'
};

export const normalizeQuestionType = (type) => {
  return STANDARD_QUESTION_TYPES[type] || type;
};
```

---

### Fix #2: Add Missing Validation Rules

```javascript
// Add to client/src/utils/questionValidation.js

scale: {
  required: ['title', 'min', 'max'],
  optional: ['description', 'step', 'minLabel', 'maxLabel'],
  validate: (question) => {
    const errors = {};
    
    if (!question.title?.trim()) {
      errors.title = 'Question title is required';
    }
    
    if (question.settings?.min === undefined || question.settings?.max === undefined) {
      errors.range = 'Min and max values are required';
    }
    
    if (question.settings?.min >= question.settings?.max) {
      errors.min = 'Minimum must be less than maximum';
    }
    
    return errors;
  }
},

ranking: {
  required: ['title', 'options'],
  optional: ['description', 'maxRank'],
  validate: (question) => {
    const errors = {};
    
    if (!question.title?.trim()) {
      errors.title = 'Question title is required';
    }
    
    if (!question.settings?.options || question.settings.options.length < 2) {
      errors.options = 'At least 2 options required for ranking';
    }
    
    if (question.settings?.maxRank > question.settings?.options?.length) {
      errors.maxRank = 'Max rank cannot exceed number of options';
    }
    
    return errors;
  }
},

yes_no: {
  required: ['title'],
  optional: ['description'],
  validate: (question) => {
    const errors = {};
    
    if (!question.title?.trim()) {
      errors.title = 'Question title is required';
    }
    
    return errors;
  }
},

time: {
  required: ['title'],
  optional: ['description', 'format', 'step'],
  validate: (question) => {
    const errors = {};
    
    if (!question.title?.trim()) {
      errors.title = 'Question title is required';
    }
    
    const validFormats = ['12h', '24h'];
    if (question.settings?.format && !validFormats.includes(question.settings.format)) {
      errors.format = 'Format must be 12h or 24h';
    }
    
    return errors;
  }
},

file: {
  required: ['title'],
  optional: ['description', 'acceptedTypes', 'maxFileSize', 'maxFiles'],
  validate: (question) => {
    const errors = {};
    
    if (!question.title?.trim()) {
      errors.title = 'Question title is required';
    }
    
    if (question.settings?.maxFileSize > 100) {
      errors.maxFileSize = 'Maximum file size cannot exceed 100MB';
    }
    
    if (question.settings?.maxFiles < 1) {
      errors.maxFiles = 'Must allow at least 1 file';
    }
    
    return errors;
  }
}
```

---

### Fix #3: Remove Redundant Types

```javascript
// Remove these from questionTypes.js:
// - svg_emoji_satisfaction (use emoji_satisfaction instead)
// - svg_emoji_mood (use emoji_mood instead)

// Update emoji types to support both SVG and Unicode:
emoji_satisfaction: {
  type: 'emoji_satisfaction',
  name: 'Emoji Satisfaction',
  description: 'Rate satisfaction using emoji faces',
  category: 'Emoji & Visual',
  icon: '😊',
  planRequired: null,
  settings: {
    scale: 5,
    emojis: ['😞', '😐', '🙂', '😊', '😍'],
    labels: {
      1: 'Very Dissatisfied',
      2: 'Dissatisfied',
      3: 'Neutral',
      4: 'Satisfied',
      5: 'Very Satisfied'
    },
    useSVGEmojis: false,  // Add option to use SVG
    svgEmojiPath: '/emojis/satisfaction/',  // Path to SVG emojis
    validation: {
      required: false
    }
  }
}
```

---

### Fix #4: Add Missing Question Type

```javascript
// Add yes_no type to questionTypes.js

yes_no: {
  type: 'yes_no',
  name: 'Yes/No',
  description: 'Simple binary choice',
  category: 'Choice',
  icon: '✓',
  planRequired: null,
  settings: {
    yesLabel: 'Yes',
    noLabel: 'No',
    allowNA: false,
    naLabel: 'Not Applicable',
    validation: {
      required: false
    }
  }
}
```

---

### Fix #5: Create Missing Renderer Components

```javascript
// Create: client/src/components/questionRenderers/RankingQuestion.js

import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const RankingQuestion = ({ question, value, onChange }) => {
  const [items, setItems] = useState(
    value || question.settings.options.map((opt, i) => ({ id: i, text: opt, rank: null }))
  );

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
    onChange(newItems.map((item, i) => ({ ...item, rank: i + 1 })));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 transition-colors"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
            {index + 1}
          </span>
          <span className="flex-1">{item.text}</span>
        </div>
      ))}
    </div>
  );
};

export default RankingQuestion;
```

---

### Fix #6: Fix Template Type Mismatches

```javascript
// Update client/src/data/questionTemplates.js

// BEFORE (WRONG):
type: 'likert',  // ❌ Not defined
type: 'thumbs',  // ❌ Not defined

// AFTER (CORRECT):
type: 'scale',   // ✅ Use existing scale type
type: 'yes_no',  // ✅ Use yes/no type
```

**Specific fixes needed:**

```javascript
// Line 197: Change from
type: 'likert',
// To:
type: 'scale',

// Line 173: Change from
type: 'thumbs',
// To:
type: 'yes_no',
settings: { 
  yesLabel: 'Yes, I would recommend',
  noLabel: 'No, I would not recommend'
}
```

---

### Fix #7: Add Question Type in Database Schema

**Current:**
```sql
CREATE TABLE public.surveys (
    questions JSONB DEFAULT '[]'::jsonb,  -- All questions as JSON
    ...
);
```

**Recommended:** Add dedicated table for question library

```sql
CREATE TABLE public.question_library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    category TEXT,
    tags TEXT[],
    is_template BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast searching
CREATE INDEX idx_question_library_type ON question_library(type);
CREATE INDEX idx_question_library_user ON question_library(user_id);
CREATE INDEX idx_question_library_tags ON question_library USING GIN(tags);
```

**Benefits:**
- ✅ Reuse questions across surveys
- ✅ Build question library
- ✅ Better performance
- ✅ Version control for questions
- ✅ Share questions between users

---

### Fix #8: Add Missing Renderers

**Create these files:**

1. `client/src/components/questionRenderers/SliderQuestion.js`
2. `client/src/components/questionRenderers/FileUploadQuestion.js`
3. `client/src/components/questionRenderers/TimeQuestion.js`
4. `client/src/components/questionRenderers/DateTimeQuestion.js`

---

### Fix #9: Implement File Upload Support

```javascript
// Add Supabase Storage bucket
// Run in Supabase SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('survey-uploads', 'survey-uploads', false);

-- Policy for uploading
CREATE POLICY "Users can upload survey files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'survey-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for viewing own uploads
CREATE POLICY "Users can view own uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'survey-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 📋 Complete Type Reference

| # | Type Name | Category | Plan | Status | Issues |
|---|-----------|----------|------|--------|--------|
| 1 | text | Text Input | Free | ✅ Works | None |
| 2 | textarea | Text Input | Free | ✅ Works | None |
| 3 | email | Text Input | Free | ✅ Works | None |
| 4 | number | Text Input | Free | ✅ Works | None |
| 5 | radio | Choice | Free | ✅ Works | None |
| 6 | checkbox | Choice | Free | ✅ Works | None |
| 7 | dropdown | Choice | Free | ✅ Works | None |
| 8 | rating | Rating | Free | ✅ Works | None |
| 9 | nps | Rating | Pro | ✅ Works | None |
| 10 | emoji_satisfaction | Emoji | Free | ✅ Works | None |
| 11 | emoji_agreement | Emoji | Free | ✅ Works | None |
| 12 | emoji_quality | Emoji | Free | ✅ Works | None |
| 13 | emoji_mood | Emoji | Free | ✅ Works | None |
| 14 | emoji_difficulty | Emoji | Free | ✅ Works | None |
| 15 | emoji_likelihood | Emoji | Pro | ✅ Works | None |
| 16 | emoji_scale | Emoji | Free | ⚠️ Partial | Missing emoji set |
| 17 | emoji_custom | Emoji | Pro | ⚠️ Partial | No UI for customization |
| 18 | svg_emoji_satisfaction | Emoji | Pro | ⚠️ Redundant | Merge with #10 |
| 19 | svg_emoji_mood | Emoji | Pro | ⚠️ Redundant | Merge with #13 |
| 20 | scale | Advanced | Pro | ⚠️ Partial | No validation |
| 21 | matrix | Advanced | Enterprise | ⚠️ Partial | No proper renderer |
| 22 | ranking | Advanced | Enterprise | ❌ Missing | No drag-and-drop UI |
| 23 | slider | Advanced | Enterprise | ⚠️ Partial | Basic only |
| 24 | file | Advanced | Enterprise | ❌ Missing | No storage integration |
| 25 | date | Advanced | Enterprise | ✅ Works | None |
| 26 | time | Advanced | Enterprise | ⚠️ Partial | No validation |
| 27 | datetime | Advanced | Enterprise | ⚠️ Partial | No validation |
| 28 | yes_no | Choice | Free | ❌ Missing | Not in questionTypes.js |

---

## 🎯 Implementation Priority

### **Phase 1: Critical Fixes** (Week 1)
1. ✅ Standardize type names across codebase
2. ✅ Add missing `yes_no` type
3. ✅ Fix template type mismatches (`likert` → `scale`, `thumbs` → `yes_no`)
4. ✅ Add missing validation rules
5. ✅ Remove redundant SVG emoji types

**Impact:** Fixes broken templates and validation

### **Phase 2: Advanced Types** (Week 2)
1. ⚡ Implement ranking drag-and-drop UI
2. ⚡ Complete matrix question renderer
3. ⚡ Add slider improvements
4. ⚡ Implement file upload with Supabase Storage

**Impact:** Unlocks Enterprise features

### **Phase 3: Enhancement** (Week 3)
1. 🎨 Create question library table
2. 🎨 Build question reuse system
3. 🎨 Add question versioning
4. 🎨 Implement custom emoji builder

**Impact:** Improves user experience

---

## 📝 SQL Scripts Needed

### 1. Create Question Library Table
**File:** `CREATE_QUESTION_LIBRARY_TABLE.sql` (to be created)

### 2. Add File Upload Bucket
**File:** `SETUP_SURVEY_FILE_UPLOADS.sql` (to be created)

### 3. Fix Validation Triggers
**File:** `ADD_QUESTION_VALIDATION_TRIGGERS.sql` (to be created)

---

## 🧪 Testing Checklist

### Test Each Question Type:

- [ ] text - Create, save, render, submit
- [ ] textarea - Create, save, render, submit
- [ ] email - Create, validate, save, render
- [ ] number - Create with min/max, validate, submit
- [ ] radio - Create with options, render, submit
- [ ] checkbox - Multiple selection, min/max, submit
- [ ] dropdown - Search, select, submit
- [ ] rating - Star display, selection, submit
- [ ] nps - 0-10 scale, color coding, submit
- [ ] emoji_satisfaction - Click emoji, submit
- [ ] emoji_agreement - Click emoji, submit
- [ ] emoji_quality - Click emoji, submit
- [ ] emoji_mood - Click emoji, submit
- [ ] emoji_difficulty - Click emoji, submit
- [ ] emoji_likelihood - Click emoji, submit
- [ ] scale - Slider or buttons, submit
- [ ] matrix - Fill grid, validate all rows, submit
- [ ] ranking - Drag to reorder, validate order, submit
- [ ] slider - Drag slider, show value, submit
- [ ] file - Upload, validate size/type, submit
- [ ] date - Date picker, validate range, submit
- [ ] time - Time picker, validate format, submit
- [ ] datetime - Combined picker, validate, submit
- [ ] yes_no - Select option, submit

---

## 🔍 Type Consistency Issues

### Current Inconsistencies:

```javascript
// File: templates.js
'multiple-choice'  // ❌ Hyphen

// File: questionTypes.js
'checkbox'  // ✅ No hyphen

// File: questionTemplates.js
'multiple_choice'  // ❌ Underscore

// File: QuestionUpload.js  
'multiple_choice'  // ❌ Underscore
```

**Solution:** Choose ONE standard (recommend: snake_case)

---

## 💾 Database Schema Issue

### Current Schema (JSONB):
```sql
surveys.questions JSONB DEFAULT '[]'
```

**Pros:**
- ✅ Flexible schema
- ✅ Easy to update
- ✅ No migrations needed

**Cons:**
- ❌ Can't query individual questions
- ❌ Can't index questions
- ❌ Can't reuse questions
- ❌ Difficult to validate structure
- ❌ No referential integrity

### Recommended: Hybrid Approach

Keep JSONB for flexibility, add question library for reuse:

```sql
-- Keep existing surveys.questions as JSONB
-- Add new question_library table for reusable questions
-- Link via question_library_id in JSONB
```

---

## 🎯 Quick Wins

### Fix #1: Add Missing yes_no Type (5 minutes)

Add to `client/src/utils/questionTypes.js`:
```javascript
yes_no: {
  type: 'yes_no',
  name: 'Yes/No',
  description: 'Simple yes or no question',
  category: 'Choice',
  icon: '✓',
  planRequired: null,
  settings: {
    yesLabel: 'Yes',
    noLabel: 'No',
    validation: {
      required: false
    }
  }
},
```

### Fix #2: Update Template Types (10 minutes)

In `client/src/data/questionTemplates.js`:
```javascript
// Line 197:
type: 'scale',  // was 'likert'

// Line 173:
type: 'yes_no',  // was 'thumbs'
```

### Fix #3: Add Validation Rules (15 minutes)

Add missing rules to `client/src/utils/questionValidation.js` (see Fix #2 above)

---

## 📊 Impact Analysis

### High Impact Issues:
1. 🔴 **Template type mismatches** - Breaks template loading
2. 🔴 **Missing yes_no type** - Templates fail to render
3. 🔴 **Advanced type renderers** - Enterprise features don't work

### Medium Impact Issues:
4. 🟡 **Type name inconsistency** - Confusion and bugs
5. 🟡 **Missing validation** - Data quality issues
6. 🟡 **Redundant types** - Code bloat

### Low Impact Issues:
7. 🟢 **No question library** - Inconvenience
8. 🟢 **File upload not integrated** - Feature missing

---

## 📞 Support

For implementation help:
- **Email:** infoajumapro@gmail.com
- **Phone:** +233 24 973 9599

---

**Document Version:** 1.0  
**Last Updated:** October 1, 2025  
**Next Review:** After Phase 1 fixes

