import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Eye,
  Copy,
  Zap,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const AITemplateSuggestions = ({ templateData, updateTemplateData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Mock AI-generated suggestions based on purpose and category
  const generateAISuggestions = (purpose, category) => {
    const baseSuggestions = {
      'survey': {
        'customer-feedback': [
          {
            id: 'customer-satisfaction-pro',
            name: 'Professional Customer Satisfaction Survey',
            description: 'Comprehensive customer satisfaction survey with NPS, ratings, and feedback collection',
            match: 95,
            questionCount: 6,
            estimatedTime: '3-4 minutes',
            features: ['NPS Question', 'Rating Scales', 'Open Feedback', 'Contact Info'],
            rating: 4.8,
            usage: 15420,
            trending: true,
            aiGenerated: false,
            questions: [
              {
                type: 'rating',
                question: 'How satisfied are you with our service?',
                required: true,
                options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
              },
              {
                type: 'nps',
                question: 'How likely are you to recommend us to others?',
                required: true
              },
              {
                type: 'text',
                question: 'What did you like most about our service?',
                required: false
              },
              {
                type: 'text',
                question: 'What could we improve?',
                required: false
              },
              {
                type: 'multiple-choice',
                question: 'How did you hear about us?',
                required: false,
                options: ['Social Media', 'Friend/Family', 'Advertisement', 'Search Engine', 'Other']
              },
              {
                type: 'text',
                question: 'Any additional comments?',
                required: false
              }
            ]
          },
          {
            id: 'product-feedback-ai',
            name: 'AI-Generated Product Feedback Survey',
            description: 'Smart product feedback collection with automated insights and improvement suggestions',
            match: 88,
            questionCount: 5,
            estimatedTime: '2-3 minutes',
            features: ['Smart Questions', 'Product Rating', 'Feature Requests', 'Purchase Intent'],
            rating: 4.6,
            usage: 8920,
            trending: false,
            aiGenerated: true,
            questions: [
              {
                type: 'rating',
                question: 'How would you rate the overall quality of our product?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'multiple-choice',
                question: 'Which feature do you use most often?',
                required: false,
                options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'None of the above']
              },
              {
                type: 'text',
                question: 'What new feature would you like to see?',
                required: false
              },
              {
                type: 'rating',
                question: 'How likely are you to purchase from us again?',
                required: true,
                options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
              },
              {
                type: 'text',
                question: 'Any other feedback about our product?',
                required: false
              }
            ]
          }
        ],
        'employee': [
          {
            id: 'employee-satisfaction-pro',
            name: 'Employee Satisfaction & Engagement Survey',
            description: 'Comprehensive employee feedback covering satisfaction, engagement, and workplace culture',
            match: 92,
            questionCount: 8,
            estimatedTime: '4-5 minutes',
            features: ['Engagement Metrics', 'Workplace Culture', 'Career Development', 'Anonymous Feedback'],
            rating: 4.7,
            usage: 6730,
            trending: true,
            aiGenerated: false,
            questions: [
              {
                type: 'rating',
                question: 'How satisfied are you with your current role?',
                required: true,
                options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
              },
              {
                type: 'rating',
                question: 'How would you rate your work-life balance?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'multiple-choice',
                question: 'What motivates you most at work?',
                required: false,
                options: ['Recognition', 'Career Growth', 'Compensation', 'Work Environment', 'Team Collaboration']
              },
              {
                type: 'text',
                question: 'What do you enjoy most about working here?',
                required: false
              },
              {
                type: 'text',
                question: 'What could we improve as an organization?',
                required: false
              },
              {
                type: 'rating',
                question: 'How likely are you to recommend this company as a place to work?',
                required: true,
                options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
              },
              {
                type: 'multiple-choice',
                question: 'How often do you feel recognized for your work?',
                required: false,
                options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
              },
              {
                type: 'text',
                question: 'Any additional comments or suggestions?',
                required: false
              }
            ]
          }
        ]
      },
      'event': {
        'conference': [
          {
            id: 'tech-conference-2024',
            name: 'Tech Conference Registration & Feedback',
            description: 'Comprehensive conference registration with session preferences and feedback collection',
            match: 90,
            questionCount: 7,
            estimatedTime: '3-4 minutes',
            features: ['Session Selection', 'Dietary Preferences', 'Networking Goals', 'Feedback Collection'],
            rating: 4.9,
            usage: 2340,
            trending: true,
            aiGenerated: false,
            questions: [
              {
                type: 'text',
                question: 'Full Name',
                required: true
              },
              {
                type: 'text',
                question: 'Email Address',
                required: true
              },
              {
                type: 'multiple-choice',
                question: 'Which conference tracks interest you most?',
                required: true,
                options: ['AI & Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Web Development', 'Data Science']
              },
              {
                type: 'multiple-choice',
                question: 'Dietary restrictions?',
                required: false,
                options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Other']
              },
              {
                type: 'text',
                question: 'What are your networking goals for this conference?',
                required: false
              },
              {
                type: 'multiple-choice',
                question: 'How did you hear about this conference?',
                required: false,
                options: ['Social Media', 'Email Newsletter', 'Website', 'Colleague', 'Other']
              },
              {
                type: 'text',
                question: 'Any special requirements or accommodations needed?',
                required: false
              }
            ]
          }
        ]
      }
    };

    return baseSuggestions[purpose]?.[category] || [];
  };

  useEffect(() => {
    console.log('AITemplateSuggestions: Generating suggestions for', templateData.purpose, templateData.category);
    setLoading(true);
    // Simulate AI processing time
    setTimeout(() => {
      const aiSuggestions = generateAISuggestions(templateData.purpose, templateData.category);
      console.log('AITemplateSuggestions: Generated suggestions:', aiSuggestions);
      setSuggestions(aiSuggestions);
      setLoading(false);
    }, 1500);
  }, [templateData.purpose, templateData.category]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    updateTemplateData({ selectedTemplate: template });
  };

  const handleGenerateCustom = () => {
    // Generate a custom AI template
    const customTemplate = {
      id: 'ai-custom-' + Date.now(),
      name: `Custom ${templateData.category.replace('-', ' ')} Template`,
      description: 'AI-generated template tailored to your specific needs',
      match: 100,
      questionCount: 4,
      estimatedTime: '2-3 minutes',
      features: ['AI-Generated Questions', 'Smart Logic', 'Optimized Flow'],
      rating: 4.5,
      usage: 0,
      trending: false,
      aiGenerated: true,
      questions: [
        {
          type: 'rating',
          question: `How would you rate your experience with ${templateData.category.replace('-', ' ')}?`,
          required: true,
          options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
        },
        {
          type: 'text',
          question: `What do you like most about ${templateData.category.replace('-', ' ')}?`,
          required: false
        },
        {
          type: 'text',
          question: `What could be improved in ${templateData.category.replace('-', ' ')}?`,
          required: false
        },
        {
          type: 'multiple-choice',
          question: 'How likely are you to recommend this to others?',
          required: true,
          options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
        }
      ]
    };
    
    handleTemplateSelect(customTemplate);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          🤖 AI is analyzing your needs...
        </h3>
        <p className="text-gray-600">
          Finding the perfect templates for your {templateData.category.replace('-', ' ')} {templateData.purpose}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🤖 AI Template Suggestions
        </h2>
        <p className="text-gray-600">
          Based on your selection, here are our AI-recommended templates:
        </p>
      </div>

      <div className="space-y-6">
        {/* Recommended Templates */}
        {suggestions.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl border-2 p-6 transition-all duration-200 ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  {template.trending && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </span>
                  )}
                  {template.aiGenerated && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generated
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{template.rating}</span>
                    <span>({template.usage.toLocaleString()} uses)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{template.questionCount} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{template.match}% match</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {selectedTemplate?.id === template.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 inline" />
                      Selected
                    </>
                  ) : (
                    'Select Template'
                  )}
                </button>
                
                <button className="flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* AI Generate Custom Template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  AI-Generated Custom Template
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generated
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                Let AI create a completely custom template tailored to your specific needs and industry requirements.
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>🤖 Generated by AI</span>
                <span>⏱️ 2-5 minutes</span>
                <span>📊 3-8 questions</span>
                <span>🎯 100% match</span>
              </div>
            </div>

            <button
              onClick={handleGenerateCustom}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </button>
          </div>
        </motion.div>

        {/* Start from Scratch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Copy className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Start from Scratch
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Create your own template from scratch with our drag-and-drop builder and extensive question library.
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>🛠️ Full Control</span>
                <span>📚 Question Library</span>
                <span>🎨 Custom Design</span>
                <span>⚡ Advanced Features</span>
              </div>
            </div>

            <button className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2" />
              Create Blank Template
            </button>
          </div>
        </motion.div>
      </div>

      {/* Selection Summary */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
        >
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Template Selected!
              </h4>
              <p className="text-gray-600">
                You've selected <strong>{selectedTemplate.name}</strong> with {selectedTemplate.questions} questions
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AITemplateSuggestions;
