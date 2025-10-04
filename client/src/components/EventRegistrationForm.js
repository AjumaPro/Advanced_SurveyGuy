import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, Users, Mail, Phone, User, CreditCard, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { usePaystackPayment } from 'react-paystack';
import { initializePayment } from '../services/paystackService';

const EventRegistrationForm = ({ event, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      attendees: 1,
      company: '',
      position: '',
      dietary: '',
      custom: ''
    }
  });

  const attendeesCount = watch('attendees');

  // Event pricing (if event has pricing)
  const eventPrice = event?.price || 0;
  const totalPrice = eventPrice * attendeesCount;

  // Paystack configuration
  const paystackConfig = initializePayment(totalPrice, user?.email || '', {
    event_id: event?.id,
    registration_data: registrationData,
    user_id: user?.id,
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
  });

  const initializePaystack = usePaystackPayment(paystackConfig);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = {
        user_id: user?.id,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || '',
        attendees: parseInt(data.attendees) || 1,
        company: data.company?.trim() || '',
        position: data.position?.trim() || '',
        dietary: data.dietary?.trim() || '',
        additional_info: {
          custom: data.custom?.trim() || '',
          registration_source: 'web_form',
          registered_by: user?.id || 'anonymous'
        }
      };

      setRegistrationData(formData);

      // If event has a price, show payment flow
      if (eventPrice > 0) {
        setShowPayment(true);
        setIsSubmitting(false);
        return;
      }

      // If free event, proceed with registration
      await processRegistration(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to process registration');
      setIsSubmitting(false);
    }
  };

  const processRegistration = async (data) => {
    try {
      const { data: registration, error } = await api.events.registerForEvent(event.id, data);
      
      if (error) throw error;
      
      toast.success('Registration successful!');
      onSuccess?.(registration);
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for event');
      throw error;
    }
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      // Verify payment with backend
      const { data: verification, error } = await api.payments.verifyPayment(reference);
      
      if (error) throw error;
      
      // Process registration with payment confirmation
      await processRegistration({
        ...registrationData,
        payment_reference: reference,
        payment_verified: true
      });
      
      setShowPayment(false);
      toast.success('Payment successful! Registration completed.');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment verification failed');
    }
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setIsSubmitting(false);
  };

  if (!event) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No event selected for registration.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Event Info Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg text-white">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-blue-100 mb-4">{event.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(event.start_date || event.starts_at || event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{event.time || new Date(event.start_date || event.starts_at || event.date).toTimeString().slice(0, 5)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location || 'TBA'}</span>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Attendees *
              </label>
              <select
                {...register('attendees', { 
                  required: 'Number of attendees is required',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 10, message: 'Maximum 10 attendees' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              {errors.attendees && (
                <p className="text-red-600 text-sm mt-1">{errors.attendees.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Professional Information (Optional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Organization
              </label>
              <input
                type="text"
                {...register('company')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your company or organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position/Title
              </label>
              <input
                type="text"
                {...register('position')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your position or job title"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Requirements
              </label>
              <textarea
                {...register('dietary')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any dietary restrictions or preferences..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                {...register('custom')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional information or special requests..."
              />
            </div>
          </div>
        </div>

        {/* Event Capacity Warning */}
        {event.capacity && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Event Capacity: {event.capacity} attendees
                </p>
                <p className="text-sm text-yellow-700">
                  {attendeesCount > 1 && `You are registering for ${attendeesCount} attendees.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        {eventPrice > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Event Fee: GH¢{eventPrice.toFixed(2)} per person
                  </p>
                  <p className="text-sm text-blue-700">
                    Total: GH¢{totalPrice.toFixed(2)} for {attendeesCount} attendee{attendeesCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600">QR Payment Available</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Flow */}
        {showPayment && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Complete Your Payment
              </h3>
              <p className="text-green-700 mb-4">
                Total Amount: GH¢{totalPrice.toFixed(2)}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => initializePaystack(handlePaymentSuccess, handlePaymentClose)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay with Paystack
                </button>
                <button
                  onClick={handlePaymentClose}
                  className="px-6 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Registering...
              </>
            ) : (
              <>
                {eventPrice > 0 ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Register & Pay
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Register for Event
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm;