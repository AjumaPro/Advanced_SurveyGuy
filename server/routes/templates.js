const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('../database/connection');

// Comprehensive survey categories and templates
const surveyCategories = {
  // 🔹 By Purpose
  customer_satisfaction: {
    name: "Customer Satisfaction Surveys",
    description: "Measure customer satisfaction with products, services, and experiences",
    subcategories: {
      csat: {
        title: "CSAT (Customer Satisfaction Score) Survey",
        description: "Measure overall customer satisfaction with your service",
        icon: "😊",
        questions: [
          {
            type: "emoji_scale",
            text: "How satisfied are you with our overall service?",
            required: true,
            options: [
              { value: 1, label: "Very Unsatisfied", emoji: "😠" },
              { value: 2, label: "Unsatisfied", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Satisfied", emoji: "🙂" },
              { value: 5, label: "Very Satisfied", emoji: "🥰" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How likely are you to recommend us to others?",
            required: true,
            options: [
              { value: 1, label: "1", emoji: "😞" },
              { value: 2, label: "2", emoji: "😞" },
              { value: 3, label: "3", emoji: "😞" },
              { value: 4, label: "4", emoji: "😞" },
              { value: 5, label: "5", emoji: "😞" },
              { value: 6, label: "6", emoji: "😞" },
              { value: 7, label: "7", emoji: "😐" },
              { value: 8, label: "8", emoji: "😐" },
              { value: 9, label: "9", emoji: "😊" },
              { value: 10, label: "10", emoji: "😊" }
            ]
          },
          {
            type: "text",
            text: "What could we do to improve your experience?",
            required: false
          }
        ]
      },
      nps: {
        title: "NPS (Net Promoter Score) Survey",
        description: "Measure customer loyalty and likelihood to recommend",
        icon: "⭐",
        questions: [
          {
            type: "emoji_scale",
            text: "How likely are you to recommend our company to a friend or colleague?",
            required: true,
            options: [
              { value: 0, label: "0", emoji: "😠" },
              { value: 1, label: "1", emoji: "😠" },
              { value: 2, label: "2", emoji: "😞" },
              { value: 3, label: "3", emoji: "😞" },
              { value: 4, label: "4", emoji: "😞" },
              { value: 5, label: "5", emoji: "😐" },
              { value: 6, label: "6", emoji: "😐" },
              { value: 7, label: "7", emoji: "😐" },
              { value: 8, label: "8", emoji: "😊" },
              { value: 9, label: "9", emoji: "😊" },
              { value: 10, label: "10", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What is the primary reason for your score?",
            required: false
          }
        ]
      },
      ces: {
        title: "CES (Customer Effort Score) Survey",
        description: "Measure how easy it is for customers to interact with your service",
        icon: "🎯",
        questions: [
          {
            type: "emoji_scale",
            text: "How easy was it to resolve your issue with us today?",
            required: true,
            options: [
              { value: 1, label: "Very Difficult", emoji: "😠" },
              { value: 2, label: "Difficult", emoji: "😞" },
              { value: 3, label: "Moderate", emoji: "😐" },
              { value: 4, label: "Easy", emoji: "🙂" },
              { value: 5, label: "Very Easy", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What made this experience easy or difficult?",
            required: false,
            options: [
              { value: "staff", label: "Helpful Staff" },
              { value: "process", label: "Simple Process" },
              { value: "technology", label: "Good Technology" },
              { value: "communication", label: "Clear Communication" },
              { value: "wait_time", label: "Long Wait Times" },
              { value: "complexity", label: "Complex Process" }
            ]
          }
        ]
      }
    }
  },
  market_research: {
    name: "Market Research Surveys",
    description: "Gather insights about market trends, preferences, and competition",
    subcategories: {
      product_feedback: {
        title: "Product Feedback Survey",
        description: "Collect feedback about your products or services",
        icon: "📦",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate the overall quality of our product?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "⭐" },
              { value: 2, label: "Fair", emoji: "⭐⭐" },
              { value: 3, label: "Good", emoji: "⭐⭐⭐" },
              { value: 4, label: "Very Good", emoji: "⭐⭐⭐⭐" },
              { value: 5, label: "Excellent", emoji: "⭐⭐⭐⭐⭐" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What features do you use most often?",
            required: false,
            options: [
              { value: "core", label: "Core Features" },
              { value: "advanced", label: "Advanced Features" },
              { value: "mobile", label: "Mobile App" },
              { value: "web", label: "Web Interface" },
              { value: "api", label: "API Integration" }
            ]
          },
          {
            type: "text",
            text: "What features would you like to see added?",
            required: false
          }
        ]
      },
      brand_awareness: {
        title: "Brand Awareness Survey",
        description: "Measure brand recognition and perception",
        icon: "🏷️",
        questions: [
          {
            type: "multiple_choice",
            text: "How did you first hear about our brand?",
            required: true,
            options: [
              { value: "social_media", label: "Social Media" },
              { value: "search_engine", label: "Search Engine" },
              { value: "friend_recommendation", label: "Friend/Family Recommendation" },
              { value: "advertisement", label: "Advertisement" },
              { value: "email_marketing", label: "Email Marketing" },
              { value: "other", label: "Other" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How familiar are you with our brand?",
            required: true,
            options: [
              { value: 1, label: "Never Heard", emoji: "❓" },
              { value: 2, label: "Slightly Familiar", emoji: "🤔" },
              { value: 3, label: "Somewhat Familiar", emoji: "😐" },
              { value: 4, label: "Very Familiar", emoji: "😊" },
              { value: 5, label: "Extremely Familiar", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What words come to mind when you think of our brand?",
            required: false
          }
        ]
      },
      competitor_analysis: {
        title: "Competitor Analysis Survey",
        description: "Understand how you compare to competitors",
        icon: "📊",
        questions: [
          {
            type: "multiple_choice",
            text: "Which companies do you consider our main competitors?",
            required: true,
            options: [
              { value: "competitor_a", label: "Competitor A" },
              { value: "competitor_b", label: "Competitor B" },
              { value: "competitor_c", label: "Competitor C" },
              { value: "competitor_d", label: "Competitor D" },
              { value: "other", label: "Other" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How do we compare to our competitors in terms of quality?",
            required: true,
            options: [
              { value: 1, label: "Much Worse", emoji: "😠" },
              { value: 2, label: "Worse", emoji: "😞" },
              { value: 3, label: "About the Same", emoji: "😐" },
              { value: 4, label: "Better", emoji: "🙂" },
              { value: 5, label: "Much Better", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What do our competitors do better than us?",
            required: false
          }
        ]
      }
    }
  },
  employee_surveys: {
    name: "Employee Surveys",
    description: "Gather feedback from employees about workplace satisfaction and engagement",
    subcategories: {
      employee_engagement: {
        title: "Employee Engagement Survey",
        description: "Measure employee engagement and satisfaction",
        icon: "👥",
        questions: [
          {
            type: "emoji_scale",
            text: "How satisfied are you with your current role?",
            required: true,
            options: [
              { value: 1, label: "Very Unsatisfied", emoji: "😠" },
              { value: 2, label: "Unsatisfied", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Satisfied", emoji: "🙂" },
              { value: 5, label: "Very Satisfied", emoji: "🥰" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How would you rate the work-life balance?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "⭐" },
              { value: 2, label: "Fair", emoji: "⭐⭐" },
              { value: 3, label: "Good", emoji: "⭐⭐⭐" },
              { value: 4, label: "Very Good", emoji: "⭐⭐⭐⭐" },
              { value: 5, label: "Excellent", emoji: "⭐⭐⭐⭐⭐" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What would you like to see improved?",
            required: false,
            options: [
              { value: "communication", label: "Communication" },
              { value: "training", label: "Training & Development" },
              { value: "benefits", label: "Benefits & Compensation" },
              { value: "culture", label: "Company Culture" },
              { value: "tools", label: "Tools & Resources" }
            ]
          }
        ]
      },
      job_satisfaction: {
        title: "Job Satisfaction Survey",
        description: "Assess overall job satisfaction and workplace happiness",
        icon: "😊",
        questions: [
          {
            type: "emoji_scale",
            text: "How satisfied are you with your job overall?",
            required: true,
            options: [
              { value: 1, label: "Very Dissatisfied", emoji: "😠" },
              { value: 2, label: "Dissatisfied", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Satisfied", emoji: "🙂" },
              { value: 5, label: "Very Satisfied", emoji: "🥰" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How likely are you to stay with the company for the next 2 years?",
            required: true,
            options: [
              { value: 1, label: "Very Unlikely", emoji: "😠" },
              { value: 2, label: "Unlikely", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Likely", emoji: "🙂" },
              { value: 5, label: "Very Likely", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What would make you more satisfied with your job?",
            required: false
          }
        ]
      },
      exit_interview: {
        title: "Exit Interview Survey",
        description: "Gather feedback from departing employees",
        icon: "🚪",
        questions: [
          {
            type: "multiple_choice",
            text: "What is the primary reason for your departure?",
            required: true,
            options: [
              { value: "career_growth", label: "Career Growth Opportunities" },
              { value: "compensation", label: "Compensation" },
              { value: "work_environment", label: "Work Environment" },
              { value: "management", label: "Management Issues" },
              { value: "personal", label: "Personal Reasons" },
              { value: "other", label: "Other" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How would you rate your overall experience at the company?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What could the company have done to retain you?",
            required: false
          }
        ]
      },
      onboarding_feedback: {
        title: "Onboarding Feedback Survey",
        description: "Evaluate the effectiveness of the onboarding process",
        icon: "🎯",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate your onboarding experience?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "Which onboarding activities were most helpful?",
            required: false,
            options: [
              { value: "orientation", label: "Company Orientation" },
              { value: "training", label: "Job Training" },
              { value: "mentor", label: "Mentor Assignment" },
              { value: "documentation", label: "Documentation" },
              { value: "team_intro", label: "Team Introductions" }
            ]
          },
          {
            type: "text",
            text: "What would you change about the onboarding process?",
            required: false
          }
        ]
      }
    }
  },
  academic_educational: {
    name: "Academic / Educational Surveys",
    description: "Surveys for educational institutions and academic research",
    subcategories: {
      course_evaluation: {
        title: "Course Evaluation Survey",
        description: "Evaluate course effectiveness and instructor performance",
        icon: "📚",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate the overall quality of this course?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How effective was the instructor in teaching the material?",
            required: true,
            options: [
              { value: 1, label: "Very Ineffective", emoji: "😠" },
              { value: 2, label: "Ineffective", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Effective", emoji: "🙂" },
              { value: 5, label: "Very Effective", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What suggestions do you have for improving this course?",
            required: false
          }
        ]
      },
      student_feedback: {
        title: "Student Feedback Survey",
        description: "Gather feedback from students about their educational experience",
        icon: "🎓",
        questions: [
          {
            type: "emoji_scale",
            text: "How satisfied are you with your overall educational experience?",
            required: true,
            options: [
              { value: 1, label: "Very Dissatisfied", emoji: "😠" },
              { value: 2, label: "Dissatisfied", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Satisfied", emoji: "🙂" },
              { value: 5, label: "Very Satisfied", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What aspects of your education need improvement?",
            required: false,
            options: [
              { value: "facilities", label: "Facilities" },
              { value: "curriculum", label: "Curriculum" },
              { value: "faculty", label: "Faculty" },
              { value: "support_services", label: "Support Services" },
              { value: "technology", label: "Technology" }
            ]
          },
          {
            type: "text",
            text: "What would make your educational experience better?",
            required: false
          }
        ]
      },
      educational_research: {
        title: "Educational Research Survey",
        description: "Conduct research on educational methods and outcomes",
        icon: "🔬",
        questions: [
          {
            type: "multiple_choice",
            text: "What is your primary learning style?",
            required: true,
            options: [
              { value: "visual", label: "Visual Learner" },
              { value: "auditory", label: "Auditory Learner" },
              { value: "kinesthetic", label: "Kinesthetic Learner" },
              { value: "reading", label: "Reading/Writing Learner" },
              { value: "mixed", label: "Mixed Learning Style" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How effective are online learning platforms for your education?",
            required: true,
            options: [
              { value: 1, label: "Very Ineffective", emoji: "😠" },
              { value: 2, label: "Ineffective", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Effective", emoji: "🙂" },
              { value: 5, label: "Very Effective", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What challenges do you face in your educational journey?",
            required: false
          }
        ]
      }
    }
  },
  health_wellness: {
    name: "Health & Wellness Surveys",
    description: "Surveys related to healthcare, wellness, and mental health",
    subcategories: {
      patient_satisfaction: {
        title: "Patient Satisfaction Survey",
        description: "Evaluate patient satisfaction with healthcare services",
        icon: "🏥",
        questions: [
          {
            type: "emoji_scale",
            text: "How satisfied are you with the care you received?",
            required: true,
            options: [
              { value: 1, label: "Very Dissatisfied", emoji: "😠" },
              { value: 2, label: "Dissatisfied", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Satisfied", emoji: "🙂" },
              { value: 5, label: "Very Satisfied", emoji: "🥰" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How would you rate the communication with your healthcare provider?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What could we do to improve your healthcare experience?",
            required: false
          }
        ]
      },
      mental_health_screening: {
        title: "Mental Health Screening Survey",
        description: "Assess mental health and well-being",
        icon: "🧠",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate your overall mental well-being?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "How often do you feel stressed or anxious?",
            required: true,
            options: [
              { value: "never", label: "Never" },
              { value: "rarely", label: "Rarely" },
              { value: "sometimes", label: "Sometimes" },
              { value: "often", label: "Often" },
              { value: "always", label: "Always" }
            ]
          },
          {
            type: "text",
            text: "What coping strategies work best for you?",
            required: false
          }
        ]
      },
      lifestyle_habits: {
        title: "Lifestyle Habits Survey",
        description: "Assess lifestyle choices and health behaviors",
        icon: "💪",
        questions: [
          {
            type: "multiple_choice",
            text: "How often do you exercise?",
            required: true,
            options: [
              { value: "never", label: "Never" },
              { value: "rarely", label: "Rarely (1-2 times/month)" },
              { value: "sometimes", label: "Sometimes (1-2 times/week)" },
              { value: "regularly", label: "Regularly (3-4 times/week)" },
              { value: "daily", label: "Daily" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How would you rate your sleep quality?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😴" },
              { value: 2, label: "Fair", emoji: "😴" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "😊" },
              { value: 5, label: "Excellent", emoji: "😴" }
            ]
          },
          {
            type: "text",
            text: "What health goals are you working towards?",
            required: false
          }
        ]
      }
    }
  },
  event_feedback: {
    name: "Event Feedback Surveys",
    description: "Gather feedback from event attendees and participants",
    subcategories: {
      pre_event_expectations: {
        title: "Pre-Event Expectations Survey",
        description: "Understand attendee expectations before an event",
        icon: "📅",
        questions: [
          {
            type: "multiple_choice",
            text: "What are you most looking forward to at this event?",
            required: true,
            options: [
              { value: "networking", label: "Networking Opportunities" },
              { value: "learning", label: "Learning Sessions" },
              { value: "speakers", label: "Keynote Speakers" },
              { value: "exhibits", label: "Exhibits & Demos" },
              { value: "social", label: "Social Activities" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How excited are you about attending this event?",
            required: true,
            options: [
              { value: 1, label: "Not Excited", emoji: "😐" },
              { value: 2, label: "Somewhat Excited", emoji: "🙂" },
              { value: 3, label: "Excited", emoji: "😊" },
              { value: 4, label: "Very Excited", emoji: "🥰" },
              { value: 5, label: "Extremely Excited", emoji: "🎉" }
            ]
          },
          {
            type: "text",
            text: "What specific topics or sessions interest you most?",
            required: false
          }
        ]
      },
      post_event_feedback: {
        title: "Post-Event Feedback Survey",
        description: "Evaluate event success and gather attendee feedback",
        icon: "🎉",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate the overall event experience?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "⭐" },
              { value: 2, label: "Fair", emoji: "⭐⭐" },
              { value: 3, label: "Good", emoji: "⭐⭐⭐" },
              { value: 4, label: "Very Good", emoji: "⭐⭐⭐⭐" },
              { value: 5, label: "Excellent", emoji: "⭐⭐⭐⭐⭐" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What was your favorite part of the event?",
            required: false,
            options: [
              { value: "keynotes", label: "Keynote Speakers" },
              { value: "networking", label: "Networking Sessions" },
              { value: "workshops", label: "Workshops" },
              { value: "exhibits", label: "Exhibits" },
              { value: "food", label: "Food & Refreshments" }
            ]
          },
          {
            type: "text",
            text: "What would you like to see at future events?",
            required: false
          }
        ]
      },
      virtual_hybrid_events: {
        title: "Virtual/Hybrid Event Survey",
        description: "Evaluate virtual and hybrid event experiences",
        icon: "💻",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate the virtual event platform?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What challenges did you face with the virtual format?",
            required: false,
            options: [
              { value: "technical", label: "Technical Issues" },
              { value: "engagement", label: "Lack of Engagement" },
              { value: "networking", label: "Difficulty Networking" },
              { value: "content", label: "Content Quality" },
              { value: "none", label: "No Challenges" }
            ]
          },
          {
            type: "text",
            text: "How can we improve the virtual event experience?",
            required: false
          }
        ]
      }
    }
  },
  community_public_opinion: {
    name: "Community / Public Opinion Surveys",
    description: "Surveys for civic engagement and public opinion research",
    subcategories: {
      political_polling: {
        title: "Political Polling Survey",
        description: "Gather public opinion on political issues and candidates",
        icon: "🗳️",
        questions: [
          {
            type: "multiple_choice",
            text: "Which political party do you most closely identify with?",
            required: true,
            options: [
              { value: "democrat", label: "Democratic Party" },
              { value: "republican", label: "Republican Party" },
              { value: "independent", label: "Independent" },
              { value: "other", label: "Other Party" },
              { value: "prefer_not", label: "Prefer Not to Say" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How satisfied are you with current government performance?",
            required: true,
            options: [
              { value: 1, label: "Very Dissatisfied", emoji: "😠" },
              { value: 2, label: "Dissatisfied", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Satisfied", emoji: "🙂" },
              { value: 5, label: "Very Satisfied", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What issues are most important to you in the upcoming election?",
            required: false
          }
        ]
      },
      social_issues: {
        title: "Social Issues Perception Survey",
        description: "Understand public opinion on social issues",
        icon: "🌍",
        questions: [
          {
            type: "multiple_choice",
            text: "Which social issue concerns you the most?",
            required: true,
            options: [
              { value: "climate_change", label: "Climate Change" },
              { value: "healthcare", label: "Healthcare Access" },
              { value: "education", label: "Education Quality" },
              { value: "economic_inequality", label: "Economic Inequality" },
              { value: "social_justice", label: "Social Justice" },
              { value: "other", label: "Other" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How optimistic are you about solving this issue?",
            required: true,
            options: [
              { value: 1, label: "Very Pessimistic", emoji: "😠" },
              { value: 2, label: "Pessimistic", emoji: "😞" },
              { value: 3, label: "Neutral", emoji: "😐" },
              { value: 4, label: "Optimistic", emoji: "🙂" },
              { value: 5, label: "Very Optimistic", emoji: "🥰" }
            ]
          },
          {
            type: "text",
            text: "What actions do you think would be most effective?",
            required: false
          }
        ]
      },
      civic_engagement: {
        title: "Civic Engagement Survey",
        description: "Assess community involvement and civic participation",
        icon: "🏛️",
        questions: [
          {
            type: "multiple_choice",
            text: "How often do you participate in community activities?",
            required: true,
            options: [
              { value: "never", label: "Never" },
              { value: "rarely", label: "Rarely" },
              { value: "sometimes", label: "Sometimes" },
              { value: "often", label: "Often" },
              { value: "regularly", label: "Regularly" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How important is civic engagement to you?",
            required: true,
            options: [
              { value: 1, label: "Not Important", emoji: "😐" },
              { value: 2, label: "Somewhat Important", emoji: "🙂" },
              { value: 3, label: "Important", emoji: "😊" },
              { value: 4, label: "Very Important", emoji: "🥰" },
              { value: 5, label: "Extremely Important", emoji: "🎉" }
            ]
          },
          {
            type: "text",
            text: "What would encourage you to be more civically engaged?",
            required: false
          }
        ]
      }
    }
  },
  product_service_feedback: {
    name: "Product or Service Feedback Surveys",
    description: "Gather feedback on specific products and services",
    subcategories: {
      beta_testing: {
        title: "Beta Testing Feedback Survey",
        description: "Collect feedback from beta testers and early adopters",
        icon: "🧪",
        questions: [
          {
            type: "emoji_scale",
            text: "How would you rate the overall user experience?",
            required: true,
            options: [
              { value: 1, label: "Poor", emoji: "😠" },
              { value: 2, label: "Fair", emoji: "😞" },
              { value: 3, label: "Good", emoji: "😐" },
              { value: 4, label: "Very Good", emoji: "🙂" },
              { value: 5, label: "Excellent", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "What issues did you encounter during testing?",
            required: false,
            options: [
              { value: "bugs", label: "Software Bugs" },
              { value: "usability", label: "Usability Issues" },
              { value: "performance", label: "Performance Problems" },
              { value: "design", label: "Design Issues" },
              { value: "none", label: "No Issues" }
            ]
          },
          {
            type: "text",
            text: "What features would you like to see added or improved?",
            required: false
          }
        ]
      },
      feature_prioritization: {
        title: "Feature Prioritization Survey",
        description: "Determine which features to develop next",
        icon: "📋",
        questions: [
          {
            type: "multiple_choice",
            text: "Which feature would be most valuable to you?",
            required: true,
            options: [
              { value: "feature_a", label: "Feature A" },
              { value: "feature_b", label: "Feature B" },
              { value: "feature_c", label: "Feature C" },
              { value: "feature_d", label: "Feature D" },
              { value: "feature_e", label: "Feature E" }
            ]
          },
          {
            type: "emoji_scale",
            text: "How important is this feature to your workflow?",
            required: true,
            options: [
              { value: 1, label: "Not Important", emoji: "😐" },
              { value: 2, label: "Somewhat Important", emoji: "🙂" },
              { value: 3, label: "Important", emoji: "😊" },
              { value: 4, label: "Very Important", emoji: "🥰" },
              { value: 5, label: "Critical", emoji: "🎉" }
            ]
          },
          {
            type: "text",
            text: "How would this feature improve your experience?",
            required: false
          }
        ]
      },
      usability_testing: {
        title: "Usability Testing Survey",
        description: "Evaluate the usability and user experience of products",
        icon: "🔍",
        questions: [
          {
            type: "emoji_scale",
            text: "How easy was it to complete the main task?",
            required: true,
            options: [
              { value: 1, label: "Very Difficult", emoji: "😠" },
              { value: 2, label: "Difficult", emoji: "😞" },
              { value: 3, label: "Moderate", emoji: "😐" },
              { value: 4, label: "Easy", emoji: "🙂" },
              { value: 5, label: "Very Easy", emoji: "🥰" }
            ]
          },
          {
            type: "multiple_choice",
            text: "Where did you encounter the most difficulty?",
            required: false,
            options: [
              { value: "navigation", label: "Navigation" },
              { value: "search", label: "Search Function" },
              { value: "forms", label: "Forms/Input" },
              { value: "content", label: "Content Understanding" },
              { value: "none", label: "No Difficulties" }
            ]
          },
          {
            type: "text",
            text: "What would make this product easier to use?",
            required: false
          }
        ]
      }
    }
  }
};

// Question format categories
const questionFormats = {
  multiple_choice: {
    name: "Multiple Choice",
    description: "Questions with predefined answer options",
    icon: "☑️"
  },
  rating_scale: {
    name: "Rating Scale / Likert Scale",
    description: "Questions using numerical or emoji rating scales",
    icon: "⭐"
  },
  open_ended: {
    name: "Open-Ended",
    description: "Free-text response questions",
    icon: "📝"
  },
  dropdowns: {
    name: "Dropdowns",
    description: "Questions with dropdown selection options",
    icon: "📋"
  },
  yes_no: {
    name: "Yes/No or True/False",
    description: "Binary choice questions",
    icon: "✅"
  },
  ranking: {
    name: "Ranking Questions",
    description: "Questions requiring ordering or ranking of options",
    icon: "📊"
  },
  matrix_tables: {
    name: "Matrix Tables",
    description: "Complex questions with multiple variables",
    icon: "📈"
  }
};

// Data collection method categories
const dataCollectionMethods = {
  online_surveys: {
    name: "Online Surveys",
    description: "Web-based survey distribution",
    icon: "💻"
  },
  telephone_surveys: {
    name: "Telephone Surveys",
    description: "Phone-based survey administration",
    icon: "📞"
  },
  face_to_face: {
    name: "Face-to-Face Interviews",
    description: "In-person survey administration",
    icon: "👥"
  },
  paper_based: {
    name: "Paper-Based Surveys",
    description: "Traditional paper survey forms",
    icon: "📄"
  },
  sms_mobile: {
    name: "SMS/Mobile Surveys",
    description: "Mobile device-based surveys",
    icon: "📱"
  },
  kiosk_onsite: {
    name: "Kiosk or On-site Surveys",
    description: "Location-based survey kiosks",
    icon: "🏢"
  }
};

// Flatten templates for easier access
const surveyTemplates = {};
Object.keys(surveyCategories).forEach(categoryKey => {
  const category = surveyCategories[categoryKey];
  Object.keys(category.subcategories).forEach(subcategoryKey => {
    const subcategory = category.subcategories[subcategoryKey];
    const templateKey = `${categoryKey}_${subcategoryKey}`;
    surveyTemplates[templateKey] = {
      title: subcategory.title,
      description: subcategory.description,
      category: category.name,
      subcategory: subcategoryKey,
      icon: subcategory.icon,
      questions: subcategory.questions
    };
  });
});

// GET /api/templates - Get all available templates
router.get('/', auth, async (req, res) => {
  try {
    const templates = Object.keys(surveyTemplates).map(key => ({
      id: key,
      ...surveyTemplates[key]
    }));
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/templates/categories - Get all survey categories
router.get('/categories', auth, async (req, res) => {
  try {
    res.json({
      categories: surveyCategories,
      questionFormats: questionFormats,
      dataCollectionMethods: dataCollectionMethods
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/templates/category/:categoryId - Get templates by category
router.get('/category/:categoryId', auth, async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    if (!surveyCategories[categoryId]) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const category = surveyCategories[categoryId];
    const templates = Object.keys(category.subcategories).map(subcategoryKey => {
      const subcategory = category.subcategories[subcategoryKey];
      const templateKey = `${categoryId}_${subcategoryKey}`;
      return {
        id: templateKey,
        title: subcategory.title,
        description: subcategory.description,
        category: category.name,
        subcategory: subcategoryKey,
        icon: subcategory.icon,
        questions: subcategory.questions
      };
    });
    
    res.json({
      category: category,
      templates: templates
    });
  } catch (error) {
    console.error('Error fetching category templates:', error);
    res.status(500).json({ error: 'Failed to fetch category templates' });
  }
});

// GET /api/templates/:id - Get a specific template
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!surveyTemplates[id]) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({
      id,
      ...surveyTemplates[id]
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// POST /api/templates/:id/create - Create a survey from template
router.post('/:id/create', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    if (!surveyTemplates[id]) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const template = surveyTemplates[id];
    
    // Create the survey
    const surveyResult = await query(
      `INSERT INTO surveys (user_id, title, description, status, theme, settings)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        req.user.id,
        title || template.title,
        description || template.description,
        'draft',
        JSON.stringify({ primaryColor: '#3B82F6', secondaryColor: '#1E40AF' }),
        JSON.stringify({ allowAnonymous: true, showProgress: true })
      ]
    );
    
    const surveyId = surveyResult.rows[0].id;
    
    // Create questions from template
    for (let i = 0; i < template.questions.length; i++) {
      const question = template.questions[i];
      await query(
        `INSERT INTO questions (survey_id, title, type, required, options, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          surveyId,
          question.text,
          question.type,
          question.required,
          JSON.stringify(question.options || []),
          i + 1
        ]
      );
    }
    
    res.json({
      message: 'Survey created from template successfully',
      surveyId,
      survey: {
        id: surveyId,
        title: title || template.title,
        description: description || template.description
      }
    });
    
  } catch (error) {
    console.error('Error creating survey from template:', error);
    res.status(500).json({ error: 'Failed to create survey from template' });
  }
});

// PUT /api/templates/:id - Update a template
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;
    
    if (!surveyTemplates[id]) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Update template (in a real app, you'd store templates in database)
    surveyTemplates[id] = {
      ...surveyTemplates[id],
      title: title || surveyTemplates[id].title,
      description: description || surveyTemplates[id].description,
      questions: questions || surveyTemplates[id].questions
    };
    
    res.json({
      message: 'Template updated successfully',
      template: { id, ...surveyTemplates[id] }
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// POST /api/templates/:id/duplicate - Duplicate a template
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    if (!surveyTemplates[id]) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const originalTemplate = surveyTemplates[id];
    const newId = `template_${Date.now()}`;
    
    // Create duplicate template
    surveyTemplates[newId] = {
      ...originalTemplate,
      title: title || `${originalTemplate.title} (Copy)`,
      description: description || originalTemplate.description
    };
    
    res.json({
      message: 'Template duplicated successfully',
      template: { id: newId, ...surveyTemplates[newId] }
    });
  } catch (error) {
    console.error('Error duplicating template:', error);
    res.status(500).json({ error: 'Failed to duplicate template' });
  }
});

// DELETE /api/templates/:id - Delete a template
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!surveyTemplates[id]) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Delete template (in a real app, you'd delete from database)
    delete surveyTemplates[id];
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
