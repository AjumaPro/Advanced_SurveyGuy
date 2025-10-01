import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SliderQuestion = ({ question, value, onChange, disabled }) => {
  const min = question.settings?.min || 0;
  const max = question.settings?.max || 100;
  const step = question.settings?.step || 1;
  const minLabel = question.settings?.minLabel || 'Minimum';
  const maxLabel = question.settings?.maxLabel || 'Maximum';
  const showValue = question.settings?.showValue !== false;
  const unit = question.settings?.unit || '';

  const [currentValue, setCurrentValue] = useState(value || min);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setCurrentValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const getColorClass = () => {
    if (percentage <= 33) return 'bg-red-500';
    if (percentage <= 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      {/* Value Display */}
      {showValue && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-baseline space-x-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
            <span className="text-4xl font-bold">{currentValue}</span>
            {unit && <span className="text-xl opacity-90">{unit}</span>}
          </div>
        </motion.div>
      )}

      {/* Slider */}
      <div className="relative px-2">
        {/* Track Background */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
        
        {/* Filled Track */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 h-2 rounded-full transition-all duration-200 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className="relative w-full h-2 appearance-none bg-transparent cursor-pointer focus:outline-none disabled:cursor-not-allowed slider-thumb"
          style={{
            WebkitAppearance: 'none',
          }}
        />
      </div>

      {/* Min/Max Labels and Tick Marks */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-left">
          <div className="font-semibold text-gray-700">{min}{unit}</div>
          <div className="text-gray-500 text-xs">{minLabel}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-700">{max}{unit}</div>
          <div className="text-gray-500 text-xs">{maxLabel}</div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-8 h-1 bg-red-500 rounded"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-8 h-1 bg-yellow-500 rounded"></div>
          <span>Med</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-8 h-1 bg-green-500 rounded"></div>
          <span>High</span>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${percentage <= 33 ? '#ef4444' : percentage <= 66 ? '#eab308' : '#22c55e'};
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${percentage <= 33 ? '#ef4444' : percentage <= 66 ? '#eab308' : '#22c55e'};
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .slider-thumb:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SliderQuestion;

