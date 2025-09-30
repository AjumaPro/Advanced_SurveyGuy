import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import api from '../services/api';
import FeatureGate from '../components/FeatureGate';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  Star,
  Zap,
  X,
  Save,
  AlertTriangle,
  Clock
} from 'lucide-react';

const Team = () => {
  const { user } = useAuth();
  const { hasFeature, canAddTeamMember, getPlanLimits, currentPlan } = useFeatureAccess();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);

  const limits = getPlanLimits();

  useEffect(() => {
    if (user && hasFeature('team_collaboration')) {
    fetchTeamMembers();
    }
  }, [user, hasFeature]);

  const fetchTeamMembers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.team.getTeamMembers(user.id);
      if (response.error) {
        console.error('Error fetching team members:', response.error);
        toast.error('Failed to load team members');
        setTeamMembers([]);
      } else {
        setTeamMembers(response.teamMembers || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteTeamMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!canAddTeamMember(teamMembers.length)) {
      toast.error(`Your ${currentPlan} plan allows up to ${limits.team_members} team members`);
      return;
    }

    try {
      setInviting(true);
      const response = await api.team.inviteTeamMember(user.id, inviteEmail, inviteRole);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('member');
        setShowInviteModal(false);
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error inviting team member:', error);
      toast.error('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveTeamMember = async (teamMemberId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      try {
        const response = await api.team.removeTeamMember(teamMemberId);
        if (response.error) {
          toast.error(response.error);
        } else {
      toast.success('Team member removed successfully');
          fetchTeamMembers();
        }
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
      }
    }
  };

  const handleUpdateRole = async (teamMemberId, newRole) => {
    try {
      const response = await api.team.updateTeamMemberRole(teamMemberId, newRole);
      if (response.error) {
        toast.error(response.error);
      } else {
      toast.success('Role updated successfully');
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin': return <Shield className="w-4 h-4 text-red-600" />;
      default: return <Users className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <FeatureGate feature="team_collaboration">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>Team Management</span>
            </h1>
            <p className="text-gray-600">
              Collaborate with your team members • {teamMembers.length}/{limits.team_members === -1 ? '∞' : limits.team_members} members
            </p>
        </div>
          
        <button
          onClick={() => setShowInviteModal(true)}
            disabled={!canAddTeamMember(teamMembers.length)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
        </button>
      </div>

        {/* Plan Badge */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Team Collaboration Feature</h3>
              <p className="text-sm text-gray-600">
                Invite team members to collaborate on surveys and share insights
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {currentPlan === 'enterprise' ? 'Enterprise' : 'Pro'} Plan
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            <p className="text-gray-600 text-sm">Manage your team and collaboration settings</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No team members yet</h3>
              <p className="text-gray-600 mb-4">Invite your first team member to start collaborating</p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Invite Team Member
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {getRoleIcon(member.role)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {member.member?.full_name || member.member?.email || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-600">{member.member?.email}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {member.joined_at 
                                ? `Joined ${new Date(member.joined_at).toLocaleDateString()}` 
                                : `Invited ${new Date(member.invited_at).toLocaleDateString()}`
                              }
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(member.joined_at ? 'active' : 'pending')}
                        <span className="text-sm text-gray-600">
                          {member.joined_at ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      
                      {member.role !== 'owner' && (
                      <div className="flex items-center space-x-2">
                            <select
                              value={member.role}
                            onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>
                          
                            <button
                            onClick={() => handleRemoveTeamMember(member.id, member.member?.full_name || member.member?.email)}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        )}
                      </div>
                  </div>
                </motion.div>
                ))}
          </div>
          )}
      </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">Total Members</h3>
                <p className="text-2xl font-bold text-blue-600">{teamMembers.length}</p>
            </div>
            </div>
            <p className="text-sm text-gray-600">
              {limits.team_members === -1 ? 'Unlimited' : `${limits.team_members - teamMembers.length} slots remaining`}
            </p>
        </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Members</h3>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.joined_at).length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Members who have joined</p>
                </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Mail className="w-6 h-6 text-yellow-600" />
                </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pending Invites</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {teamMembers.filter(m => !m.joined_at).length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Awaiting acceptance</p>
        </div>
      </div>

      {/* Invite Modal */}
        <AnimatePresence>
      {showInviteModal && (
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
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleInviteTeamMember} className="space-y-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="colleague@company.com"
                      required
                />
              </div>
              
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                      <option value="member">Member - Can view and create surveys</option>
                      <option value="admin">Admin - Can manage team and settings</option>
                </select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Team Limits:</p>
                        <p>Your {currentPlan} plan allows up to {limits.team_members === -1 ? 'unlimited' : limits.team_members} team members.</p>
                        <p>Currently using: {teamMembers.length} slots</p>
                      </div>
              </div>
            </div>

                  <div className="flex space-x-3 pt-4">
              <button
                      type="button"
                onClick={() => setShowInviteModal(false)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                      type="submit"
                      disabled={inviting || !canAddTeamMember(teamMembers.length)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {inviting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Invitation</span>
                        </>
                      )}
              </button>
            </div>
                </form>
              </motion.div>
            </motion.div>
      )}
        </AnimatePresence>
    </div>
    </FeatureGate>
  );
};

export default Team; 