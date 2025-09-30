import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Star,
  Search,
  Filter,
  Plus,
  Copy,
  Edit3,
  Trash2,
  Save,
  Heart,
  Tag,
  Clock,
  Users,
  Eye,
  MoreVertical,
  Bookmark,
  BookmarkPlus,
  Grid,
  List as ListIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getQuestionType } from '../utils/questionTypes';
import api from '../services/api';
import toast from 'react-hot-toast';

const QuestionLibrary = ({ onSelectQuestion, onClose, showSaveOption = false, questionToSave = null }) => {
  const { user } = useAuth();
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveData, setSaveData] = useState({
    name: '',
    description: '',
    tags: [],
    category: 'general',
    isPublic: false
  });

  const categories = [
    { id: 'all', name: 'All Questions', count: 0 },
    { id: 'general', name: 'General', count: 0 },
    { id: 'customer', name: 'Customer Feedback', count: 0 },
    { id: 'employee', name: 'Employee Survey', count: 0 },
    { id: 'product', name: 'Product Research', count: 0 },
    { id: 'event', name: 'Event Feedback', count: 0 },
    { id: 'education', name: 'Education', count: 0 },
    { id: 'healthcare', name: 'Healthcare', count: 0 },
    { id: 'favorites', name: 'Favorites', count: 0 }
  ];

  const sortOptions = [
    { id: 'recent', name: 'Recently Added', icon: <Clock className="w-4 h-4" /> },
    { id: 'popular', name: 'Most Used', icon: <Star className="w-4 h-4" /> },
    { id: 'name', name: 'Name A-Z', icon: <SortAsc className="w-4 h-4" /> },
    { id: 'type', name: 'Question Type', icon: <Filter className="w-4 h-4" /> }
  ];

  useEffect(() => {
    loadSavedQuestions();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (questionToSave && showSaveOption) {
      setSaveData(prev => ({
        ...prev,
        name: questionToSave.title || 'Untitled Question',
        description: questionToSave.description || ''
      }));
      setShowSaveModal(true);
    }
  }, [questionToSave, showSaveOption]);

  const loadSavedQuestions = async () => {
    try {
      setLoading(true);
      
      // Load saved questions from API
      const { questions, error } = await api.questions.getSavedQuestions(user.id, {
        category: selectedCategory === 'favorites' ? null : selectedCategory,
        search: searchTerm
      });

      if (error) {
        throw new Error(error);
      }

      // Transform API response to match component expectations
      const transformedQuestions = questions.map(q => ({
        id: q.id,
        name: q.name,
        type: q.question_data.type,
        title: q.question_data.title,
        description: q.question_data.description || q.description,
        settings: q.question_data.settings || {},
        category: q.category,
        tags: q.tags || [],
        usageCount: q.usage_count || 0,
        createdAt: new Date(q.created_at),
        isPublic: q.is_public,
        author: q.user_id === user.id ? user.email : 'Shared'
      }));
      
      setSavedQuestions(transformedQuestions);
    } catch (error) {
      console.error('Failed to load saved questions:', error);
      toast.error('Failed to load question library');
      
      // Fallback to empty array
      setSavedQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('questionFavorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('questionFavorites', JSON.stringify([...newFavorites]));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (questionId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(questionId)) {
      newFavorites.delete(questionId);
    } else {
      newFavorites.add(questionId);
    }
    saveFavorites(newFavorites);
  };

  const handleSaveQuestion = async () => {
    try {
      const questionData = {
        name: saveData.name,
        description: saveData.description,
        category: saveData.category,
        tags: saveData.tags,
        isPublic: saveData.isPublic,
        type: questionToSave.type,
        title: questionToSave.title,
        settings: questionToSave.settings || {},
        required: questionToSave.required || false
      };

      const { question, error } = await api.questions.saveQuestion(user.id, questionData);
      
      if (error) {
        throw new Error(error);
      }

      // Add to local state
      const newQuestion = {
        id: question.id,
        name: question.name,
        type: question.question_data.type,
        title: question.question_data.title,
        description: question.description,
        settings: question.question_data.settings || {},
        category: question.category,
        tags: question.tags || [],
        usageCount: 0,
        createdAt: new Date(question.created_at),
        isPublic: question.is_public,
        author: user.email
      };

      setSavedQuestions(prev => [newQuestion, ...prev]);
      setShowSaveModal(false);
      toast.success('Question saved to library!');
      
      // Reset save data
      setSaveData({
        name: '',
        description: '',
        tags: [],
        category: 'general',
        isPublic: false
      });
    } catch (error) {
      console.error('Failed to save question:', error);
      toast.error('Failed to save question');
    }
  };

  const handleUseQuestion = async (question) => {
    try {
      // Increment usage count in database
      await api.questions.incrementUsage(question.id);
      
      const questionCopy = {
        ...question,
        id: `q_${Date.now()}`,
        usageCount: question.usageCount + 1
      };
      
      onSelectQuestion(questionCopy);
      toast.success('Question added to survey!');
      
      // Update local state
      setSavedQuestions(prev => 
        prev.map(q => q.id === question.id 
          ? { ...q, usageCount: q.usageCount + 1 }
          : q
        )
      );
    } catch (error) {
      console.error('Failed to update question usage:', error);
      // Still allow the question to be used even if usage tracking fails
      const questionCopy = {
        ...question,
        id: `q_${Date.now()}`
      };
      onSelectQuestion(questionCopy);
      toast.success('Question added to survey!');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const { success, error } = await api.questions.deleteQuestion(questionId, user.id);
      
      if (error) {
        throw new Error(error);
      }

      setSavedQuestions(prev => prev.filter(q => q.id !== questionId));
      toast.success('Question deleted from library');
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('Failed to delete question');
    }
  };

  const filteredQuestions = savedQuestions
    .filter(question => {
      const matchesSearch = question.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
                             selectedCategory === 'favorites' && favorites.has(question.id) ||
                             question.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getQuestionTypeInfo = (type) => {
    return getQuestionType(type) || { name: type, icon: <Tag className="w-4 h-4" /> };
  };

  const renderQuestionCard = (question) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{question.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{question.title}</p>
        </div>
        
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => toggleFavorite(question.id)}
            className={`p-1 rounded transition-colors ${
              favorites.has(question.id)
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(question.id) ? 'fill-current' : ''}`} />
          </button>
          
          <div className="relative group">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="w-4 h-4" />
            </button>
            
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleUseQuestion(question)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                Use Question
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(question, null, 2))}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Copy JSON
              </button>
              {question.author === user?.email && (
                <>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          {getQuestionTypeInfo(question.type).icon}
          <span className="text-xs font-medium text-gray-600 capitalize">
            {question.type.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span>{question.usageCount} uses</span>
        </div>

        {question.isPublic && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Eye className="w-3 h-3" />
            <span>Public</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {question.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {tag}
          </span>
        ))}
        {question.tags.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            +{question.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>by {question.author}</span>
        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
      </div>

      <button
        onClick={() => handleUseQuestion(question)}
        className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium opacity-0 group-hover:opacity-100"
      >
        Use This Question
      </button>
    </motion.div>
  );

  const renderQuestionRow = (question) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getQuestionTypeInfo(question.type).icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{question.name}</h3>
            <p className="text-sm text-gray-600 truncate">{question.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500 capitalize">{question.type.replace('_', ' ')}</span>
              <span className="text-xs text-gray-500">{question.usageCount} uses</span>
              <span className="text-xs text-gray-500">{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(question.id)}
            className={`p-2 rounded transition-colors ${
              favorites.has(question.id)
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(question.id) ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => handleUseQuestion(question)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Use
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Question Library</h2>
              <p className="text-sm text-gray-500">Save and reuse your favorite questions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showSaveOption && questionToSave && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save Question
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs opacity-60">
                      {category.id === 'all' 
                        ? savedQuestions.length
                        : category.id === 'favorites'
                        ? favorites.size
                        : savedQuestions.filter(q => q.category === category.id).length
                      }
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Sort By</h3>
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${
                      sortBy === option.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedCategory === 'all' ? 'All Questions' : 
                     selectedCategory === 'favorites' ? 'Favorite Questions' :
                     categories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Questions Grid/List */}
              {loading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600">Loading question library...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start building your question library'}
                  </p>
                  {showSaveOption && questionToSave && (
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      Save Current Question
                    </button>
                  )}
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-3'
                }>
                  {filteredQuestions.map(question => 
                    viewMode === 'grid' 
                      ? renderQuestionCard(question)
                      : renderQuestionRow(question)
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Question Modal */}
        <AnimatePresence>
          {showSaveModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Question to Library</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Name</label>
                    <input
                      type="text"
                      value={saveData.name}
                      onChange={(e) => setSaveData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Give your question a memorable name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={saveData.description}
                      onChange={(e) => setSaveData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                      placeholder="Describe when to use this question"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={saveData.category}
                      onChange={(e) => setSaveData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.filter(c => c.id !== 'all' && c.id !== 'favorites').map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={saveData.isPublic}
                      onChange={(e) => setSaveData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm text-gray-700">Make this question public for others to use</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveQuestion}
                    disabled={!saveData.name.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Save Question
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QuestionLibrary;
