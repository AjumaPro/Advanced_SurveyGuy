import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Mail,
  Crown,
  Shield,
  UserCheck,
  Eye,
  X,
  Send,
  Check,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const MemberInvitationModal = ({ isOpen, onClose, team, onInvitationSent }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [errors, setErrors] = useState({});

  const roles = [
    {
      value: 'viewer',
      label: 'Viewer',
      description: 'Can view surveys and reports',
      icon: Eye,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      value: 'member',
      label: 'Member',
      description: 'Can view and comment on surveys',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      value: 'editor',
      label: 'Editor',
      description: 'Can create and edit surveys',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Can manage team settings and members',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const addInvitation = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (invitations.some(inv => inv.email.toLowerCase() === email.toLowerCase())) {
      newErrors.email = 'This email is already in the invitation list';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setInvitations(prev => [...prev, {
        id: Date.now(),
        email: email.trim(),
        role: role,
        status: 'pending'
      }]);
      setEmail('');
    }
  };

  const removeInvitation = (id) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const sendInvitations = async () => {
    if (invitations.length === 0) {
      toast.error('Please add at least one invitation');
      return;
    }

    setLoading(true);
    try {
      const invitationPromises = invitations.map(async (invitation) => {
        const { data, error } = await supabase
          .rpc('create_team_invitation', {
            p_team_id: team.id,
            p_email: invitation.email,
            p_role: invitation.role,
            p_invited_by: user.id
          });

        if (error) throw error;
        return data;
      });

      await Promise.all(invitationPromises);

      // TODO: Send actual email invitations
      // This would integrate with your email service (Resend, SendGrid, etc.)
      
      toast.success(`🎉 ${invitations.length} invitation${invitations.length > 1 ? 's' : ''} sent successfully!`);
      
      if (onInvitationSent) {
        onInvitationSent(invitations);
      }
      
      onClose();
      setInvitations([]);
      setEmail('');

    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error(error.message || 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleValue) => {
    const roleObj = roles.find(r => r.value === roleValue);
    return roleObj ? roleObj.icon : UserCheck;
  };

  const getRoleColor = (roleValue) => {
    const roleObj = roles.find(r => r.value === roleValue);
    return roleObj ? roleObj.color : 'text-gray-600';
  };

  const getRoleBgColor = (roleValue) => {
    const roleObj = roles.find(r => r.value === roleValue);
    return roleObj ? roleObj.bgColor : 'bg-gray-100';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Invite Team Members</h2>
                <p className="text-gray-600 mt-1">Invite people to join "{team?.name}"</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
            {/* Add Invitation Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Add New Invitation</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addInvitation()}
                      placeholder="colleague@company.com"
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      onClick={addInvitation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roles.map((roleOption) => (
                      <option key={roleOption.value} value={roleOption.value}>
                        {roleOption.label} - {roleOption.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Invitation List */}
            {invitations.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Pending Invitations ({invitations.length})
                </h3>
                
                <div className="space-y-3">
                  {invitations.map((invitation) => {
                    const RoleIcon = getRoleIcon(invitation.role);
                    return (
                      <div key={invitation.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invitation.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBgColor(invitation.role)} ${getRoleColor(invitation.role)}`}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                <span className="capitalize">{invitation.role}</span>
                              </span>
                              <span className="text-xs text-gray-500">Pending</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeInvitation(invitation.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Role Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Role Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map((roleOption) => {
                  const Icon = roleOption.icon;
                  return (
                    <div key={roleOption.value} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                      <div className={`p-2 rounded-lg ${roleOption.bgColor}`}>
                        <Icon className={`w-4 h-4 ${roleOption.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{roleOption.label}</p>
                        <p className="text-sm text-gray-600">{roleOption.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Limits Info */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Team Limits</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Current plan allows up to {team?.max_members || 5} team members. 
                    You currently have {team?.total_members || 0} members.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {invitations.length > 0 && (
                  <span>{invitations.length} invitation{invitations.length > 1 ? 's' : ''} ready to send</span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvitations}
                  disabled={loading || invitations.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Invitations</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemberInvitationModal;
