import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Star, 
  Crown, 
  Zap, 
  Filter,
  Grid,
  List,
  Sparkles,
  Heart,
  Smile,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  Target
} from 'lucide-react';
import { getAllQuestionTypes, hasAccessToQuestionType } from '../utils/questionTypes';
import { useAuth } from '../contexts/AuthContext';

const EnhancedQuestionTypeSelector = ({ onSelect, onClose }) => {
  const { user, userProfile } = useAuth();
  const userPlan = userProfile?.plan || user?.subscription_plan || 'free';
  const userRole = userProfile?.role || 'user';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showPreview, setShowPreview] = useState(null);

  const categories = [
    { id: 'all', name: 'All Types', icon: Grid, color: 'blue' },
    { id: 'Text Input', name: 'Text Input', icon: FileText, color: 'green' },
    { id: 'Choice', name: 'Multiple Choice', icon: List, color: 'purple' },
    { id: 'Rating & Scale', name: 'Rating & Scale', icon: Star, color: 'yellow' },
    { id: 'Emoji & Visual', name: 'Emoji & Visual', icon: Smile, color: 'pink' },
    { id: 'Advanced', name: 'Advanced', icon: Zap, color: 'orange' }
  ];

  const popularTypes = [
    'text', 'radio', 'checkbox', 'rating', 'emoji_satisfaction', 
    'emoji_agreement', 'scale', 'dropdown', 'textarea'
  ];

  const newTypes = [
    'emoji_mood', 'emoji_difficulty', 'emoji_likelihood', 'emoji_custom',
    'matrix', 'ranking', 'slider', 'file'
  ];

  const allQuestionTypes = getAllQuestionTypes();

  // Group and filter question types
  const { groupedTypes, filteredTypes } = useMemo(() => {
    // Group by category
    const grouped = allQuestionTypes.reduce((acc, type) => {
      const category = type.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(type);
      return acc;
    }, {});

    // Filter based on search and category
    const filtered = Object.entries(grouped)
      .filter(([category]) => selectedCategory === 'all' || category === selectedCategory)
      .map(([category, types]) => ({
        category,
        types: types.filter(type => {
          const matchesSearch = !searchTerm || 
            type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            type.description.toLowerCase().includes(searchTerm.toLowerCase());
          
          return matchesSearch;
        })
      }))
      .filter(group => group.types.length > 0);

    return { groupedTypes: grouped, filteredTypes: filtered };
  }, [allQuestionTypes, searchTerm, selectedCategory]);

  const getTypeAccess = (type) => {
    const hasAccess = hasAccessToQuestionType(type.type, userPlan, userRole);
    return {
      hasAccess,
      badge: type.planRequired ? (type.planRequired === 'enterprise' ? 'Enterprise' : 'Pro') : null,
      badgeColor: type.planRequired === 'enterprise' ? 'purple' : 'blue'
    };
  };

  const handleTypeSelect = (type) => {
    const { hasAccess } = getTypeAccess(type);
    if (!hasAccess) {
      // Show upgrade prompt or handle restricted access
      return;
    }
    onSelect(type.type);
  };

  const renderQuestionTypeCard = (type, index) => {
    const { hasAccess, badge, badgeColor } = getTypeAccess(type);
    const isPopular = popularTypes.includes(type.type);
    const isNew = newTypes.includes(type.type);

    return (
      <motion.div
        key={type.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`relative group cursor-pointer ${!hasAccess ? 'opacity-60' : ''}`}
        onMouseEnter={() => setShowPreview(type)}
        onMouseLeave={() => setShowPreview(null)}
        onClick={() => handleTypeSelect(type)}
      >
        <div className={`
          p-4 rounded-xl border-2 transition-all duration-200
          ${hasAccess 
            ? 'border-gray-200 hover:border-blue-400 hover:shadow-lg bg-white' 
            : 'border-gray-100 bg-gray-50 cursor-not-allowed'
          }
        `}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{type.icon}</div>
              <div className="flex flex-col gap-1">
                {isPopular && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    <Star className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {isNew && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                )}
              </div>
            </div>
            
            {badge && (
              <span className={`
                inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
                ${badgeColor === 'purple' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
                }
              `}>
                <Crown className="w-3 h-3" />
                {badge}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">
              {type.name}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {type.description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 capitalize">
                {type.category}
              </span>
              {hasAccess ? (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-gray-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderQuestionTypeList = (type, index) => {
    const { hasAccess, badge, badgeColor } = getTypeAccess(type);
    const isPopular = popularTypes.includes(type.type);
    const isNew = newTypes.includes(type.type);

    return (
      <motion.div
        key={type.type}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`
          flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all
          ${hasAccess 
            ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white' 
            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
          }
        `}
        onClick={() => handleTypeSelect(type)}
      >
        <div className="text-xl">{type.icon}</div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 text-sm">{type.name}</h3>
            {isPopular && (
              <Star className="w-3 h-3 text-yellow-500" />
            )}
            {isNew && (
              <Sparkles className="w-3 h-3 text-green-500" />
            )}
            {badge && (
              <span className={`
                inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded
                ${badgeColor === 'purple' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
                }
              `}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600">{type.description}</p>
        </div>

        <div className="text-xs text-gray-500 capitalize">
          {type.category}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Choose Question Type
              </h2>
              <p className="text-gray-600 mt-1">
                Select from {allQuestionTypes.length}+ professional question types including emoji questions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search question types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? `bg-${category.color}-100 text-${category.color}-700 border-${category.color}-200 border`
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTypes.map((group, groupIndex) => (
            <div key={group.category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {group.category}
                </h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {group.types.length}
                </span>
                {group.category === 'Emoji & Visual' && (
                  <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                    🎉 New!
                  </span>
                )}
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.types.map((type, index) => renderQuestionTypeCard(type, index))}
                </div>
              ) : (
                <div className="space-y-2">
                  {group.types.map((type, index) => renderQuestionTypeList(type, index))}
                </div>
              )}
            </div>
          ))}

          {filteredTypes.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No question types found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Free ({allQuestionTypes.filter(t => !t.planRequired).length})</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-blue-500" />
                <span>Pro ({allQuestionTypes.filter(t => t.planRequired === 'pro').length})</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-purple-500" />
                <span>Enterprise ({allQuestionTypes.filter(t => t.planRequired === 'enterprise').length})</span>
              </div>
            </div>
            <div>
              Current Plan: <span className="font-medium capitalize">{userPlan}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedQuestionTypeSelector;
