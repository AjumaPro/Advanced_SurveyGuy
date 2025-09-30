import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { getQuestionType, getDefaultQuestionSettings } from '../utils/questionTypes';
import toast from 'react-hot-toast';
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
  Star,
  AlertCircle,
  X
} from 'lucide-react';

// Import components directly (temporary fix for runtime error)
import ProfessionalQuestionEditor from './ProfessionalQuestionEditor';
import ProfessionalPreview from './ProfessionalPreview';
import QuestionTypeLibrary from './QuestionTypeLibrary';
import SurveyShareModal from './SurveyShareModal';
import AdvancedQuestionEditor from './AdvancedQuestionEditor';
import BulkQuestionOperations from './BulkQuestionOperations';
import EmojiScaleAdvanced from './EmojiScaleAdvanced';
import MatrixQuestion from './MatrixQuestion';
import AdvancedQuestionTypeSelector from './AdvancedQuestionTypeSelector';
import QuestionLibrary from './QuestionLibrary';
import EnhancedQuestionSelector from './EnhancedQuestionSelector';
import TemplateSelector from './TemplateSelector';
import ComprehensiveQuestionEditor from './ComprehensiveQuestionEditor';
import DatabaseSetupGuide from './DatabaseSetupGuide';
import BulkQuestionAdder from './BulkQuestionAdder';

