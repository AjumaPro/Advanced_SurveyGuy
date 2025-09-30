import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Crown,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MoreVertical,
  Send,
  Key,
  Building,
  Globe,
  Zap,
  BarChart3,
  Activity,
  Bell,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const TeamManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'admin',
      status: 'active',
      lastActive: '2024-01-15T10:30:00Z',
      permissions: ['surveys', 'analytics', 'team', 'billing'],
      department: 'Product',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      avatar: null,
      joinedAt: '2023-06-15T09:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'editor',
      status: 'active',
      lastActive: '2024-01-14T16:45:00Z',
      permissions: ['surveys', 'analytics'],
      department: 'Marketing',
      location: 'New York, NY',
      phone: '+1 (555) 987-6543',
      avatar: null,
      joinedAt: '2023-08-20T14:30:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'viewer',
      status: 'pending',
      lastActive: null,
      permissions: ['surveys'],
      department: 'Sales',
      location: 'Los Angeles, CA',
      phone: '+1 (555) 456-7890',
      avatar: null,
      joinedAt: '2024-01-10T11:15:00Z'
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all features and settings',
      permissions: ['surveys', 'analytics', 'team', 'billing', 'settings'],
      color: 'bg-red-500',
      memberCount: 1
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can create and edit surveys, view analytics',
      permissions: ['surveys', 'analytics'],
      color: 'bg-blue-500',
      memberCount: 1
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to surveys and basic analytics',
      permissions: ['surveys'],
      color: 'bg-green-500',
      memberCount: 1
    },
    {
      id: 'billing',
      name: 'Billing Manager',
      description: 'Manage subscriptions and billing',
      permissions: ['billing', 'analytics'],
      color: 'bg-purple-500',
      memberCount: 0
    }
  ]);

  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'viewer',
    message: ''
  });

  const tabs = [
    { id: 'members', label: 'Team Members', icon: <Users className="w-4 h-4" /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield className="w-4 h-4" /> },
    { id: 'invites', label: 'Invitations', icon: <Mail className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity Log', icon: <Activity className="w-4 h-4" /> }
  ];

  const permissions = [
    {
      id: 'surveys',
      name: 'Surveys',
      description: 'Create, edit, and manage surveys',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'View survey analytics and reports',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'team',
      name: 'Team Management',
      description: 'Manage team members and roles',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'billing',
      name: 'Billing',
      description: 'Manage subscriptions and billing',
      icon: <Crown className="w-4 h-4" />
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Access system settings and configuration',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      // Load team data from API
      // const response = await api.get('/team/members');
      // setTeamMembers(response.data.members);
      // setRoles(response.data.roles);
    } catch (error) {
      console.error('Failed to load team data:', error);
    }
  };

  const handleInviteMember = async () => {
    setLoading(true);
    try {
      // await api.post('/team/invite', inviteData);
      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteData({ email: '', role: 'viewer', message: '' });
    } catch (error) {
      toast.error('Failed to send invitation');
      console.error('Invite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      // await api.put(`/team/members/${memberId}/role`, { role: newRole });
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      toast.success('Role updated successfully!');
    } catch (error) {
      toast.error('Failed to update role');
      console.error('Update error:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      // await api.delete(`/team/members/${memberId}`);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Member removed successfully!');
    } catch (error) {
      toast.error('Failed to remove member');
      console.error('Remove error:', error);
    }
  };

  const handleResendInvite = async (memberId) => {
    try {
      // await api.post(`/team/invite/resend/${memberId}`);
      toast.success('Invitation resent successfully!');
    } catch (error) {
      toast.error('Failed to resend invitation');
      console.error('Resend error:', error);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId) || roles[0];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderMembersTab = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => {
          const roleInfo = getRoleInfo(member.role);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${roleInfo.color}`}>
                    {roleInfo.name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm text-gray-900">{member.department}</span>
                </div>

                {member.lastActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Active</span>
                    <span className="text-sm text-gray-900">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setShowRoleModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                
                {member.status === 'pending' && (
                  <button
                    onClick={() => handleResendInvite(member.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Resend
                  </button>
                )}
                
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedRole !== 'all' 
              ? 'Try adjusting your search criteria' 
              : 'Start building your team by inviting members'
            }
          </p>
          {(!searchTerm && selectedRole === 'all') && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <UserPlus className="w-4 h-4" />
              Invite First Member
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderRolesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Roles & Permissions</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center text-white`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{role.memberCount} members</span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Permissions</h4>
              <div className="space-y-2">
                {permissions.map(permission => (
                  <div key={permission.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      role.permissions.includes(permission.id) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {role.permissions.includes(permission.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {permission.icon}
                        <span className="font-medium text-gray-900">{permission.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvitesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Pending Invitations</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Send Invitation
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invitee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.filter(member => member.status === 'pending').map(member => {
                const roleInfo = getRoleInfo(member.role);
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${roleInfo.color}`}>
                        {roleInfo.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResendInvite(member.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Team Activity</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="space-y-4 p-6">
          {[
            {
              id: 1,
              user: 'John Smith',
              action: 'invited Sarah Johnson to the team',
              timestamp: '2024-01-15T10:30:00Z',
              type: 'team'
            },
            {
              id: 2,
              user: 'Sarah Johnson',
              action: 'created a new survey: Customer Feedback Q1',
              timestamp: '2024-01-14T16:45:00Z',
              type: 'survey'
            },
            {
              id: 3,
              user: 'John Smith',
              action: 'updated team permissions for Editor role',
              timestamp: '2024-01-14T09:15:00Z',
              type: 'permissions'
            },
            {
              id: 4,
              user: 'Mike Chen',
              action: 'joined the team',
              timestamp: '2024-01-10T11:15:00Z',
              type: 'team'
            }
          ].map(activity => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{activity.user}</span>
                  <span className="text-gray-600">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                Team Management
              </h1>
              <p className="text-gray-600 mt-1">Advanced role-based access control</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter(m => m.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'members' && renderMembersTab()}
                {activeTab === 'roles' && renderRolesTab()}
                {activeTab === 'invites' && renderInvitesTab()}
                {activeTab === 'activity' && renderActivityTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
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
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="colleague@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add a personal message to your invitation..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={loading || !inviteData.email}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
