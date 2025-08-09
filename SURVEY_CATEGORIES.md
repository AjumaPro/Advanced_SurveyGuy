# Survey Categories Documentation

## Overview

SurveyGuy now features a comprehensive categorization system that organizes survey templates by **purpose**, **question format**, and **data collection method**. This system helps users quickly find the right template for their specific needs.

## 🔹 Survey Categories by Purpose

### 1. Customer Satisfaction Surveys
**Purpose**: Measure customer satisfaction with products, services, and experiences

#### Subcategories:
- **CSAT (Customer Satisfaction Score) Survey**
  - Measures overall customer satisfaction
  - Uses 5-point emoji scale
  - Includes follow-up questions for improvement

- **NPS (Net Promoter Score) Survey**
  - Measures customer loyalty and likelihood to recommend
  - Uses 0-10 scale
  - Captures reasons for scores

- **CES (Customer Effort Score) Survey**
  - Measures ease of customer interactions
  - Evaluates service delivery efficiency
  - Identifies friction points

### 2. Market Research Surveys
**Purpose**: Gather insights about market trends, preferences, and competition

#### Subcategories:
- **Product Feedback Survey**
  - Collects feedback about products or services
  - Evaluates quality and usability
  - Identifies feature preferences

- **Brand Awareness Survey**
  - Measures brand recognition and perception
  - Tracks brand awareness channels
  - Evaluates brand associations

- **Competitor Analysis Survey**
  - Compares against competitors
  - Identifies competitive advantages
  - Tracks market positioning

### 3. Employee Surveys
**Purpose**: Gather feedback from employees about workplace satisfaction and engagement

#### Subcategories:
- **Employee Engagement Survey**
  - Measures employee engagement and satisfaction
  - Evaluates work-life balance
  - Identifies improvement areas

- **Job Satisfaction Survey**
  - Assesses overall job satisfaction
  - Measures retention likelihood
  - Identifies satisfaction drivers

- **Exit Interview Survey**
  - Gathers feedback from departing employees
  - Identifies retention issues
  - Improves workplace culture

- **Onboarding Feedback Survey**
  - Evaluates onboarding effectiveness
  - Identifies onboarding improvements
  - Measures new hire satisfaction

### 4. Academic / Educational Surveys
**Purpose**: Surveys for educational institutions and academic research

#### Subcategories:
- **Course Evaluation Survey**
  - Evaluates course effectiveness
  - Measures instructor performance
  - Identifies course improvements

- **Student Feedback Survey**
  - Gathers student experience feedback
  - Evaluates educational quality
  - Identifies institutional improvements

- **Educational Research Survey**
  - Conducts educational research
  - Studies learning methods
  - Evaluates educational outcomes

### 5. Health & Wellness Surveys
**Purpose**: Surveys related to healthcare, wellness, and mental health

#### Subcategories:
- **Patient Satisfaction Survey**
  - Evaluates healthcare service quality
  - Measures patient experience
  - Identifies healthcare improvements

- **Mental Health Screening Survey**
  - Assesses mental well-being
  - Identifies stress factors
  - Evaluates coping strategies

- **Lifestyle Habits Survey**
  - Evaluates health behaviors
  - Measures exercise and sleep patterns
  - Tracks health goals

### 6. Event Feedback Surveys
**Purpose**: Gather feedback from event attendees and participants

#### Subcategories:
- **Pre-Event Expectations Survey**
  - Understands attendee expectations
  - Measures excitement levels
  - Identifies session interests

- **Post-Event Feedback Survey**
  - Evaluates event success
  - Measures attendee satisfaction
  - Identifies future improvements

- **Virtual/Hybrid Event Survey**
  - Evaluates virtual event platforms
  - Measures online engagement
  - Identifies technical challenges

### 7. Community / Public Opinion Surveys
**Purpose**: Surveys for civic engagement and public opinion research

#### Subcategories:
- **Political Polling Survey**
  - Gathers political opinions
  - Measures voter preferences
  - Tracks political issues

- **Social Issues Perception Survey**
  - Understands public opinion on social issues
  - Measures issue priorities
  - Evaluates solution preferences

- **Civic Engagement Survey**
  - Assesses community involvement
  - Measures civic participation
  - Identifies engagement barriers

### 8. Product or Service Feedback Surveys
**Purpose**: Gather feedback on specific products and services

#### Subcategories:
- **Beta Testing Feedback Survey**
  - Collects feedback from beta testers
  - Identifies bugs and issues
  - Evaluates user experience

