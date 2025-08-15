import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Search, 
  Grid, 
  List,
  Plus,
  Star,
  Users,
  Target,
  Building,
  GraduationCap,
  Heart,
  Music
} from 'lucide-react';
import SurveyTemplates from '../components/SurveyTemplates';
import EventTemplates from '../components/EventTemplates';

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('surveys');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateTemplate = () => {
    navigate('/app/templates/new');
  };

  const handleSurveyTemplateSelect = (template) => {
    console.log('Selected survey template:', template);
    // Navigate to survey builder with template
    window.location.href = `/app/builder?template=${template.id}`;
  };

  const handleEventTemplateSelect = (template) => {
    console.log('Selected event template:', template);
    // Navigate to event creation with template
    window.location.href = `/app/events?template=${template.id}`;
  };

  const handleSurveyTemplatePreview = (template) => {
    console.log('Previewing survey template:', template);
    // Show preview modal
  };

  const handleEventTemplatePreview = (template) => {
    console.log('Previewing event template:', template);
    // Show preview modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Library</h1>
              <p className="text-gray-600 mt-2">
                Choose from our collection of pre-built survey and event templates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Custom Template
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-8">
            <button
              onClick={() => setActiveTab('surveys')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'surveys'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              Survey Templates
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">12</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'events'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Event Templates
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">15</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'surveys' ? 'survey' : 'event'} templates...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Template Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeTab === 'surveys' ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Customer Feedback</h3>
                    <p className="text-sm text-gray-500">3 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Measure satisfaction and gather customer insights</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Employee</h3>
                    <p className="text-sm text-gray-500">2 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Employee satisfaction and engagement surveys</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Education</h3>
                    <p className="text-sm text-gray-500">2 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Course evaluations and student feedback</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Market Research</h3>
                    <p className="text-sm text-gray-500">1 template</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Customer preferences and market insights</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business</h3>
                    <p className="text-sm text-gray-500">3 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Conferences, meetings, and corporate events</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Education</h3>
                    <p className="text-sm text-gray-500">3 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Workshops, webinars, and training sessions</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Social</h3>
                    <p className="text-sm text-gray-500">3 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Weddings, parties, and celebrations</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Music className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Entertainment</h3>
                    <p className="text-sm text-gray-500">3 templates</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Concerts, workshops, and entertainment events</p>
              </div>
            </>
          )}
        </div>

        {/* Templates Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'surveys' ? (
            <SurveyTemplates
              onSelectTemplate={handleSurveyTemplateSelect}
              onPreviewTemplate={handleSurveyTemplatePreview}
            />
          ) : (
            <EventTemplates
              onSelectTemplate={handleEventTemplateSelect}
              onPreviewTemplate={handleEventTemplatePreview}
            />
          )}
        </div>

        {/* Template Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {activeTab === 'surveys' ? '12' : '15'}
              </div>
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {activeTab === 'surveys' ? '8' : '12'}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {activeTab === 'surveys' ? '150+' : '200+'}
              </div>
              <div className="text-sm text-gray-600">Questions Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary; 