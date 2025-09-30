# Professional Templates Guide
## Advanced SurveyGuy Template Library

This guide explains how to create and use the comprehensive professional templates for both surveys and events in Advanced SurveyGuy.

## 📋 Overview

The Advanced SurveyGuy platform now includes a comprehensive library of professional templates designed for various business needs:

### Survey Templates (7 Professional Templates)
- **Customer Satisfaction Survey** - Basic satisfaction measurement
- **Comprehensive Customer Experience Survey** - Detailed customer journey analysis
- **Employee Satisfaction Survey** - Workplace satisfaction and engagement
- **Event Feedback Survey** - Post-event evaluation and improvement
- **Product Feature Feedback Survey** - Product development insights
- **Market Research Survey** - Customer preferences and behavior
- **Course Evaluation Survey** - Educational program assessment

### Event Templates (5 Professional Templates)
- **Professional Business Conference** - Full-scale business conference
- **Corporate Team Building Event** - Internal team development
- **Educational Workshop** - Hands-on learning sessions
- **Professional Webinar** - Virtual educational events
- **Professional Networking Event** - Business relationship building

## 🚀 Quick Setup

### Method 1: Browser Console (Recommended)

1. **Open your SurveyGuy application**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Copy and paste the contents of `create-professional-templates.js`**
5. **Press Enter to execute**

The script will automatically:
- Create all professional templates
- Set them as public templates
- Configure proper settings and metadata
- Provide success/failure feedback

### Method 2: SQL Script

1. **Access your Supabase dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the contents of `PROFESSIONAL_TEMPLATES_COMPLETE.sql`**
4. **Execute the script**

### Method 3: JavaScript Module

1. **Import the seeding module** in your application
2. **Call the seeding functions** programmatically

```javascript
import { seedAllTemplates } from './SEED_PROFESSIONAL_TEMPLATES.js';
await seedAllTemplates();
```

## 📊 Template Categories

### Survey Categories

| Category | Description | Templates |
|----------|-------------|-----------|
| `customer-feedback` | Customer satisfaction and experience | 2 templates |
| `employee` | Employee satisfaction and engagement | 1 template |
| `events` | Event feedback and evaluation | 1 template |
| `product-research` | Product development insights | 1 template |
| `market-research` | Market analysis and preferences | 1 template |
| `education` | Educational program evaluation | 1 template |

### Event Categories

| Category | Description | Templates |
|----------|-------------|-----------|
| `business` | Business conferences and networking | 3 templates |
| `education` | Educational workshops and webinars | 2 templates |

## 🎯 Template Features

### Survey Template Features

Each survey template includes:
- **Professional question design** with proper scales and options
- **Comprehensive question types**: Rating, multiple-choice, text, email
- **Proper validation** and required field settings
- **Professional settings** including progress bars and thank you messages
- **Industry-specific customization** for different use cases
- **Estimated completion times** for better user experience

### Event Template Features

Each event template includes:
- **Professional registration forms** with relevant fields
- **Comprehensive event settings** including payment, approval, and cancellation policies
- **Detailed feature lists** for marketing and planning
- **Capacity and pricing** configuration
- **Target audience** specifications
- **Professional event types** and categories

## 🔧 Customization

### Survey Template Customization

Templates can be customized by:
1. **Editing questions** - Add, remove, or modify questions
2. **Adjusting settings** - Change validation, display options
3. **Modifying metadata** - Update title, description, target audience
4. **Industry adaptation** - Customize for specific industries

### Event Template Customization

Event templates can be customized by:
1. **Registration fields** - Add or modify registration form fields
2. **Event settings** - Adjust payment, approval, and cancellation policies
3. **Features and amenities** - Update what's included in the event
4. **Pricing and capacity** - Modify event logistics

## 📈 Best Practices

### Survey Best Practices

1. **Keep surveys focused** - Don't mix too many topics
2. **Use appropriate scales** - 5-point scales for satisfaction, 10-point for NPS
3. **Include open-ended questions** - Allow for detailed feedback
4. **Set proper completion times** - Be realistic about survey length
5. **Test before publishing** - Ensure all questions work correctly

### Event Best Practices

1. **Clear registration process** - Make it easy for attendees to register
2. **Detailed event information** - Provide comprehensive event details
3. **Proper capacity planning** - Set realistic attendance limits
4. **Clear policies** - Transparent cancellation and refund policies
5. **Professional presentation** - Use high-quality descriptions and features

## 🎨 Template Design Principles

### Professional Design Elements

1. **Consistent branding** - Professional titles and descriptions
2. **Clear structure** - Logical question flow and organization
3. **Appropriate complexity** - Match template complexity to use case
4. **Industry relevance** - Templates designed for specific industries
5. **User experience** - Optimized for both creators and respondents

### Question Design Standards

1. **Clear language** - Professional, easy-to-understand questions
2. **Proper scales** - Industry-standard rating scales
3. **Comprehensive options** - Complete answer choices
4. **Validation** - Appropriate required field settings
5. **Accessibility** - Inclusive question design

## 🔍 Verification

### Check Template Creation

After running the creation script, verify templates were created:

```sql
-- Check survey templates
SELECT title, template_category, estimated_time, target_audience 
FROM surveys 
WHERE is_template = true 
ORDER BY created_at DESC;

-- Check event templates
SELECT title, category, capacity, price, target_audience 
FROM events 
WHERE is_template = true 
ORDER BY created_at DESC;
```

### Expected Results

You should see:
- **7 survey templates** in the surveys table
- **5 event templates** in the events table
- All templates marked as `is_template = true`
- All templates marked as `is_public = true`
- Proper categorization and metadata

## 🚨 Troubleshooting

### Common Issues

1. **"No authenticated user found"**
   - Solution: Log in to your SurveyGuy application first

2. **"Supabase client not found"**
   - Solution: Ensure you're on the SurveyGuy application page

3. **Template creation fails**
   - Solution: Check browser console for specific error messages

4. **Templates not appearing**
   - Solution: Refresh the page after creation

### Error Messages

- **Permission denied**: Check user permissions in Supabase
- **Table doesn't exist**: Ensure database tables are properly set up
- **Duplicate key**: Templates may already exist, check for duplicates

## 📚 Additional Resources

### Template Documentation
- Each template includes detailed descriptions
- Question types and settings are documented
- Best practices are included in template metadata

### Support
- Check console logs for detailed error information
- Verify database connectivity and permissions
- Ensure proper authentication before running scripts

## 🎉 Success Indicators

When templates are successfully created, you'll see:
- ✅ Success messages in the console
- 📊 Creation summary with counts
- 🎯 Templates available in the application
- 🔄 Ability to create surveys/events from templates

## 🔄 Maintenance

### Updating Templates
- Templates can be updated through the application interface
- Changes are immediately available to all users
- Version control is maintained through the database

### Adding New Templates
- Follow the existing template structure
- Use consistent naming conventions
- Include proper metadata and settings
- Test thoroughly before making public

---

**Congratulations!** 🎉 Your Advanced SurveyGuy platform now has a comprehensive library of professional templates ready for immediate use.
