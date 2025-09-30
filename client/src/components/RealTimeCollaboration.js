import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  MessageSquare,
  Edit3,
  Eye,
  CheckCircle,
  MoreVertical,
  Crown,
  User,
  Activity,
  X
} from 'lucide-react';

const RealTimeCollaboration = ({ 
  survey, 
  currentUser, 
  onCollaborationUpdate,
  userPlan = 'free' 
}) => {
  const [collaborators, setCollaborators] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  // const [liveCursors, setLiveCursors] = useState([]);
  // const [userPresence, setUserPresence] = useState({});
  // const [conflictResolution, setConflictResolution] = useState(null);
  // const [notifications, setNotifications] = useState([]);
  // const [isOnline, setIsOnline] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate user activity
      const randomUser = collaborators[Math.floor(Math.random() * collaborators.length)];
      if (randomUser) {
        setActiveUsers(prev => {
          const updated = prev.filter(u => u.id !== randomUser.id);
          return [...updated, { ...randomUser, lastSeen: new Date().toISOString() }];
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [collaborators]);

  // Mock data for demonstration
  useEffect(() => {
    setCollaborators([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        status: 'online',
        lastSeen: new Date().toISOString(),
        permissions: ['edit', 'view', 'comment', 'invite']
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        status: 'online',
        lastSeen: new Date().toISOString(),
        permissions: ['edit', 'view', 'comment']
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'viewer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        status: 'away',
        lastSeen: new Date(Date.now() - 300000).toISOString(),
        permissions: ['view', 'comment']
      }
    ]);

    setActiveUsers([
      {
        id: 1,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        currentAction: 'editing question 3',
        lastSeen: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        currentAction: 'viewing survey',
        lastSeen: new Date().toISOString()
      }
    ]);

    setComments([
      {
        id: 1,
        questionId: 'q1',
        author: {
          id: 2,
          name: 'Jane Smith',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
        },
        content: 'Should we make this question required?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: false
      },
      {
        id: 2,
        questionId: 'q2',
        author: {
          id: 1,
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        content: 'Great suggestion! I think we should add an "Other" option here.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        resolved: true
      }
    ]);
  }, []);

  const inviteCollaborator = (email, role) => {
    const newCollaborator = {
      id: Date.now(),
      email,
      role,
      status: 'pending',
      permissions: getRolePermissions(role),
      invitedAt: new Date().toISOString()
    };

    setCollaborators(prev => [...prev, newCollaborator]);
    setShowInviteModal(false);
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case 'owner':
        return ['edit', 'view', 'comment', 'invite', 'delete'];
      case 'editor':
        return ['edit', 'view', 'comment'];
      case 'viewer':
        return ['view', 'comment'];
      default:
        return ['view'];
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor':
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-slate-400';
      case 'pending':
        return 'bg-blue-500';
      default:
        return 'bg-slate-400';
    }
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedQuestion) return;

    const comment = {
      id: Date.now(),
      questionId: selectedQuestion.id,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const resolveComment = (commentId) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, resolved: true } : comment
      )
    );
  };

  // const removeCollaborator = (collaboratorId) => {
  //   setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  // };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="real-time-collaboration bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Team Collaboration</h2>
              <p className="text-sm text-slate-600">
                Work together in real-time with your team
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-600">
                    {'Online'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Active Users */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Currently Online</h3>
          <div className="flex items-center space-x-3">
            {activeUsers.map(user => (
              <div key={user.id} className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-slate-300">{user.currentAction}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collaborators List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          </div>

          <div className="space-y-3">
            {collaborators.map(collaborator => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-slate-900">{collaborator.name}</h4>
                      {getRoleIcon(collaborator.role)}
                    </div>
                    <p className="text-sm text-slate-600">{collaborator.email}</p>
                    <p className="text-xs text-slate-500">
                      {collaborator.status === 'online' ? 'Online' : 
                       collaborator.status === 'away' ? 'Away' :
                       collaborator.status === 'pending' ? 'Pending invitation' :
                       `Last seen ${formatTimeAgo(collaborator.lastSeen)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium capitalize">
                    {collaborator.role}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Comments</h3>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{showComments ? 'Hide' : 'Show'} Comments</span>
            </button>
          </div>

          {showComments && (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <select
                        value={selectedQuestion?.id || ''}
                        onChange={(e) => {
                          const question = survey.questions.find(q => q.id === e.target.value);
                          setSelectedQuestion(question);
                        }}
                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a question...</option>
                        {survey.questions.map(question => (
                          <option key={question.id} value={question.id}>
                            {question.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={addComment}
                        disabled={!newComment.trim() || !selectedQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className={`p-4 rounded-lg border ${
                    comment.resolved ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{comment.author.name}</h4>
                          <span className="text-xs text-slate-500">{formatTimeAgo(comment.timestamp)}</span>
                          {comment.resolved && (
                            <span className="flex items-center space-x-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Resolved</span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-2">
                          {!comment.resolved && (
                            <button
                              onClick={() => resolveComment(comment.id)}
                              className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                              Mark as resolved
                            </button>
                          )}
                          <button className="text-xs text-slate-500 hover:text-slate-700">
                              Reply
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { id: 1, user: 'Jane Smith', action: 'edited question 3', time: '2 minutes ago', type: 'edit' },
              { id: 2, user: 'Mike Johnson', action: 'added a comment', time: '15 minutes ago', type: 'comment' },
              { id: 3, user: 'John Doe', action: 'published survey', time: '1 hour ago', type: 'publish' }
            ].map(activity => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="colleague@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="viewer">Viewer - Can view and comment</option>
                  <option value="editor">Editor - Can edit and comment</option>
                  <option value="owner">Owner - Full access</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => inviteCollaborator('new@example.com', 'viewer')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeCollaboration;
