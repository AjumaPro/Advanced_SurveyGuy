import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  Send,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Type,
  CheckSquare,
  Star,
  Smile,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  MessageSquare,
  ThumbsUp,
  Menu
} from 'lucide-react';

const MobileSurveyBuilder = ({ 
  survey = {
    id: 'demo-survey',
    title: 'Mobile Survey Demo',
    description: 'A demo survey for mobile devices',
    questions: [
      {
        id: 'q1',
        title: 'How satisfied are you with our service?',
        type: 'rating',
        required: true,
        options: [],
        order: 0
      },
      {
        id: 'q2',
        title: 'What could we improve?',
        type: 'textarea',
        required: false,
        options: [],
        order: 1
      }
    ],
    settings: {
      theme: 'light',
      allowMultipleResponses: false,
      showProgress: true
    }
  }, 
  onUpdate = () => {}, 
  onSave = () => {}, 
  onPublish = () => {},
  onPreview = () => {}
}) => {
  const [activeView, setActiveView] = useState('mobile'); // mobile, tablet, desktop
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hapticFeedback] = useState(true);

  // Mobile-optimized question types
  const mobileQuestionTypes = [
    { id: 'text', name: 'Text', icon: <Type className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
    { id: 'textarea', name: 'Long Text', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-green-100 text-green-600' },
    { id: 'multiple_choice', name: 'Choice', icon: <CheckSquare className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
    { id: 'rating', name: 'Rating', icon: <Star className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'emoji_scale', name: 'Emoji', icon: <Smile className="w-4 h-4" />, color: 'bg-pink-100 text-pink-600' },
    { id: 'yes_no', name: 'Yes/No', icon: <ThumbsUp className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'email', name: 'Email', icon: <Mail className="w-4 h-4" />, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'phone', name: 'Phone', icon: <Phone className="w-4 h-4" />, color: 'bg-teal-100 text-teal-600' },
    { id: 'date', name: 'Date', icon: <Calendar className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
    { id: 'location', name: 'Location', icon: <MapPin className="w-4 h-4" />, color: 'bg-red-100 text-red-600' },
    { id: 'file_upload', name: 'Upload', icon: <Upload className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600' },
    { id: 'payment', name: 'Payment', icon: <CreditCard className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' }
  ];

  const addQuestion = (questionType) => {
    const newQuestion = {
      id: Date.now(),
      type: questionType,
      title: `New ${mobileQuestionTypes.find(t => t.id === questionType)?.name || 'Question'}`,
      description: '',
      required: true,
      options: getDefaultOptions(questionType),
      order: survey.questions.length
    };

    onUpdate({
      ...survey,
      questions: [...survey.questions, newQuestion]
    });

    // Haptic feedback for mobile
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Touch gesture handlers (placeholder for future implementation)
  // const handleLongPress = (questionId) => {
  //   setSelectedQuestion(questionId);
  //   setShowQuestionEditor(true);
  //   if (hapticFeedback && 'vibrate' in navigator) {
  //     navigator.vibrate(200);
  //   }
  // };

  const getDefaultOptions = (questionType) => {
    switch (questionType) {
      case 'multiple_choice':
        return ['Option 1', 'Option 2', 'Option 3'];
      case 'rating':
        return Array.from({ length: 5 }, (_, i) => i + 1);
      case 'emoji_scale':
        return ['😞', '😐', '😊', '😄', '🤩'];
      case 'yes_no':
        return ['Yes', 'No'];
      default:
        return [];
    }
  };

  const updateQuestion = (questionId, updates) => {
    onUpdate({
      ...survey,
      questions: survey.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const removeQuestion = (questionId) => {
    onUpdate({
      ...survey,
      questions: survey.questions.filter(q => q.id !== questionId)
    });
    setSelectedQuestion(null);
  };

  // const reorderQuestions = (fromIndex, toIndex) => {
  //   const newQuestions = [...survey.questions];
  //   const [movedQuestion] = newQuestions.splice(fromIndex, 1);
  //   newQuestions.splice(toIndex, 0, movedQuestion);
  //   
  //   onUpdate({
  //     ...survey,
  //     questions: newQuestions.map((q, index) => ({ ...q, order: index }))
  //   });
  // };

  const getViewportClass = () => {
    switch (activeView) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
        return 'max-w-4xl mx-auto';
      default:
        return 'max-w-sm mx-auto';
    }
  };

  const renderQuestionPreview = (question) => {
    const questionType = mobileQuestionTypes.find(t => t.id === question.type);
    
    return (
      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`p-2 rounded-lg ${questionType?.color || 'bg-slate-100'}`}>
            {questionType?.icon}
          </div>
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            {questionType?.name}
          </span>
          {question.required && (
            <span className="text-xs text-red-500 font-medium">Required</span>
          )}
        </div>
        
        <h3 className="font-semibold text-slate-900 mb-2">{question.title}</h3>
        
        {question.description && (
          <p className="text-sm text-slate-600 mb-3">{question.description}</p>
        )}
        
        {/* Question-specific preview */}
        {question.type === 'text' && (
          <input
            type="text"
            placeholder="Type your answer..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled
          />
        )}
        
        {question.type === 'textarea' && (
          <textarea
            placeholder="Type your answer..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
            rows={3}
            disabled
          />
        )}
        
        {question.type === 'multiple_choice' && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="radio" name={`preview-${question.id}`} className="text-blue-600" disabled />
                <span className="text-sm text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {question.type === 'rating' && (
          <div className="flex space-x-1">
            {question.options.map((rating, index) => (
              <button
                key={index}
                className="w-8 h-8 text-slate-300 hover:text-yellow-400 transition-colors"
                disabled
              >
                <Star className="w-full h-full" />
              </button>
            ))}
          </div>
        )}
        
        {question.type === 'emoji_scale' && (
          <div className="flex space-x-2">
            {question.options.map((emoji, index) => (
              <button
                key={index}
                className="text-2xl hover:scale-110 transition-transform"
                disabled
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        
        {question.type === 'yes_no' && (
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <input type="radio" name={`preview-${question.id}`} className="text-blue-600" disabled />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <input type="radio" name={`preview-${question.id}`} className="text-blue-600" disabled />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mobile-survey-builder bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900 truncate">
                  {survey.title || 'Untitled Survey'}
                </h1>
                <p className="text-sm text-slate-600">
                  {survey.questions.length} questions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Viewport Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'mobile' ? 'bg-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'tablet' ? 'bg-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'desktop' ? 'bg-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isPreviewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {!isPreviewMode && (
          <div className="w-80 bg-white border-r border-slate-200 min-h-screen">
            {/* Question Types */}
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Add Questions</h3>
              <div className="grid grid-cols-2 gap-2">
                {mobileQuestionTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => addQuestion(type.id)}
                    className="flex flex-col items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    <div className={`p-2 rounded-lg mb-2 ${type.color}`}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-700 text-center">
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Questions</h3>
              <div className="space-y-2">
                {survey.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedQuestion?.id === question.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {question.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {mobileQuestionTypes.find(t => t.id === question.type)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuestion(question);
                            setShowQuestionEditor(true);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(question.id);
                          }}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className={getViewportClass()}>
            {/* Survey Header */}
            <div className="mb-6">
              <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {survey.title || 'Untitled Survey'}
                </h2>
                {survey.description && (
                  <p className="text-slate-600">{survey.description}</p>
                )}
                <div className="mt-4 flex items-center space-x-4 text-sm text-slate-500">
                  <span>{survey.questions.length} questions</span>
                  <span>•</span>
                  <span>Estimated time: {Math.ceil(survey.questions.length * 0.5)} min</span>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {survey.questions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-200">
                  <Plus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Questions Yet</h3>
                  <p className="text-slate-600 mb-4">
                    Add questions from the sidebar to start building your survey
                  </p>
                </div>
              ) : (
                survey.questions.map((question, index) => (
                  <div key={question.id} className="relative group">
                    {renderQuestionPreview(question)}
                    
                    {/* Question Actions */}
                    {!isPreviewMode && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1">
                          <button
                            onClick={() => {
                              setSelectedQuestion(question);
                              setShowQuestionEditor(true);
                            }}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            {!isPreviewMode && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={onPublish}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Editor Modal */}
      {showQuestionEditor && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Question</h3>
                <button
                  onClick={() => setShowQuestionEditor(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Question Title
                  </label>
                  <input
                    type="text"
                    value={selectedQuestion?.title || ''}
                    onChange={(e) => selectedQuestion && updateQuestion(selectedQuestion.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={selectedQuestion?.description || ''}
                    onChange={(e) => selectedQuestion && updateQuestion(selectedQuestion.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedQuestion?.required || false}
                      onChange={(e) => selectedQuestion && updateQuestion(selectedQuestion.id, { required: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Required question</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowQuestionEditor(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowQuestionEditor(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSurveyBuilder;
