import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  FileText,
  Presentation,
  Image,
  File,
  Settings,
  Share2,
  Calendar,
  BarChart3,
  Users,
  Globe,
  Star,
  Timer,
  Activity,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp
} from 'lucide-react';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ReportExportModal = ({ 
  isOpen, 
  onClose, 
  analyticsData, 
  filteredSurveys,
  chartRefs,
  exportFunctions 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('powerpoint');
  const [selectedPages, setSelectedPages] = useState(['overview', 'charts', 'demographics']);
  const [pageSettings, setPageSettings] = useState({
    includeCharts: true,
    includeData: true,
    includeSummary: true,
    chartQuality: 'high',
    imageFormat: 'png'
  });
  const [exporting, setExporting] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState('');

  if (!isOpen) return null;

  const availablePages = [
    { id: 'overview', name: 'Overview & Summary', icon: BarChart3, description: 'Key metrics and statistics' },
    { id: 'charts', name: 'Analytics Charts', icon: BarChart3, description: 'All charts and graphs' },
    { id: 'demographics', name: 'Demographics', icon: Users, description: 'Age and geographic distribution' },
    { id: 'performance', name: 'Performance Metrics', icon: Activity, description: 'Response times and satisfaction' },
    { id: 'trends', name: 'Trend Analysis', icon: TrendingUp, description: 'Monthly and response trends' },
    { id: 'device', name: 'Device Analytics', icon: Smartphone, description: 'Device type usage' }
  ];

  const exportFormats = [
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      icon: Presentation,
      description: 'Perfect for presentations and meetings',
      extensions: ['.pptx'],
      color: 'bg-orange-500'
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      icon: FileText,
      description: 'Data tables and analytics',
      extensions: ['.csv'],
      color: 'bg-green-500'
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      icon: File,
      description: 'Professional reports for sharing',
      extensions: ['.pdf'],
      color: 'bg-red-500'
    },
    {
      id: 'images',
      name: 'Image Gallery',
      icon: Image,
      description: 'Individual charts as images',
      extensions: ['.png', '.jpg'],
      color: 'bg-green-500'
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: Share2,
      description: 'Platform-optimized content for sharing',
      extensions: ['.txt'],
      color: 'bg-blue-500'
    }
  ];

  const socialPlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-700', bg: 'bg-blue-50' },
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400', bg: 'bg-blue-50' },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  const handlePageToggle = (pageId) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleSelectAllPages = () => {
    setSelectedPages(availablePages.map(page => page.id));
  };

  const handleDeselectAllPages = () => {
    setSelectedPages([]);
  };

  const handleExport = async () => {
    if (selectedPages.length === 0) {
      toast.error('Please select at least one page to export');
      return;
    }

    setExporting(true);
    
    try {
      console.log('Starting export with format:', selectedFormat);
      console.log('Export functions available:', Object.keys(exportFunctions));
      
      const exportConfig = {
        format: selectedFormat,
        pages: selectedPages,
        settings: pageSettings,
        analyticsData,
        filteredSurveys,
        chartRefs,
        socialPlatform
      };

      console.log('Export config:', exportConfig);

      switch (selectedFormat) {
        case 'powerpoint':
          console.log('Calling PowerPoint export...');
          await exportFunctions.exportPowerPoint(exportConfig);
          break;
        case 'excel':
          console.log('Calling Excel export...');
          await exportFunctions.exportExcel(exportConfig);
          break;
        case 'pdf':
          console.log('Calling PDF export...');
          await exportFunctions.exportPDF(exportConfig);
          break;
        case 'images':
          console.log('Calling Images export...');
          await exportFunctions.exportImages(exportConfig);
          break;
        case 'social':
          console.log('Calling Social Media export...');
          await exportFunctions.exportSocialMedia(exportConfig);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      toast.success(`Report exported successfully as ${selectedFormat.toUpperCase()}!`);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export report: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleSocialShare = (platform) => {
    setSocialPlatform(platform);
    setSelectedFormat('images');
    setPageSettings(prev => ({
      ...prev,
      chartQuality: 'high',
      imageFormat: 'png'
    }));
    toast.success(`Optimized for ${platform} sharing`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Export Report</h2>
                <p className="text-gray-600 mt-1">Choose format and customize your report export</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Export Format Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Format
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 ${format.color} rounded-lg flex items-center justify-center mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">{format.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{format.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {format.extensions.map((ext) => (
                          <span key={ext} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                            {ext}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Media Optimization */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Social Media Optimization
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handleSocialShare(platform.id)}
                      className={`p-3 rounded-lg border transition-all ${platform.bg} hover:shadow-md`}
                    >
                      <Icon className={`w-6 h-6 ${platform.color} mx-auto mb-2`} />
                      <p className={`text-sm font-medium ${platform.color}`}>{platform.name}</p>
                    </button>
                  );
                })}
              </div>
              {socialPlatform && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Optimized for {socialPlatform.charAt(0).toUpperCase() + socialPlatform.slice(1)} sharing
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Page Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Select Pages
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAllPages}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllPages}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePages.map((page) => {
                  const Icon = page.icon;
                  const isSelected = selectedPages.includes(page.id);
                  return (
                    <button
                      key={page.id}
                      onClick={() => handlePageToggle(page.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-500' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{page.name}</h4>
                          <p className="text-xs text-gray-600">{page.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Export Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Quality
                  </label>
                  <select
                    value={pageSettings.chartQuality}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, chartQuality: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="high">High Quality (Recommended)</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (Smaller Size)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Format
                  </label>
                  <select
                    value={pageSettings.imageFormat}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, imageFormat: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="png">PNG (Recommended)</option>
                    <option value="jpg">JPG (Smaller Size)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={pageSettings.includeCharts}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include interactive charts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={pageSettings.includeData}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, includeData: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include data tables</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={pageSettings.includeSummary}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, includeSummary: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include executive summary</span>
                </label>
              </div>
            </div>

            {/* Export Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Export Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Format:</span>
                    <span className="ml-2 text-gray-600 capitalize">{selectedFormat}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Pages:</span>
                    <span className="ml-2 text-gray-600">{selectedPages.length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Quality:</span>
                    <span className="ml-2 text-gray-600 capitalize">{pageSettings.chartQuality}</span>
                  </div>
                </div>
                {socialPlatform && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Social Platform:</span>
                    <span className="ml-2 text-gray-600 capitalize">{socialPlatform}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedPages.length > 0 ? (
                  <span>Ready to export {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-red-600">Please select at least one page</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={exporting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={selectedPages.length === 0 || exporting}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportExportModal;
