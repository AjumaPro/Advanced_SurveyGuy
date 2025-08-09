import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Plus,
  Save,
  Eye,
  Trash2,
  Copy,
  GripVertical,
  Smile,
  List,
  Type,
  BarChart3,
  Upload,
  CheckSquare,
  ChevronDown,
  Star,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  Hash,
  PenTool,
  Grid,
  Table,
  FileText
} from 'lucide-react';
import QuestionUpload from '../components/QuestionUpload';
import EmojiScale, { emojiScaleTemplates } from '../components/EmojiScale';

const SurveyBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    status: 'draft'
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchSurvey = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/surveys/${id}`);
      console.log('Survey fetched:', response.data);
      console.log('Questions loaded:', response.data.questions?.length || 0);
      setSurvey(response.data);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching survey:', error);
      toast.error('Failed to load survey');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSurvey();
    }
  }, [id, fetchSurvey]);

  // Debug effect to log questions changes
  useEffect(() => {
    console.log('Questions updated:', questions.length, 'questions');
    if (questions.length > 0) {
      console.log('First question:', questions[0]);
    }
  }, [questions]);

  const saveSurvey = async () => {
    try {
      setLoading(true);
      const surveyData = {
        ...survey,
        questions: questions.map((q, index) => ({ ...q, order_index: index }))
      };

      if (id) {
        await axios.put(`/api/surveys/${id}`, surveyData);
        toast.success('Survey updated successfully');
      } else {
        const response = await axios.post('/api/surveys', surveyData);
        toast.success('Survey created successfully');
        navigate(`/builder/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error saving survey:', error);
      toast.error('Failed to save survey');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      title: '',
      description: '',
      required: false,
      options: type === 'emoji_scale' ? emojiScaleTemplates.satisfaction : [],
      settings: {}
    };

    setQuestions([...questions, newQuestion]);
    setShowQuestionModal(false);
  };

  const updateQuestion = (questionId, updates) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const duplicateQuestion = (question) => {
    const duplicated = {
      ...question,
      id: Date.now(),
      title: `${question.title} (Copy)`
    };
    setQuestions([...questions, duplicated]);
  };

  const handleQuestionsUploaded = (uploadedQuestions) => {
    const questionsWithIds = uploadedQuestions.map((q, index) => ({
      ...q,
      id: Date.now() + index,
      order_index: questions.length + index
    }));
    setQuestions([...questions, ...questionsWithIds]);
  };

  const questionTypes = [
    { type: 'short_answer', label: 'Short Answer', icon: Type, color: 'text-blue-600' },
    { type: 'paragraph', label: 'Paragraph', icon: FileText, color: 'text-green-600' },
    { type: 'multiple_choice', label: 'Multiple Choice', icon: List, color: 'text-purple-600' },
    { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, color: 'text-orange-600' },
    { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, color: 'text-indigo-600' },
    { type: 'linear_scale', label: 'Linear Scale', icon: BarChart3, color: 'text-red-600' },
    { type: 'emoji_scale', label: 'Emoji Scale', icon: Smile, color: 'text-yellow-600' },
    { type: 'rating', label: 'Rating', icon: Star, color: 'text-pink-600' },
    { type: 'date', label: 'Date', icon: Calendar, color: 'text-teal-600' },
    { type: 'time', label: 'Time', icon: Clock, color: 'text-cyan-600' },
    { type: 'phone', label: 'Phone', icon: Phone, color: 'text-emerald-600' },
    { type: 'email', label: 'Email', icon: Mail, color: 'text-blue-500' },
    { type: 'url', label: 'Website', icon: Globe, color: 'text-violet-600' },
    { type: 'number', label: 'Number', icon: Hash, color: 'text-gray-600' },
    { type: 'file_upload', label: 'File Upload', icon: Upload, color: 'text-amber-600' },
    { type: 'signature', label: 'Signature', icon: PenTool, color: 'text-rose-600' },
    { type: 'checkbox_grid', label: 'Checkbox Grid', icon: Grid, color: 'text-lime-600' },
    { type: 'multiple_choice_grid', label: 'Multiple Choice Grid', icon: Table, color: 'text-slate-600' }
  ];

  const renderQuestionEditor = (question) => {
    switch (question.type) {
      case 'short_answer':
      case 'paragraph':
      case 'text':
        return <TextEditor question={question} updateQuestion={updateQuestion} />;
      case 'multiple_choice':
      case 'checkbox':
        return <MultipleChoiceEditor question={question} updateQuestion={updateQuestion} />;
      case 'dropdown':
        return <DropdownEditor question={question} updateQuestion={updateQuestion} />;
      case 'linear_scale':
        return <LinearScaleEditor question={question} updateQuestion={updateQuestion} />;
      case 'emoji_scale':
        return <EmojiScaleEditor question={question} updateQuestion={updateQuestion} />;
      case 'rating':
        return <RatingEditor question={question} updateQuestion={updateQuestion} />;
      case 'date':
      case 'time':
      case 'phone':
      case 'email':
      case 'url':
      case 'number':
        return <BasicEditor question={question} updateQuestion={updateQuestion} />;
      case 'file_upload':
        return <FileUploadEditor question={question} updateQuestion={updateQuestion} />;
      case 'signature':
        return <SignatureEditor question={question} updateQuestion={updateQuestion} />;
      case 'checkbox_grid':
      case 'multiple_choice_grid':
        return <GridEditor question={question} updateQuestion={updateQuestion} />;
      case 'likert_scale':
        return <LikertScaleEditor question={question} updateQuestion={updateQuestion} />;
      default:
        return <div>Question type not supported</div>;
    }
  };

  const renderQuestionPreview = (question) => {
    switch (question.type) {
      case 'emoji_scale':
        return (
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">{question.title}</h4>
            <EmojiScale options={question.options} />
          </div>
        );
      case 'multiple_choice':
        return (
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">{question.title}</h4>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input type="radio" name={`question-${question.id}`} className="mr-2" />
                  <span>{typeof option === 'object' ? option.label || option.value : option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">{question.title}</h4>
            <textarea className="w-full p-2 border rounded" rows="3" placeholder="Your answer..." />
          </div>
        );
      default:
        return <div>Preview not available</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Survey' : 'Create Survey'}
          </h1>
          <p className="text-gray-600">Build your survey with our drag & drop builder</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn ${previewMode ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={saveSurvey}
            disabled={loading}
            className="btn-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Survey'}
          </button>
        </div>
      </div>

      {/* Survey Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Survey Settings</h3>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={survey.title}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
              className="input mt-1"
              placeholder="Enter survey title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={survey.description}
              onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
              className="input mt-1"
              rows="3"
              placeholder="Enter survey description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={survey.status}
              onChange={(e) => setSurvey({ ...survey, status: e.target.value })}
              className="input mt-1"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Questions</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-secondary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Questions
            </button>
            <button
              onClick={() => setShowQuestionModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </button>
          </div>
        </div>
        <div className="card-body">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600 mb-4">Add your first question to get started</p>
              <button
                onClick={() => setShowQuestionModal(true)}
                className="btn-primary"
              >
                Add Question
              </button>
            </div>
          ) : (
            <>
              {/* Questions Summary */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Survey Questions</h4>
                    <p className="text-xs text-blue-700">
                      {questions.length} question{questions.length !== 1 ? 's' : ''} loaded
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-600">
                      {questions.filter(q => q.required).length} required
                    </div>
                    <div className="text-xs text-blue-600">
                      {questions.filter(q => !q.required).length} optional
                    </div>
                  </div>
                </div>
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`card ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            <div className="card-header flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                                </div>
                                <div className="flex items-center space-x-2">
                                  {questionTypes.find(t => t.type === question.type)?.icon && 
                                    React.createElement(questionTypes.find(t => t.type === question.type).icon, {
                                      className: `h-5 w-5 ${questionTypes.find(t => t.type === question.type).color}`
                                    })
                                  }
                                  <span className="text-sm font-medium text-gray-900">
                                    Question {index + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => duplicateQuestion(question)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="card-body">
                              {previewMode ? (
                                renderQuestionPreview(question)
                              ) : (
                                renderQuestionEditor(question)
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            </>
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Question</h3>
            <div className="space-y-3">
              {questionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => addQuestion(type.type)}
                    className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <Icon className={`h-5 w-5 mr-3 ${type.color}`} />
                    <span className="text-left">{type.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Questions Modal */}
      {showUploadModal && (
        <QuestionUpload
          onQuestionsUploaded={handleQuestionsUploaded}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};

// Question Editor Components
const EmojiScaleEditor = ({ question, updateQuestion }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('satisfaction');

  const handleTemplateChange = (templateName) => {
    setSelectedTemplate(templateName);
    updateQuestion(question.id, { options: emojiScaleTemplates[templateName] });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Template</label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="input mt-1"
        >
          <option value="satisfaction">Satisfaction Scale</option>
          <option value="agreement">Agreement Scale</option>
          <option value="quality">Quality Rating</option>
          <option value="thumbs">Thumbs Up/Down</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
        <EmojiScale options={question.options} />
      </div>
    </div>
  );
};

const MultipleChoiceEditor = ({ question, updateQuestion }) => {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim()) {
      updateQuestion(question.id, {
        options: [...(question.options || []), newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Options</label>
        <div className="space-y-2">
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={typeof option === 'object' ? option.label || option.value || '' : option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = e.target.value;
                  updateQuestion(question.id, { options: newOptions });
                }}
                className="input flex-1"
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOption()}
              className="input flex-1"
              placeholder="Add new option"
            />
            <button onClick={addOption} className="btn-primary px-3 py-1">
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const TextEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

const LikertScaleEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Scale Range</label>
        <div className="flex items-center space-x-2 mt-1">
          <input
            type="number"
            value={question.settings.min || 1}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, min: parseInt(e.target.value) }
            })}
            className="input w-20"
            min="1"
            max="10"
          />
          <span>to</span>
          <input
            type="number"
            value={question.settings.max || 10}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, max: parseInt(e.target.value) }
            })}
            className="input w-20"
            min="1"
            max="10"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Basic Editor for simple question types
const BasicEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Dropdown Editor
const DropdownEditor = ({ question, updateQuestion }) => {
  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options || []).length + 1}`];
    updateQuestion(question.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
        <div className="space-y-2">
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="input flex-1"
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Linear Scale Editor
const LinearScaleEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Value</label>
          <input
            type="number"
            value={question.settings?.min || 1}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, min: parseInt(e.target.value) }
            })}
            className="input mt-1"
            min="1"
            max="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Value</label>
          <input
            type="number"
            value={question.settings?.max || 5}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, max: parseInt(e.target.value) }
            })}
            className="input mt-1"
            min="1"
            max="10"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Label (Optional)</label>
          <input
            type="text"
            value={question.settings?.minLabel || ''}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, minLabel: e.target.value }
            })}
            className="input mt-1"
            placeholder="e.g., Not satisfied"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Label (Optional)</label>
          <input
            type="text"
            value={question.settings?.maxLabel || ''}
            onChange={(e) => updateQuestion(question.id, {
              settings: { ...question.settings, maxLabel: e.target.value }
            })}
            className="input mt-1"
            placeholder="e.g., Very satisfied"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Rating Editor
const RatingEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Stars</label>
        <input
          type="number"
          value={question.settings?.max || 5}
          onChange={(e) => updateQuestion(question.id, {
            settings: { ...question.settings, max: parseInt(e.target.value) }
          })}
          className="input mt-1"
          min="1"
          max="10"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// File Upload Editor
const FileUploadEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Accepted File Types</label>
        <input
          type="text"
          value={question.settings?.accept || ''}
          onChange={(e) => updateQuestion(question.id, {
            settings: { ...question.settings, accept: e.target.value }
          })}
          className="input mt-1"
          placeholder="e.g., .pdf,.doc,.jpg,.png"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`multiple-${question.id}`}
          checked={question.settings?.multiple || false}
          onChange={(e) => updateQuestion(question.id, {
            settings: { ...question.settings, multiple: e.target.checked }
          })}
          className="mr-2"
        />
        <label htmlFor={`multiple-${question.id}`} className="text-sm text-gray-700">
          Allow multiple files
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Signature Editor
const SignatureEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

// Grid Editor
const GridEditor = ({ question, updateQuestion }) => {
  const addRow = () => {
    const newRows = [...(question.settings?.rows || []), `Row ${(question.settings?.rows || []).length + 1}`];
    updateQuestion(question.id, {
      settings: { ...question.settings, rows: newRows }
    });
  };

  const addColumn = () => {
    const newColumns = [...(question.settings?.columns || []), `Column ${(question.settings?.columns || []).length + 1}`];
    updateQuestion(question.id, {
      settings: { ...question.settings, columns: newColumns }
    });
  };

  const removeRow = (index) => {
    const newRows = question.settings?.rows?.filter((_, i) => i !== index) || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, rows: newRows }
    });
  };

  const removeColumn = (index) => {
    const newColumns = question.settings?.columns?.filter((_, i) => i !== index) || [];
    updateQuestion(question.id, {
      settings: { ...question.settings, columns: newColumns }
    });
  };

  const updateRow = (index, value) => {
    const newRows = [...(question.settings?.rows || [])];
    newRows[index] = value;
    updateQuestion(question.id, {
      settings: { ...question.settings, rows: newRows }
    });
  };

  const updateColumn = (index, value) => {
    const newColumns = [...(question.settings?.columns || [])];
    newColumns[index] = value;
    updateQuestion(question.id, {
      settings: { ...question.settings, columns: newColumns }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="input mt-1"
          placeholder="Enter question title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          value={question.description}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="input mt-1"
          rows="2"
          placeholder="Enter question description"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
          <div className="space-y-2">
            {(question.settings?.rows || []).map((row, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={row}
                  onChange={(e) => updateRow(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Row ${index + 1}`}
                />
                <button
                  onClick={() => removeRow(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addRow}
              className="btn-secondary text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
          <div className="space-y-2">
            {(question.settings?.columns || []).map((column, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={column}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Column ${index + 1}`}
                />
                <button
                  onClick={() => removeColumn(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addColumn}
              className="btn-secondary text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required question
        </label>
      </div>
    </div>
  );
};

export default SurveyBuilder; 