import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Palette, 
  Settings, 
  Check, 
  X, 
  Plus,
  Crown,
  Shield,
  UserCheck,
  Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TeamCreationModal = ({ isOpen, onClose, onTeamCreated }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    plan: 'free',
    max_members: 5
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Branding', icon: Palette },
    { id: 3, title: 'Settings', icon: Settings },
    { id: 4, title: 'Review', icon: Check }
  ];

  const planLimits = {
    free: { members: 5, surveys: 10, responses: 1000 },
    pro: { members: 25, surveys: 100, responses: 10000 },
    enterprise: { members: 100, surveys: 1000, responses: 100000 }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!teamData.name.trim()) {
          newErrors.name = 'Team name is required';
        } else if (teamData.name.length < 2) {
          newErrors.name = 'Team name must be at least 2 characters';
        } else if (teamData.name.length > 255) {
          newErrors.name = 'Team name must be less than 255 characters';
        }
        break;
      case 2:
        // Color validation is handled by input type="color"
        break;
      case 3:
        if (teamData.max_members < 2) {
          newErrors.max_members = 'Minimum 2 members required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateTeam = async () => {
    setLoading(true);
    try {
      // Generate slug from team name
      const slug = teamData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          slug: slug,
          description: teamData.description,
          primary_color: teamData.primary_color,
          secondary_color: teamData.secondary_color,
          plan: teamData.plan,
          max_members: teamData.max_members
        })
        .select()
        .single();

      if (teamError) {
        throw teamError;
      }

      // Add creator as team owner
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner',
          status: 'active'
        });

      if (memberError) {
        throw memberError;
      }

      // Log team creation activity
      await supabase
        .from('team_activities')
        .insert({
          team_id: team.id,
          user_id: user.id,
          activity_type: 'team_created',
          entity_type: 'team',
          entity_id: team.id,
          description: `Created team "${teamData.name}"`
        });

      toast.success('🎉 Team created successfully!');
      
      if (onTeamCreated) {
        onTeamCreated(team);
      }
      
      onClose();
      
      // Reset form
      setTeamData({
        name: '',
        description: '',
        primary_color: '#3B82F6',
        secondary_color: '#1E40AF',
        plan: 'free',
        max_members: 5
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Information</h3>
              <p className="text-gray-600">Let's start with the basics about your team</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={teamData.name}
                  onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter team name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="teamDescription"
                  value={teamData.description}
                  onChange={(e) => setTeamData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your team's purpose and goals"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Palette className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Branding</h3>
              <p className="text-gray-600">Customize your team's appearance</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={teamData.primary_color}
                      onChange={(e) => setTeamData(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{teamData.primary_color}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={teamData.secondary_color}
                      onChange={(e) => setTeamData(prev => ({ ...prev, secondary_color: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{teamData.secondary_color}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
                <div 
                  className="p-4 rounded-lg text-white"
                  style={{ 
                    background: `linear-gradient(135deg, ${teamData.primary_color}, ${teamData.secondary_color})` 
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold">{teamData.name || 'Your Team'}</h5>
                      <p className="text-sm opacity-90">{teamData.description || 'Team description'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Settings</h3>
              <p className="text-gray-600">Configure your team's limits and permissions</p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="teamPlan" className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  id="teamPlan"
                  value={teamData.plan}
                  onChange={(e) => setTeamData(prev => ({ 
                    ...prev, 
                    plan: e.target.value,
                    max_members: planLimits[e.target.value].members
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="free">Free Plan</option>
                  <option value="pro">Pro Plan</option>
                  <option value="enterprise">Enterprise Plan</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {teamData.plan.charAt(0).toUpperCase() + teamData.plan.slice(1)} Plan Includes:
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Up to {planLimits[teamData.plan].members} team members</li>
                  <li>• Up to {planLimits[teamData.plan].surveys} surveys</li>
                  <li>• Up to {planLimits[teamData.plan].responses.toLocaleString()} responses per survey</li>
                  <li>• {teamData.plan === 'free' ? 'Basic' : teamData.plan === 'pro' ? 'Advanced' : 'Premium'} collaboration features</li>
                </ul>
              </div>

              <div>
                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Team Members
                </label>
                <input
                  type="number"
                  id="maxMembers"
                  value={teamData.max_members}
                  onChange={(e) => setTeamData(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                  min="2"
                  max={planLimits[teamData.plan].members}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.max_members ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.max_members && <p className="text-red-500 text-sm mt-1">{errors.max_members}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Maximum: {planLimits[teamData.plan].members} members (based on plan)
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Create</h3>
              <p className="text-gray-600">Review your team settings before creating</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Team Information</h4>
                <p><strong>Name:</strong> {teamData.name}</p>
                <p><strong>Description:</strong> {teamData.description || 'No description'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Branding</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: teamData.primary_color }}
                    />
                    <span className="text-sm">Primary: {teamData.primary_color}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: teamData.secondary_color }}
                    />
                    <span className="text-sm">Secondary: {teamData.secondary_color}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Settings</h4>
                <p><strong>Plan:</strong> {teamData.plan.charAt(0).toUpperCase() + teamData.plan.slice(1)}</p>
                <p><strong>Max Members:</strong> {teamData.max_members}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
                <h2 className="text-2xl font-bold text-gray-900">Create New Team</h2>
                <p className="text-gray-600 mt-1">Step {currentStep} of {steps.length}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded-full ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center space-x-3">
                {currentStep === steps.length ? (
                  <button
                    onClick={handleCreateTeam}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Team</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamCreationModal;
