import React, { useState } from 'react';
import { X, Download, Mail, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const RegistrationsModal = ({ event, registrations, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredRegistrations = registrations
    .filter(reg => 
      reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name);
        case 'date':
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        case 'attendees':
          return b.attendees - a.attendees;
        default:
          return 0;
      }
    });

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Attendees',
      'Registration Date',
      'Template',
      'Company',
      'Position',
      'Dietary Requirements',
      'Additional Info'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        `"${reg.name || ''}"`,
        `"${reg.email || ''}"`,
        `"${reg.phone || ''}"`,
        reg.attendees || 0,
        `"${new Date(reg.registrationDate).toLocaleDateString()}"`,
        `"${reg.template || ''}"`,
        `"${reg.company || ''}"`,
        `"${reg.position || ''}"`,
        `"${reg.dietary || ''}"`,
        `"${reg.custom || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title}_registrations.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Registrations exported successfully!');
  };

  const getRegistrationStats = () => {
    const totalAttendees = registrations.reduce((sum, reg) => sum + (reg.attendees || 0), 0);
    const uniqueRegistrations = registrations.length;
    const templates = [...new Set(registrations.map(reg => reg.template))];
    
    return {
      totalAttendees,
      uniqueRegistrations,
      templates: templates.length
    };
  };

  const stats = getRegistrationStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Registrations for {event.title}
            </h2>
            <p className="text-gray-600 mt-1">
              {registrations.length} registrations • {stats.totalAttendees} total attendees
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Attendees</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalAttendees}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Registrations</p>
                  <p className="text-2xl font-bold text-green-900">{stats.uniqueRegistrations}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Templates Used</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.templates}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="attendees">Sort by Attendees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="p-6">
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching registrations' : 'No registrations yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Registrations will appear here once people sign up'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.name}
                          </div>
                          {registration.company && (
                            <div className="text-sm text-gray-500">
                              {registration.company}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {registration.email}
                        </div>
                        {registration.phone && (
                          <div className="text-sm text-gray-500">
                            {registration.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {registration.attendees || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(registration.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {registration.template || 'standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          {registration.position && (
                            <div>Position: {registration.position}</div>
                          )}
                          {registration.dietary && (
                            <div>Dietary: {registration.dietary}</div>
                          )}
                          {registration.experience && (
                            <div>Experience: {registration.experience}</div>
                          )}
                          {registration.plusOne && (
                            <div>Plus One: Yes</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationsModal; 