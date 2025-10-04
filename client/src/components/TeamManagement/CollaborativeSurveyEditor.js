import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Eye,
  Edit3,
  Save,
  Share2,
  Settings,
  Plus,
  Trash2,
  Copy,
  MoreVertical,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CollaborativeSurveyEditor = ({ survey, team, onSurveyUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userPermissions, setUserPermissions] = useState(null);

  useEffect(() => {
    if (survey && team) {
      loadCollaborationData();
      checkUserPermissions();
    }
  }, [survey, team, user]);

  const loadCollaborationData = async () => {
    try {
      // Load team members who can collaborate on this survey
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles:user_id (id, full_name, avatar_url, email)
        `)
        .eq('team_id', team.id)
        .eq('status', 'active')
        .in('role', ['owner', 'admin', 'editor']);

      if (membersError) throw membersError;
      setCollaborators(membersData || []);

      // Load comments for this survey
      const { data: commentsData, error: commentsError } = await supabase
        .from('team_comments')
        .select(`
          *,
          profiles:author_id (id, full_name, avatar_url)
        `)
        .eq('team_id', team.id)
        .eq('entity_type', 'survey')
        .eq('entity_id', survey.id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

      // Simulate active users (in a real app, this would use WebSockets)
      setActiveUsers([
        { id: user.id, name: 'You', avatar: null, lastSeen: new Date() },
        { id: 'user2', name: 'John Doe', avatar: null, lastSeen: new Date(Date.now() - 300000) },
        { id: 'user3', name: 'Jane Smith', avatar: null, lastSeen: new Date(Date.now() - 600000) }
      ]);

    } catch (error) {
      console.error('Error loading collaboration data:', error);
      toast.error('Failed to load collaboration data');
    }
  };

  const checkUserPermissions = async () => {
    try {
      const { data, error } = await supabase
        .rpc('check_team_permission', {
          p_team_id: team.id,
          p_user_id: user.id,
          p_required_role: 'editor'
        });

      if (error) throw error;
      setUserPermissions(data);

    } catch (error) {
      console.error('Error checking permissions:', error);
      setUserPermissions(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_comments')
        .insert({
          team_id: team.id,
          content: newComment.trim(),
          entity_type: 'survey',
          entity_id: survey.id,
          author_id: user.id
        })
        .select(`
          *,
          profiles:author_id (id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment('');

      // Log activity
      await supabase
        .from('team_activities')
        .insert({
          team_id: team.id,
          user_id: user.id,
          activity_type: 'comment_added',
          entity_type: 'survey',
          entity_id: survey.id,
          description: `Added a comment to survey "${survey.title}"`
        });

      toast.success('Comment added successfully');

    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const resolveComment = async (commentId) => {
    try {
      const { error } = await supabase
        .from('team_comments')
        .update({
          is_resolved: true,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_resolved: true, resolved_by: user.id, resolved_at: new Date().toISOString() }
            : comment
        )
      );

      toast.success('Comment resolved');

    } catch (error) {
      console.error('Error resolving comment:', error);
      toast.error('Failed to resolve comment');
    }
  };

  const shareSurvey = async () => {
    try {
      // Update survey sharing settings
      const { error } = await supabase
        .from('team_surveys')
        .update({ is_public: true })
        .eq('team_id', team.id)
        .eq('survey_id', survey.id);

      if (error) throw error;

      // Log activity
      await supabase
        .from('team_activities')
        .insert({
          team_id: team.id,
          user_id: user.id,
          activity_type: 'survey_shared',
          entity_type: 'survey',
          entity_id: survey.id,
          description: `Shared survey "${survey.title}" with the team`
        });

      toast.success('Survey shared with team');
      if (onSurveyUpdate) onSurveyUpdate();

    } catch (error) {
      console.error('Error sharing survey:', error);
      toast.error('Failed to share survey');
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const time = new Date(date);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const getActiveUserIndicator = () => {
    if (activeUsers.length <= 1) return null;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2">
          {activeUsers.slice(0, 3).map((activeUser, index) => (
            <div
              key={activeUser.id}
              className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              title={`${activeUser.name} - ${formatTime(activeUser.lastSeen)}`}
            >
              {activeUser.avatar ? (
                <img src={activeUser.avatar} alt={activeUser.name} className="w-8 h-8 rounded-full" />
              ) : (
                activeUser.name.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {activeUsers.length > 3 && (
            <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
              +{activeUsers.length - 3}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-600">{activeUsers.length} editing</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{survey.title}</h2>
              <p className="text-sm text-gray-600">Collaborative editing • Team: {team.name}</p>
            </div>
            {getActiveUserIndicator()}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showComments 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comments ({comments.length})</span>
            </button>
            
            {userPermissions && (
              <button
                onClick={shareSurvey}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            )}
            
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${showComments ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="p-6">
            {/* Survey Content Preview */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Survey Description</h3>
                <p className="text-gray-700">{survey.description || 'No description provided'}</p>
              </div>

              {/* Questions Preview */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Questions ({survey.questions?.length || 0})</h3>
                <div className="space-y-3">
                  {survey.questions?.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {question.type}
                        </span>
                      </div>
                      <p className="text-gray-900">{question.text}</p>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Edit3 className="w-8 h-8 mx-auto mb-2" />
                      <p>No questions added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Sidebar */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="lg:w-1/3 border-l border-gray-200 bg-gray-50"
            >
              <div className="p-6 h-full flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4">Comments & Feedback</h3>
                
                {/* Add Comment */}
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or feedback..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <button
                    onClick={addComment}
                    disabled={loading || !newComment.trim()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Add Comment</span>
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 bg-white rounded-lg border ${
                          comment.is_resolved ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                              {comment.profiles?.full_name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {comment.profiles?.full_name || 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTime(comment.created_at)}
                              </p>
                            </div>
                          </div>
                          
                          {!comment.is_resolved && userPermissions && (
                            <button
                              onClick={() => resolveComment(comment.id)}
                              className="text-green-600 hover:text-green-700 transition-colors"
                              title="Mark as resolved"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                        
                        {comment.is_resolved && (
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>Resolved</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      <p>No comments yet</p>
                      <p className="text-xs">Add the first comment to start the discussion</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{collaborators.length} collaborators</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated {formatTime(survey.updated_at)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {userPermissions ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Unlock className="w-4 h-4" />
                <span className="text-sm">Can edit</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-600">
                <Lock className="w-4 h-4" />
                <span className="text-sm">View only</span>
              </div>
            )}
            
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Edit3 className="w-4 h-4 mr-2 inline" />
              Edit Survey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeSurveyEditor;
