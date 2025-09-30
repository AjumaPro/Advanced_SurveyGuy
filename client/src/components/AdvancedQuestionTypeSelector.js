import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  FileText,
  List,
  CheckSquare,
  Star,
  Sliders,
  Calendar,
  Clock,
  Phone,
  Mail,
  Hash,
  Upload,
  BarChart3,
  Grid,
  Smile,
  MapPin,
  Globe,
  Image,
  ThumbsUp,
  Heart,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Plus,
  Zap,
  Crown,
  Sparkles,
  ChevronRight,
  BookOpen,
  Target,
  Users,
  Building,
  ShoppingCart,
  GraduationCap
} from 'lucide-react';
import { getAllQuestionTypes, getDefaultQuestionSettings } from '../utils/questionTypes';

const AdvancedQuestionTypeSelector = ({ onSelectType, onClose, userPlan = 'free', userRole = 'user' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredType, setHoveredType] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  const categories = [
    { 
      id: 'all', 
      name: 'All Types', 
      icon: <Grid className="w-4 h-4" />,
      description: 'Browse all available question types',
      color: 'bg-gray-100 text-gray-700'
    },
    { 
      id: 'Text Input', 
      name: 'Text Input', 
      icon: <Type className="w-4 h-4" />,
      description: 'Text fields and input controls',
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      id: 'Multiple Choice', 
      name: 'Choice', 
      icon: <List className="w-4 h-4" />,
      description: 'Single and multiple selection options',
      color: 'bg-green-100 text-green-700'
    },
    { 
      id: 'Rating & Scale', 
      name: 'Rating', 
      icon: <Star className="w-4 h-4" />,
      description: 'Rating scales and feedback controls',
      color: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'Date & Time', 
      name: 'Date & Time', 
      icon: <Calendar className="w-4 h-4" />,
      description: 'Date and time pickers',
      color: 'bg-purple-100 text-purple-700'
    },
    { 
      id: 'Numbers', 
      name: 'Numbers', 
      icon: <Hash className="w-4 h-4" />,
      description: 'Numeric input and calculations',
      color: 'bg-indigo-100 text-indigo-700'
    },
    { 
      id: 'Advanced', 
      name: 'Advanced', 
      icon: <Zap className="w-4 h-4" />,
      description: 'Complex question types',
      color: 'bg-orange-100 text-orange-700',
      requiresPlan: 'pro'
    },
    { 
      id: 'Interactive', 
      name: 'Interactive', 
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Interactive and engaging elements',
      color: 'bg-pink-100 text-pink-700',
      requiresPlan: 'pro'
    }
  ];

  const popularTypes = [
    'text', 'textarea', 'multiple_choice', 'rating', 'emoji_scale', 'yes_no'
  ];

  const filteredCategories = categories.filter(category => {
    // Super admins have access to all categories
    if (userRole === 'super_admin') return true;
    
    if (category.requiresPlan === 'pro' && userPlan === 'free') return false;
    if (category.requiresPlan === 'enterprise' && !['enterprise'].includes(userPlan)) return false;
    return true;
  });

  const isTypeAvailable = (type) => {
    // Super admins have access to all question types
    if (userRole === 'super_admin') return true;
    
    if (!type.planRequired) return true;
    if (type.planRequired === 'pro' && ['pro', 'enterprise'].includes(userPlan)) return true;
    if (type.planRequired === 'enterprise' && userPlan === 'enterprise') return true;
    return false;
  };

  const allQuestionTypes = getAllQuestionTypes();
  
  // Group question types by category
  const groupedTypes = allQuestionTypes.reduce((acc, type) => {
    const category = type.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        types: []
      };
    }
    acc[category].types.push(type);
    return acc;
  }, {});

  const filteredTypes = Object.values(groupedTypes)
    .filter(category => selectedCategory === 'all' || category.category === selectedCategory)
    .map(category => ({
      ...category,
      types: category.types.filter(type => {
        const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             type.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Plan-based filtering (super admins bypass this)
        if (userRole !== 'super_admin') {
          if (type.planRequired === 'pro' && userPlan === 'free') return false;
          if (type.planRequired === 'enterprise' && !['enterprise'].includes(userPlan)) return false;
        }
        
        return matchesSearch;
      })
    }))
    .filter(category => category.types.length > 0);

  const handleSelectType = (type, keepOpen = false) => {
    const defaultSettings = getDefaultQuestionSettings(type.type);
    const newQuestion = {
      id: `q_${Date.now()}`,
      type: type.type,
      title: `New ${type.name}`,
      description: '',
      required: false,
      settings: defaultSettings
    };
    
    onSelectType(newQuestion, keepOpen);
    if (!keepOpen) {
      onClose();
    }
  };

  const getPlanBadge = (requiresPlan) => {
    // Don't show plan badges for super admins since they have access to everything
    if (userRole === 'super_admin') return null;
    
    if (!requiresPlan) return null;
    
    const badges = {
      pro: { text: 'PRO', color: 'bg-blue-100 text-blue-700' },
      enterprise: { text: 'ENTERPRISE', color: 'bg-purple-100 text-purple-700' }
    };
    
    const badge = badges[requiresPlan];
    if (!badge) return null;
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const renderQuestionPreview = (type) => {
    if (!hoveredType || hoveredType.type !== type.type) return null;

    const previewComponents = {
      text: (
        <input
          type="text"
          placeholder="Enter your answer..."
          className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
          disabled
        />
      ),
      textarea: (
        <textarea
          placeholder="Enter your detailed response..."
          rows="3"
          className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 resize-none"
          disabled
        />
      ),
      multiple_choice: (
        <div className="space-y-2">
          {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
            <label key={index} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="preview" className="w-4 h-4 text-blue-600" disabled />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      ),
      checkbox: (
        <div className="space-y-2">
          {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
            <label key={index} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600" disabled />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      ),
      rating: (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="w-6 h-6 text-gray-300" />
          ))}
        </div>
      ),
      emoji_scale: (
        <div className="flex justify-between">
          {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xs text-gray-500">
                {['Poor', 'Fair', 'Good', 'Great', 'Excellent'][index]}
              </div>
            </div>
          ))}
        </div>
      ),
      slider: (
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      ),
      matrix: (
        <div className="text-center p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <Grid className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Matrix/Grid Question</p>
          <p className="text-xs text-gray-500">Multiple questions in a table format</p>
        </div>
      )
    };

    return previewComponents[type.type] || (
      <div className="text-center p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">Preview not available</p>
      </div>
    );
  };

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
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Choose Question Type</h2>
              {userRole === 'super_admin' && (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Super Admin
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              {userRole === 'super_admin' 
                ? 'You have unlimited access to all question types and features'
                : 'Select from our comprehensive library of question types'
              }
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">Click</kbd>
                <span>Add single question</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">Shift+Click</kbd>
                <span>Add multiple</span>
              </div>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Debug: Plan="{userPlan}" | Role="{userRole}"
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Categories */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search question types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Popular Types */}
              {searchTerm === '' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Popular Types
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allQuestionTypes
                      .filter(type => popularTypes.includes(type.type))
                      .map(type => (
                        <button
                          key={type.type}
                          onClick={() => handleSelectType(type)}
                          disabled={!isTypeAvailable(type)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isTypeAvailable(type)
                              ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                          }`}
                          onMouseEnter={() => setHoveredType(type)}
                          onMouseLeave={() => setHoveredType(null)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {type.icon}
                            <span className="text-sm font-medium">{type.name}</span>
                          </div>
                          {getPlanBadge(type.requiresPlan)}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                {filteredCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      selectedCategory === category.id
                        ? `${category.color} border border-current`
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${
                      selectedCategory === category.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                    }`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs opacity-75 truncate">{category.description}</div>
                    </div>
                    {category.requiresPlan && (
                      <Crown className="w-4 h-4 opacity-60" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Question Types */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {filteredTypes.map((category, categoryIndex) => (
                <div key={category.category} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                    <span className="text-sm text-gray-500">
                      {category.types.length} type{category.types.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.types.map((type, typeIndex) => {
                      const isAvailable = isTypeAvailable(type);
                      
                      return (
                        <motion.div
                          key={type.type}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: Math.min((categoryIndex * 0.05) + (typeIndex * 0.02), 0.3),
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }}
                          whileHover={isAvailable ? { y: -3 } : {}}
                          className={`relative group ${
                            isAvailable 
                              ? 'cursor-pointer' 
                              : 'cursor-not-allowed opacity-60'
                          }`}
                          onClick={(e) => {
                            if (!isAvailable) return;
                            const keepOpen = e.shiftKey || e.ctrlKey || e.metaKey;
                            handleSelectType(type, keepOpen);
                          }}
                          onMouseEnter={() => setHoveredType(type)}
                          onMouseLeave={() => setHoveredType(null)}
                        >
                          <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            isAvailable
                              ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white'
                              : 'border-gray-100 bg-gray-50'
                          }`}>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  isAvailable ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {type.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                                  {getPlanBadge(type.requiresPlan)}
                                </div>
                              </div>
                              
                              {popularTypes.includes(type.type) && (
                                <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                                  <Sparkles className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3">{type.description}</p>

                            {/* Preview */}
                            <div className="text-xs text-gray-500 font-medium mb-2">Preview:</div>
                            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                              {type.preview}
                            </div>

                            {/* Settings Available */}
                            {type.settings && type.settings.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-500 mb-1">Configurable:</div>
                                <div className="flex flex-wrap gap-1">
                                  {type.settings.slice(0, 3).map(setting => (
                                    <span key={setting} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                      {setting}
                                    </span>
                                  ))}
                                  {type.settings.length > 3 && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                      +{type.settings.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Hover Overlay */}
                            {isAvailable && (
                              <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Unavailable Overlay */}
                            {!isAvailable && (
                              <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-xl flex items-center justify-center">
                                <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-center">
                                  <Crown className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs font-medium text-gray-600">
                                    {type.requiresPlan === 'pro' ? 'Pro Plan Required' : 'Enterprise Plan Required'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredTypes.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No question types found</h3>
                  <p className="text-gray-600">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Live Preview */}
          {showPreview && hoveredType && (
            <div className="w-80 border-l border-gray-200 overflow-y-auto">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {hoveredType.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{hoveredType.name}</h3>
                      <p className="text-sm text-gray-600">{hoveredType.category}</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Sample Question
                      <span className="text-red-500 ml-1">*</span>
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      This is how your question will appear to respondents
                    </p>
                    {renderQuestionPreview(hoveredType)}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Description</h4>
                    <p className="text-sm text-gray-600">{hoveredType.description}</p>
                  </div>

                  {hoveredType.settings && hoveredType.settings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Available Settings</h4>
                      <div className="space-y-2">
                        {hoveredType.settings.map(setting => (
                          <div key={setting} className="flex items-center gap-2 text-sm">
                            <CheckSquare className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 capitalize">
                              {setting.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hoveredType.requiresPlan && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          {hoveredType.requiresPlan === 'pro' ? 'Pro Plan Required' : 'Enterprise Plan Required'}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700">
                        Upgrade your plan to access this advanced question type
                      </p>
                    </div>
                  )}

                  {isTypeAvailable(hoveredType) && (
                    <button
                      onClick={() => handleSelectType(hoveredType)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add This Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available ({allQuestionTypes.filter(isTypeAvailable).length})</span>
            </div>
            {userRole === 'super_admin' ? (
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 text-purple-500" />
                <span className="text-purple-600 font-medium">Super Admin - All Access</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 text-yellow-500" />
                <span>Premium ({allQuestionTypes.filter(t => t.planRequired).length})</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedQuestionTypeSelector;
