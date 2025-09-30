import React, { useState } from 'react';
import { getAllQuestionTypes } from '../utils/questionTypes';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  Zap,
  Crown,
  Plus,
  BookOpen,
  Save,
  Grid,
  List,
  Filter,
  Eye,
  Sparkles,
  Target
} from 'lucide-react';

const QuestionTypeLibrary = ({ onAddQuestion, userRole = 'user' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('types'); // 'types' or 'templates'

  const categories = [
    { id: 'all', name: 'All Types', icon: <Star className="w-4 h-4" /> },
    { id: 'Text Input', name: 'Text Input', icon: <Zap className="w-4 h-4" /> },
    { id: 'Multiple Choice', name: 'Choice', icon: <Crown className="w-4 h-4" /> },
    { id: 'Rating & Scale', name: 'Rating', icon: <Star className="w-4 h-4" /> },
    { id: 'Advanced', name: 'Advanced', icon: <Zap className="w-4 h-4" /> }
  ];

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
      types: category.types.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.types.length > 0);

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search question types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Question Types */}
      <div className="space-y-4">
        {filteredTypes.map((category) => (
          <div key={category.category}>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <span>{category.category}</span>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.types.length}
              </span>
            </h4>
            
            <div className="space-y-2">
              {category.types.map((type) => (
                <motion.button
                  key={type.type}
                  onClick={() => onAddQuestion(type.type)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full flex items-center space-x-3 p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <div className="text-gray-600 group-hover:text-blue-600">
                      {type.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {type.name}
                      </h5>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {type.description}
                    </p>
                    {type.preview && (
                      <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Preview: {type.preview}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm mb-2">
            No question types found
          </div>
          <p className="text-xs text-gray-500">
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Add</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddQuestion('text')}
            className="flex items-center justify-center space-x-1 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Text</span>
          </button>
          <button
            onClick={() => onAddQuestion('multiple_choice')}
            className="flex items-center justify-center space-x-1 p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Choice</span>
          </button>
          <button
            onClick={() => onAddQuestion('rating')}
            className="flex items-center justify-center space-x-1 p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Rating</span>
          </button>
          <button
            onClick={() => onAddQuestion('emoji_scale')}
            className="flex items-center justify-center space-x-1 p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Emoji</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionTypeLibrary;
