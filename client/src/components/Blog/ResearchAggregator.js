import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Rss,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar,
  TrendingUp,
  FileText,
  BarChart3,
  Briefcase,
  Cpu,
  BookOpen,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ResearchAggregator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState([]);
  const [aggregatedPosts, setAggregatedPosts] = useState([]);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    website: '',
    rss_feed_url: '',
    api_endpoint: '',
    source_type: 'website',
    category: 'general',
    keywords: [],
    language: 'en',
    is_auto_fetch: false,
    fetch_frequency: 'daily'
  });
  const [filters, setFilters] = useState({
    category: '',
    source: '',
    dateRange: '',
    status: ''
  });

  useEffect(() => {
    loadSources();
    loadAggregatedPosts();
  }, []);

  const loadSources = async () => {
    try {
      const { data, error } = await supabase
        .from('research_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error loading sources:', error);
      toast.error('Failed to load research sources');
    } finally {
      setLoading(false);
    }
  };

  const loadAggregatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories:category_id (name, color, icon),
          research_sources:source_name (name, website)
        `)
        .eq('content_source', 'aggregated')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setAggregatedPosts(data || []);
    } catch (error) {
      console.error('Error loading aggregated posts:', error);
      toast.error('Failed to load aggregated posts');
    }
  };

  const addSource = async () => {
    try {
      const { data, error } = await supabase
        .from('research_sources')
        .insert(newSource)
        .select()
        .single();

      if (error) throw error;

      setSources(prev => [data, ...prev]);
      setNewSource({
        name: '',
        website: '',
        rss_feed_url: '',
        api_endpoint: '',
        source_type: 'website',
        category: 'general',
        keywords: [],
        language: 'en',
        is_auto_fetch: false,
        fetch_frequency: 'daily'
      });
      setShowAddSource(false);
      toast.success('Research source added successfully!');

    } catch (error) {
      console.error('Error adding source:', error);
      toast.error('Failed to add research source');
    }
  };

  const updateSource = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('research_sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSources(prev => prev.map(source => 
        source.id === id ? data : source
      ));
      toast.success('Source updated successfully!');

    } catch (error) {
      console.error('Error updating source:', error);
      toast.error('Failed to update source');
    }
  };

  const deleteSource = async (id) => {
    if (!confirm('Are you sure you want to delete this source?')) return;

    try {
      const { error } = await supabase
        .from('research_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSources(prev => prev.filter(source => source.id !== id));
      toast.success('Source deleted successfully!');

    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error('Failed to delete source');
    }
  };

  const fetchFromSource = async (sourceId) => {
    try {
      setLoading(true);
      
      // This would typically call a backend function to fetch from the source
      const { data, error } = await supabase.functions.invoke('fetch-research-content', {
        body: { source_id: sourceId }
      });

      if (error) throw error;

      toast.success('Research content fetched successfully!');
      loadAggregatedPosts();

    } catch (error) {
      console.error('Error fetching from source:', error);
      toast.error('Failed to fetch research content');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'financial': return TrendingUp;
      case 'business': return Briefcase;
      case 'technology': return Cpu;
      case 'market_research': return BarChart3;
      case 'academic': return BookOpen;
      default: return FileText;
    }
  };

  const getSourceTypeIcon = (type) => {
    switch (type) {
      case 'rss': return Rss;
      case 'api': return Globe;
      case 'website': return Globe;
      case 'social_media': return Globe;
      default: return FileText;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Aggregator</h1>
            <p className="text-gray-600 mt-2">
              Aggregate financial, business, and tech research from global sources
            </p>
          </div>
          
          <button
            onClick={() => setShowAddSource(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Source</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sources Management */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Sources</h3>
              
              <div className="space-y-4">
                {sources.map((source) => {
                  const CategoryIcon = getCategoryIcon(source.category);
                  const SourceTypeIcon = getSourceTypeIcon(source.source_type);
                  
                  return (
                    <div
                      key={source.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <SourceTypeIcon className="w-4 h-4 text-blue-600" />
                          <h4 className="font-medium text-gray-900">{source.name}</h4>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => fetchFromSource(source.id)}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Fetch content"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateSource(source.id, { is_active: !source.is_active })}
                            className={`p-1 ${source.is_active ? 'text-green-600' : 'text-gray-400'}`}
                            title={source.is_active ? 'Active' : 'Inactive'}
                          >
                            {source.is_active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteSource(source.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Delete source"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-3 h-3" />
                          <span className="capitalize">{source.category.replace('_', ' ')}</span>
                        </div>
                        
                        {source.website && (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-3 h-3" />
                            <a
                              href={source.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 truncate"
                            >
                              {source.website}
                            </a>
                          </div>
                        )}
                        
                        {source.last_fetch && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>Last fetch: {formatDate(source.last_fetch)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          {source.is_active ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={source.is_active ? 'text-green-600' : 'text-gray-400'}>
                            {source.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Aggregated Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Aggregated Content</h3>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="financial">Financial</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="market_research">Market Research</option>
                  </select>
                  
                  <button
                    onClick={() => setFilters({ category: '', source: '', dateRange: '', status: '' })}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {aggregatedPosts
                  .filter(post => 
                    !filters.category || post.blog_categories?.name.toLowerCase().includes(filters.category)
                  )
                  .map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.published_at)}</span>
                            </div>
                            
                            {post.blog_categories && (
                              <div className="flex items-center space-x-1">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: post.blog_categories.color }}
                                />
                                <span>{post.blog_categories.name}</span>
                              </div>
                            )}
                            
                            {post.source_url && (
                              <a
                                href={post.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>View Source</span>
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            View Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Source Modal */}
        {showAddSource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add Research Source</h3>
                  <button
                    onClick={() => setShowAddSource(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); addSource(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source Name *
                      </label>
                      <input
                        type="text"
                        value={newSource.name}
                        onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Financial Times"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={newSource.website}
                        onChange={(e) => setNewSource(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source Type
                      </label>
                      <select
                        value={newSource.source_type}
                        onChange={(e) => setNewSource(prev => ({ ...prev, source_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="website">Website</option>
                        <option value="rss">RSS Feed</option>
                        <option value="api">API</option>
                        <option value="social_media">Social Media</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newSource.category}
                        onChange={(e) => setNewSource(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="financial">Financial</option>
                        <option value="business">Business</option>
                        <option value="technology">Technology</option>
                        <option value="market_research">Market Research</option>
                        <option value="academic">Academic</option>
                        <option value="government">Government</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    {newSource.source_type === 'rss' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          RSS Feed URL
                        </label>
                        <input
                          type="url"
                          value={newSource.rss_feed_url}
                          onChange={(e) => setNewSource(prev => ({ ...prev, rss_feed_url: e.target.value }))}
                          placeholder="https://example.com/feed.xml"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {newSource.source_type === 'api' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Endpoint
                        </label>
                        <input
                          type="url"
                          value={newSource.api_endpoint}
                          onChange={(e) => setNewSource(prev => ({ ...prev, api_endpoint: e.target.value }))}
                          placeholder="https://api.example.com/endpoint"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Source
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSource(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAggregator;