- **Feature Prioritization Survey**
  - Determines feature development priorities
  - Measures feature importance
  - Evaluates user needs

- **Usability Testing Survey**
  - Evaluates product usability
  - Identifies user experience issues
  - Measures task completion ease

## 🔹 Question Format Categories

### 1. Multiple Choice
- Questions with predefined answer options
- Single or multiple selection
- Dropdown menus

### 2. Rating Scale / Likert Scale
- Numerical rating scales (1-5, 1-10)
- Emoji-based rating scales
- Agreement/disagreement scales

### 3. Open-Ended
- Free-text response questions
- Long-form answers
- Qualitative feedback

### 4. Dropdowns
- Questions with dropdown selection options
- Hierarchical choices
- Categorized responses

### 5. Yes/No or True/False
- Binary choice questions
- Simple decision points
- Quick assessments

### 6. Ranking Questions
- Questions requiring ordering or ranking
- Priority assessments
- Preference ordering

### 7. Matrix Tables
- Complex questions with multiple variables
- Multi-dimensional assessments
- Comprehensive evaluations

## 🔹 Data Collection Method Categories

### 1. Online Surveys
- Web-based survey distribution
- Email invitations
- Social media sharing

### 2. Telephone Surveys
- Phone-based survey administration
- Live interviewer surveys
- Automated phone surveys

### 3. Face-to-Face Interviews
- In-person survey administration
- Focus group discussions
- One-on-one interviews

### 4. Paper-Based Surveys
- Traditional paper survey forms
- Physical distribution
- Manual data entry

### 5. SMS/Mobile Surveys
- Mobile device-based surveys
- Text message surveys
- Mobile app surveys

### 6. Kiosk or On-site Surveys
- Location-based survey kiosks
- Point-of-service surveys
- In-store feedback

## Implementation Details

### Database Schema

The categorization system is supported by three main database tables:

1. **survey_categories**: Stores main category information
   - `category_key`: Unique identifier
   - `name`: Display name
   - `description`: Category description
   - `icon`: Category icon
   - `color`: Category color theme

2. **survey_subcategories**: Stores subcategory information
   - `category_key`: Reference to parent category
   - `subcategory_key`: Unique subcategory identifier
   - `name`: Display name
   - `description`: Subcategory description
   - `icon`: Subcategory icon
   - `template_data`: JSON template data

3. **survey_templates**: Enhanced template table
   - `category`: Main category
   - `subcategory`: Subcategory
   - `template_data`: Complete template structure

### API Endpoints

- `GET /api/templates/categories`: Returns all categories and subcategories
- `GET /api/templates/category/:categoryId`: Returns templates by category
- `GET /api/templates`: Returns all templates with category information

### Frontend Features

- **Category Sidebar**: Expandable category navigation
- **Search & Filter**: Find templates by name, description, or category
- **View Modes**: Grid and list view options
- **Template Preview**: Quick overview of template structure
- **One-Click Creation**: Instant survey creation from templates

## Usage Examples

### For Customer Service Teams
- Use **CSAT surveys** to measure satisfaction after support interactions
- Use **CES surveys** to identify friction points in customer journeys
- Use **NPS surveys** to measure customer loyalty and advocacy

### For Product Teams
- Use **Product Feedback surveys** to gather feature requests
- Use **Beta Testing surveys** to collect user feedback
- Use **Usability Testing surveys** to improve user experience

### For HR Teams
- Use **Employee Engagement surveys** to measure workplace satisfaction
- Use **Exit Interview surveys** to understand turnover reasons
- Use **Onboarding surveys** to improve new hire experience

### For Event Organizers
- Use **Pre-Event surveys** to understand attendee expectations
- Use **Post-Event surveys** to measure event success
- Use **Virtual Event surveys** to optimize online experiences

## Best Practices

1. **Choose the Right Category**: Select the category that best matches your survey purpose
2. **Customize Templates**: Modify templates to fit your specific needs
3. **Use Appropriate Question Types**: Match question formats to your data collection goals
4. **Consider Response Rates**: Choose data collection methods that maximize participation
5. **Analyze Results**: Use the categorization to organize and analyze survey responses

## Future Enhancements

- **Advanced Filtering**: Filter by multiple categories simultaneously
- **Template Recommendations**: AI-powered template suggestions based on use case
- **Category Analytics**: Track usage patterns by category
- **Custom Categories**: Allow users to create custom categories
- **Template Sharing**: Share custom templates within organizations 