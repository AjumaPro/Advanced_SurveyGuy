import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Settings,
  Crown,
  Shield,
  UserCheck,
  Eye,
  MoreVertical,
  Building2,
  Calendar,
  BarChart3,
  MessageSquare,
  FileText,
  Activity,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import TeamCreationModal from '../components/TeamManagement/TeamCreationModal';
import TeamDashboard from '../components/TeamManagement/TeamDashboard';
import MemberInvitationModal from '../components/TeamManagement/MemberInvitationModal';

const Teams = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadUserTeams();
  }, [user]);

  const loadUserTeams = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          teams (
            id,
            name,
            slug,
            description,
            primary_color,
            secondary_color,
            plan,
            max_members,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userTeams = data?.map(item => ({
        ...item.teams,
        userRole: item.role,
        joinedAt: item.joined_at,
        isOwner: item.role === 'owner'
      })) || [];

      setTeams(userTeams);

      // Auto-select first team if none selected
      if (userTeams.length > 0 && !selectedTeam) {
        setSelectedTeam(userTeams[0]);
      }

    } catch (error) {
      console.error('Error loading teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamCreated = (newTeam) => {
    // Reload teams to include the new one
    loadUserTeams();
    
    // Select the newly created team
    const teamWithRole = {
      ...newTeam,
      userRole: 'owner',
      joinedAt: new Date().toISOString(),
      isOwner: true
    };
    setSelectedTeam(teamWithRole);
  };

  const handleInvitationSent = () => {
    // Refresh team data to show updated member count
    loadUserTeams();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'editor': return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || team.userRole === filterRole;
    return matchesSearch && matchesRole;
  });

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
            <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
            <p className="text-gray-600 mt-2">Work together seamlessly on surveys and projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Team</span>
          </button>
        </div>

        {teams.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teams Yet</h3>
              <p className="text-gray-600 mb-8">
                Create your first team to start collaborating with colleagues on surveys and projects.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Team</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Teams Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Search and Filter */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                {/* Teams List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Your Teams</h3>
                  {filteredTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedTeam(team)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTeam?.id === team.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                          style={{
                            background: `linear-gradient(135deg, ${team.primary_color}, ${team.secondary_color})`
                          }}
                        >
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{team.name}</p>
                          <p className="text-sm text-gray-600 truncate">{team.description || 'No description'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(team.userRole)}`}>
                          {getRoleIcon(team.userRole)}
                          <span className="ml-1 capitalize">{team.userRole}</span>
                        </span>
                        {team.isOwner && (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedTeam ? (
                <TeamDashboard 
                  team={selectedTeam} 
                  onTeamUpdate={loadUserTeams}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Team</h3>
                  <p className="text-gray-600">Choose a team from the sidebar to view its dashboard</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        <TeamCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTeamCreated={handleTeamCreated}
        />

        <MemberInvitationModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          team={selectedTeam}
          onInvitationSent={handleInvitationSent}
        />
      </div>
    </div>
  );
};

export default Teams;
