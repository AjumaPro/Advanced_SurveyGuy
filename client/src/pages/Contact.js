import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  Bug, 
  Star,
  CheckCircle,
  AlertCircle,
  Users,
  Headphones,
  FileText,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = {
    phones: [
      { number: '+233 24 973 9599', label: 'Primary Support', type: 'support' },
      { number: '+233 50 698 5503', label: 'Technical Support', type: 'technical' }
    ],
    email: 'infoajumapro@gmail.com',
    address: 'Accra, Ghana',
    hours: {
      weekdays: '9:00 AM - 6:00 PM GMT',
      weekends: '10:00 AM - 4:00 PM GMT'
    }
  };

  const contactCategories = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Star },
    { value: 'billing', label: 'Billing Question', icon: FileText },
    { value: 'partnership', label: 'Partnership', icon: Users }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contact form submitted:', formData);
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCall = (number) => {
    window.open(`tel:${number.replace(/\s/g, '')}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${contactInfo.email}`, '_self');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We've received your message and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We're here to help! Reach out to our support team for any questions, technical issues, or feedback.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                {/* Phone Numbers */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Phone Support</span>
                  </h3>
                  {contactInfo.phones.map((phone, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{phone.number}</p>
                          <p className="text-sm text-gray-600">{phone.label}</p>
                        </div>
                        <button
                          onClick={() => handleCall(phone.number)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-3">
                    <Mail className="w-5 h-5" />
                    <span>Email Support</span>
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{contactInfo.email}</p>
                      <p className="text-sm text-gray-600">We respond within 24 hours</p>
                    </div>
                    <button
                      onClick={handleEmail}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Email
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-3">
                    <MapPin className="w-5 h-5" />
                    <span>Location</span>
                  </h3>
                  <p className="text-gray-900">{contactInfo.address}</p>
                </div>

                {/* Business Hours */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-3">
                    <Clock className="w-5 h-5" />
                    <span>Business Hours</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monday - Friday:</span>
                      <span className="text-sm font-medium text-gray-900">{contactInfo.hours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Saturday - Sunday:</span>
                      <span className="text-sm font-medium text-gray-900">{contactInfo.hours.weekends}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {contactCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorityLevels.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">How quickly do you respond to support requests?</h3>
              <p className="text-gray-600 text-sm">
                We typically respond to all support requests within 24 hours during business days. 
                For urgent issues, please call our support line directly.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What information should I include in my support request?</h3>
              <p className="text-gray-600 text-sm">
                Please include your account email, a clear description of the issue, steps to reproduce (if applicable), 
                and any error messages you're seeing.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Do you offer phone support?</h3>
              <p className="text-gray-600 text-sm">
                Yes! We offer phone support during business hours. Call +233 24 973 9599 for general support 
                or +233 50 698 5503 for technical issues.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">How can I report a bug?</h3>
              <p className="text-gray-600 text-sm">
                Use our contact form and select "Bug Report" as the category. Include details about when the bug occurs, 
                what you were trying to do, and any error messages.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Can I request new features?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely! We love hearing from our users. Select "Feature Request" in the contact form and 
                describe the feature you'd like to see added.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What are your business hours?</h3>
              <p className="text-gray-600 text-sm">
                We're available Monday-Friday 9:00 AM - 6:00 PM GMT and weekends 10:00 AM - 4:00 PM GMT. 
                Email support is available 24/7.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Emergency Support</h3>
              <p className="text-red-800 text-sm mb-4">
                For critical issues affecting your surveys or urgent technical problems, 
                call our emergency support line immediately.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="tel:+233249739599"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Emergency: +233 24 973 9599</span>
                </a>
                <span className="text-sm text-red-600">Available 24/7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
