import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Crown,
  Zap,
  Shield,
  Star,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Package,
  BarChart3,
  Users,
  Code,
  Palette,
  Database,
  Globe,
  Mail,
  Bell,
  Calendar,
  FileText,
  Sparkles
} from 'lucide-react';

const FeatureManagement = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'core',
    required_plan: 'free',
    is_active: true,
    icon: 'Star',
    color: 'blue'
  });

  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin && userProfile) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/app/dashboard');
    }
  }, [isSuperAdmin, userProfile, navigate]);

  const featureCategories = [
    { id: 'core', name: 'Core Features', icon: <Package className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics & Reporting', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'collaboration', name: 'Team Collaboration', icon: <Users className="w-4 h-4" /> },
    { id: 'integration', name: 'Integrations & API', icon: <Code className="w-4 h-4" /> },
    { id: 'customization', name: 'Customization', icon: <Palette className="w-4 h-4" /> },
    { id: 'enterprise', name: 'Enterprise', icon: <Shield className="w-4 h-4" /> }
  ];

  const planOptions = [
    { id: 'free', name: 'Free', color: 'gray' },
    { id: 'pro', name: 'Pro', color: 'blue' },
    { id: 'enterprise', name: 'Enterprise', color: 'purple' }
  ];

  const iconOptions = [
    'Star', 'Zap', 'Shield', 'Crown', 'Package', 'BarChart3', 'Users', 'Code', 
    'Palette', 'Database', 'Globe', 'Mail', 'Bell', 'Calendar', 'FileText', 'Sparkles'
  ];

  const colorOptions = [
    { id: 'blue', name: 'Blue', class: 'bg-blue-100 text-blue-600' },
    { id: 'green', name: 'Green', class: 'bg-green-100 text-green-600' },
    { id: 'purple', name: 'Purple', class: 'bg-purple-100 text-purple-600' },
    { id: 'red', name: 'Red', class: 'bg-red-100 text-red-600' },
    { id: 'yellow', name: 'Yellow', class: 'bg-yellow-100 text-yellow-600' },
    { id: 'gray', name: 'Gray', class: 'bg-gray-100 text-gray-600' }
  ];

  // Default platform features
  const defaultFeatures = [
    {
      id: 'survey_creation',
      name: 'Survey Creation',
      description: 'Create and build custom surveys with various question types',
      category: 'core',
      required_plan: 'free',
      is_active: true,
      icon: 'FileText',
      color: 'blue'
    },
    {
      id: 'basic_analytics',
      name: 'Basic Analytics',
      description: 'View basic survey response analytics and completion rates',
      category: 'analytics',
      required_plan: 'free',
      is_active: true,
      icon: 'BarChart3',
      color: 'green'
    },
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Deep insights with trends, demographics, and custom reports',
      category: 'analytics',
      required_plan: 'pro',
      is_active: true,
      icon: 'BarChart3',
      color: 'blue'
    },
    {
      id: 'custom_branding',
      name: 'Custom Branding',
      description: 'Add your logo, colors, and custom styling to surveys',
      category: 'customization',
      required_plan: 'pro',
      is_active: true,
      icon: 'Palette',
      color: 'purple'
    },
    {
      id: 'team_collaboration',
      name: 'Team Collaboration',
      description: 'Share surveys with team members and collaborate in real-time',
      category: 'collaboration',
      required_plan: 'pro',
      is_active: true,
      icon: 'Users',
      color: 'green'
    },
    {
      id: 'api_access',
      name: 'API Access',
      description: 'Programmatic access to surveys and responses via REST API',
      category: 'integration',
      required_plan: 'pro',
      is_active: true,
      icon: 'Code',
      color: 'gray'
    },
    {
      id: 'sso_integration',
      name: 'Single Sign-On (SSO)',
      description: 'Enterprise SSO integration with SAML, OAuth, and LDAP',
      category: 'enterprise',
      required_plan: 'enterprise',
      is_active: true,
      icon: 'Shield',
      color: 'red'
    },
    {
      id: 'white_label',
      name: 'White Label Solution',
      description: 'Complete white-label platform with custom domain support',
      category: 'enterprise',
      required_plan: 'enterprise',
      is_active: true,
      icon: 'Globe',
      color: 'purple'
    }
  ];

  useEffect(() => {
    if (isSuperAdmin) {
      fetchFeatures();
    }
  }, [isSuperAdmin]);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      // For now, use default features. In a real app, this would fetch from database
      setFeatures(defaultFeatures);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeature = async (e) => {
    e.preventDefault();
    try {
      const newFeature = {
        ...createForm,
        id: createForm.name.toLowerCase().replace(/\s+/g, '_'),
        created_at: new Date().toISOString()
      };

      setFeatures(prev => [...prev, newFeature]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        category: 'core',
        required_plan: 'free',
        is_active: true,
        icon: 'Star',
        color: 'blue'
      });
      toast.success('Feature created successfully!');
    } catch (error) {
      console.error('Error creating feature:', error);
      toast.error('Failed to create feature');
    }
  };

  const handleUpdateFeature = async (featureId, updates) => {
    try {
      setFeatures(prev => prev.map(f => 
        f.id === featureId ? { ...f, ...updates } : f
      ));
      toast.success('Feature updated successfully!');
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature');
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      setFeatures(prev => prev.filter(f => f.id !== featureId));
      toast.success('Feature deleted successfully!');
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Star, Zap, Shield, Crown, Package, BarChart3, Users, Code, 
      Palette, Database, Globe, Mail, Bell, Calendar, FileText, Sparkles
    };
    const IconComponent = icons[iconName] || Star;
    return <IconComponent className="w-4 h-4" />;
  };

  const getColorClass = (colorId) => {
    const color = colorOptions.find(c => c.id === colorId);
    return color?.class || 'bg-gray-100 text-gray-600';
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Super admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <span>Feature Management</span>
          </h1>
          <p className="text-gray-600">Manage platform features and plan restrictions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Feature</span>
        </button>
      </div>

      {/* Super Admin Status */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Super Admin Feature Control</h2>
            <p className="text-purple-100">
              Add, edit, and manage platform features across all subscription plans
            </p>
          </div>
          <Crown className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCategories.map((category) => {
          const categoryFeatures = features.filter(f => f.category === category.id);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {categoryFeatures.length}
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {categoryFeatures.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No features in this category
                  </p>
                ) : (
                  categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getColorClass(feature.color)}`}>
                          {getIconComponent(feature.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{feature.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPlanBadgeColor(feature.required_plan)}`}>
                              {feature.required_plan}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              feature.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {feature.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateFeature(feature.id, { is_active: !feature.is_active })}
                          className={`p-1 rounded ${feature.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                        >
                          {feature.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFeature(feature);
                            setCreateForm(feature);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(feature.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Feature Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedFeature ? 'Edit Feature' : 'Create New Feature'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedFeature(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateFeature} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Advanced Export Options"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe what this feature does and its benefits"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {featureCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Plan
                    </label>
                    <select
                      value={createForm.required_plan}
                      onChange={(e) => setCreateForm({...createForm, required_plan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {planOptions.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      value={createForm.icon}
                      onChange={(e) => setCreateForm({...createForm, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      value={createForm.color}
                      onChange={(e) => setCreateForm({...createForm, color: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {colorOptions.map(color => (
                        <option key={color.id} value={color.id}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={createForm.is_active}
                    onChange={(e) => setCreateForm({...createForm, is_active: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">
                    Feature Active
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedFeature(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{selectedFeature ? 'Update' : 'Create'} Feature</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Feature Modal */}
      <AnimatePresence>
        {showEditModal && selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Feature</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFeature(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFeature(selectedFeature.id, createForm);
                setShowEditModal(false);
                setSelectedFeature(null);
              }} className="space-y-4">
                {/* Same form fields as create modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Plan
                    </label>
                    <select
                      value={createForm.required_plan}
                      onChange={(e) => setCreateForm({...createForm, required_plan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {planOptions.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={createForm.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setCreateForm({...createForm, is_active: e.target.value === 'active'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedFeature(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Update Feature</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureManagement;
