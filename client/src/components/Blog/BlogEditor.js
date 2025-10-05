import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Globe,
  Clock,
  Tag,
  Image,
  Link,
  Settings,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Plus,
  Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BlogEditor = ({ post, onSave, onCancel, isEditing = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category_id: post?.category_id || '',
    tags: post?.tags || [],
    featured_image_url: post?.featured_image_url || '',
    featured_image_alt: post?.featured_image_alt || '',
    post_type: post?.post_type || 'article',
    content_source: post?.content_source || 'original',
    source_url: post?.source_url || '',
    source_name: post?.source_name || '',
    source_date: post?.source_date || '',
    related_survey_id: post?.related_survey_id || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    meta_keywords: post?.meta_keywords || [],
    social_title: post?.social_title || '',
    social_description: post?.social_description || '',
    status: post?.status || 'draft',
    is_featured: post?.is_featured || false,
    is_pinned: post?.is_pinned || false,
    scheduled_at: post?.scheduled_at || ''
  });

  const [categories, setCategories] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    loadSurveys();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, status')
        .eq('user_id', user.id)
        .in('status', ['published', 'draft'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error loading surveys:', error);
      toast.error('Failed to load surveys');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (formData.content_source === 'aggregated' && !formData.source_url) {
      newErrors.source_url = 'Source URL is required for aggregated content';
    }

    if (formData.status === 'scheduled' && !formData.scheduled_at) {
      newErrors.scheduled_at = 'Scheduled date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status = 'draft') => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        ...formData,
        status,
        published_at: status === 'published' && !isEditing ? new Date().toISOString() : post?.published_at,
        author_id: user.id,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        social_title: formData.social_title || formData.title,
        social_description: formData.social_description || formData.excerpt
      };

      let result;
      if (isEditing) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      toast.success(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`);
      
      if (onSave) {
        onSave(result);
      }

    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.meta_keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        meta_keywords: [...prev.meta_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        featured_image_url: publicUrl
      }));

      toast.success('Image uploaded successfully!');

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Update your blog post' : 'Share your research, insights, and survey reports'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreview(!preview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                preview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{preview ? 'Edit' : 'Preview'}</span>
            </button>
            
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a compelling title..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of your post..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your blog post content here..."
                    rows={20}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduled_at"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.scheduled_at ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduled_at && <p className="text-red-500 text-sm mt-1">{errors.scheduled_at}</p>}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSave('draft')}
                    disabled={saving}
                    className="flex-1 mr-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Draft</span>
                  </button>
                  
                  <button
                    onClick={() => handleSave('published')}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                </div>

                <div>
                  <label htmlFor="post_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Post Type
                  </label>
                  <select
                    id="post_type"
                    value={formData.post_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, post_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="article">Article</option>
                    <option value="survey_report">Survey Report</option>
                    <option value="research_news">Research News</option>
                    <option value="industry_analysis">Industry Analysis</option>
                    <option value="case_study">Case Study</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="content_source" className="block text-sm font-medium text-gray-700 mb-2">
                    Content Source
                  </label>
                  <select
                    id="content_source"
                    value={formData.content_source}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="original">Original Content</option>
                    <option value="aggregated">Aggregated Content</option>
                    <option value="guest_post">Guest Post</option>
                    <option value="press_release">Press Release</option>
                  </select>
                </div>

                {formData.content_source === 'aggregated' && (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="source_url" className="block text-sm font-medium text-gray-700 mb-2">
                        Source URL *
                      </label>
                      <input
                        type="url"
                        id="source_url"
                        value={formData.source_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                        placeholder="https://example.com"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.source_url ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.source_url && <p className="text-red-500 text-sm mt-1">{errors.source_url}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="source_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Source Name
                      </label>
                      <input
                        type="text"
                        id="source_name"
                        value={formData.source_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, source_name: e.target.value }))}
                        placeholder="Source publication name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="related_survey_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Related Survey
                  </label>
                  <select
                    id="related_survey_id"
                    value={formData.related_survey_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, related_survey_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No related survey</option>
                    {surveys.map((survey) => (
                      <option key={survey.id} value={survey.id}>
                        {survey.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              
              <div className="space-y-4">
                {formData.featured_image_url && (
                  <div className="relative">
                    <img
                      src={formData.featured_image_url}
                      alt={formData.featured_image_alt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-gray-600">Upload Image</span>
                </label>
                
                <input
                  type="text"
                  value={formData.featured_image_alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image_alt: e.target.value }))}
                  placeholder="Image alt text (for accessibility)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title (defaults to post title)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description (defaults to excerpt)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
