import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  BarChart3,
  Smile,
  List,
  Type,
  Copy,
  GripVertical,
  Image
} from 'lucide-react';
import { motion } from 'framer-motion';

const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const fetchTemplate = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/templates/${id}`);
      setTemplate(response.data);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template');
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id, fetchTemplate]);

  const saveTemplate = async () => {
    try {
      setSaving(true);
      const templateData = {
        title: template.title,
        description: template.description,
        questions: questions.map((q, index) => ({ ...q, order_index: index }))
      };

      await axios.put(`/api/templates/${id}`, templateData);
      toast.success('Template updated successfully!');
      navigate('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const duplicateTemplate = async () => {
    try {
      setSaving(true);
      await axios.post(`/api/templates/${id}/duplicate`, {
        title: `${template.title} (Copy)`,
        description: template.description
      });
      toast.success('Template duplicated successfully');
      navigate(`/templates`);
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      setSaving(true);
      await axios.delete(`/api/templates/${id}`);
      toast.success('Template deleted successfully');
      navigate('/templates');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      text: '',
      description: '',
      required: false,
      options: type === 'emoji_scale' ? [
        { emoji: '😠', label: 'Very Unsatisfied', value: 1 },
        { emoji: '😞', label: 'Unsatisfied', value: 2 },
        { emoji: '😐', label: 'Neutral', value: 3 },
        { emoji: '🙂', label: 'Satisfied', value: 4 },
        { emoji: '🥰', label: 'Very Satisfied', value: 5 }
      ] : [],
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
      text: `${question.text} (Copy)`
    };
    setQuestions([...questions, duplicated]);
  };

  const renderQuestionEditor = (question) => {
    switch (question.type) {
      case 'emoji_scale':
        return <EmojiScaleEditor question={question} updateQuestion={updateQuestion} />;
      case 'multiple_choice':
        return <MultipleChoiceEditor question={question} updateQuestion={updateQuestion} />;
      case 'text':
        return <TextEditor question={question} updateQuestion={updateQuestion} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Template not found</h3>
          <p className="text-gray-600 mb-4">The template you're looking for doesn't exist.</p>
          <Link to="/templates" className="btn-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link to="/templates" className="btn-secondary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Templates
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
                <p className="text-gray-600 mt-1">Modify your survey template</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={duplicateTemplate}
                disabled={saving}
                className="btn-secondary"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </button>
              <button
                onClick={deleteTemplate}
                disabled={saving}
                className="btn-danger"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
              <button
                onClick={saveTemplate}
                disabled={saving}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Title
                </label>
                <input
                  type="text"
                  value={template.title || ''}
                  onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter template title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={template.description || ''}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter template description"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Questions Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Template Questions</h2>
              <button
                onClick={() => setShowQuestionModal(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </button>
            </div>
          </div>

          <div className="p-6">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">Add your first question to get started</p>
                <button
                  onClick={() => setShowQuestionModal(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.required 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {question.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => duplicateQuestion(question)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="p-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {renderQuestionEditor(question)}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Question</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addQuestion('emoji_scale')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Smile className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Emoji Scale</span>
                </button>
                <button
                  onClick={() => addQuestion('multiple_choice')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <List className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Multiple Choice</span>
                </button>
                <button
                  onClick={() => addQuestion('text')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Type className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Text Input</span>
                </button>
                <button
                  onClick={() => addQuestion('image')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Image className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium">Image Upload</span>
                </button>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="mt-4 w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Question Editor Components
const EmojiScaleEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <input
          type="text"
          value={question.text || ''}
          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter your question"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={question.required || false}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">Required question</label>
      </div>
    </div>
  );
};

const MultipleChoiceEditor = ({ question, updateQuestion }) => {
  const addOption = () => {
    const newOptions = [...(question.options || []), { label: '', value: '' }];
    updateQuestion(question.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: newOptions });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <input
          type="text"
          value={question.text || ''}
          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter your question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <div className="space-y-2">
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option.label || ''}
                onChange={(e) => updateOption(index, 'label', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Option text"
              />
              <input
                type="text"
                value={option.value || ''}
                onChange={(e) => updateOption(index, 'value', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Option value"
              />
              <button
                onClick={() => removeOption(index)}
                className="p-2 text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="btn-secondary text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={question.required || false}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">Required question</label>
      </div>
    </div>
  );
};

const TextEditor = ({ question, updateQuestion }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <input
          type="text"
          value={question.text || ''}
          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter your question"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={question.required || false}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">Required question</label>
      </div>
    </div>
  );
};

export default TemplateEditor; 