// Modern Question Editor Component
const ModernQuestionEditor = ({ question, onUpdate, onClose }) => {
  const [localQuestion, setLocalQuestion] = useState(question || {});
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalQuestion(question || {});
  }, [question]);

  const handleUpdate = (updates) => {
    const newQuestion = { ...localQuestion, ...updates };
    setLocalQuestion(newQuestion);
    onUpdate(updates);
  };

  const handleTitleChange = (title) => {
    handleUpdate({ title });
  };

  const handleDescriptionChange = (description) => {
    handleUpdate({ description });
  };

  const handleRequiredChange = (required) => {
    handleUpdate({ required });
  };

  const handleOptionsChange = (options) => {
    handleUpdate({ options });
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No question selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Question Type Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            {getQuestionType(question.type)?.icon ? (
              <span className="text-lg">{getQuestionType(question.type).icon}</span>
            ) : (
              <FileText className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              {getQuestionType(question.type)?.name || question.type}
            </h4>
            <p className="text-sm text-gray-500 font-medium">Question Type</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm"
        >
          <Eye className="w-4 h-4 mr-2 inline" />
          {showPreview ? 'Hide' : 'Preview'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            activeTab === 'content'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            activeTab === 'advanced'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Advanced
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Question Title */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Question Title *
            </label>
            <textarea
              value={localQuestion.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter your question..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-medium text-gray-900 placeholder-gray-400 text-sm"
              rows={3}
            />
          </div>

          {/* Question Description */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={localQuestion.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Add additional context or instructions..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-medium text-gray-900 placeholder-gray-400 text-sm"
              rows={2}
            />
          </div>

          {/* Answer Options (for applicable question types) */}
          {['multiple_choice', 'single_choice', 'dropdown', 'checkbox', 'emoji_scale'].includes(question.type) && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Answer Options
              </label>
              <div className="space-y-2">
                {(localQuestion.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      {typeof option === 'object' && option.emoji && (
                        <div className="flex items-center space-x-2">
                          {option.file ? (
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border">
                              <img 
                                src={`/emojis/${option.file}`} 
                                alt={option.emoji}
                                className="w-6 h-6"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline';
                                }}
                              />
                              <span className="text-lg hidden">{option.emoji}</span>
                            </div>
                          ) : (
                            <span className="text-lg">{option.emoji}</span>
                          )}
                          {option.color && (
                            <div 
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: option.color }}
                              title={`Color: ${option.color}`}
                            />
                          )}
                        </div>
                      )}
                      <input
                        type="text"
                        value={typeof option === 'object' ? option.label || '' : option || ''}
                        onChange={(e) => {
                          const newOptions = [...(localQuestion.options || [])];
                          if (typeof option === 'object') {
                            newOptions[index] = { ...option, label: e.target.value };
                          } else {
                            newOptions[index] = e.target.value;
                          }
                          handleOptionsChange(newOptions);
                        }}
                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium text-gray-900 text-sm"
                        placeholder={`Enter option ${index + 1} text...`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newOptions = (localQuestion.options || []).filter((_, i) => i !== index);
                        handleOptionsChange(newOptions);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...(localQuestion.options || []), ''];
                    handleOptionsChange(newOptions);
                  }}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add New Option
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Required Toggle */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-gray-900">
                  Required Question
                </label>
                <p className="text-sm text-gray-600 font-medium">Respondents must answer this question</p>
              </div>
              <button
                onClick={() => handleRequiredChange(!localQuestion.required)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localQuestion.required ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                    localQuestion.required ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
            <h4 className="text-base font-bold text-gray-900 mb-4">Display Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 text-sm">Randomize Options</span>
                <button className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 text-sm">Allow "Other" Option</span>
                <button className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 text-sm">Show Question Number</span>
                <button className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
            <h4 className="text-base font-bold text-gray-900 mb-4">Advanced Configuration</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS Classes</label>
                <input
                  type="text"
                  placeholder="custom-class-1 custom-class-2"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validation Rules</label>
                <textarea
                  placeholder="Enter custom validation rules..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium text-gray-900 text-sm"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
          <h4 className="text-base font-bold text-gray-900 mb-4">Preview</h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <h5 className="font-bold text-gray-900 mb-3 text-sm">{localQuestion.title || 'Question Title'}</h5>
            {localQuestion.description && (
              <p className="text-gray-600 mb-4 text-sm">{localQuestion.description}</p>
            )}
            {localQuestion.options && (
              <div className="space-y-2">
                {localQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <div className="flex items-center space-x-2">
                      {typeof option === 'object' && option.file ? (
                        <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border">
                          <img 
                            src={`/emojis/${option.file}`} 
                            alt={option.emoji}
                            className="w-4 h-4"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                          <span className="text-sm hidden">{option.emoji}</span>
                        </div>
                      ) : typeof option === 'object' && option.emoji ? (
                        <span className="text-sm">{option.emoji}</span>
                      ) : null}
                      <span className="text-gray-700 font-medium text-xs">
                        {typeof option === 'object' 
                          ? option.label || `Option ${index + 1}`
                          : option || `Option ${index + 1}`
                        }
                      </span>
                      {typeof option === 'object' && option.color && (
                        <div 
                          className="w-2 h-2 rounded-full border border-gray-200"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfessionalSurveyBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  // Survey state
  const [survey, setSurvey] = useState({
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
      brandColor: '#3B82F6'
    }
  });


  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState('builder'); // builder, preview, settings
  const [sidebarView, setSidebarView] = useState('questions'); // questions, library, settings
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Advanced features state
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [bulkOperationsMode, setBulkOperationsMode] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);
  const [showQuestionLibrary, setShowQuestionLibrary] = useState(false);
  const [questionToSave, setQuestionToSave] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showComprehensiveEditor, setShowComprehensiveEditor] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [showDatabaseSetupGuide, setShowDatabaseSetupGuide] = useState(false);
  const [showBulkAdder, setShowBulkAdder] = useState(false);
  const [editingQuestionTitle, setEditingQuestionTitle] = useState(null);
  const [tempQuestionTitle, setTempQuestionTitle] = useState('');
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkSelectedQuestions, setBulkSelectedQuestions] = useState([]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [questionValidation, setQuestionValidation] = useState({});

  // Memoized filtered questions
  const filteredQuestions = useMemo(() => {
    if (!survey?.questions) {
      return [];
    }
    
    if (!searchTerm) {
      return survey.questions;
    }
    
    return survey.questions.filter(q => {
      return (q.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.type || '').toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [survey?.questions, searchTerm]);

  const loadSurvey = React.useCallback(async () => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        toast.error('Survey not found');
        navigate('/app/surveys');
        return;
      }

      setSurvey({
        ...data,
        questions: data.questions || [],
        settings: data.settings || {}
      });
    } catch (error) {
      console.error('Error loading survey:', error);
      toast.error('Failed to load survey');
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const saveSurvey = React.useCallback(async (silent = false, status = null) => {
    if (!silent) setSaving(true);
    
    try {
      
      const surveyData = {
        ...survey,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        ...(status && { status })
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('surveys')
          .update(surveyData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        // Create new survey with default draft status
        const newSurveyData = {
          ...surveyData,
          status: status || 'draft'
        };
        
        const { data, error } = await supabase
          .from('surveys')
          .insert([newSurveyData])
          .select()
          .single();
        
        if (error) throw error;
        
        // Update the survey state with the new data, but preserve any unsaved changes
        setSurvey(prev => ({ 
          ...prev, 
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at
        }));
        navigate(`/app/builder/${data.id}`, { replace: true });
      }

      setLastSaved(new Date());
      if (!silent) {
        const statusText = status === 'published' ? 'published' : status === 'draft' ? 'saved as draft' : 'saved';
        toast.success(`Survey ${statusText} successfully!`);
      }
    } catch (error) {
      console.error('Error saving survey:', error);
      if (!silent) toast.error('Failed to save survey');
    } finally {
      if (!silent) setSaving(false);
    }
  }, [survey, user, id, navigate]);

  // Save as draft
  const saveDraft = React.useCallback(async () => {
    await saveSurvey(false, 'draft');
  }, [saveSurvey]);

  // Publish survey
  const publishSurvey = React.useCallback(async () => {
    // Validation before publishing
    if (!survey.title?.trim()) {
      toast.error('Please add a title before publishing');
      return;
    }
    
    if (!survey?.questions || survey.questions.length === 0) {
      toast.error('Please add at least one question before publishing');
      return;
    }

    // Check if any required questions are missing titles
    const invalidQuestions = survey.questions.filter(q => !q?.title?.trim());
    if (invalidQuestions.length > 0) {
      toast.error('Please add titles to all questions before publishing');
      return;
    }

    await saveSurvey(false, 'published');
    
    // Show share modal after successful publishing
    setTimeout(() => {
      setShareModalOpen(true);
    }, 1000);
  }, [survey, saveSurvey]);

  // Unpublish survey (back to draft)
  const unpublishSurvey = React.useCallback(async () => {
    await saveSurvey(false, 'draft');
  }, [saveSurvey]);

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (survey?.title || (survey?.questions?.length > 0)) {
        console.log('Auto-saving survey with questions:', survey.questions?.length);
        saveSurvey(true); // Silent save
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [survey, saveSurvey]);

  // Helper function to get default options for question types
  const getDefaultOptions = (questionType) => {
    switch (questionType) {
      case 'multiple_choice':
      case 'checkbox':
      case 'dropdown':
        return ['Option 1', 'Option 2', 'Option 3'];
      case 'rating':
        return ['1', '2', '3', '4', '5'];
      case 'emoji_scale':
        return [
          { emoji: '😠', label: 'Very Unsatisfied', value: 1 },
          { emoji: '😞', label: 'Unsatisfied', value: 2 },
          { emoji: '😐', label: 'Neutral', value: 3 },
          { emoji: '🙂', label: 'Satisfied', value: 4 },
          { emoji: '😊', label: 'Very Satisfied', value: 5 }
        ];
      case 'yes_no':
        return ['Yes', 'No'];
      default:
        return [];
    }
  };

  const addQuestion = (questionOrType) => {
    let newQuestion;
    
    // Generate unique ID with timestamp and random component
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof questionOrType === 'string') {
      // Legacy support for type string
      const defaultSettings = getDefaultQuestionSettings(questionOrType);
      
      newQuestion = {
        id: uniqueId,
        type: questionOrType,
        title: `Untitled ${questionOrType.replace('_', ' ')} question`,
        description: '',
        required: false,
        options: getDefaultOptions(questionOrType),
        settings: defaultSettings || {}
      };
    } else {
      // New question object from selector or library
      newQuestion = {
        ...questionOrType,
        id: uniqueId,
        title: questionOrType.title || `Untitled ${questionOrType.type.replace('_', ' ')} question`,
        options: questionOrType.options || getDefaultOptions(questionOrType.type)
      };
    }

    console.log('Adding question:', newQuestion);
    console.log('Current survey questions before add:', survey.questions);

    setSurvey(prev => {
      const updatedSurvey = {
        ...prev,
        questions: [...prev.questions, newQuestion]
      };
      console.log('Updated survey questions after add:', updatedSurvey.questions);
      return updatedSurvey;
    });
    
    setSelectedQuestion(newQuestion.id);
    setSidebarView('questions');
  };

  const handleSelectQuestionType = (question, keepSelectorOpen = false) => {
    addQuestion(question);
    if (!keepSelectorOpen) {
      setShowQuestionTypeSelector(false);
    }
  };

  const handleSelectFromLibrary = (question) => {
    addQuestion(question);
    setShowQuestionLibrary(false);
  };

  const handleBulkAddQuestions = (questions) => {
    setSurvey(prev => {
      const newQuestions = [...prev.questions, ...questions];
      
      return {
        ...prev,
        questions: newQuestions
      };
    });
    
    // Select the first question for editing
    if (questions.length > 0) {
      setSelectedQuestion(questions[0].id);
    }
    
    toast.success(`Added ${questions.length} questions to your survey`);
  };

  // Keyboard shortcuts for quick question addition
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if not typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'q' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowQuestionTypeSelector(true);
      }
      
      if (e.key === '1' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addQuestion('text');
      }
      
      if (e.key === '2' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addQuestion('multiple_choice');
      }
      
      if (e.key === '3' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addQuestion('rating');
      }
      
        if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          setShowBulkAdder(true);
        }
        if (e.key === 'e' && (e.ctrlKey || e.metaKey) && selectedQuestion) {
          e.preventDefault();
          const question = survey.questions.find(q => q.id === selectedQuestion);
          if (question) {
            startEditingQuestionTitle(selectedQuestion, question.title);
          }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveQuestionToLibrary = async (question) => {
    if (!user?.id) {
      toast.error('You must be logged in to save questions');
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Saving question to library...');
      
      // Prepare question data for saving
      const questionData = {
        name: question.title || 'Untitled Question',
        description: question.description || '',
        category: 'general',
        tags: [],
        isPublic: false,
        type: question.type,
        title: question.title,
        settings: question.settings || {},
        required: question.required || false
      };

      // Save directly to database
      const { question: savedQuestion, error } = await api.questions.saveQuestion(user.id, questionData);
      
      if (error) {
        throw new Error(error);
      }

      // Success
      toast.dismiss(loadingToast);
      toast.success('Question saved to library successfully!');
      
      // Optionally show the library with the saved question
      setQuestionToSave(null);
      setShowQuestionLibrary(true);
      
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error(`Failed to save question: ${error.message}`);
      
      // If it's a database error, show helpful message
      if (error.message.includes('relation "question_library" does not exist')) {
        toast.error('Database not set up yet. Please run the database setup script first.');
      }
    }
  };

  const handleEditQuestionComprehensive = (question) => {
    setEditingQuestionId(question.id);
    setShowComprehensiveEditor(true);
  };

  const handleSaveEditedQuestion = (editedQuestion) => {
    updateQuestion(editingQuestionId, editedQuestion);
    setShowComprehensiveEditor(false);
    setEditingQuestionId(null);
    toast.success('Question updated successfully!');
  };

  const handleSelectTemplate = (template) => {
    if (!template) {
      // Start from scratch
      setShowTemplateSelector(false);
      return;
    }

    // Apply template to survey
    setSurvey(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      questions: template.questions?.map((q, index) => ({
        ...q,
        id: `q_${Date.now()}_${index}`,
        settings: q.settings || getDefaultQuestionSettings(q.type)
      })) || []
    }));

    setShowTemplateSelector(false);
    toast.success(`Template "${template.title}" applied!`);
  };

  const handleBulkEditQuestions = (questionIds) => {
    // For now, open the first question in the comprehensive editor
    if (questionIds.length > 0) {
      const firstQuestion = survey.questions.find(q => q.id === questionIds[0]);
      if (firstQuestion) {
        handleEditQuestionComprehensive(firstQuestion);
      }
    }
  };

  // Check database setup for question library
  const checkDatabaseSetup = async () => {
    try {
      const { questions, error } = await api.questions.getSavedQuestions(user?.id, { limit: 1 });
      if (error && error.includes('does not exist')) {
        toast.error('Database setup required. Opening setup guide...');
        setShowDatabaseSetupGuide(true);
        return false;
      }
      toast.success('Database is properly configured!');
      return true;
    } catch (error) {
      toast.error('Database connection issue. Opening setup guide...');
      setShowDatabaseSetupGuide(true);
      return false;
    }
  };

  const updateQuestion = (questionId, updates) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId) => {
    console.log('Deleting question with ID:', questionId);
    console.log('Current survey questions before delete:', survey.questions);
    
    setSurvey(prev => {
      const updatedQuestions = prev.questions.filter(q => q.id !== questionId);
      console.log('Updated survey questions after delete:', updatedQuestions);
      return {
      ...prev,
        questions: updatedQuestions
      };
    });
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
  };

  const duplicateQuestion = (questionId) => {
    const question = survey.questions.find(q => q.id === questionId);
    if (!question) return;

    const duplicated = {
      ...question,
      id: Date.now().toString(),
      title: `${question.title} (Copy)`
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, duplicated]
    }));
  };

  // Inline editing functions for questions
  const startEditingQuestionTitle = (questionId, currentTitle) => {
    setEditingQuestionTitle(questionId);
    setTempQuestionTitle(currentTitle || '');
  };

  const saveQuestionTitleEdit = (questionId) => {
    if (tempQuestionTitle.trim()) {
      updateQuestion(questionId, { title: tempQuestionTitle.trim() });
    }
    setEditingQuestionTitle(null);
    setTempQuestionTitle('');
  };

  const cancelQuestionTitleEdit = () => {
    setEditingQuestionTitle(null);
    setTempQuestionTitle('');
  };

  // Bulk editing functions
  const toggleBulkEditMode = () => {
    setBulkEditMode(!bulkEditMode);
    if (bulkEditMode) {
      setBulkSelectedQuestions([]);
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setBulkSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const selectAllQuestions = () => {
    setBulkSelectedQuestions(survey.questions.map(q => q.id));
  };

  const clearSelection = () => {
    setBulkSelectedQuestions([]);
  };

  const bulkUpdateQuestions = (updates) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        bulkSelectedQuestions.includes(q.id) ? { ...q, ...updates } : q
      )
    }));
    toast.success(`Updated ${bulkSelectedQuestions.length} questions`);
    setBulkSelectedQuestions([]);
    setBulkEditMode(false);
  };

  const bulkDeleteQuestions = () => {
    if (bulkSelectedQuestions.length === 0) return;
    
    if (window.confirm(`Delete ${bulkSelectedQuestions.length} selected questions?`)) {
      setSurvey(prev => ({
        ...prev,
        questions: prev.questions.filter(q => !bulkSelectedQuestions.includes(q.id))
      }));
      toast.success(`Deleted ${bulkSelectedQuestions.length} questions`);
      setBulkSelectedQuestions([]);
      setBulkEditMode(false);
    }
  };

  const bulkDuplicateQuestions = () => {
    const questionsToDuplicate = survey.questions.filter(q => bulkSelectedQuestions.includes(q.id));
    const duplicatedQuestions = questionsToDuplicate.map(q => ({
      ...q,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${q.title} (Copy)`
    }));

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, ...duplicatedQuestions]
    }));
    toast.success(`Duplicated ${bulkSelectedQuestions.length} questions`);
    setBulkSelectedQuestions([]);
    setBulkEditMode(false);
  };

  const reorderQuestions = (fromIndex, toIndex) => {
    setSurvey(prev => {
      const questions = [...prev.questions];
      const [movedQuestion] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, movedQuestion);
      return { ...prev, questions };
    });
  };

  // Question validation functions
  const validateQuestion = (question) => {
    const errors = [];
    
    if (!question.title || question.title.trim() === '') {
      errors.push('Question title is required');
    }
    
    if (question.title && question.title.length > 200) {
      errors.push('Question title must be less than 200 characters');
    }
    
    if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
      if (!question.options || question.options.length < 2) {
        errors.push('At least 2 options are required');
      }
      if (question.options && question.options.some(opt => !opt || opt.trim() === '')) {
        errors.push('All options must have content');
      }
    }
    
    if (question.type === 'rating' && (!question.maxRating || question.maxRating < 1)) {
      errors.push('Rating scale must have a valid maximum value');
    }
    
    if (question.type === 'emoji_scale' && (!question.options || question.options.length < 2)) {
      errors.push('Emoji scale must have at least 2 options');
    }
    
    return errors;
  };

  const validateAllQuestions = () => {
    const validationResults = {};
    let hasErrors = false;
    
    survey.questions.forEach(question => {
      const errors = validateQuestion(question);
      if (errors.length > 0) {
        validationResults[question.id] = errors;
        hasErrors = true;
      }
    });
    
    setQuestionValidation(validationResults);
    return !hasErrors;
  };

  const getQuestionValidationErrors = (questionId) => {
    return questionValidation[questionId] || [];
  };

  // Drag and drop reordering temporarily disabled for React 18 compatibility
  // const onDragEnd = (result) => {
  //   if (!result.destination) return;
  //   const items = Array.from(survey.questions);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   items.splice(result.destination.index, 0, reorderedItem);
  //   setSurvey(prev => ({ ...prev, questions: items }));
  // };

  // Advanced bulk operations
  const handleBulkDelete = (questionIds) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => !questionIds.includes(q.id))
    }));
    setSelectedQuestions([]);
    toast.success(`Deleted ${questionIds.length} question${questionIds.length !== 1 ? 's' : ''}`);
  };

  const handleBulkDuplicate = (questionIds) => {
    const questionsToClone = survey.questions.filter(q => questionIds.includes(q.id));
    const duplicatedQuestions = questionsToClone.map(question => ({
      ...question,
      id: Date.now().toString() + Math.random(),
      title: `${question.title} (Copy)`
    }));
    
    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, ...duplicatedQuestions]
    }));
    setSelectedQuestions([]);
    toast.success(`Duplicated ${questionIds.length} question${questionIds.length !== 1 ? 's' : ''}`);
  };

  const handleBulkToggleRequired = (questionIds, required) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        questionIds.includes(q.id) ? { ...q, required } : q
      )
    }));
    setSelectedQuestions([]);
    toast.success(`Made ${questionIds.length} question${questionIds.length !== 1 ? 's' : ''} ${required ? 'required' : 'optional'}`);
  };

  const handleBulkToggleVisibility = (questionIds, visible) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        questionIds.includes(q.id) ? { ...q, hidden: !visible } : q
      )
    }));
    setSelectedQuestions([]);
    toast.success(`${visible ? 'Showed' : 'Hidden'} ${questionIds.length} question${questionIds.length !== 1 ? 's' : ''}`);
  };

  const handleBulkReorder = (questionIds, direction) => {
    // Implementation for bulk reordering
    const questions = [...survey.questions];
    const selectedIndices = questionIds.map(id => questions.findIndex(q => q.id === id)).sort((a, b) => a - b);
    
    if (direction === 'up' && selectedIndices[0] > 0) {
      selectedIndices.forEach((index, i) => {
        const adjustedIndex = index - i;
        const temp = questions[adjustedIndex];
        questions[adjustedIndex] = questions[adjustedIndex - 1];
        questions[adjustedIndex - 1] = temp;
      });
    } else if (direction === 'down' && selectedIndices[selectedIndices.length - 1] < questions.length - 1) {
      selectedIndices.reverse().forEach((index, i) => {
        const adjustedIndex = index + i;
        const temp = questions[adjustedIndex];
        questions[adjustedIndex] = questions[adjustedIndex + 1];
        questions[adjustedIndex + 1] = temp;
      });
    }
    
    setSurvey(prev => ({ ...prev, questions }));
    toast.success(`Moved ${questionIds.length} question${questionIds.length !== 1 ? 's' : ''} ${direction}`);
  };

  const handleTitleEdit = () => {
    setTempTitle(survey.title);
    setIsEditingTitle(true);
  };

  const saveTitleEdit = () => {
    setSurvey(prev => ({ ...prev, title: tempTitle || 'Untitled Survey' }));
    setIsEditingTitle(false);
  };

  const cancelTitleEdit = () => {
    setTempTitle(survey.title);
    setIsEditingTitle(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading Survey Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Redesigned Header with Better Organization */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Navigation & Title */}
          <div className="flex items-center justify-between py-4">
            {/* Left: Navigation & Title */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate('/app/surveys')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium text-sm">Back to Surveys</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {isEditingTitle ? (
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTitleEdit();
                        if (e.key === 'Escape') cancelTitleEdit();
                      }}
                      onBlur={saveTitleEdit}
                      className="text-xl sm:text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 min-w-0 flex-1"
                      placeholder="Enter survey title..."
                      autoFocus
                    />
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={saveTitleEdit} 
                        className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                        title="Save title"
                      >
                        <CheckCircle className="w-4 h-4" />
                    </button>
                      <button 
                        onClick={cancelTitleEdit} 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                        title="Cancel editing"
                      >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <h1 
                    onClick={handleTitleEdit}
                      className="text-xl sm:text-2xl font-bold text-gray-900 cursor-text hover:text-blue-600 transition-colors truncate"
                  >
                    {survey.title || 'Untitled Survey'}
                  </h1>
                <button
                  onClick={handleTitleEdit}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex-shrink-0"
                      title="Edit title"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Save Status */}
            <div className="flex items-center space-x-3 ml-4">
              {saving ? (
                <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : 'Auto-saved'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: View Modes, Stats, and Actions */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            {/* Left: View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('builder')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'builder'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4 mr-2 inline" />
                Builder
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('settings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'settings'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Settings
              </button>
            </div>

            {/* Center: Survey Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <List className="w-4 h-4" />
                <span className="font-medium">{survey.questions.length} questions</span>
                </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Clock className="w-4 h-4" />
                <span className="font-medium">~{Math.ceil(survey.questions.length * 0.5)} min</span>
                </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <Users className="w-4 h-4" />
                <span className="font-medium">{survey.questions.filter(q => q.required).length} required</span>
                </div>
              </div>

            {/* Right: Action Buttons */}
              <div className="flex items-center space-x-2">
              {/* Secondary Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Browse Templates"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Templates</span>
                </button>
                
                <button
                  onClick={checkDatabaseSetup}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                  title="Check Database Setup"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">DB Check</span>
                </button>
                
              </div>

              {/* Primary Actions */}
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200">
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span className="font-medium">{saving ? 'Saving...' : 'Save Draft'}</span>
                </button>

                {survey.status === 'published' ? (
                  <>
                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="font-medium">Share & QR</span>
                    </button>
                    
                    <button
                      onClick={unpublishSurvey}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">Unpublish</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={publishSurvey}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium">Publish</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
          {/* Redesigned Left Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              {/* Enhanced Sidebar Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Survey Tools</h3>
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSidebarView('questions')}
                      className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        sidebarView === 'questions'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      title="Questions"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSidebarView('library')}
                      className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        sidebarView === 'library'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      title="Question Library"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSidebarView('settings')}
                      className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        sidebarView === 'settings'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Search */}
                {sidebarView === 'questions' && (
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {sidebarView === 'questions' && (
                  <div className="p-6 space-y-4">
                    {/* Primary Add Question Buttons */}
                  <div className="space-y-3">
                      <div className="text-base font-semibold text-gray-700 mb-3">Add Questions</div>
                      
                      {/* Main Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowQuestionTypeSelector(true)}
                          className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-sm">New Question</span>
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setShowQuestionLibrary(true)}
                            className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                        >
                            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-xs">From Library</span>
                        </button>
                        
                        <button
                          onClick={() => setShowBulkAdder(true)}
                            className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                        >
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-xs">Bulk Add</span>
                        </button>
                        </div>
                      </div>
                      
                      {/* Quick Add Section */}
                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quick Add</div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => addQuestion('text')}
                            className="flex items-center justify-center space-x-1.5 p-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-all duration-200 group"
                          >
                            <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Text</span>
                          </button>
                          <button
                            onClick={() => addQuestion('multiple_choice')}
                            className="flex items-center justify-center space-x-1.5 p-2.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-all duration-200 group"
                          >
                            <CheckCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Choice</span>
                          </button>
                          <button
                            onClick={() => addQuestion('rating')}
                            className="flex items-center justify-center space-x-1.5 p-2.5 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-all duration-200 group"
                          >
                            <Star className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Rating</span>
                          </button>
                          <button
                            onClick={() => addQuestion('emoji_scale')}
                            className="flex items-center justify-center space-x-1.5 p-2.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 transition-all duration-200 group"
                          >
                            <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Emoji</span>
                          </button>
                        </div>
                        
                        {/* Additional Options */}
                        <div className="space-y-2 pt-2">
                          <button
                            onClick={() => {
                              addQuestion('text');
                              setTimeout(() => addQuestion('multiple_choice'), 100);
                              setTimeout(() => addQuestion('rating'), 200);
                            }}
                            className="w-full flex items-center justify-center space-x-2 p-2.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-all duration-200 group"
                          >
                            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Quick 3-Pack</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Questions List */}
                    {filteredQuestions.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <div className="text-base font-semibold text-gray-700 mb-3">Questions ({filteredQuestions.length})</div>
                    {filteredQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedQuestion === question.id
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                Q{index + 1}
                              </span>
                                  <span className="text-xs font-medium text-gray-500 capitalize bg-gray-50 px-2 py-1 rounded-md">
                                {getQuestionType(question.type)?.name || question.type}
                              </span>
                              {question.required && (
                                    <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-md">
                                      Required
                                    </span>
                              )}
                            </div>
                                <p className="text-sm font-medium text-gray-900 truncate mb-1">
                              {question.title || 'Untitled Question'}
                            </p>
                            {question.description && (
                                  <p className="text-xs text-gray-600 truncate">
                                {question.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Show context menu
                            }}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                      </div>
                    )}

                    {filteredQuestions.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <List className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-500 font-medium mb-2">
                          {searchTerm ? 'No questions match your search' : 'No questions yet'}
                        </div>
                        <p className="text-sm text-gray-400">
                          {searchTerm ? 'Try a different search term' : 'Add your first question to get started'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {sidebarView === 'library' && (
                  <QuestionTypeLibrary onAddQuestion={addQuestion} userRole={userProfile?.role || 'user'} />
                )}

                {sidebarView === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Survey Description
                      </label>
                      <textarea
                        value={survey.description}
                        onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this survey is about..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Survey Settings
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={survey.settings.showProgress}
                            onChange={(e) => setSurvey(prev => ({
                              ...prev,
                              settings: { ...prev.settings, showProgress: e.target.checked }
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Show progress bar</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={survey.settings.allowAnonymous}
                            onChange={(e) => setSurvey(prev => ({
                              ...prev,
                              settings: { ...prev.settings, allowAnonymous: e.target.checked }
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Allow anonymous responses</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={survey.settings.randomizeQuestions}
                            onChange={(e) => setSurvey(prev => ({
                              ...prev,
                              settings: { ...prev.settings, randomizeQuestions: e.target.checked }
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Randomize question order</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={survey.settings.brandColor}
                          onChange={(e) => setSurvey(prev => ({
                            ...prev,
                            settings: { ...prev.settings, brandColor: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={survey.settings.brandColor}
                          onChange={(e) => setSurvey(prev => ({
                            ...prev,
                            settings: { ...prev.settings, brandColor: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              {viewMode === 'builder' && (
                <div className="flex-1 flex flex-col">
                  {/* Enhanced Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {survey.questions.length} total
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {bulkEditMode && (
                          <div className="flex items-center space-x-3 text-sm bg-blue-50 px-3 py-2 rounded-lg">
                            <span className="text-blue-700 font-medium">
                              {bulkSelectedQuestions.length} selected
                            </span>
                            <button
                              onClick={selectAllQuestions}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              Select All
                            </button>
                            <button
                              onClick={clearSelection}
                              className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={() => {
                            const isValid = validateAllQuestions();
                            if (isValid) {
                              toast.success('All questions are valid!');
                            } else {
                              toast.error('Some questions have validation errors');
                            }
                          }}
                          className="flex items-center space-x-1.5 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Validate</span>
                        </button>
                        
                        <button
                          onClick={toggleBulkEditMode}
                          className={`flex items-center space-x-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                            bulkEditMode
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                          <span>{bulkEditMode ? 'Exit Bulk Edit' : 'Bulk Edit'}</span>
                        </button>
                        </div>
                      </div>
                    
                    {/* Keyboard Shortcuts */}
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="font-medium">Keyboard shortcuts:</span>
                      <kbd className="bg-white px-1.5 py-0.5 rounded text-xs mx-1">⌘+E</kbd> Edit title • 
                      <kbd className="bg-white px-1.5 py-0.5 rounded text-xs mx-1">⌘+B</kbd> Bulk add
                      </div>
                    </div>
                    
                  {/* Enhanced Bulk Edit Actions */}
                    {bulkEditMode && bulkSelectedQuestions.length > 0 && (
                    <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-blue-900">
                              Bulk Actions for {bulkSelectedQuestions.length} questions:
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => bulkUpdateQuestions({ required: true })}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors"
                            >
                            <CheckCircle className="w-3 h-3" />
                            <span>Make Required</span>
                            </button>
                            <button
                              onClick={() => bulkUpdateQuestions({ required: false })}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                            <Users className="w-3 h-3" />
                            <span>Make Optional</span>
                            </button>
                            <button
                              onClick={bulkDuplicateQuestions}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
                            >
                            <Copy className="w-3 h-3" />
                            <span>Duplicate</span>
                            </button>
                            <button
                              onClick={bulkDeleteQuestions}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Instructions */}
                  <div className="px-6 mb-4">
                    <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      {bulkEditMode 
                        ? 'Select questions to perform bulk operations • Click checkboxes to select multiple questions'
                        : 'Click to edit • Double-click title to edit inline • Use advanced edit for comprehensive customization'
                      }
                    </p>
                  </div>

                  {/* Enhanced Questions Content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="space-y-4">

                    {/* Enhanced Question Cards */}
                    {survey?.questions && survey.questions.length > 0 ? (
                      <div className="space-y-4">
                        {survey.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className={`rounded-xl border-2 transition-all duration-200 ${
                              bulkEditMode ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              selectedQuestion === question.id
                                ? 'bg-blue-50 border-blue-300 shadow-lg'
                                : bulkSelectedQuestions.includes(question.id)
                                ? 'bg-green-50 border-green-300 shadow-md'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                            onClick={() => {
                              if (bulkEditMode) {
                                toggleQuestionSelection(question.id);
                              } else {
                                setSelectedQuestion(question.id);
                              }
                            }}
                          >
                            <div className="p-5">
                              <div className="flex items-start space-x-4">
                                {/* Bulk selection checkbox */}
                                {bulkEditMode && (
                                  <div className="pt-1">
                                  <input
                                    type="checkbox"
                                    checked={bulkSelectedQuestions.includes(question.id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleQuestionSelection(question.id);
                                    }}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  </div>
                                )}
                                
                                {/* Question number with drag handle */}
                                <div className="flex items-center space-x-2">
                                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    selectedQuestion === question.id
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {index + 1}
                                  </span>
                                  {!bulkEditMode && (
                                    <div className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                                      <Move className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  {editingQuestionTitle === question.id ? (
                                    <div className="mb-3">
                                      <input
                                        type="text"
                                        value={tempQuestionTitle}
                                        onChange={(e) => setTempQuestionTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            saveQuestionTitleEdit(question.id);
                                          } else if (e.key === 'Escape') {
                                            cancelQuestionTitleEdit();
                                          }
                                        }}
                                        onBlur={() => saveQuestionTitleEdit(question.id)}
                                        className="w-full px-3 py-2 text-base font-medium bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                        placeholder="Enter question title..."
                                      />
                                    </div>
                                  ) : (
                                    <h3 
                                      className={`font-semibold text-base mb-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors ${
                                        selectedQuestion === question.id
                                          ? 'text-blue-900'
                                          : 'text-gray-900'
                                      }`}
                                      onDoubleClick={() => startEditingQuestionTitle(question.id, question.title)}
                                      title="Double-click to edit title"
                                    >
                                      {question.title || `Untitled ${question.type} question`}
                                    </h3>
                                  )}
                                  
                                  {/* Enhanced Tags */}
                                  <div className="flex items-center space-x-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      selectedQuestion === question.id
                                        ? 'bg-blue-200 text-blue-800'
                                        : 'bg-blue-100 text-blue-600'
                                    }`}>
                                      {question.type}
                                    </span>
                                    {question.required && (
                                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                        Required
                                      </span>
                                    )}
                                    {selectedQuestion === question.id && (
                                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                        Editing
                                      </span>
                                    )}
                                    {getQuestionValidationErrors(question.id).length > 0 && (
                                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium flex items-center space-x-1">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{getQuestionValidationErrors(question.id).length} error{getQuestionValidationErrors(question.id).length > 1 ? 's' : ''}</span>
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Enhanced Validation Errors Display */}
                                  {getQuestionValidationErrors(question.id).length > 0 && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="font-medium text-red-800 mb-2 text-sm">Validation Errors:</div>
                                      <ul className="text-red-700 space-y-1 text-sm">
                                        {getQuestionValidationErrors(question.id).map((error, index) => (
                                          <li key={index} className="flex items-center space-x-2">
                                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                            <span>{error}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {/* Enhanced Action Buttons */}
                                  {!bulkEditMode && (
                                    <div className="mt-4 flex items-center space-x-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedQuestion(question.id);
                                        }}
                                        className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                          selectedQuestion === question.id
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>{selectedQuestion === question.id ? 'Currently Editing' : 'Edit Question'}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          duplicateQuestion(question.id);
                                        }}
                                        className="flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Duplicate</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteQuestion(question.id);
                                        }}
                                        className="flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                  
                                  {/* Enhanced Bulk edit mode indicators */}
                                  {bulkEditMode && bulkSelectedQuestions.includes(question.id) && (
                                    <div className="mt-3">
                                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        Selected for bulk operation
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No questions found. Start by adding your first question.</p>
                      </div>
                    )}
                  </div>

                  {(!survey?.questions || survey.questions.length === 0) && (
                    <div className="text-center py-16">
                      <div className="mb-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Create Your First Question
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Choose from 25+ professional question types to build engaging surveys
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={() => setSidebarView('library')}
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Add Your First Question</span>
                        </button>
                        
                      </div>
                    </div>
                  )}
                    </div>
                </div>
              )}

              {viewMode === 'preview' && (
                <div className="h-full">
                  <ProfessionalPreview survey={survey} />
                </div>
              )}

              {viewMode === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Survey Settings</h2>
                  {/* Settings content */}
                  <div className="text-gray-600">
                    Advanced survey settings panel coming soon...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expanded Modern Question Editor */}
          <div className="col-span-4">
            {selectedQuestion ? (
              <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 h-full flex flex-col">
                {/* Modern Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Question Editor</h3>
                        <p className="text-indigo-100 text-sm font-medium">Customize your question with advanced options</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="Close editor"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Modern Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <ModernQuestionEditor
                    question={survey.questions.find(q => q.id === selectedQuestion) || null}
                    onUpdate={(updates) => updateQuestion(selectedQuestion, updates)}
                    onClose={() => setSelectedQuestion(null)}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Edit3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    Select a Question
                  </h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-md mx-auto mb-6">
                    Click on any question from the list to edit its content, options, validation rules, and display settings
                  </p>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg max-w-lg mx-auto">
                    <div className="text-sm text-gray-600 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md"></div>
                        <span className="font-medium">Edit question text and options</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-md"></div>
                        <span className="font-medium">Configure validation rules</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-md"></div>
                        <span className="font-medium">Set display preferences</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-md"></div>
                        <span className="font-medium">Advanced customization options</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <ProfessionalPreview
          survey={survey}
          onClose={() => setShowPreview(false)}
          fullscreen={true}
        />
      )}

      {/* Share Modal */}
      {survey.status === 'published' && (
        <SurveyShareModal
          survey={survey}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      {/* Advanced Question Type Selector */}
      {showQuestionTypeSelector && (
        <AdvancedQuestionTypeSelector
          onSelectType={handleSelectQuestionType}
          onClose={() => setShowQuestionTypeSelector(false)}
          userPlan={userProfile?.plan || user?.plan || 'free'}
          userRole={userProfile?.role || 'user'}
        />
      )}

      {/* Question Library */}
      {showQuestionLibrary && (
        <QuestionLibrary
          onSelectQuestion={handleSelectFromLibrary}
          onClose={() => {
            setShowQuestionLibrary(false);
            setQuestionToSave(null);
          }}
          showSaveOption={!!questionToSave}
          questionToSave={questionToSave}
        />
      )}

      {/* Template Selector */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onEditTemplate={(template) => {
            // Navigate to template editor
            navigate(`/app/template-editor/${template.id}`);
          }}
          onClose={() => setShowTemplateSelector(false)}
          allowEdit={true}
          showCreateOption={true}
        />
      )}

      {/* Comprehensive Question Editor */}
      {showComprehensiveEditor && editingQuestionId && (
        <ComprehensiveQuestionEditor
          question={survey.questions.find(q => q.id === editingQuestionId)}
          onSave={handleSaveEditedQuestion}
          onClose={() => {
            setShowComprehensiveEditor(false);
            setEditingQuestionId(null);
          }}
          onDelete={(questionId) => {
            deleteQuestion(questionId);
            setShowComprehensiveEditor(false);
            setEditingQuestionId(null);
          }}
          onDuplicate={(question) => {
            duplicateQuestion(question.id);
            setShowComprehensiveEditor(false);
            setEditingQuestionId(null);
          }}
          isNew={false}
        />
      )}

      {/* Database Setup Guide */}
      {showDatabaseSetupGuide && (
        <DatabaseSetupGuide
          onClose={() => setShowDatabaseSetupGuide(false)}
        />
      )}

      {/* Bulk Question Adder */}
      <BulkQuestionAdder
        isOpen={showBulkAdder}
        onClose={() => setShowBulkAdder(false)}
        onAddQuestions={handleBulkAddQuestions}
      />

      {/* Enhanced Floating Action Button for Quick Question Addition */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          <button
            onClick={() => setShowQuestionTypeSelector(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-105"
          >
            <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          {/* Enhanced Quick Action Menu */}
          <div className="absolute bottom-20 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 space-y-2 min-w-40">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Add</div>
              
              <button
                onClick={() => addQuestion('text')}
                className="w-full flex items-center space-x-3 p-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
                <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Text</div>
                  <div className="text-xs text-gray-500">Short answer</div>
                </div>
              </button>
              
              <button
                onClick={() => addQuestion('multiple_choice')}
                className="w-full flex items-center space-x-3 p-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors">
                <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Choice</div>
                  <div className="text-xs text-gray-500">Multiple options</div>
                </div>
              </button>
              
              <button
                onClick={() => addQuestion('rating')}
                className="w-full flex items-center space-x-3 p-3 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover/item:bg-yellow-200 transition-colors">
                <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Rating</div>
                  <div className="text-xs text-gray-500">Scale rating</div>
                </div>
              </button>
              
              <button
                onClick={() => addQuestion('emoji_scale')}
                className="w-full flex items-center space-x-3 p-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors">
                <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Emoji</div>
                  <div className="text-xs text-gray-500">Emoji scale</div>
                </div>
              </button>
              
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={() => setShowQuestionTypeSelector(true)}
                  className="w-full flex items-center space-x-3 p-3 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/item"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
                  <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">All Types</div>
                    <div className="text-xs text-blue-500">25+ question types</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Question Card Component
const ProfessionalQuestionCard = ({ 
  question, 
  index, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onSave,
  onAdvancedEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(question.title);
  const questionTypeInfo = getQuestionType(question.type);

  const handleSaveTitle = () => {
    onUpdate(question.id, { title: editTitle || 'Untitled Question' });
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-start space-x-3">
        {/* Question Number */}
        <div className="mt-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </span>
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded border">
              {index + 1}
            </span>
            {questionTypeInfo?.icon && (
              <div className="text-blue-600">
                {questionTypeInfo.icon}
              </div>
            )}
            <span className="text-sm font-medium text-blue-600">
              {questionTypeInfo?.name || question.type}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="w-full text-lg font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter question title..."
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveTitle}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => setIsEditing(true)} className="cursor-text">
              <h4 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {question.title || 'Click to add question title...'}
              </h4>
              {question.description && (
                <p className="text-sm text-gray-600 mt-1">{question.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          {onAdvancedEdit && (
            <button
              onClick={() => onAdvancedEdit(question)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
              title="Advanced Edit"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          {onSave && (
            <button
              onClick={() => onSave(question)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Save to Library"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Duplicate Question"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
};

export default ProfessionalSurveyBuilder;
