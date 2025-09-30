import React from 'react';
import { motion } from 'framer-motion';
import { Save, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AutoSaveIndicator = ({ lastSaved, saving, enabled, onToggle }) => {
  const getStatus = () => {
    if (saving) return { icon: Save, text: 'Saving...', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (lastSaved) return { icon: CheckCircle, text: 'Saved', color: 'text-green-600', bg: 'bg-green-50' };
    return { icon: Clock, text: 'Not saved', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const status = getStatus();

  return (
    <div className="space-y-2">
      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 p-1.5 rounded-md ${status.bg}`}
      >
        <status.icon className={`w-3 h-3 ${status.color}`} />
        <span className={`text-xs font-medium ${status.color} flex-1`}>
          {status.text}
        </span>
        {lastSaved && (
          <span className="text-[10px] text-gray-500">
            {new Date(lastSaved).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </motion.div>

      {/* Auto-save Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">Auto-save</span>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <p className="text-[10px] text-gray-500 leading-tight">
          Saves every 30 seconds
        </p>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
