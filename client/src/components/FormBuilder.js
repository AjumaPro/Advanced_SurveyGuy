import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  X,
  Save,
  Eye,
  Settings,
  Plus,
  Trash2,
  Copy,
  Move,
  Type,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Star,
  CheckSquare,
  Radio,
  FileText,
  Image,
  Upload,
  ToggleLeft,
  ToggleRight,
  Lock,
  Globe,
  QrCode,
  Share2,
  Download,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import QRCode from 'qrcode';

const FormBuilder = ({ template, onClose, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [],
    settings: {
      isPublic: true,
      allowMultipleSubmissions: false,
      requireLogin: false,
      showProgress: true,
      theme: 'default'
    }
  });
  const [activeTab, setActiveTab] = useState('design');
  const [selectedField, setSelectedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Field types with icons and configurations
  const fieldTypes = [
    { id: 'text', name: 'Text Input', icon: Type, description: 'Single line text input' },
    { id: 'textarea', name: 'Text Area', icon: FileText, description: 'Multi-line text input' },
    { id: 'email', name: 'Email', icon: Mail, description: 'Email address input' },
    { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone number input' },
    { id: 'date', name: 'Date', icon: Calendar, description: 'Date picker' },
    { id: 'time', name: 'Time', icon: Calendar, description: 'Time picker' },
    { id: 'select', name: 'Dropdown', icon: CheckSquare, description: 'Single selection dropdown' },
    { id: 'radio', name: 'Radio Buttons', icon: Radio, description: 'Single selection radio buttons' },
    { id: 'checkbox', name: 'Checkboxes', icon: CheckSquare, description: 'Multiple selection checkboxes' },
    { id: 'number', name: 'Number', icon: Type, description: 'Numeric input' },
    { id: 'file', name: 'File Upload', icon: Upload, description: 'File upload field' },
    { id: 'rating', name: 'Rating', icon: Star, description: 'Star rating input' },
    { id: 'payment', name: 'Payment', icon: CreditCard, description: 'Payment collection field with Paystack integration' }
  ];

  useEffect(() => {
    if (template) {
      if (template.id && template.id.startsWith('form_')) {
        // This is an existing form being edited
        setFormData({
          title: template.name || '',
          description: template.description || '',
          fields: template.fields || [],
          settings: template.settings || {
            isPublic: true,
            allowMultipleSubmissions: false,
            requireLogin: false,
            showProgress: true,
            theme: 'default'
          }
        });
      } else {
        // This is a new form from template
        initializeFormFromTemplate();
      }
    }
  }, [template]);

  const initializeFormFromTemplate = () => {
    const templateFields = generateFieldsFromTemplate(template);
    setFormData({
      title: `${template.name} Form`,
      description: template.description,
      fields: templateFields,
      settings: {
        isPublic: true,
        allowMultipleSubmissions: false,
        requireLogin: false,
        showProgress: true,
        theme: 'default'
      }
    });
  };

  const generateFieldsFromTemplate = (template) => {
    const fieldMap = {
      name: { type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      email: { type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
      phone: { type: 'phone', label: 'Phone Number', required: false, placeholder: 'Enter your phone number' },
      message: { type: 'textarea', label: 'Message', required: true, placeholder: 'Enter your message' },
      company: { type: 'text', label: 'Company', required: false, placeholder: 'Enter your company name' },
      position: { type: 'text', label: 'Position', required: false, placeholder: 'Enter your position' },
      dietary: { type: 'textarea', label: 'Dietary Requirements', required: false, placeholder: 'Any dietary requirements or allergies' },
      amount: { type: 'payment', label: 'Payment Amount', required: true, placeholder: 'Enter amount', defaultAmount: 0, description: 'Enter the amount you wish to pay' },
      description: { type: 'textarea', label: 'Payment Description', required: true, placeholder: 'Describe what this payment is for' },
      payment_method: { type: 'select', label: 'Payment Method', required: true, options: ['Card', 'Mobile Money', 'Bank Transfer'] },
      rating: { type: 'rating', label: 'Rating', required: true, maxRating: 5 },
      feedback: { type: 'textarea', label: 'Feedback', required: true, placeholder: 'Share your feedback' },
      category: { type: 'select', label: 'Category', required: true, options: ['General', 'Technical', 'Billing', 'Other'] },
      service: { type: 'select', label: 'Service', required: true, options: ['Consultation', 'Support', 'Training', 'Other'] },
      date: { type: 'date', label: 'Preferred Date', required: true },
      time: { type: 'time', label: 'Preferred Time', required: true },
      notes: { type: 'textarea', label: 'Additional Notes', required: false, placeholder: 'Any additional information' },
      interest: { type: 'select', label: 'Area of Interest', required: true, options: ['Product Demo', 'Pricing', 'Support', 'Partnership'] },
      source: { type: 'select', label: 'How did you hear about us?', required: false, options: ['Google', 'Social Media', 'Referral', 'Other'] },
      subject: { type: 'text', label: 'Subject', required: true, placeholder: 'Brief description of your issue' },
      priority: { type: 'select', label: 'Priority', required: true, options: ['Low', 'Medium', 'High', 'Urgent'] },
      attachments: { type: 'file', label: 'Attachments', required: false, accept: '.pdf,.doc,.docx,.jpg,.png' }
    };

    return template.fields.map((fieldId, index) => {
      const fieldConfig = fieldMap[fieldId] || { type: 'text', label: fieldId, required: false };
      return {
        id: `field_${index + 1}`,
        type: fieldConfig.type,
        label: fieldConfig.label,
        required: fieldConfig.required || false,
        placeholder: fieldConfig.placeholder || '',
        options: fieldConfig.options || [],
        maxRating: fieldConfig.maxRating || 5,
        accept: fieldConfig.accept || '',
        validation: {
          min: fieldConfig.type === 'number' ? 0 : undefined,
          max: fieldConfig.type === 'number' ? 999999 : undefined
        }
      };
    });
  };

  const addField = (fieldType) => {
    const fieldTypeConfig = fieldTypes.find(ft => ft.id === fieldType);
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: fieldTypeConfig.name,
      required: false,
      placeholder: `Enter ${fieldTypeConfig.name.toLowerCase()}`,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1', 'Option 2'] : [],
      maxRating: fieldType === 'rating' ? 5 : undefined,
      accept: fieldType === 'file' ? '*' : '',
      validation: {}
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  };

  const duplicateField = (fieldId) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (field) {
      const newField = {
        ...field,
        id: `field_${Date.now()}`,
        label: `${field.label} (Copy)`
      };
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
  };

  const moveField = (fieldId, direction) => {
    const fields = [...formData.fields];
    const index = fields.findIndex(f => f.id === fieldId);
    
    if (direction === 'up' && index > 0) {
      [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
    } else if (direction === 'down' && index < fields.length - 1) {
      [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    }
    
    setFormData(prev => ({ ...prev, fields }));
  };

  const generateQRCode = async (formUrl) => {
    try {
      const qrDataURL = await QRCode.toDataURL(formUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate form data
      if (!formData.title.trim()) {
        toast.error('Please enter a form title');
        setIsSaving(false);
        return;
      }

      if (formData.fields.length === 0) {
        toast.error('Please add at least one field to your form');
        setIsSaving(false);
        return;
      }

      // Prepare form data for saving
      const formToSave = {
        ...formData,
        id: template?.id ? `form_${Date.now()}` : formData.id || `form_${Date.now()}`,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft',
        responses: 0
      };

      // Save form to localStorage (for demo purposes)
      // In production, this would be an API call
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const existingIndex = savedForms.findIndex(f => f.id === formToSave.id);
      
      if (existingIndex >= 0) {
        savedForms[existingIndex] = formToSave;
      } else {
        savedForms.push(formToSave);
      }
      
      localStorage.setItem('savedForms', JSON.stringify(savedForms));

      // Generate QR code for the saved form
      const formUrl = `${window.location.origin}/form/${formToSave.id}`;
      await generateQRCode(formUrl);
      
      toast.success('Form saved successfully!');
      onSave?.(formToSave);
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Validate form data
      if (!formData.title.trim()) {
        toast.error('Please enter a form title');
        setIsPublishing(false);
        return;
      }

      if (formData.fields.length === 0) {
        toast.error('Please add at least one field to your form');
        setIsPublishing(false);
        return;
      }

      // Prepare form data for publishing
      const formToPublish = {
        ...formData,
        id: template?.id ? `form_${Date.now()}` : formData.id || `form_${Date.now()}`,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published',
        responses: 0
      };

      // Save form to localStorage (for demo purposes)
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const existingIndex = savedForms.findIndex(f => f.id === formToPublish.id);
      
      if (existingIndex >= 0) {
        savedForms[existingIndex] = formToPublish;
      } else {
        savedForms.push(formToPublish);
      }
      
      localStorage.setItem('savedForms', JSON.stringify(savedForms));

      // Generate QR code for the published form
      const formUrl = `${window.location.origin}/form/${formToPublish.id}`;
      await generateQRCode(formUrl);
      
      toast.success('Form published successfully!');
      onSave?.(formToPublish);
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error('Failed to publish form');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderFieldEditor = (field) => {
    const fieldTypeConfig = fieldTypes.find(ft => ft.id === field.type);
    const Icon = fieldTypeConfig?.icon || Type;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{field.label}</h3>
              <p className="text-sm text-gray-600">{fieldTypeConfig?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveField(field.id, 'up')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              ↑
            </button>
            <button
              onClick={() => moveField(field.id, 'down')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              ↓
            </button>
            <button
              onClick={() => duplicateField(field.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteField(field.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>
          </div>

          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              <div className="space-y-2">
                {field.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[index] = e.target.value;
                        updateField(field.id, { options: newOptions });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const newOptions = field.options.filter((_, i) => i !== index);
                        updateField(field.id, { options: newOptions });
                      }}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...field.options, 'New Option'];
                    updateField(field.id, { options: newOptions });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
            </div>
          )}

          {field.type === 'rating' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Rating</label>
              <input
                type="number"
                min="1"
                max="10"
                value={field.maxRating}
                onChange={(e) => updateField(field.id, { maxRating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {field.type === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accepted File Types</label>
              <input
                type="text"
                value={field.accept}
                onChange={(e) => updateField(field.id, { accept: e.target.value })}
                placeholder="e.g., .pdf,.doc,.jpg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFormPreview = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
        <p className="text-gray-600">{formData.description}</p>
      </div>

      <div className="space-y-4">
        {formData.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'text' && (
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'textarea' && (
              <textarea
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'email' && (
              <input
                type="email"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'phone' && (
              <input
                type="tel"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'date' && (
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'time' && (
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'number' && (
              <input
                type="number"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'select' && (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select an option</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input type="radio" name={field.id} value={option} />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {field.type === 'checkbox' && (
              <div className="space-y-2">
                {field.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input type="checkbox" value={option} />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {field.type === 'rating' && (
              <div className="flex items-center gap-1">
                {Array.from({ length: field.maxRating }, (_, i) => (
                  <Star key={i} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                ))}
              </div>
            )}
            
            {field.type === 'file' && (
              <input
                type="file"
                accept={field.accept}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {field.type === 'payment' && (
              <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Payment Amount</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      placeholder={field.placeholder || 'Enter amount'}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      min="0.01"
                      value={field.defaultAmount || ''}
                      onChange={(e) => updateField(field.id, { ...field, defaultAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  {field.description && (
                    <p className="text-xs text-gray-600">{field.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Secure payment powered by Paystack</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Submit Form
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Form Builder</h2>
            <p className="text-gray-600 mt-1">Create and customize your form</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              {isPublishing ? 'Publishing...' : 'Publish Form'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Add Fields</h3>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes.map((fieldType) => {
                  const Icon = fieldType.icon;
                  return (
                    <button
                      key={fieldType.id}
                      onClick={() => addField(fieldType.id)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all text-left"
                    >
                      <Icon className="w-5 h-5 text-gray-600 mb-1" />
                      <div className="text-xs font-medium text-gray-900">{fieldType.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {showPreview ? (
              <div className="p-6">
                {renderFormPreview()}
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {formData.fields.map((field) => (
                    <div key={field.id}>
                      {renderFieldEditor(field)}
                    </div>
                  ))}
                  
                  {formData.fields.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                      <p className="text-gray-600">Add fields from the sidebar to start building your form</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Modal */}
        {qrCodeDataURL && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Form QR Code</h3>
                <div className="mb-4">
                  <img src={qrCodeDataURL} alt="Form QR Code" className="mx-auto" />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Share this QR code to allow easy form access
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `${formData.title}-qrcode.png`;
                      link.href = qrCodeDataURL;
                      link.click();
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => setQrCodeDataURL('')}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
