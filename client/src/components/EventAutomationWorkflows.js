import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Clock,
  Mail,
  MessageSquare,
  Users,
  Calendar,
  Bell,
  Target,
  ArrowRight,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const EventAutomationWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const workflowTemplates = [
    {
      id: 'welcome-sequence',
      name: 'Welcome Email Sequence',
      description: 'Automated welcome emails for new registrants',
      category: 'email',
      triggers: ['registration_confirmed'],
      actions: [
        { type: 'wait', duration: '1 hour' },
        { type: 'email', template: 'welcome' },
        { type: 'wait', duration: '3 days' },
        { type: 'email', template: 'event_details' },
        { type: 'wait', duration: '1 day_before_event' },
        { type: 'email', template: 'reminder' }
      ]
    },
    {
      id: 'reminder-system',
      name: 'Event Reminder System',
      description: 'Multi-channel reminders before events',
      category: 'notification',
      triggers: ['event_approaching'],
      actions: [
        { type: 'email', template: 'reminder_7_days' },
        { type: 'wait', duration: '5 days' },
        { type: 'sms', template: 'reminder_2_days' },
        { type: 'wait', duration: '1 day' },
        { type: 'push_notification', template: 'reminder_1_day' }
      ]
    },
    {
      id: 'follow-up-sequence',
      name: 'Post-Event Follow-up',
      description: 'Automated follow-up after event completion',
      category: 'engagement',
      triggers: ['event_completed'],
      actions: [
        { type: 'wait', duration: '2 hours' },
        { type: 'email', template: 'thank_you' },
        { type: 'wait', duration: '1 day' },
        { type: 'survey', template: 'feedback_survey' },
        { type: 'wait', duration: '1 week' },
        { type: 'email', template: 'upcoming_events' }
      ]
    },
    {
      id: 'capacity-management',
      name: 'Capacity Management',
      description: 'Automated actions based on registration capacity',
      category: 'management',
      triggers: ['capacity_threshold'],
      actions: [
        { type: 'condition', rule: 'capacity > 80%' },
        { type: 'email', template: 'admin_alert_high_capacity' },
        { type: 'condition', rule: 'capacity = 100%' },
        { type: 'update_status', value: 'waitlist' },
        { type: 'email', template: 'waitlist_notification' }
      ]
    }
  ];

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockWorkflows = [
        {
          id: 1,
          name: 'Welcome Email Sequence',
          description: 'Automated welcome emails for new registrants',
          status: 'active',
          trigger: 'registration_confirmed',
          totalRuns: 1250,
          successRate: 94.5,
          lastRun: '2024-01-10T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          actions: [
            { type: 'wait', duration: '1 hour', description: 'Wait 1 hour' },
            { type: 'email', template: 'welcome', description: 'Send welcome email' },
            { type: 'wait', duration: '3 days', description: 'Wait 3 days' },
            { type: 'email', template: 'event_details', description: 'Send event details' }
          ]
        },
        {
          id: 2,
          name: 'Event Reminder System',
          description: 'Multi-channel reminders before events',
          status: 'active',
          trigger: 'event_approaching',
          totalRuns: 856,
          successRate: 98.2,
          lastRun: '2024-01-09T15:45:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          actions: [
            { type: 'email', template: 'reminder_7_days', description: 'Email reminder (7 days)' },
            { type: 'wait', duration: '5 days', description: 'Wait 5 days' },
            { type: 'sms', template: 'reminder_2_days', description: 'SMS reminder (2 days)' }
          ]
        }
      ];

      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWorkflow = async (workflowId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? { ...w, status: newStatus } : w
      ));
      toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error('Failed to update workflow status');
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        setWorkflows(prev => prev.filter(w => w.id !== workflowId));
        toast.success('Workflow deleted successfully');
      } catch (error) {
        toast.error('Failed to delete workflow');
      }
    }
  };

  const getActionIcon = (actionType) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      wait: Clock,
      survey: Target,
      push_notification: Bell,
      condition: Settings,
      update_status: CheckCircle
    };
    return icons[actionType] || Settings;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const WorkflowCard = ({ workflow }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
            <p className="text-gray-600 text-sm">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
            {workflow.status}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedWorkflow(workflow)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteWorkflow(workflow.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{workflow.totalRuns}</div>
          <div className="text-xs text-gray-600">Total Runs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{workflow.successRate}%</div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {new Date(workflow.lastRun).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-600">Last Run</div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Workflow Steps:</div>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {workflow.actions.map((action, index) => {
            const IconComponent = getActionIcon(action.type);
            return (
              <React.Fragment key={index}>
                <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                  <IconComponent className="w-3 h-3" />
                  <span>{action.description || action.type}</span>
                </div>
                {index < workflow.actions.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const CreateWorkflowModal = () => (
    <AnimatePresence>
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Workflow</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflowTemplates.map(template => (
                <div key={template.id} className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <button
                      onClick={() => {
                        // Handle template selection
                        toast.success('Workflow template selected');
                        setShowCreateModal(false);
                      }}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Custom Workflow
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Automation</h1>
          <p className="text-gray-600">Automate your event workflows and communications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.filter(w => w.status === 'active').length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.reduce((sum, w) => sum + w.totalRuns, 0).toLocaleString()}
              </p>
            </div>
            <Play className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.length > 0 
                  ? (workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900">127h</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map(workflow => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600 mb-6">Create your first automation workflow to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Workflow
          </button>
        </div>
      )}

      <CreateWorkflowModal />
    </div>
  );
};

export default EventAutomationWorkflows;
