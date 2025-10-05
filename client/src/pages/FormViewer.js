import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usePaystackPayment } from 'react-paystack';
import { initializePayment } from '../services/paystackService';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  QrCode,
  Share2,
  Copy,
  Download,
  DollarSign,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { supabase } from '../lib/supabase';
import { useDashboardNavigation } from '../utils/navigationUtils';
import QRCode from 'qrcode';

const FormViewer = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { navigateToDashboard, isSignedIn } = useDashboardNavigation();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm();


  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  // Check if Paystack script is loaded
  useEffect(() => {
    const checkPaystack = () => {
      console.log('Checking Paystack availability:', {
        hasPaystackPop: typeof window.PaystackPop !== 'undefined',
        paystackVersion: window.PaystackPop?.version || 'not available'
      });
    };
    
    // Check immediately
    checkPaystack();
    
    // Check again after a short delay in case script is still loading
    const timer = setTimeout(checkPaystack, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchForm = async () => {
    try {
      setLoading(true);
      
      // First, try to load from localStorage (for demo purposes)
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const foundForm = savedForms.find(f => f.id === formId);
      
      if (foundForm) {
        console.log('📋 Form found in localStorage:', foundForm);
        setForm(foundForm);
        await generateQRCode();
        return;
      }

      // Try to fetch from database/API
      try {
        console.log('🔍 Attempting to fetch form from database...');
        const { data: dbForm, error: dbError } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .eq('is_public', true)
          .single();

        if (!dbError && dbForm) {
          console.log('✅ Form found in database:', dbForm);
          setForm(dbForm);
          await generateQRCode();
          return;
        } else {
          console.log('❌ Form not found in database:', dbError?.message);
        }
      } catch (apiError) {
        console.log('⚠️ Database fetch failed:', apiError);
      }

      // Fallback to mock data if form not found
      console.log('🔄 Using fallback mock form...');
      const mockForm = {
        id: formId,
        title: 'Contact Us Form',
        description: 'Get in touch with us using this form',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            required: true,
            placeholder: 'Enter your email address'
          },
          {
            id: 'phone',
            type: 'phone',
            label: 'Phone Number',
            required: false,
            placeholder: 'Enter your phone number'
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            required: true,
            placeholder: 'Enter your message'
          }
        ],
        settings: {
          isPublic: true,
          allowMultipleSubmissions: false,
          requireLogin: false
        }
      };
      
      setForm(mockForm);
      await generateQRCode();
      
    } catch (error) {
      console.error('Error fetching form:', error);
      setError('Form not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const formUrl = window.location.href;
      const qrDataURL = await QRCode.toDataURL(formUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Check if form has payment fields
      const hasPaymentField = form.fields.some(field => field.type === 'payment');
      
      if (hasPaymentField) {
        // Extract payment amount from form data
        const amountField = form.fields.find(field => field.type === 'payment');
        const amount = Number(data[amountField.id]) || Number(amountField.defaultAmount) || 0;
        
        if (amount > 0) {
          setPaymentAmount(amount);
          setShowPayment(true);
          setSubmitting(false);
          return;
        }
      }
      
      // Submit form without payment
      await submitForm(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
      setSubmitting(false);
    }
  };

  const submitForm = async (data, paymentReference = null) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would be an API call
      console.log('Form submitted:', { ...data, paymentReference });
      
      setSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      setIsProcessingPayment(true);
      
      // Verify payment with backend
      const { data: verification, error } = await api.payments.verifyPayment(reference);
      
      if (error) throw error;
      
      // Submit form with payment confirmation
      const formData = getValues();
      await submitForm(formData, reference);
      
      setShowPayment(false);
      toast.success('Payment successful! Form submitted.');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment verification failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSubmitting(false);
  };

  // Paystack configuration - updated when payment amount changes
  const paystackConfig = React.useMemo(() => {
    const numericAmount = Number(paymentAmount) || 0;
    const config = initializePayment(numericAmount, getValues().email || 'customer@example.com', {
      form_id: formId,
      form_data: getValues(),
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
    });
    console.log('Paystack Config:', config);
    return config;
  }, [paymentAmount, formId, getValues().email]);

  // Initialize Paystack using direct script approach
  const initializePaystackDirect = () => {
    try {
      console.log('Initializing Paystack with config:', paystackConfig);
      
      // Check if Paystack script is loaded
      if (typeof window.PaystackPop === 'undefined') {
        throw new Error('Paystack script not loaded');
      }
      
      const handler = window.PaystackPop.setup({
        ...paystackConfig,
        callback: function(response) {
          console.log('Payment successful:', response);
          handlePaymentSuccess(response.reference);
        },
        onClose: function() {
          console.log('Payment closed');
          handlePaymentClose();
        }
      });
      
      handler.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack directly:', error);
      throw error;
    }
  };

  // Fallback to hook if direct method fails
  const initializePaystack = usePaystackPayment({
    ...paystackConfig,
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose
  });

  // Debug: Log the Paystack hook initialization
  console.log('Paystack Hook Initialized:', {
    config: paystackConfig,
    hasPublicKey: !!paystackConfig.publicKey,
    publicKeyLength: paystackConfig.publicKey?.length,
    hasPaystackPop: typeof window.PaystackPop !== 'undefined'
  });

  const copyFormUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Form URL copied to clipboard!');
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `${form?.title || 'form'}-qrcode.png`;
      link.href = qrCodeDataURL;
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  const renderField = (field) => {
    const commonProps = {
      ...register(field.id, {
        required: field.required ? `${field.label} is required` : false
      }),
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[field.id] ? 'border-red-500' : 'border-gray-300'
      }`,
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type}
            {...commonProps}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={3}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            {...commonProps}
          />
        );
      
      case 'time':
        return (
          <input
            type="time"
            {...commonProps}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={option}
                  {...register(field.id, {
                    required: field.required ? `${field.label} is required` : false
                  })}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  {...register(field.id)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: field.maxRating || 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setValue(field.id, i + 1)}
                className={`w-8 h-8 ${
                  watch(field.id) > i ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
        );
      
      case 'file':
        return (
          <input
            type="file"
            {...commonProps}
            accept={field.accept}
          />
        );
      
      case 'payment':
        return (
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
                  {...register(field.id, {
                    required: field.required ? `${field.label} is required` : false,
                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                  })}
                  placeholder={field.placeholder || 'Enter amount'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                  min="0.01"
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
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.id].message}</p>
            )}
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            {...commonProps}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={navigateToDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isSignedIn ? 'Go to Dashboard' : 'Go Home'}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your submission. We'll get back to you soon.
          </p>
          <button
            onClick={navigateToDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isSignedIn ? 'Go to Dashboard' : 'Go Home'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToDashboard}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isSignedIn ? 'Back to Dashboard' : 'Back to Home'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{form?.title}</h1>
                <p className="text-gray-600">{form?.description}</p>
              </div>
            </div>
            
            {/* QR Code and Sharing */}
            <div className="flex items-center gap-2">
              {qrCodeDataURL && (
                <div className="relative group">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <QrCode className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <img src={qrCodeDataURL} alt="QR Code" className="w-32 h-32" />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={downloadQRCode}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={copyFormUrl}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {form?.fields?.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderField(field)}
                
                {errors[field.id] && (
                  <p className="text-sm text-red-600">{errors[field.id].message}</p>
                )}
              </div>
            ))}

            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={submitting || isProcessingPayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting || isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isProcessingPayment ? 'Processing Payment...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {form?.fields?.some(f => f.type === 'payment') ? 'Submit & Pay' : 'Submit Form'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
              <p className="text-gray-600 mb-6">
                You are about to pay <span className="font-semibold text-green-600">GH¢{(Number(paymentAmount) || 0).toFixed(2)}</span>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Clicking "Pay Now" will redirect you to Paystack's secure payment page to complete your payment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">GH¢{(Number(paymentAmount) || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-blue-600">Paystack</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    console.log('Pay Now clicked, initializing Paystack...');
                    console.log('Paystack config:', paystackConfig);
                    console.log('Payment amount:', paymentAmount);
                    console.log('Email:', getValues().email);
                    
                    try {
                      // Check if Paystack is properly configured
                      if (!paystackConfig.publicKey || paystackConfig.publicKey.includes('xxxxx')) {
                        throw new Error('Paystack public key not configured properly');
                      }
                      
                      if (!paymentAmount || paymentAmount <= 0) {
                        throw new Error('Invalid payment amount');
                      }
                      
                      console.log('Calling initializePaystack...');
                      
                      // Try direct method first, then fallback to hook
                      try {
                        initializePaystackDirect();
                      } catch (directError) {
                        console.log('Direct method failed, trying hook method:', directError);
                        initializePaystack();
                      }
                      
                      // If redirect doesn't happen within 3 seconds, show a message
                      setTimeout(() => {
                        if (!isProcessingPayment) {
                          console.log('Payment redirect timeout - showing error');
                          toast.error('Payment redirect failed. Please check your Paystack configuration.');
                        }
                      }, 3000);
                    } catch (error) {
                      console.error('Error initializing Paystack:', error);
                      console.error('Error details:', {
                        message: error.message,
                        stack: error.stack,
                        config: paystackConfig
                      });
                      toast.error(`Failed to initialize payment: ${error.message}`);
                    }
                  }}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  onClick={handlePaymentClose}
                  disabled={isProcessingPayment}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Secure payment powered by Paystack</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FormViewer;
