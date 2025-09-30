import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeatureGate, trackFeatureUsage } from '../utils/planFeatures';
import toast from 'react-hot-toast';
import {
  Palette,
  Upload,
  Save,
  RotateCcw,
  Image,
  Type,
  Brush,
  Monitor,
  Smartphone,
  Tablet,
  Crown,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';

const CustomBranding = ({ surveyId, onBrandingUpdate }) => {
  const { user, userProfile } = useAuth();
  const [branding, setBranding] = useState({
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter',
    customCSS: '',
    headerText: '',
    footerText: '',
    thankYouMessage: 'Thank you for your response!',
    progressBarStyle: 'default'
  });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const userPlan = userProfile?.plan || 'free';

  const loadBranding = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('survey_branding')
        .select('*')
        .eq('survey_id', surveyId)
        .single();

      if (!error && data) {
        setBranding(data.branding_config);
      }
    } catch (error) {
      console.error('Error loading branding:', error);
    }
  }, [surveyId]);

  useEffect(() => {
    if (surveyId) {
      loadBranding();
    }
  }, [surveyId, loadBranding]);

  const saveBranding = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('survey_branding')
        .upsert({
          survey_id: surveyId,
          user_id: user.id,
          branding_config: branding
        });

      if (error) throw error;

      // Track usage
      await trackFeatureUsage(user.id, 'custom_branding', {
        surveyId,
        brandingElements: Object.keys(branding).length
      });

      toast.success('Branding saved successfully');
      
      if (onBrandingUpdate) {
        onBrandingUpdate(branding);
      }
    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Failed to save branding');
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file) => {
    try {
      const fileName = `logos/${user.id}/${Date.now()}-${file.name}`;
      
      const { error } = await supabase.storage
        .from('survey-files')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('survey-files')
        .getPublicUrl(fileName);

      setBranding(prev => ({
        ...prev,
        logo: urlData.publicUrl
      }));

      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo');
    }
  };

  const resetBranding = () => {
    setBranding({
      logo: null,
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: 'Inter',
      customCSS: '',
      headerText: '',
      footerText: '',
      thankYouMessage: 'Thank you for your response!',
      progressBarStyle: 'default'
    });
    toast.success('Branding reset to defaults');
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Roboto', label: 'Roboto (Clean)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly)' },
    { value: 'Lato', label: 'Lato (Professional)' },
    { value: 'Montserrat', label: 'Montserrat (Bold)' },
    { value: 'Poppins', label: 'Poppins (Rounded)' }
  ];

  const progressBarStyles = [
    { value: 'default', label: 'Default Bar' },
    { value: 'rounded', label: 'Rounded Bar' },
    { value: 'steps', label: 'Step Indicators' },
    { value: 'circle', label: 'Circular Progress' }
  ];

  return (
    <FeatureGate
      userPlan={userPlan}
      feature="branding.custom"
      fallback={
        <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg text-center">
          <Crown className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Branding</h3>
          <p className="text-gray-600 mb-4">
            Customize your surveys with your own logo, colors, and styling
          </p>
          <button
            onClick={() => window.location.href = '/app/subscriptions'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upgrade to Pro
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Palette className="w-6 h-6 mr-3 text-blue-600" />
              Custom Branding
            </h2>
            <p className="text-gray-600">Customize the look and feel of your surveys</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetBranding}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <button
              onClick={saveBranding}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Branding Controls */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-blue-600" />
                Logo
              </h3>
              
              <div className="space-y-4">
                {branding.logo && (
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={branding.logo} 
                      alt="Logo" 
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Current Logo</p>
                      <p className="text-xs text-gray-600">Click to change</p>
                    </div>
                    <button
                      onClick={() => setBranding(prev => ({ ...prev, logo: null }))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && uploadLogo(e.target.files[0])}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Upload Logo</span>
                </label>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brush className="w-5 h-5 mr-2 text-blue-600" />
                Color Scheme
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.backgroundColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.backgroundColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.textColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.textColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, textColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-blue-600" />
                Typography
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={branding.fontFamily}
                  onChange={(e) => setBranding(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Text */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Text</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Text
                  </label>
                  <input
                    type="text"
                    value={branding.headerText}
                    onChange={(e) => setBranding(prev => ({ ...prev, headerText: e.target.value }))}
                    placeholder="Optional header text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={branding.footerText}
                    onChange={(e) => setBranding(prev => ({ ...prev, footerText: e.target.value }))}
                    placeholder="Optional footer text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thank You Message
                  </label>
                  <textarea
                    value={branding.thankYouMessage}
                    onChange={(e) => setBranding(prev => ({ ...prev, thankYouMessage: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <FeatureGate
              userPlan={userPlan}
              feature="branding.whiteLabel"
              fallback={
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">White-label Options</p>
                      <p className="text-sm text-yellow-700">Available in Pro plan</p>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Advanced Options</h3>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced
                  </button>
                </div>
                
                {showAdvanced && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Progress Bar Style
                      </label>
                      <select
                        value={branding.progressBarStyle}
                        onChange={(e) => setBranding(prev => ({ ...prev, progressBarStyle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {progressBarStyles.map(style => (
                          <option key={style.value} value={style.value}>
                            {style.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom CSS
                      </label>
                      <textarea
                        value={branding.customCSS}
                        onChange={(e) => setBranding(prev => ({ ...prev, customCSS: e.target.value }))}
                        placeholder="/* Add custom CSS here */"
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </FeatureGate>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            {/* Preview Controls */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Preview Frame */}
              <div className={`mx-auto border border-gray-300 rounded-lg overflow-hidden ${
                previewMode === 'desktop' ? 'w-full h-96' :
                previewMode === 'tablet' ? 'w-80 h-96' :
                'w-64 h-96'
              }`}>
                <div 
                  className="w-full h-full p-4"
                  style={{
                    backgroundColor: branding.backgroundColor,
                    color: branding.textColor,
                    fontFamily: branding.fontFamily
                  }}
                >
                  {/* Header */}
                  {(branding.logo || branding.headerText) && (
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b" style={{ borderColor: branding.primaryColor + '20' }}>
                      {branding.logo && (
                        <img src={branding.logo} alt="Logo" className="h-8 object-contain" />
                      )}
                      {branding.headerText && (
                        <h1 className="text-lg font-semibold" style={{ color: branding.primaryColor }}>
                          {branding.headerText}
                        </h1>
                      )}
                    </div>
                  )}
                  
                  {/* Sample Survey Content */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Sample Survey</h2>
                    <p className="text-sm opacity-75">This is how your survey will look to respondents</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>3 of 5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: branding.primaryColor,
                            width: '60%'
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Sample Question */}
                    <div className="space-y-3">
                      <h3 className="font-medium">How satisfied are you with our service?</h3>
                      <div className="space-y-2">
                        {['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'].map((option, index) => (
                          <label key={index} className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="sample" 
                              className="text-blue-600"
                              style={{ accentColor: branding.primaryColor }}
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sample Button */}
                    <button 
                      className="w-full py-2 px-4 rounded-lg text-white font-medium"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      Next Question
                    </button>
                  </div>
                  
                  {/* Footer */}
                  {branding.footerText && (
                    <div className="mt-6 pt-4 border-t text-xs opacity-75" style={{ borderColor: branding.primaryColor + '20' }}>
                      {branding.footerText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};


export default CustomBranding;
