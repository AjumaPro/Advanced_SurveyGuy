import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Brain,
  Lightbulb,
  Wand2,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIAssistant = ({ survey, onAddQuestion, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');

  const quickPrompts = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: "Customer Satisfaction",
      prompt: "Create questions to measure customer satisfaction with our service"
    },
    {
      icon: <Brain className="w-4 h-4" />,
      title: "Product Feedback",
      prompt: "Generate questions to gather feedback about our new product features"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      title: "Employee Engagement",
      prompt: "Create an employee engagement survey with rating questions"
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      title: "Event Feedback",
      prompt: "Generate questions for post-event feedback collection"
    }
  ];

  const improvementSuggestions = [
    {
      type: 'structure',
      title: 'Add Welcome Message',
      description: 'Consider adding a welcome message to introduce your survey',
      action: () => toast.info('Welcome message feature coming soon!')
    },
    {
      type: 'flow',
      title: 'Logical Question Order',
      description: 'Reorder questions from general to specific for better flow',
      action: () => toast.info('Auto-reordering feature coming soon!')
    },
    {
      type: 'engagement',
      title: 'Add Progress Bar',
      description: 'Show progress to improve completion rates',
      action: () => toast.info('Progress bar is already enabled in settings!')
    }
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI-generated questions based on input
      const mockQuestions = generateMockQuestions(input);
      setSuggestions(mockQuestions);
      
      toast.success(`Generated ${mockQuestions.length} question suggestions!`);
    } catch (error) {
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (prompt) => {
    const templates = [
      {
        type: 'rating',
        title: `How would you rate ${prompt.toLowerCase()}?`,
        description: 'Rate from 1-5 stars'
      },
      {
        type: 'multiple_choice',
        title: `What is your overall impression of ${prompt.toLowerCase()}?`,
        options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
      },
      {
        type: 'textarea',
        title: `Please provide detailed feedback about ${prompt.toLowerCase()}`,
        description: 'Your detailed thoughts and suggestions'
      },
      {
        type: 'checkbox',
        title: `Which aspects of ${prompt.toLowerCase()} are most important to you?`,
        options: ['Quality', 'Price', 'Service', 'Speed', 'Reliability']
      }
    ];

    return templates.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const addQuestionFromSuggestion = (suggestion) => {
    onAddQuestion(suggestion.type);
    toast.success('Question added to your survey!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Survey Assistant</h2>
              <p className="text-sm text-gray-600">Get intelligent suggestions for your survey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wand2 className="w-4 h-4 inline mr-2" />
            Generate Questions
          </button>
          <button
            onClick={() => setActiveTab('improve')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'improve'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Improve Survey
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'generate' && (
            <div className="space-y-6">
              {/* Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Describe what you want to ask about:
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="e.g., customer satisfaction with our mobile app"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Prompts:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt.prompt)}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {prompt.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prompt.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            {prompt.prompt}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Generated Questions:</h3>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {suggestion.type.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              {suggestion.title}
                            </h4>
                            {suggestion.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {suggestion.description}
                              </p>
                            )}
                            {suggestion.options && (
                              <div className="text-sm text-gray-500">
                                Options: {suggestion.options.join(', ')}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => addQuestionFromSuggestion(suggestion)}
                            className="ml-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'improve' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Survey Analysis & Suggestions
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Current Survey Stats</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-blue-600 font-medium">{survey.questions.length}</div>
                      <div className="text-blue-700">Questions</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-medium">~{Math.ceil(survey.questions.length * 0.5)}</div>
                      <div className="text-blue-700">Minutes</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-medium">
                        {survey.questions.filter(q => q.required).length}
                      </div>
                      <div className="text-blue-700">Required</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-medium">
                        {new Set(survey.questions.map(q => q.type)).size}
                      </div>
                      <div className="text-blue-700">Question Types</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {improvementSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {suggestion.type.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {suggestion.description}
                          </p>
                        </div>
                        <button
                          onClick={suggestion.action}
                          className="ml-3 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Sparkles className="w-4 h-4 inline mr-1" />
              AI suggestions are powered by advanced language models
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
