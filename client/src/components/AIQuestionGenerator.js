import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Lightbulb,
  Check,
  RefreshCw,
  Brain,
  Target,
  MessageSquare,
  Star,
  Settings
} from 'lucide-react';

const AIQuestionGenerator = ({ onQuestionsGenerated, currentSurvey = null }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [surveyContext, setSurveyContext] = useState('general');
  const [targetAudience, setTargetAudience] = useState('general');
  const [surveyGoal] = useState('feedback');
  const [industry, setIndustry] = useState('technology');
  const [questionCount, setQuestionCount] = useState(5);
  const [complexity, setComplexity] = useState('medium');
  const [language, setLanguage] = useState('english');

  // AI-generated question templates based on context
  const contextTemplates = {
    customer_satisfaction: [
      "How satisfied are you with our product/service?",
      "What is the primary reason for your rating?",
      "How likely are you to recommend us to others?",
      "What could we improve to better serve you?",
      "How would you rate our customer support?"
    ],
    employee_feedback: [
      "How satisfied are you with your current role?",
      "What do you enjoy most about working here?",
      "What challenges do you face in your daily work?",
      "How would you rate our company culture?",
      "What suggestions do you have for improvement?"
    ],
    event_feedback: [
      "How would you rate the overall event experience?",
      "What was your favorite part of the event?",
      "How likely are you to attend future events?",
      "What could we improve for next time?",
      "How would you rate the event organization?"
    ],
    market_research: [
      "How often do you use products like ours?",
      "What factors influence your purchasing decisions?",
      "What is your preferred price range?",
      "Where do you typically discover new products?",
      "What features are most important to you?"
    ]
  };

  // Industry-specific question enhancements
  const industryTemplates = {
    technology: [
      "How do you stay updated with tech trends?",
      "What tools do you use for development?",
      "How important is data security to you?",
      "What's your preferred deployment method?",
      "How do you handle version control?",
      "What programming languages do you use most?"
    ],
    healthcare: [
      "How do you prioritize patient care?",
      "What challenges do you face with documentation?",
      "How important is compliance in your workflow?",
      "What technology would improve patient outcomes?",
      "How do you handle patient data privacy?",
      "What training do you need for new systems?"
    ],
    education: [
      "How do you measure student engagement?",
      "What teaching methods work best for you?",
      "How do you handle different learning styles?",
      "What resources do you need for effective teaching?",
      "How do you assess student progress?",
      "What technology enhances your teaching?"
    ],
    retail: [
      "How do you track customer preferences?",
      "What drives customer loyalty in your store?",
      "How do you handle inventory management?",
      "What seasonal trends do you notice?",
      "How do you measure store performance?",
      "What marketing strategies work best?"
    ],
    finance: [
      "How do you assess risk in investments?",
      "What factors influence your financial decisions?",
      "How important is transparency in reporting?",
      "What tools help you manage portfolios?",
      "How do you stay compliant with regulations?",
      "What metrics do you track for success?"
    ]
  };

  const generateQuestions = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate AI API call - replace with actual OpenAI integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const questions = generateAISuggestions(prompt, surveyContext, targetAudience, surveyGoal, industry, questionCount, complexity, language);
      setGeneratedQuestions(questions);
      setSelectedQuestions(questions.map(q => q.id)); // Select all by default
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAISuggestions = (prompt, context, audience, goal, industry, count, complexity, lang) => {
    const baseQuestions = contextTemplates[context] || contextTemplates.customer_satisfaction;
    const industryQuestions = industryTemplates[industry] || [];
    
    // Combine base questions with industry-specific questions
    const allQuestions = [...baseQuestions, ...industryQuestions];
    
    // Filter questions based on complexity
    const filteredQuestions = filterByComplexity(allQuestions, complexity);
    
    // Select the requested number of questions
    const selectedQuestions = filteredQuestions.slice(0, count);
    
    // Customize questions based on prompt
    const customizedQuestions = customizeQuestions(selectedQuestions, prompt, audience, goal);
    
    return customizedQuestions.map((question, index) => ({
      id: `ai_${Date.now()}_${index}`,
      title: question,
      type: getOptimalQuestionType(question, context),
      description: generateQuestionDescription(question, context),
      options: generateOptions(question, context),
      required: true,
      aiGenerated: true,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      category: context,
      industry: industry,
      complexity: complexity,
      language: lang,
      tags: generateTags(question, context)
    }));
  };

  const filterByComplexity = (questions, complexity) => {
    switch (complexity) {
      case 'simple':
        return questions.filter(q => 
          !q.includes('assess') && 
          !q.includes('analyze') && 
          !q.includes('evaluate') &&
          q.length < 80
        );
      case 'complex':
        return questions.filter(q => 
          q.includes('assess') || 
          q.includes('analyze') || 
          q.includes('evaluate') ||
          q.length > 60
        );
      default: // medium
        return questions;
    }
  };

  const customizeQuestions = (questions, prompt, audience, goal) => {
    return questions.map(question => {
      let customized = question;
      
      // Replace placeholders based on context
      if (prompt.toLowerCase().includes('product')) {
        customized = customized.replace(/\[product category\]/g, 'our product');
        customized = customized.replace(/\[product type\]/g, 'this type of product');
      }
      
      if (audience === 'customers') {
        customized = customized.replace(/our/g, 'your');
      }
      
      if (goal === 'feedback') {
        customized = customized.replace(/rate/g, 'evaluate');
      }
      
      return customized;
    });
  };

  const getOptimalQuestionType = (question, context) => {
    if (question.includes('satisfied') || question.includes('rate')) return 'rating';
    if (question.includes('likely') || question.includes('recommend')) return 'emoji_scale';
    if (question.includes('favorite') || question.includes('primary reason')) return 'multiple_choice';
    if (question.includes('improve') || question.includes('suggestions')) return 'textarea';
    return 'rating';
  };

  const generateQuestionDescription = (question, context) => {
    const descriptions = {
      customer_satisfaction: "Help us understand your experience and improve our service",
      employee_feedback: "Your feedback helps us create a better workplace",
      event_feedback: "Your input helps us improve future events",
      market_research: "Help us understand your needs and preferences"
    };
    return descriptions[context] || "Your feedback is valuable to us";
  };

  const generateOptions = (question, context) => {
    if (question.includes('satisfied') || question.includes('rate')) {
      return ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
    }
    if (question.includes('likely') || question.includes('recommend')) {
      return ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'];
    }
    return [];
  };

  const generateTags = (question, context) => {
    const tagMap = {
      customer_satisfaction: ['satisfaction', 'experience', 'service'],
      employee_feedback: ['workplace', 'culture', 'feedback'],
      event_feedback: ['event', 'experience', 'improvement'],
      market_research: ['research', 'preferences', 'market']
    };
    return tagMap[context] || ['feedback', 'survey'];
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const addSelectedQuestions = () => {
    const questionsToAdd = generatedQuestions.filter(q => selectedQuestions.includes(q.id));
    onQuestionsGenerated(questionsToAdd);
    setSelectedQuestions([]);
    setGeneratedQuestions([]);
    setPrompt('');
  };

  const loadTemplate = (templateKey) => {
    const questions = contextTemplates[templateKey];
    const generated = questions.map((question, index) => ({
      id: `template_${Date.now()}_${index}`,
      title: question,
      type: getOptimalQuestionType(question, templateKey),
      description: generateQuestionDescription(question, templateKey),
      options: generateOptions(question, templateKey),
      required: true,
      aiGenerated: true,
      confidence: 0.95,
      category: templateKey,
      tags: generateTags(question, templateKey)
    }));
    setGeneratedQuestions(generated);
    setSelectedQuestions(generated.map(q => q.id)); // Select all by default
  };

  return (
    <div className="ai-question-generator bg-white rounded-xl p-6 shadow-lg border border-slate-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Question Generator</h3>
            <p className="text-sm text-slate-600">Generate intelligent questions with AI assistance</p>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
          Quick Templates
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(contextTemplates).map(template => (
            <button
              key={template}
              onClick={() => loadTemplate(template)}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-200"
            >
              <div className="text-sm font-semibold text-slate-900 capitalize">
                {template.replace('_', ' ')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {contextTemplates[template].length} questions
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Survey Context */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2 text-blue-500" />
          Survey Context
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Survey Type</label>
            <select
              value={surveyContext}
              onChange={(e) => setSurveyContext(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="customer_satisfaction">Customer Satisfaction</option>
              <option value="employee_feedback">Employee Feedback</option>
              <option value="event_feedback">Event Feedback</option>
              <option value="market_research">Market Research</option>
              <option value="general">General Survey</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Public</option>
              <option value="customers">Customers</option>
              <option value="employees">Employees</option>
              <option value="students">Students</option>
              <option value="professionals">Professionals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Settings className="w-4 h-4 mr-2 text-indigo-500" />
          Advanced Settings
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="finance">Finance</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Question Count</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Complexity</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="complex">Complex</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Wand2 className="w-4 h-4 mr-2 text-green-500" />
          Custom Prompt
        </h4>
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your survey needs... (e.g., 'Create a customer satisfaction survey for our new product launch')"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={generateQuestions}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Generate Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" />
              Generated Questions ({generatedQuestions.length})
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">
                {selectedQuestions.length} selected
              </span>
              <button
                onClick={addSelectedQuestions}
                disabled={selectedQuestions.length === 0}
                className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected
              </button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedQuestions.map((question) => (
              <div
                key={question.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedQuestions.includes(question.id)
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => toggleQuestionSelection(question.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-slate-600">
                        {question.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-slate-500">
                          {Math.round(question.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <h5 className="text-sm font-semibold text-slate-900 mb-1">
                      {question.title}
                    </h5>
                    <p className="text-xs text-slate-600 mb-2">
                      {question.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {question.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-3">
                    {selectedQuestions.includes(question.id) ? (
                      <Check className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-300 rounded"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Selected Questions Button */}
      {generatedQuestions.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => {
              const selectedQuestionsData = generatedQuestions.filter(q => selectedQuestions.includes(q.id));
              onQuestionsGenerated && onQuestionsGenerated(selectedQuestionsData);
            }}
            disabled={selectedQuestions.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-5 h-5" />
            <span>Add Selected Questions ({selectedQuestions.length})</span>
          </button>
        </div>
      )}

      {/* AI Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <h5 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          AI Tips
        </h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Be specific about your survey goals for better results</li>
          <li>• Mention your target audience for tailored questions</li>
          <li>• Include context about your industry or use case</li>
          <li>• Review and customize generated questions before adding</li>
        </ul>
      </div>
    </div>
  );
};

export default AIQuestionGenerator;
