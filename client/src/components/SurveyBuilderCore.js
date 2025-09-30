import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getQuestionType, getDefaultQuestionSettings } from '../utils/questionTypes';
import toast from 'react-hot-toast';
import { InlineSpinner } from './LoadingSpinner';
import InlineQuestionEditor from './InlineQuestionEditor';
import SurveyBuilderToolbar from './SurveyBuilderToolbar';
import KeyboardShortcuts, { KeyboardShortcutsHelp } from './KeyboardShortcuts';
import {
  Save,
  Eye,
  Loader2,
  Search,
  Wand2,
  Play,
  X,
  Settings
} from 'lucide-react';

// Lazy load heavy components
const QuestionTypeSelector = React.lazy(() => import('./QuestionTypeSelector'));
const QuestionEditor = React.lazy(() => import('./QuestionEditor'));
const QuickPreview = React.lazy(() => import('./QuickPreview'));
const SurveyPreview = React.lazy(() => import('./SurveyPreview'));
const AIAssistant = React.lazy(() => import('./AIAssistant'));

const SurveyBuilderCore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [survey, setSurvey] = useState({
    title: 'Untitled Survey',
    description: '',
    questions: [],
    settings: {
      allowAnonymous: true,
      collectEmail: false,
      showProgress: true,
      randomizeQuestions: false,
      requireAll: false
    }
  });
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Memoized filtered questions for search
  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return survey.questions;
    return survey.questions.filter(q => 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [survey.questions, searchTerm]);

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
        questions: data.questions || []
      });
    } catch (error) {
      console.error('Error loading survey:', error);
      toast.error('Failed to load survey');
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  const saveSurvey = async () => {
    setSaving(true);
    try {
      const surveyData = {
        ...survey,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('surveys')
          .update(surveyData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('surveys')
          .insert([surveyData])
          .select()
          .single();
        
        if (error) throw error;
        navigate(`/app/builder/${data.id}`, { replace: true });
      }

      toast.success('Survey saved successfully');
    } catch (error) {
      console.error('Error saving survey:', error);
      toast.error('Failed to save survey');
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type) => {
    const questionTypeInfo = getQuestionType(type);
    const defaultSettings = getDefaultQuestionSettings(type);
    
    const newQuestion = {
      id: Date.now().toString(),
      type,
      title: `New ${questionTypeInfo?.name || type.charAt(0).toUpperCase() + type.slice(1)} Question`,
      description: '',
      required: false,
      ...defaultSettings // Apply default settings for the question type
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setActiveQuestion(newQuestion.id);
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
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    
    if (activeQuestion === questionId) {
      setActiveQuestion(null);
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(survey.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSurvey(prev => ({
      ...prev,
      questions: items
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InlineSpinner size="large" />
        <span className="ml-3 text-lg">Loading survey builder...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={survey.title}
                onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
                placeholder="Survey Title"
              />
              <span className="text-sm text-gray-500">
                {survey.questions.length} questions
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQuickPreview(true)}
                  className="btn-secondary"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Quick Preview
                </button>
                
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-secondary"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Full Preview
                </button>
              </div>
              
              <button
                onClick={() => setShowAI(true)}
                className="btn-secondary"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                AI Assistant
              </button>
              
              <button
                onClick={saveSurvey}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Layout */}
        <div className="block xl:hidden">
          <div className="space-y-6">
            {/* Question Types Sidebar - Mobile */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Questions</h3>
                <div className="text-sm text-gray-500">
                  {survey.questions.length} questions
                </div>
              </div>
              <React.Suspense fallback={<InlineSpinner />}>
                <QuestionTypeSelector onAddQuestion={addQuestion} />
              </React.Suspense>
            </div>

            {/* Questions List - Mobile */}
            <div className="space-y-4">
              {/* Survey Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Survey Overview</h3>
                    <p className="text-sm text-gray-600">
                      {survey.questions.length} questions • Estimated time: {Math.ceil(survey.questions.length * 0.5)} minutes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowQuickPreview(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Test</span>
                    </button>
                  </div>
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {filteredQuestions.map((question, index) => (
                        <Draggable key={question.id} draggableId={question.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-all ${
                                snapshot.isDragging ? 'shadow-lg scale-105' : ''
                              }`}
                            >
                              <InlineQuestionEditor
                                question={question}
                                index={index}
                                onUpdate={updateQuestion}
                                onDelete={deleteQuestion}
                                onDuplicate={duplicateQuestion}
                                isActive={activeQuestion === question.id}
                                onSetActive={setActiveQuestion}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    {searchTerm ? 'No questions match your search' : 'No questions yet'}
                  </div>
                  {!searchTerm && (
                    <p className="text-sm text-gray-500">
                      Add your first question using the panel above
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Question Editor - Mobile Modal */}
            {activeQuestion && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 question-editor-mobile-modal">
                <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Edit Question</h3>
                      <p className="text-sm text-gray-500">Customize your question settings</p>
                    </div>
                    <button
                      onClick={() => setActiveQuestion(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(90vh-5rem)] question-editor-mobile-content">
                    <React.Suspense fallback={<InlineSpinner />}>
                      <QuestionEditor
                        question={survey.questions.find(q => q.id === activeQuestion)}
                        onUpdate={(updates) => updateQuestion(activeQuestion, updates)}
                        onClose={() => setActiveQuestion(null)}
                      />
                    </React.Suspense>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden xl:grid xl:grid-cols-12 gap-8">
          {/* Question Types Sidebar */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 question-types-sidebar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Questions</h3>
                <div className="text-sm text-gray-500">
                  {survey.questions.length} total
                </div>
              </div>
              <React.Suspense fallback={<InlineSpinner />}>
                <QuestionTypeSelector onAddQuestion={addQuestion} />
              </React.Suspense>
            </div>
          </div>

          {/* Questions List */}
          <div className="xl:col-span-7">
            <div className="space-y-4">
              {/* Survey Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Survey Overview</h3>
                    <p className="text-sm text-gray-600">
                      {survey.questions.length} questions • Estimated time: {Math.ceil(survey.questions.length * 0.5)} minutes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowQuickPreview(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Test Survey</span>
                    </button>
                  </div>
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {filteredQuestions.map((question, index) => (
                        <Draggable key={question.id} draggableId={question.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-all ${
                                snapshot.isDragging ? 'shadow-lg scale-105' : ''
                              }`}
                            >
                              <InlineQuestionEditor
                                question={question}
                                index={index}
                                onUpdate={updateQuestion}
                                onDelete={deleteQuestion}
                                onDuplicate={duplicateQuestion}
                                isActive={activeQuestion === question.id}
                                onSetActive={setActiveQuestion}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    {searchTerm ? 'No questions match your search' : 'No questions yet'}
                  </div>
                  {!searchTerm && (
                    <p className="text-sm text-gray-500">
                      Add your first question using the panel on the left
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Question Editor - Wider sidebar */}
          <div className="xl:col-span-3">
            {activeQuestion ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24 h-[calc(100vh-8rem)] overflow-hidden">
                <React.Suspense fallback={<InlineSpinner />}>
                  <QuestionEditor
                    question={survey.questions.find(q => q.id === activeQuestion)}
                    onUpdate={(updates) => updateQuestion(activeQuestion, updates)}
                    onClose={() => setActiveQuestion(null)}
                  />
                </React.Suspense>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24 h-[calc(100vh-8rem)] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Question Editor</h3>
                  <p className="text-gray-500 text-sm">
                    Select a question to edit its properties and settings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQuickPreview && (
        <React.Suspense fallback={<InlineSpinner />}>
          <QuickPreview
            survey={survey}
            onClose={() => setShowQuickPreview(false)}
            onEdit={() => {
              setShowQuickPreview(false);
              // Focus on adding questions if none exist
              if (survey.questions.length === 0) {
                document.querySelector('.question-types-sidebar')?.scrollIntoView();
              }
            }}
          />
        </React.Suspense>
      )}

      {showPreview && (
        <React.Suspense fallback={<InlineSpinner />}>
          <SurveyPreview
            survey={survey}
            onClose={() => setShowPreview(false)}
          />
        </React.Suspense>
      )}
      
      {showAI && (
        <React.Suspense fallback={<InlineSpinner />}>
          <AIAssistant
            survey={survey}
            onAddQuestion={addQuestion}
            onClose={() => setShowAI(false)}
          />
        </React.Suspense>
      )}

      {/* Advanced Question Editor */}
      {activeQuestion && showAdvancedSettings && (
        <React.Suspense fallback={<InlineSpinner />}>
          <QuestionEditor
            question={survey.questions.find(q => q.id === activeQuestion)}
            onUpdate={(updates) => updateQuestion(activeQuestion, updates)}
            onClose={() => {
              setShowAdvancedSettings(false);
              setActiveQuestion(null);
            }}
          />
        </React.Suspense>
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onSave={saveSurvey}
        onPreview={() => setShowPreview(true)}
        onQuickPreview={() => setShowQuickPreview(true)}
        onAddQuestion={addQuestion}
        onDeleteQuestion={deleteQuestion}
        onDuplicateQuestion={duplicateQuestion}
        activeQuestionId={activeQuestion}
      />

      {/* Keyboard Shortcuts Help */}
      {showKeyboardHelp && (
        <KeyboardShortcutsHelp onClose={() => setShowKeyboardHelp(false)} />
      )}

      {/* Floating Toolbar */}
      <SurveyBuilderToolbar
        survey={survey}
        onSave={saveSurvey}
        onPreview={() => setShowPreview(true)}
        onQuickPreview={() => setShowQuickPreview(true)}
        onShowAI={() => setShowAI(true)}
        onShowSettings={() => setShowAdvancedSettings(true)}
        saving={saving}
        lastSaved={survey.updated_at}
      />
    </div>
  );
};

export default SurveyBuilderCore;
