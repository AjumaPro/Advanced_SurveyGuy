import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ScaleQuestion = ({ question, value, onChange, disabled }) => {
  const min = question.settings?.min || 1;
  const max = question.settings?.max || 5;
  const step = question.settings?.step || 1;
  const minLabel = question.settings?.minLabel || `${min}`;
  const maxLabel = question.settings?.maxLabel || `${max}`;
  const labels = question.settings?.labels || {};
  const [hoveredValue, setHoveredValue] = useState(null);

  const points = [];
  for (let i = min; i <= max; i += step) {
    points.push(i);
  }

  const handleSelect = (pointValue) => {
    if (!disabled && onChange) {
      onChange(pointValue);
    }
  };

  const getColorClass = (pointValue) => {
    if (!value) return 'bg-gray-200 text-gray-600';
    
    if (value === pointValue) {
      const percentage = ((pointValue - min) / (max - min)) * 100;
      if (percentage <= 33) return 'bg-red-500 text-white';
      if (percentage <= 66) return 'bg-yellow-500 text-white';
      return 'bg-green-500 text-white';
    }
    
    return 'bg-gray-100 text-gray-500';
  };

  const getHoverColorClass = (pointValue) => {
    const percentage = ((pointValue - min) / (max - min)) * 100;
    if (percentage <= 33) return 'hover:bg-red-100 hover:border-red-300';
    if (percentage <= 66) return 'hover:bg-yellow-100 hover:border-yellow-300';
    return 'hover:bg-green-100 hover:border-green-300';
  };

  return (
    <div className="space-y-4">
      {/* Scale Points */}
      <div className="flex items-center justify-between space-x-2">
        {points.map((point, index) => (
          <motion.button
            key={point}
            type="button"
            onClick={() => handleSelect(point)}
            onMouseEnter={() => setHoveredValue(point)}
            onMouseLeave={() => setHoveredValue(null)}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`flex-1 min-w-[50px] h-14 flex flex-col items-center justify-center border-2 rounded-lg font-bold transition-all ${
              getColorClass(point)
            } ${
              !disabled && value !== point ? getHoverColorClass(point) : ''
            } ${
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } ${
              value === point ? 'ring-2 ring-offset-2 ring-blue-400 shadow-lg' : 'border-gray-300'
            }`}
          >
            <span className="text-lg">{point}</span>
            {labels[point] && (
              <span className="text-[10px] font-normal opacity-75">{labels[point].substring(0, 10)}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600 flex items-center space-x-2">
          <span className="font-medium">{min}</span>
          <span className="text-gray-500">-</span>
          <span>{minLabel}</span>
        </div>
        <div className="text-gray-600 flex items-center space-x-2">
          <span>{maxLabel}</span>
          <span className="text-gray-500">-</span>
          <span className="font-medium">{max}</span>
        </div>
      </div>

      {/* Current Selection Display */}
      {(value || hoveredValue) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-blue-900">
            <span className="font-semibold">
              {hoveredValue && !value ? 'Hovering: ' : 'Selected: '}
            </span>
            <span className="font-bold text-lg">
              {hoveredValue || value}
            </span>
            {labels[hoveredValue || value] && (
              <span className="text-blue-700 ml-2">- {labels[hoveredValue || value]}</span>
            )}
          </p>
        </motion.div>
      )}

      {/* All Labels Display (Optional) */}
      {Object.keys(labels).length > 0 && !hoveredValue && !value && (
        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase">Scale Guide:</p>
          <div className="grid grid-cols-1 gap-1">
            {points.map(point => labels[point] && (
              <div key={point} className="flex items-center space-x-2 text-sm">
                <span className="font-bold text-gray-700 w-6">{point}:</span>
                <span className="text-gray-600">{labels[point]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScaleQuestion;

