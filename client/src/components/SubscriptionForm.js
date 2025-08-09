import React, { useState } from 'react';
import { Mail, CheckCircle, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SubscriptionForm = ({ surveyId, surveyTitle, onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    survey_updates: true,
    new_surveys: false
  });
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    
    try {
      const response = await axios.post('/api/subscriptions', {
        email,
        survey_id: surveyId,
        preferences
      });

      toast.success('Successfully subscribed to survey!');
      setSubscribed(true);
      
      if (onSubscribe) {
        onSubscribe(response.data);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      const errorMessage = error.response?.data?.error || 'Failed to subscribe';
      toast.error(errorMessage);
    } finally {
      setSubscribing(false);
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Successfully Subscribed!
        </h3>
        <p className="text-green-700 mb-4">
          You'll receive updates about "{surveyTitle}" via email.
        </p>
        <div className="text-sm text-green-600">
          <p>• Survey updates and new questions</p>
          <p>• Results and insights when available</p>
          <p>• You can unsubscribe anytime</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Subscribe to Updates
        </h3>
        <p className="text-gray-600">
          Get notified about "{surveyTitle}" updates and results
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Notification Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Notification Preferences
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.email_notifications}
                onChange={() => handlePreferenceChange('email_notifications')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                Email notifications for survey updates
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.survey_updates}
                onChange={() => handlePreferenceChange('survey_updates')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                Survey updates and new questions
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.new_surveys}
                onChange={() => handlePreferenceChange('new_surveys')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                New surveys from this creator
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={subscribing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {subscribing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Subscribe to Updates
            </>
          )}
        </button>

        {/* Privacy Notice */}
        <div className="text-xs text-gray-500 text-center">
          <p>By subscribing, you agree to receive email updates.</p>
          <p>You can unsubscribe at any time.</p>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm; 