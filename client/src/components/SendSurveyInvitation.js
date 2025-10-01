import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  X,
  Plus,
  Trash2,
  Send,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Copy,
  Upload,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const SendSurveyInvitation = ({ survey, isOpen, onClose, onSuccess }) => {
  const [recipients, setRecipients] = useState([{ email: '', name: '' }]);
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);

  const addRecipient = () => {
    setRecipients([...recipients, { email: '', name: '' }]);
  };

  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index, field, value) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const emails = text.split(/[\n,;]/).map(e => e.trim()).filter(e => e);
      const newRecipients = emails.map(email => ({ email, name: '' }));
      setRecipients([...recipients, ...newRecipients]);
      toast.success(`Added ${emails.length} email(s)`);
    } catch (error) {
      toast.error('Failed to paste from clipboard');
    }
  };

  const importFromCSV = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        const lines = text.split('\n');
        const newRecipients = [];

        // Skip header row if present
        const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parts = line.split(',').map(p => p.trim());
          if (parts.length >= 1) {
            newRecipients.push({
              email: parts[0],
              name: parts[1] || ''
            });
          }
        }

        setRecipients([...recipients, ...newRecipients]);
        toast.success(`Imported ${newRecipients.length} recipient(s)`);
      } catch (error) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    // Validate recipients
    const validRecipients = recipients.filter(r => r.email.trim() !== '');
    
    if (validRecipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validRecipients.filter(r => !emailRegex.test(r.email));
    
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email format: ${invalidEmails[0].email}`);
      return;
    }

    setSending(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-survey-invitation', {
        body: {
          surveyId: survey.id,
          recipients: validRecipients,
          customMessage: customMessage.trim()
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setResults(data);
      
      if (data.failed === 0) {
        toast.success(`Successfully sent ${data.sent} invitation(s)!`);
        if (onSuccess) onSuccess(data);
        
        // Close modal after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.warning(`Sent ${data.sent} of ${validRecipients.length} invitations`);
      }

    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error(error.message || 'Failed to send invitations');
    } finally {
      setSending(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'email,name\nexample@email.com,John Doe\nanother@email.com,Jane Smith';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipients-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <div>
                  <h2 className="text-2xl font-bold">Send Survey Invitations</h2>
                  <p className="text-blue-100 text-sm mt-1">{survey.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!results ? (
              <div className="space-y-6">
                {/* Survey Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Survey Details</h3>
                      <p className="text-blue-700 text-sm mt-1">{survey.description || 'No description'}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-blue-600">
                        <span>📝 {survey.question_count || 0} questions</span>
                        <span>⏱️ ~{Math.ceil((survey.question_count || 0) * 0.5)} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Add Recipients</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={pasteFromClipboard}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Paste from Clipboard</span>
                    </button>
                    
                    <label className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Import CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={importFromCSV}
                        className="hidden"
                      />
                    </label>
                    
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download Template</span>
                    </button>
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Recipients ({recipients.length})</span>
                    </h3>
                    <button
                      onClick={addRecipient}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Recipient</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recipients.map((recipient, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="email"
                          placeholder="Email address *"
                          value={recipient.email}
                          onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Name (optional)"
                          value={recipient.name}
                          onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {recipients.length > 1 && (
                          <button
                            onClick={() => removeRecipient(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal message to your invitation..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This message will be included in the invitation email
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Each recipient will receive a personalized invitation link 
                        to access the survey. You can track opens, clicks, and responses in the survey dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Results */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Invitations Sent!</h3>
                  <p className="text-gray-600">
                    Successfully sent {results.sent} of {results.sent + results.failed} invitation(s)
                  </p>
                </div>

                {results.errors && results.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Failed to Send:</h4>
                    <ul className="space-y-1">
                      {results.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-700">
                          {error.email}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Successfully Sent To:</h4>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    {results.results?.map((result, index) => (
                      <li key={index} className="text-sm text-green-700">
                        ✓ {result.name ? `${result.name} (${result.email})` : result.email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {results ? 'Close' : 'Cancel'}
              </button>
              
              {!results && (
                <button
                  onClick={handleSend}
                  disabled={sending || recipients.filter(r => r.email).length === 0}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Invitations</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SendSurveyInvitation;

