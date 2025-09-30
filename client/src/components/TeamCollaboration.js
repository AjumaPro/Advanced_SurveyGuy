import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeatureGate, trackFeatureUsage } from '../utils/planFeatures';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserMinus,
  Edit3,
  Eye,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Copy,
  UserCheck,
  Loader2
} from 'lucide-react';

const TeamCollaboration = ({ surveyId, onTeamUpdate }) => {
  const { user, userProfile } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviteMessage, setInviteMessage] = useState('');

  const userPlan = userProfile?.plan || 'free';

  const roles = [
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Can view survey and responses',
      permissions: ['view_survey', 'view_responses']
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can edit survey and view responses',
      permissions: ['view_survey', 'edit_survey', 'view_responses']
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access including team management',
      permissions: ['view_survey', 'edit_survey', 'view_responses', 'manage_team', 'manage_settings']
    }
  ];

  const loadTeamData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Load team members
      const { data: members, error: membersError } = await supabase
        .from('survey_team_members')
        .select(`
          *,
          user:profiles(id, email, full_name)
        `)
        .eq('survey_id', surveyId);

      if (!membersError) {
        setTeamMembers(members || []);
      }

      // Load pending invitations
      const { data: invites, error: invitesError } = await supabase
        .from('survey_invitations')
        .select('*')
        .eq('survey_id', surveyId)
        .eq('status', 'pending');

      if (!invitesError) {
        setInvitations(invites || []);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    if (surveyId) {
      loadTeamData();
    }
  }, [surveyId, loadTeamData]);

  const sendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Check if user is already a team member
      const existingMember = teamMembers.find(member => 
        member.user.email.toLowerCase() === inviteEmail.toLowerCase()
      );
      
      if (existingMember) {
        toast.error('User is already a team member');
        setLoading(false);
        return;
      }

      // Check if invitation already exists
      const existingInvite = invitations.find(invite => 
        invite.email.toLowerCase() === inviteEmail.toLowerCase()
      );
      
      if (existingInvite) {
        toast.error('Invitation already sent to this email');
        setLoading(false);
        return;
      }

      // Create invitation
      const invitationData = {
        survey_id: surveyId,
        invited_by: user.id,
        email: inviteEmail.toLowerCase(),
        role: inviteRole,
        message: inviteMessage,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };

      const { data, error } = await supabase
        .from('survey_invitations')
        .insert(invitationData)
        .select()
        .single();

      if (error) throw error;

      // Send email notification (in a real app, this would trigger an email)
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'team_invitation_sent',
        title: 'Team Invitation Sent',
        message: `Invitation sent to ${inviteEmail}`,
        metadata: { email: inviteEmail, role: inviteRole }
      });

      // Track usage
      await trackFeatureUsage(user.id, 'team_collaboration', {
        action: 'invite_sent',
        email: inviteEmail,
        role: inviteRole
      });

      setInvitations(prev => [...prev, data]);
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteModal(false);
      
      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (memberId, newRole) => {
    try {
      const { error } = await supabase
        .from('survey_team_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );

      toast.success('Member role updated');
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('survey_team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Team member removed');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const cancelInvitation = async (invitationId) => {
    try {
      const { error } = await supabase
        .from('survey_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      setInvitations(prev => prev.filter(invite => invite.id !== invitationId));
      toast.success('Invitation cancelled');
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const copyInviteLink = (invitationId) => {
    const inviteLink = `${window.location.origin}/survey/invite/${invitationId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor': return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'viewer': return <Eye className="w-4 h-4 text-green-600" />;
      default: return <UserCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <FeatureGate
      userPlan={userPlan}
      feature="collaboration.team"
      fallback={
        <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg text-center">
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
          <p className="text-gray-600 mb-4">
            Invite team members, assign roles, and collaborate on surveys together
          </p>
          <button
            onClick={() => window.location.href = '/app/subscriptions'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upgrade to Pro
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Team Collaboration
            </h2>
            <p className="text-gray-600">Manage team members and their access to this survey</p>
          </div>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </button>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Team Members ({teamMembers.length})</h3>
          </div>
          
          {teamMembers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No team members yet</p>
              <p className="text-sm text-gray-500">Invite team members to collaborate on this survey</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {member.user.full_name?.charAt(0) || member.user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.user.full_name || member.user.email}
                      </p>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(member.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getRoleColor(member.role)}`}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Remove member"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Pending Invitations ({invitations.length})</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-600">
                        Invited as {invitation.role} • {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyInviteLink(invitation.id)}
                      className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Copy invite link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cancelInvitation(invitation.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Cancel invitation"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Permissions */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getRoleIcon(role.id)}
                  <h4 className="font-medium text-gray-900">{role.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                
                <div className="space-y-2">
                  {role.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Invite Team Member</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Hi! I'd like to invite you to collaborate on this survey..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvitation}
                  disabled={loading || !inviteEmail.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </FeatureGate>
  );
};

export default TeamCollaboration;
