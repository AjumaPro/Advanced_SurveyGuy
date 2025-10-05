import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  User,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Globe,
  Tag,
  ChevronRight,
  Clock,
  BarChart3,
  FileText,
  Briefcase,
  Cpu,
  BookOpen,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Star,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const postsPerPage = 9;

  useEffect(() => {
    loadBlogData();
  }, [currentPage, selectedCategory, selectedType, searchTerm]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load trending posts
      const { data: trendingData, error: trendingError } = await supabase
        .rpc('get_trending_blog_posts', { limit_count: 5 });

      if (trendingError) throw trendingError;
      setTrendingPosts(trendingData || []);

      // Load posts with filters
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (id, full_name, avatar_url),
          blog_categories:category_id (id, name, color, icon)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      // Apply filters
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      
      if (selectedType) {
        query = query.eq('post_type', selectedType);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);
      }

      // Pagination
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;
      query = query.range(from, to);

      const { data: postsData, error: postsError, count } = await query;

      if (postsError) throw postsError;
      setPosts(postsData || []);
      setTotalPosts(count || 0);

    } catch (error) {
      console.error('Error loading blog data:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      'trending-up': TrendingUp,
      'briefcase': Briefcase,
      'cpu': Cpu,
      'bar-chart-3': BarChart3,
      'file-text': FileText,
      'search': SearchIcon,
      'book-open': BookOpen,
      'globe': Globe
    };
    return icons[iconName] || FileText;
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'survey_report': return BarChart3;
      case 'research_news': return TrendingUp;
      case 'industry_analysis': return Briefcase;
      case 'case_study': return BookOpen;
      default: return FileText;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBlogData();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Research & Survey Insights
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover the latest financial, business, and technology research from around the globe. 
              Expert analysis, survey reports, and industry insights.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search research, surveys, and insights..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.icon);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                        selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedType ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setSelectedType('article')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedType === 'article' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Articles</span>
                </button>
                <button
                  onClick={() => setSelectedType('survey_report')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedType === 'survey_report' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Survey Reports</span>
                </button>
                <button
                  onClick={() => setSelectedType('research_news')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedType === 'research_news' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Research News</span>
                </button>
                <button
                  onClick={() => setSelectedType('industry_analysis')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedType === 'industry_analysis' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Industry Analysis</span>
                </button>
              </div>
            </div>

            {/* Trending Posts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingIcon className="w-5 h-5 text-orange-500" />
                <span>Trending</span>
              </h3>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || selectedType || searchTerm) && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest Research & Insights'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found
                </p>
              </div>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post, index) => {
                  const PostTypeIcon = getPostTypeIcon(post.post_type);
                  return (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      {/* Featured Image */}
                      {post.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featured_image_url}
                            alt={post.featured_image_alt || post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Category and Type */}
                        <div className="flex items-center space-x-2 mb-3">
                          {post.blog_categories && (
                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: post.blog_categories.color }}
                            >
                              {post.blog_categories.name}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            <PostTypeIcon className="w-3 h-3 mr-1" />
                            {post.post_type.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.profiles?.full_name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.published_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.view_count || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.like_count || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="mt-4">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:underline"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory || selectedType
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No blog posts have been published yet.'}
                </p>
                {(searchTerm || selectedCategory || selectedType) && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
