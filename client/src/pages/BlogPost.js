import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  Tag,
  ArrowLeft,
  Clock,
  Globe,
  TrendingUp,
  BarChart3,
  Briefcase,
  FileText,
  BookOpen,
  MessageSquare,
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BlogPost = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState({
    name: '',
    email: ''
  });
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (slug) {
      loadBlogPost();
      trackView();
    }
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      
      // Load the blog post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (id, full_name, avatar_url, bio),
          blog_categories:category_id (id, name, color, icon, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Load related posts
      const { data: relatedData, error: relatedError } = await supabase
        .from('blog_posts')
        .select(`
          id, title, slug, excerpt, featured_image_url, published_at, view_count,
          profiles:author_id (full_name),
          blog_categories:category_id (name, color)
        `)
        .eq('status', 'published')
        .neq('id', postData.id)
        .or(`category_id.eq.${postData.category_id},tags.ov.{${postData.tags?.join(',')}}`)
        .order('view_count', { ascending: false })
        .limit(3);

      if (relatedError) throw relatedError;
      setRelatedPosts(relatedData || []);

      // Load comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select(`
          *,
          profiles:author_id (full_name, avatar_url)
        `)
        .eq('post_id', postData.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

    } catch (error) {
      console.error('Error loading blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await supabase
        .from('blog_analytics')
        .insert({
          post_id: post?.id,
          event_type: 'view',
          session_id: `session_${Date.now()}`,
          event_data: {
            timestamp: new Date().toISOString(),
            url: window.location.href
          }
        });

      // Update view count
      await supabase
        .from('blog_posts')
        .update({ view_count: post?.view_count + 1 })
        .eq('id', post?.id);

    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      await supabase
        .from('blog_analytics')
        .insert({
          post_id: post.id,
          event_type: 'like',
          user_id: user?.id,
          session_id: `session_${Date.now()}`
        });

      // Update like count
      const newLikeCount = liked ? post.like_count - 1 : post.like_count + 1;
      await supabase
        .from('blog_posts')
        .update({ like_count: newLikeCount })
        .eq('id', post.id);

      setPost(prev => ({ ...prev, like_count: newLikeCount }));
      setLiked(!liked);
      
      toast.success(liked ? 'Removed from likes' : 'Added to likes');

    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post?.title;
    const description = post?.excerpt;

    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied to clipboard');
        return;
    }

    // Track share
    await supabase
      .from('blog_analytics')
      .insert({
        post_id: post.id,
        event_type: 'share',
        event_data: { platform, url }
      });

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !commentAuthor.name.trim() || !commentAuthor.email.trim()) {
      toast.error('Please fill in all comment fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: post.id,
          content: newComment.trim(),
          author_name: commentAuthor.name.trim(),
          author_email: commentAuthor.email.trim(),
          author_id: user?.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Comment submitted for review');
      setNewComment('');
      setCommentAuthor({ name: '', email: '' });

    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const PostTypeIcon = getPostTypeIcon(post.post_type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Category and Type */}
          <div className="flex items-center space-x-3 mb-4">
            {post.blog_categories && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: post.blog_categories.color }}
              >
                {post.blog_categories.name}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              <PostTypeIcon className="w-4 h-4 mr-2" />
              {post.post_type.replace('_', ' ')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{post.profiles?.full_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{getReadingTime(post.content)} min read</span>
            </div>
          </div>

          {/* Social Stats */}
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{post.view_count || 0} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>{post.like_count || 0} likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-8">
                <img
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                {/* Excerpt */}
                {post.excerpt && (
                  <div className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                    {post.excerpt}
                  </div>
                )}

                {/* Main Content */}
                <div 
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {post.profiles && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {post.profiles.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      About {post.profiles.full_name}
                    </h3>
                    <p className="text-gray-600">
                      {post.profiles.bio || 'Expert in research and data analysis with years of experience in the field.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <form onSubmit={submitComment} className="mb-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={commentAuthor.name}
                      onChange={(e) => setCommentAuthor(prev => ({ ...prev, name: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={commentAuthor.email}
                      onChange={(e) => setCommentAuthor(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.profiles?.full_name?.charAt(0) || comment.author_name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {comment.profiles?.full_name || comment.author_name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Share via Email</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Like Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleLike}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{liked ? 'Liked' : 'Like this post'}</span>
              </button>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        {relatedPost.featured_image_url && (
                          <img
                            src={relatedPost.featured_image_url}
                            alt={relatedPost.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(relatedPost.published_at)} • {relatedPost.view_count} views
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
