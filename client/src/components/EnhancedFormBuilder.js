import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Info,
  Settings,
  Eye,
  Save,
  Send,
  Download,
  Share2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image,
  Upload,
  Star,
  Heart,
  ThumbsUp,
  Smile,
  X
} from 'lucide-react';

const EnhancedFormBuilder = ({ 
  initialForm = null, 
  onSave, 
  onPublish, 
  onPreview 
}) => {
  const [form, setForm] = useState(initialForm || {
    id: Date.now(),
    title: 'Untitled Form',
    description: '',
    type: 'survey', // 'survey', 'form', 'payment'
    settings: {
      allowMultipleSubmissions: false,
      requireLogin: false,
      showProgress: true,
      randomizeQuestions: false,
      collectEmail: true,
      collectName: true,
      theme: 'default',
      customCSS: '',
      redirectUrl: '',
      thankYouMessage: 'Thank you for your submission!'
    },
    payment: {
      enabled: false,
      amount: 0,
      currency: 'USD',
      description: '',
      stripePublicKey: '',
      webhookSecret: ''
    },
    questions: [],
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('design');
  // const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Enhanced question types for forms
  const formQuestionTypes = [
    // Basic Types
    { id: 'text', name: 'Text Input', icon: <FileText className="w-4 h-4" />, description: 'Single line text input', category: 'basic' },
    { id: 'textarea', name: 'Long Text', icon: <FileText className="w-4 h-4" />, description: 'Multi-line text input', category: 'basic' },
    { id: 'email', name: 'Email', icon: <Mail className="w-4 h-4" />, description: 'Email address input', category: 'basic' },
    { id: 'phone', name: 'Phone', icon: <Phone className="w-4 h-4" />, description: 'Phone number input', category: 'basic' },
    { id: 'number', name: 'Number', icon: <DollarSign className="w-4 h-4" />, description: 'Numeric input', category: 'basic' },
    { id: 'date', name: 'Date', icon: <Calendar className="w-4 h-4" />, description: 'Date picker', category: 'basic' },
    { id: 'time', name: 'Time', icon: <Clock className="w-4 h-4" />, description: 'Time picker', category: 'basic' },
    
    // Choice Types
    { id: 'multiple_choice', name: 'Multiple Choice', icon: <CheckCircle className="w-4 h-4" />, description: 'Single selection', category: 'choice' },
    { id: 'checkbox', name: 'Checkboxes', icon: <CheckCircle className="w-4 h-4" />, description: 'Multiple selections', category: 'choice' },
    { id: 'dropdown', name: 'Dropdown', icon: <CheckCircle className="w-4 h-4" />, description: 'Dropdown selection', category: 'choice' },
    { id: 'yes_no', name: 'Yes/No', icon: <CheckCircle className="w-4 h-4" />, description: 'Simple yes or no', category: 'choice' },
    
    // Rating Types
    { id: 'rating', name: 'Rating Scale', icon: <Star className="w-4 h-4" />, description: 'Star rating', category: 'rating' },
    { id: 'emoji_scale', name: 'Emoji Scale', icon: <Smile className="w-4 h-4" />, description: 'Emoji rating', category: 'rating' },
    { id: 'thumbs', name: 'Thumbs Up/Down', icon: <ThumbsUp className="w-4 h-4" />, description: 'Thumbs rating', category: 'rating' },
    { id: 'hearts', name: 'Hearts', icon: <Heart className="w-4 h-4" />, description: 'Heart rating', category: 'rating' },
    
    // Form Specific
    { id: 'name', name: 'Name', icon: <User className="w-4 h-4" />, description: 'Full name input', category: 'form' },
    { id: 'address', name: 'Address', icon: <MapPin className="w-4 h-4" />, description: 'Address form', category: 'form' },
    { id: 'file_upload', name: 'File Upload', icon: <Upload className="w-4 h-4" />, description: 'File attachment', category: 'form' },
    { id: 'image_upload', name: 'Image Upload', icon: <Image className="w-4 h-4" />, description: 'Image upload', category: 'form' },
    
    // Payment Types
    { id: 'payment', name: 'Payment', icon: <CreditCard className="w-4 h-4" />, description: 'Payment processing', category: 'payment' },
    { id: 'donation', name: 'Donation', icon: <Heart className="w-4 h-4" />, description: 'Donation amount', category: 'payment' },
    { id: 'product_selection', name: 'Product Selection', icon: <CheckCircle className="w-4 h-4" />, description: 'Product with price', category: 'payment' }
  ];

  const tabs = [
    { id: 'design', name: 'Design', icon: <Settings className="w-4 h-4" /> },
    { id: 'questions', name: 'Questions', icon: <FileText className="w-4 h-4" /> },
    { id: 'payment', name: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'publish', name: 'Publish', icon: <Send className="w-4 h-4" /> }
  ];

  const addQuestion = (questionType) => {
    const newQuestion = {
      id: Date.now(),
      type: questionType,
      title: `New ${formQuestionTypes.find(t => t.id === questionType)?.name || 'Question'}`,
      description: '',
      required: true,
      options: getDefaultOptions(questionType),
      settings: getDefaultSettings(questionType),
      order: form.questions.length
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date().toISOString()
    }));
  };

  const getDefaultOptions = (questionType) => {
    switch (questionType) {
      case 'multiple_choice':
      case 'checkbox':
      case 'dropdown':
        return ['Option 1', 'Option 2', 'Option 3'];
      case 'rating':
        return Array.from({ length: 5 }, (_, i) => i + 1);
      case 'emoji_scale':
        return ['😞', '😐', '😊', '😄', '🤩'];
      case 'thumbs':
        return ['👎', '👍'];
      case 'hearts':
        return ['💔', '💙', '💚', '🧡', '❤️'];
      case 'yes_no':
        return ['Yes', 'No'];
      case 'payment':
        return [{ amount: 0, description: 'Custom amount' }];
      case 'donation':
        return [10, 25, 50, 100, 250, 500];
      default:
        return [];
    }
  };

  const getDefaultSettings = (questionType) => {
    const baseSettings = {
      placeholder: '',
      validation: {},
      styling: {}
    };

    switch (questionType) {
      case 'email':
        return { ...baseSettings, validation: { email: true } };
      case 'phone':
        return { ...baseSettings, validation: { phone: true } };
      case 'number':
        return { ...baseSettings, validation: { min: 0, max: 999999 } };
      case 'file_upload':
        return { ...baseSettings, validation: { maxSize: '10MB', allowedTypes: ['image/*', 'application/pdf'] } };
      case 'payment':
        return { ...baseSettings, currency: 'USD', amount: 0 };
      default:
        return baseSettings;
    }
  };

  const updateQuestion = (questionId, updates) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  const removeQuestion = (questionId) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      updatedAt: new Date().toISOString()
    }));
  };

  // const reorderQuestions = (fromIndex, toIndex) => {
  //   const newQuestions = [...form.questions];
  //   const [movedQuestion] = newQuestions.splice(fromIndex, 1);
  //   newQuestions.splice(toIndex, 0, movedQuestion);
  //   
  //   setForm(prev => ({
  //     ...prev,
  //     questions: newQuestions.map((q, index) => ({ ...q, order: index })),
  //     updatedAt: new Date().toISOString()
  //   }));
  // };

  const updateFormSettings = (settings) => {
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
      updatedAt: new Date().toISOString()
    }));
  };

  const updatePaymentSettings = (payment) => {
    setForm(prev => ({
      ...prev,
      payment: { ...prev.payment, ...payment },
      updatedAt: new Date().toISOString()
    }));
  };

  const saveForm = () => {
    onSave(form);
  };

  const publishForm = () => {
    const updatedForm = { ...form, published: true, publishedAt: new Date().toISOString() };
    setForm(updatedForm);
    onPublish(updatedForm);
  };

  const previewForm = () => {
    setIsPreviewMode(!isPreviewMode);
    onPreview(form);
  };

  const groupedQuestionTypes = formQuestionTypes.reduce((groups, type) => {
    if (!groups[type.category]) {
      groups[type.category] = [];
    }
    groups[type.category].push(type);
    return groups;
  }, {});

  return (
    <div className="enhanced-form-builder bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Enhanced Form Builder</h2>
              <p className="text-sm text-slate-600">
                Create powerful forms with payment processing and advanced features
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={previewForm}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isPreviewMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={saveForm}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={publishForm}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'design' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Form Design</h3>
            
            {/* Form Title & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter form title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Form Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="survey">Survey</option>
                  <option value="form">Form</option>
                  <option value="payment">Payment Form</option>
                  <option value="registration">Registration</option>
                  <option value="contact">Contact Form</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your form..."
              />
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-4 gap-4">
                {['default', 'modern', 'minimal', 'colorful'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => updateFormSettings({ theme })}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      form.settings.theme === theme
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded mx-auto mb-2 ${
                      theme === 'default' ? 'bg-slate-200' :
                      theme === 'modern' ? 'bg-slate-800' :
                      theme === 'minimal' ? 'bg-white border' :
                      'bg-gradient-to-r from-purple-400 to-pink-400'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Questions</h3>
              <span className="text-sm text-slate-600">
                {form.questions.length} questions
              </span>
            </div>

            {/* Question Types */}
            <div className="space-y-6">
              {Object.entries(groupedQuestionTypes).map(([category, types]) => (
                <div key={category}>
                  <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    {category} Questions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {types.map(type => (
                      <button
                        key={type.id}
                        onClick={() => addQuestion(type.id)}
                        className="p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="text-slate-600">{type.icon}</div>
                          <span className="text-sm font-semibold text-slate-900">
                            {type.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Questions List */}
            {form.questions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700">Form Questions</h4>
                {form.questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900">{question.title}</h5>
                          <p className="text-sm text-slate-600">
                            {formQuestionTypes.find(t => t.id === question.type)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuestion(question.id, { required: !question.required })}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            question.required
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {question.required ? 'Required' : 'Optional'}
                        </button>
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Payment Settings</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.payment.enabled}
                  onChange={(e) => updatePaymentSettings({ enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Enable Payments</span>
              </label>
            </div>

            {form.payment.enabled && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={form.payment.amount}
                        onChange={(e) => updatePaymentSettings({ amount: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={form.payment.currency}
                      onChange={(e) => updatePaymentSettings({ currency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Description
                  </label>
                  <input
                    type="text"
                    value={form.payment.description}
                    onChange={(e) => updatePaymentSettings({ description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What is this payment for?"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Payment Integration</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        To enable payments, you'll need to configure Stripe integration in your form settings.
                        Contact support for assistance with payment setup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Form Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700">Submission Settings</h4>
                
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">Allow Multiple Submissions</div>
                    <div className="text-sm text-slate-600">Let users submit multiple times</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings.allowMultipleSubmissions}
                    onChange={(e) => updateFormSettings({ allowMultipleSubmissions: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">Require Login</div>
                    <div className="text-sm text-slate-600">Users must be logged in to submit</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings.requireLogin}
                    onChange={(e) => updateFormSettings({ requireLogin: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">Show Progress</div>
                    <div className="text-sm text-slate-600">Display progress bar to users</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings.showProgress}
                    onChange={(e) => updateFormSettings({ showProgress: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700">Data Collection</h4>
                
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">Collect Email</div>
                    <div className="text-sm text-slate-600">Automatically collect email addresses</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings.collectEmail}
                    onChange={(e) => updateFormSettings({ collectEmail: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">Collect Name</div>
                    <div className="text-sm text-slate-600">Automatically collect names</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings.collectName}
                    onChange={(e) => updateFormSettings({ collectName: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thank You Message
              </label>
              <textarea
                value={form.settings.thankYouMessage}
                onChange={(e) => updateFormSettings({ thankYouMessage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Thank you for your submission!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Redirect URL (Optional)
              </label>
              <input
                type="url"
                value={form.settings.redirectUrl}
                onChange={(e) => updateFormSettings({ redirectUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/thank-you"
              />
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Publish Form</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-lg font-semibold text-green-900">Ready to Publish</h4>
                  <p className="text-green-800 mt-1">
                    Your form is ready to be published and shared with your audience.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700">Form Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Questions</span>
                    <span className="text-sm font-bold text-slate-900">{form.questions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Form Type</span>
                    <span className="text-sm font-bold text-slate-900 capitalize">{form.type}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Payment</span>
                    <span className="text-sm font-bold text-slate-900">
                      {form.payment.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700">Sharing Options</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Get Shareable Link</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download QR Code</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Embed Code</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
              <button
                onClick={saveForm}
                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={publishForm}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Publish Form</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFormBuilder;
