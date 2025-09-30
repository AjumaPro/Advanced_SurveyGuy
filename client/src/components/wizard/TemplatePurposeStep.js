import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Users,
  Calendar,
  FileText,
  Building,
  GraduationCap,
  Heart,
  ShoppingCart,
  Target,
  Home,
  Music,
  Camera,
  Utensils,
  Plane,
  Car,
  Gift,
  Award,
  Globe,
  Zap
} from 'lucide-react';

const TemplatePurposeStep = ({ templateData, updateTemplateData }) => {
  const [selectedPurpose, setSelectedPurpose] = useState(templateData.purpose);
  const [selectedCategory, setSelectedCategory] = useState(templateData.category);

  const templateTypes = [
    {
      id: 'survey',
      name: 'Survey Template',
      icon: <Star className="w-8 h-8" />,
      description: 'Perfect for feedback, research, assessments',
      color: 'bg-blue-500',
      examples: ['Customer satisfaction', 'Market research', 'Employee feedback']
    },
    {
      id: 'event',
      name: 'Event Template',
      icon: <Calendar className="w-8 h-8" />,
      description: 'Perfect for conferences, workshops, webinars',
      color: 'bg-green-500',
      examples: ['Conference registration', 'Workshop signup', 'Webinar attendance']
    },
    {
      id: 'form',
      name: 'Form Template',
      icon: <FileText className="w-8 h-8" />,
      description: 'Perfect for registrations, applications, contact forms',
      color: 'bg-purple-500',
      examples: ['Contact forms', 'Job applications', 'Newsletter signup']
    }
  ];

  const categories = [
    { id: 'business', name: 'Business', icon: <Building className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'customer-feedback', name: 'Customer Feedback', icon: <Star className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'employee', name: 'Employee', icon: <Users className="w-5 h-5" />, color: 'bg-green-100 text-green-800' },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'healthcare', name: 'Healthcare', icon: <Heart className="w-5 h-5" />, color: 'bg-red-100 text-red-800' },
    { id: 'events', name: 'Events', icon: <Calendar className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'product-feedback', name: 'Product Feedback', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-orange-100 text-orange-800' },
    { id: 'community', name: 'Community', icon: <Target className="w-5 h-5" />, color: 'bg-teal-100 text-teal-800' },
    { id: 'social', name: 'Social', icon: <Heart className="w-5 h-5" />, color: 'bg-pink-100 text-pink-800' },
    { id: 'entertainment', name: 'Entertainment', icon: <Music className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'travel', name: 'Travel', icon: <Plane className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'wedding', name: 'Wedding', icon: <Gift className="w-5 h-5" />, color: 'bg-rose-100 text-rose-800' },
    { id: 'training', name: 'Training', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-800' },
    { id: 'virtual', name: 'Virtual', icon: <Globe className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'wellness', name: 'Wellness', icon: <Heart className="w-5 h-5" />, color: 'bg-green-100 text-green-800' },
    { id: 'conference', name: 'Conference', icon: <Building className="w-5 h-5" />, color: 'bg-gray-100 text-gray-800' }
  ];

  const handlePurposeSelect = (purpose) => {
    setSelectedPurpose(purpose);
    updateTemplateData({ purpose });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateTemplateData({ category });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Template Type Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          🤖 What type of template are you creating?
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Choose the type that best fits your needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templateTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePurposeSelect(type.id)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedPurpose === type.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${type.color} text-white mb-4`}>
                  {type.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {type.description}
                </p>
                
                <div className="text-sm text-gray-500">
                  <p className="font-medium mb-1">Examples:</p>
                  <ul className="text-xs space-y-1">
                    {type.examples.map((example, index) => (
                      <li key={index}>• {example}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedPurpose === type.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      {selectedPurpose && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            📂 Choose a category
          </h3>
          <p className="text-gray-600 text-center mb-8">
            This helps us provide better AI suggestions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="mb-2">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {category.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selection Summary */}
      {selectedPurpose && selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Great choice!
              </h4>
              <p className="text-gray-600">
                You're creating a <strong>{templateTypes.find(t => t.id === selectedPurpose)?.name}</strong> for{' '}
                <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplatePurposeStep;
