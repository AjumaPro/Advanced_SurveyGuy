import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { supabase } from '../lib/supabase';
import FreePlanDashboard from './FreePlanDashboard';
import ProPlanDashboard from './ProPlanDashboard';
import EnterprisePlanDashboard from './EnterprisePlanDashboard';
import { RefreshCw } from 'lucide-react';

const PlanBasedDashboard = () => {
  const { user, userProfile } = useAuth();
  const { currentPlan, isFreePlan, isProPlan, isEnterprisePlan } = useFeatureAccess();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    surveys: [],
    responses: [],
    teamMembers: [],
    organizations: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch surveys
      const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
      }

      // Fetch responses for user's surveys
      let responses = [];
      if (surveys && surveys.length > 0) {
        const surveyIds = surveys.map(s => s.id);
        const { data: responseData, error: responsesError } = await supabase
          .from('survey_responses')
          .select('*')
          .in('survey_id', surveyIds);

        if (responsesError) {
          console.error('Error fetching responses:', responsesError);
        } else {
          responses = responseData || [];
        }
      }

      // Fetch team members (if Pro or Enterprise)
      let teamMembers = [];
      if (isProPlan() || isEnterprisePlan()) {
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .eq('team_owner_id', user.id);

        if (teamError) {
          console.error('Error fetching team members:', teamError);
        } else {
          teamMembers = teamData || [];
        }
      }

      // Fetch organizations (if Enterprise)
      let organizations = [];
      if (isEnterprisePlan()) {
        // In a real implementation, this would fetch organization data
        // For now, we'll use mock data
        organizations = [
          { id: '1', name: 'Main Organization', role: 'owner' }
        ];
      }

      setData({
        surveys: surveys || [],
        responses: responses || [],
        teamMembers: teamMembers || [],
        organizations: organizations || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on plan
  if (isFreePlan()) {
    return (
      <FreePlanDashboard 
        surveys={data.surveys}
        responses={data.responses}
      />
    );
  }

  if (isProPlan()) {
    return (
      <ProPlanDashboard 
        surveys={data.surveys}
        responses={data.responses}
        teamMembers={data.teamMembers}
      />
    );
  }

  if (isEnterprisePlan()) {
    return (
      <EnterprisePlanDashboard 
        surveys={data.surveys}
        responses={data.responses}
        teamMembers={data.teamMembers}
        organizations={data.organizations}
      />
    );
  }

  // Fallback to Free plan if plan is not recognized
  return (
    <FreePlanDashboard 
      surveys={data.surveys}
      responses={data.responses}
    />
  );
};

export default PlanBasedDashboard;
