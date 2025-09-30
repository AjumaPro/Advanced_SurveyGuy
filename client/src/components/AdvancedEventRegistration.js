import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdvancedEventRegistration = ({ eventId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    ticketType: 'all',
    searchTerm: ''
  });
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    waitlist: 0
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: FileText },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone Number', icon: Phone },
    { value: 'select', label: 'Dropdown', icon: FileText },
    { value: 'multiselect', label: 'Multi-Select', icon: FileText },
    { value: 'checkbox', label: 'Checkbox', icon: CheckCircle },
    { value: 'radio', label: 'Radio Buttons', icon: CheckCircle },
    { value: 'textarea', label: 'Text Area', icon: FileText },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'number', label: 'Number', icon: FileText },
    { value: 'file', label: 'File Upload', icon: FileText },
    { value: 'rating', label: 'Rating', icon: Star }
  ];

  useEffect(() => {
    fetchRegistrations();
    fetchCustomFields();
  }, [eventId]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Mock registration data - replace with actual API call
      const mockRegistrations = [
        {
          id: 'reg_001',
          attendeeName: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0123',
          ticketType: 'VIP',
          status: 'confirmed',
          registrationDate: '2024-01-10T14:30:00Z',
          paymentStatus: 'paid',
          customFields: {
            company: 'Tech Corp',
            dietaryRestrictions: 'Vegetarian',
            tshirtSize: 'L',
            experience: 'Advanced',
            interests: ['AI', 'Machine Learning', 'Data Science']
          },
          checkInStatus: 'not_checked_in',
          notes: 'VIP guest, needs special seating'
        },
        {
          id: 'reg_002',
          attendeeName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1-555-0456',
          ticketType: 'Standard',
          status: 'confirmed',
          registrationDate: '2024-01-09T16:45:00Z',
          paymentStatus: 'paid',
          customFields: {
            company: 'StartupXYZ',
            dietaryRestrictions: 'None',
            tshirtSize: 'M',
            experience: 'Intermediate',
            interests: ['Networking', 'Business Development']
          },
          checkInStatus: 'checked_in',
          notes: ''
        },
        {
          id: 'reg_003',
          attendeeName: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1-555-0789',
          ticketType: 'Student',
          status: 'pending',
          registrationDate: '2024-01-08T11:20:00Z',
          paymentStatus: 'pending',
          customFields: {
            company: 'University of Tech',
            dietaryRestrictions: 'Gluten-free',
            tshirtSize: 'S',
            experience: 'Beginner',
            interests: ['Learning', 'Career Development']
          },
          checkInStatus: 'not_checked_in',
          notes: 'Student discount applied'
        }
      ];

      setRegistrations(mockRegistrations);
      
      // Calculate stats
      const statsData = mockRegistrations.reduce((acc, reg) => {
        acc.total++;
        acc[reg.status]++;
        return acc;
      }, { total: 0, confirmed: 0, pending: 0, cancelled: 0, waitlist: 0 });
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomFields = async () => {
    try {
      // Mock custom fields - replace with actual API call
      const mockFields = [
        {
          id: 'field_001',
          name: 'company',
          label: 'Company/Organization',
          type: 'text',
          required: true,
          order: 1,
          options: null
        },
        {
          id: 'field_002',
          name: 'dietaryRestrictions',
          label: 'Dietary Restrictions',
          type: 'select',
          required: false,
          order: 2,
          options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other']
        },
        {
          id: 'field_003',
          name: 'tshirtSize',
          label: 'T-Shirt Size',
          type: 'radio',
          required: true,
          order: 3,
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: 'field_004',
          name: 'experience',
          label: 'Experience Level',
          type: 'select',
          required: true,
          order: 4,
          options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        },
        {
          id: 'field_005',
          name: 'interests',
          label: 'Areas of Interest',
          type: 'multiselect',
          required: false,
          order: 5,
          options: ['AI', 'Machine Learning', 'Data Science', 'Networking', 'Business Development', 'Career Development', 'Learning']
        }
      ];

      setCustomFields(mockFields);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      ));
      toast.success(`Registration status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update registration status');
    }
  };

  const handleBulkAction = async (action) => {
    try {
      // Simulate bulk action
      if (action === 'send_reminder') {
        toast.success(`Reminder emails sent to ${selectedRegistrations.length} attendees`);
      } else if (action === 'export_selected') {
        toast.success(`Exported ${selectedRegistrations.length} registrations`);
      }
      setSelectedRegistrations([]);
      setShowBulkActionModal(false);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesStatus = filters.status === 'all' || registration.status === filters.status;
    const matchesTicketType = filters.ticketType === 'all' || registration.ticketType === filters.ticketType;
    const matchesSearch = 
      registration.attendeeName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesStatus && matchesTicketType && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      waitlist: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: UserCheck,
      pending: Clock,
      cancelled: UserX,
      waitlist: Users
    };
    return icons[status] || Users;
  };

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {[
        { key: 'total', label: 'Total Registrations', color: 'blue' },
        { key: 'confirmed', label: 'Confirmed', color: 'green' },
        { key: 'pending', label: 'Pending', color: 'yellow' },
        { key: 'cancelled', label: 'Cancelled', color: 'red' },
        { key: 'waitlist', label: 'Waitlist', color: 'purple' }
      ].map(({ key, label, color }) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{stats[key]}</p>
            </div>
            <Users className={`w-8 h-8 text-${color}-600`} />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const CustomFieldModal = () => (
    <AnimatePresence>
      {showCustomFieldModal && (
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
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Custom Registration Fields</h2>
              <button
                onClick={() => setShowCustomFieldModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {customFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{field.label}</div>
                      <div className="text-sm text-gray-600">
                        {field.type} • {field.required ? 'Required' : 'Optional'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                onClick={() => setShowCustomFieldModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const RegistrationsTable = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Registrations</h3>
          <div className="flex items-center space-x-3">
            {selectedRegistrations.length > 0 && (
              <button
                onClick={() => setShowBulkActionModal(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Bulk Actions ({selectedRegistrations.length})
              </button>
            )}
            <button
              onClick={() => setShowCustomFieldModal(true)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Custom Fields
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRegistrations.length === filteredRegistrations.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRegistrations(filteredRegistrations.map(r => r.id));
                    } else {
                      setSelectedRegistrations([]);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistrations.map((registration) => {
              const StatusIcon = getStatusIcon(registration.status);
              return (
                <tr key={registration.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(registration.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegistrations(prev => [...prev, registration.id]);
                        } else {
                          setSelectedRegistrations(prev => prev.filter(id => id !== registration.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.attendeeName}
                      </div>
                      <div className="text-sm text-gray-500">{registration.email}</div>
                      <div className="text-sm text-gray-500">{registration.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {registration.ticketType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.checkInStatus === 'checked_in' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {registration.checkInStatus === 'checked_in' ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Send className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Registration Management</h1>
          <p className="text-gray-600">Manage attendee registrations and custom forms</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Manual Registration</span>
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="waitlist">Waitlist</option>
            </select>
            <select
              value={filters.ticketType}
              onChange={(e) => setFilters(prev => ({ ...prev, ticketType: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ticket Types</option>
              <option value="VIP">VIP</option>
              <option value="Standard">Standard</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <RegistrationsTable />

      {/* Custom Field Modal */}
      <CustomFieldModal />
    </div>
  );
};

export default AdvancedEventRegistration;
