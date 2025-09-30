import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Eye,
  Share2,
  Settings,
  Plus,
  Search,
  Grid,
  List,
  Sparkles,
  ArrowLeft,
  MoreVertical,
  Copy,
  Trash2,
  Move,
  Edit3,
  CheckCircle,
  Clock,
  Users,
  Loader2,
  BookOpen,
  FileText,
  Zap,
  Crown,
  Globe,
  Database,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getQuestionType, getDefaultQuestionSettings } from '../utils/questionTypes';

// Import professional components
import ProfessionalQuestionEditorV2 from './ProfessionalQuestionEditorV2';
import ProfessionalPreview from './ProfessionalPreview';
import SurveyShareModal from './SurveyShareModal';
import EnhancedQuestionTypeSelector from './EnhancedQuestionTypeSelector';
import SurveySettingsModal from './SurveySettingsModal';
import AutoSaveIndicator from './AutoSaveIndicator';
import SurveyValidationPanel from './SurveyValidationPanel';

const ProfessionalSurveyBuilderV2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Core survey state
  const [survey, setSurvey] = useState({
    id: null,
    title: '',
    description: '',
    questions: [],
    settings: {
      allowAnonymous: true,
      collectEmail: false,
      showProgress: true,
      randomizeQuestions: false,
      requireAll: false,
      theme: 'modern',
      brandColor: '#3B82F6',
      thankYouMessage: 'Thank you for completing this survey!'
    },
    status: 'draft',
    published_at: null,
    created_at: null,
    updated_at: null
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [viewMode, setViewMode] = useState('builder'); // builder, preview, settings
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  // Load survey data
  const loadSurvey = useCallback(async () => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { survey: surveyData, error } = await api.surveys.getSurvey(id);
      
      if (error) throw new Error(error);
      
      setSurvey(surveyData);
      setSelectedQuestion(surveyData?.questions?.[0]?.id || null);
    } catch (error) {
      console.error('Error loading survey:', error);
      toast.error('Failed to load survey');
      navigate('/app/surveys');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Save survey with professional error handling
  const saveSurvey = useCallback(async (status = null, showToast = true) => {
    if (!user?.id) {
      toast.error('You must be logged in to save surveys');
      return;
    }

    try {
      setSaving(true);
      
      const surveyData = {
        ...survey,
        status: status || survey.status,
        updated_at: new Date().toISOString()
      };

      let result;
      if (survey?.id) {
        result = await api.surveys.updateSurvey(survey.id, surveyData);
      } else {
        result = await api.surveys.createSurvey(user?.id, surveyData);
        setSurvey(prev => ({ ...prev, id: result?.survey?.id }));
      }

      if (result.error) throw new Error(result.error);

      setLastSaved(new Date());
      if (showToast) {
        toast.success(status === 'published' ? 'Survey published successfully!' : 'Survey saved successfully!');
      }
      
      return result;
    } catch (error) {
      console.error('Error saving survey:', error);
      toast.error(`Failed to save survey: ${error.message}`);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [survey, user]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !survey?.id) return;

    const autoSaveInterval = setInterval(() => {
      if ((survey?.questions?.length > 0) || (survey?.title?.trim())) {
        saveSurvey(null, false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [survey, autoSaveEnabled, saveSurvey]);

  // Load survey on mount
  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  // Question management
  const addQuestion = useCallback((questionType) => {
    setSurvey(prev => {
      const newQuestion = {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: questionType,
        title: '',
        description: '',
        required: false,
        settings: getDefaultQuestionSettings(questionType),
        order: prev.questions?.length || 0
      };

      setSelectedQuestion(newQuestion.id);
      setShowQuestionTypeSelector(false);
      toast.success('Question added successfully');
      
      return {
        ...prev,
        questions: [...(prev.questions || []), newQuestion]
      };
    });
  }, []);

  const updateQuestion = useCallback((questionId, updates) => {
    setSurvey(prev => ({
      ...prev,
      questions: (prev.questions || []).map(q => 
        q?.id === questionId ? { ...q, ...updates } : q
      )
    }));
  }, []);

  const deleteQuestion = useCallback((questionId) => {
    setSurvey(prev => {
      const currentQuestions = prev.questions || [];
      const updatedQuestions = currentQuestions.filter(q => q?.id !== questionId);
      
      // If we're deleting the currently selected question, select the next available one
      if (selectedQuestion === questionId) {
        const nextQuestion = updatedQuestions.find(q => q?.id !== questionId);
        setSelectedQuestion(nextQuestion?.id || null);
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });

    toast.success('Question deleted');
  }, [selectedQuestion]);

  const duplicateQuestion = useCallback((questionId) => {
    setSurvey(prev => {
      const questionToDuplicate = prev.questions?.find(q => q?.id === questionId);
      if (!questionToDuplicate) return prev;

      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${questionToDuplicate.title} (Copy)`,
        order: prev.questions.length
      };

      setSelectedQuestion(duplicatedQuestion.id);
      toast.success('Question duplicated');
      
      return {
        ...prev,
        questions: [...prev.questions, duplicatedQuestion]
      };
    });
  }, []);

  // Survey actions
  const publishSurvey = useCallback(async () => {
    // Validate survey before publishing
    const errors = validateSurvey();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix validation errors before publishing');
      return;
    }

    try {
      await saveSurvey('published');
      setShowShareModal(true);
    } catch (error) {
      console.error('Error publishing survey:', error);
    }
  }, [saveSurvey]);

  const unpublishSurvey = useCallback(async () => {
    try {
      await saveSurvey('draft');
      toast.success('Survey unpublished successfully');
    } catch (error) {
      console.error('Error unpublishing survey:', error);
    }
  }, [saveSurvey]);

  // Validation
  const validateSurvey = useCallback(() => {
    const errors = [];

    if (!survey.title.trim()) {
      errors.push({ type: 'title', message: 'Survey title is required' });
    }

    if (survey.questions.length === 0) {
      errors.push({ type: 'questions', message: 'At least one question is required' });
    }

    survey.questions.forEach((question, index) => {
      if (!question.title.trim()) {
        errors.push({ 
          type: 'question', 
          message: `Question ${index + 1} needs a title`,
          questionId: question.id 
        });
      }
    });

    return errors;
  }, [survey]);

  // Memoized filtered questions
  const filteredQuestions = useMemo(() => {
    if (!survey?.questions) return [];
    if (!searchTerm) return survey.questions;
    return survey.questions.filter(q => 
      (q?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q?.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [survey?.questions, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading survey builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-900">Survey Tools</h2>
                <p className="text-xs text-gray-500 mt-0.5">Build your professional survey</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              {sidebarCollapsed ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>
          </div>
        )}

        {/* Add Question Buttons */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowQuestionTypeSelector(true)}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
              >
                <Plus className="w-3 h-3" />
                New Question
              </button>
              <button
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
              >
                <BookOpen className="w-3 h-3" />
                From Library
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Questions ({filteredQuestions.length})</h3>
              </div>

              <div className="space-y-1.5">
                <AnimatePresence>
                  {filteredQuestions.map((question, index) => {
                    const questionTypeInfo = getQuestionType(question.type);
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                          selectedQuestion === question.id
                            ? 'border-blue-400 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                            {questionTypeInfo?.icon ? (
                              <span className="text-xs">{questionTypeInfo.icon}</span>
                            ) : (
                              <FileText className="w-3 h-3 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-medium text-gray-500">
                                Q{index + 1}
                              </span>
                              {question.required && (
                                <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded text-[10px] font-medium">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-gray-900 truncate leading-tight">
                              {question.title || 'Untitled Question'}
                            </p>
                            <p className="text-xs text-gray-500 capitalize leading-tight">
                              {question.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-6">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">No questions yet</p>
                    <p className="text-gray-400 text-[10px]">Add your first question to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
            <AutoSaveIndicator 
              lastSaved={lastSaved}
              saving={saving}
              enabled={autoSaveEnabled}
              onToggle={() => setAutoSaveEnabled(!autoSaveEnabled)}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          {/* Top Header Bar */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/app/surveys')}
                  className="flex items-center gap-1.5 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Surveys
                </button>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>📊</span>
                  <span>{survey?.questions?.length || 0} questions</span>
                  <span>•</span>
                  <span>~{Math.ceil((survey?.questions?.length || 0) * 0.5)} min</span>
                  <span>•</span>
                  <span>{survey?.questions?.filter(q => q?.required)?.length || 0} required</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Auto-saved</span>
                </div>
                
                <button className="flex items-center gap-1 px-2 py-1 text-purple-600 hover:bg-purple-50 rounded-md transition-colors text-xs">
                  <FileText className="w-3 h-3" />
                  Templates
                </button>
                
                <button className="flex items-center gap-1 px-2 py-1 text-orange-600 hover:bg-orange-50 rounded-md transition-colors text-xs">
                  <Database className="w-3 h-3" />
                  DB Check
                </button>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <input
                  type="text"
                  value={survey.title}
                  onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Untitled Survey"
                  className="text-lg font-semibold bg-transparent border-none outline-none placeholder-gray-400 w-full focus:ring-0"
                />
                <input
                  type="text"
                  value={survey.description}
                  onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Click to edit • Use advanced edit for comprehensive customization • Keyboard shortcuts available"
                  className="text-sm text-gray-500 bg-transparent border-none outline-none placeholder-gray-400 w-full mt-0.5 focus:ring-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('builder')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                      viewMode === 'builder'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    Builder
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>
                
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>

                {survey.status === 'published' ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                    <button
                      onClick={unpublishSurvey}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Unpublish
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={publishSurvey}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Publish
                  </button>
                )}

                <button
                  onClick={() => saveSurvey()}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Panel */}
        {validationErrors.length > 0 && (
          <SurveyValidationPanel 
            errors={validationErrors}
            onClose={() => setValidationErrors([])}
          />
        )}

        {/* Content Area */}
        <div className="flex-1 flex bg-gray-50">
          {viewMode === 'preview' ? (
            <div className="flex-1 p-6">
              <ProfessionalPreview survey={survey} />
            </div>
          ) : (
            <div className="flex-1 flex">
              {/* Main Questions Area */}
              <div className="flex-1 p-6">
                {selectedQuestion ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                    <ProfessionalQuestionEditorV2
                      question={survey?.questions?.find(q => q?.id === selectedQuestion) || null}
                      onUpdate={(updates) => updateQuestion(selectedQuestion, updates)}
                      onDelete={() => deleteQuestion(selectedQuestion)}
                      onDuplicate={() => duplicateQuestion(selectedQuestion)}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your First Question</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Choose from 25+ professional question types to build engaging surveys
                      </p>
                      <button
                        onClick={() => setShowQuestionTypeSelector(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        Add Your First Question
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Question Properties */}
              {selectedQuestion && (
                <div className="w-80 bg-white border-l border-gray-200 p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Select a Question</h3>
                    <p className="text-xs text-gray-500">
                      Click on a question from the list to edit its settings and properties
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showQuestionTypeSelector && (
          <EnhancedQuestionTypeSelector
            onSelect={addQuestion}
            onClose={() => setShowQuestionTypeSelector(false)}
          />
        )}

        {showSettingsModal && (
          <SurveySettingsModal
            survey={survey}
            onUpdate={(updates) => setSurvey(prev => ({ ...prev, ...updates }))}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {showShareModal && (
          <SurveyShareModal
            survey={survey}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfessionalSurveyBuilderV2;
