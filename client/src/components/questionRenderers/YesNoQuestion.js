import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const YesNoQuestion = ({ question, value, onChange, disabled }) => {
  const yesLabel = question.settings?.yesLabel || 'Yes';
  const noLabel = question.settings?.noLabel || 'No';
  const allowNA = question.settings?.allowNA || false;
  const naLabel = question.settings?.naLabel || 'Not Applicable';

  const handleSelect = (selection) => {
    if (!disabled && onChange) {
      onChange(selection);
    }
  };

  const options = [
    { value: 'yes', label: yesLabel, icon: CheckCircle, color: 'green' },
    { value: 'no', label: noLabel, icon: XCircle, color: 'red' }
  ];

  if (allowNA) {
    options.push({ value: 'na', label: naLabel, icon: HelpCircle, color: 'gray' });
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.value;
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            disabled={disabled}
            className={`w-full flex items-center space-x-4 p-4 border-2 rounded-lg transition-all ${
              isSelected
                ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon 
              className={`w-6 h-6 ${
                isSelected ? `text-${option.color}-600` : 'text-gray-400'
              }`} 
            />
            <span className={`flex-1 text-left font-medium ${
              isSelected ? `text-${option.color}-900` : 'text-gray-700'
            }`}>
              {option.label}
            </span>
            {isSelected && (
              <div className={`w-5 h-5 rounded-full bg-${option.color}-500 flex items-center justify-center`}>
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default YesNoQuestion;

