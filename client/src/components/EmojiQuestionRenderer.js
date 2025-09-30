import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EmojiQuestionRenderer = ({ question, value, onChange, disabled = false }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const settings = question?.settings || {};
  const scale = settings.scale || 5;
  const emojis = settings.emojis || ['😞', '😐', '🙂', '😊', '😍'];
  const labels = settings.labels || {
    1: 'Very Dissatisfied',
    2: 'Dissatisfied', 
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very Satisfied'
  };

  const handleEmojiClick = (selectedValue) => {
    if (disabled) return;
    onChange(selectedValue);
  };

  const getEmojiSize = (scale) => {
    if (scale <= 4) return 'text-4xl'; // 36px
    if (scale <= 5) return 'text-3xl'; // 30px
    if (scale <= 7) return 'text-2xl'; // 24px
    return 'text-xl'; // 20px
  };

  const emojiSize = getEmojiSize(scale);

  return (
    <div className="space-y-4">
      {/* Emoji Scale */}
      <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
        {Array.from({ length: scale }, (_, index) => {
          const emojiValue = index + 1;
          const emoji = emojis[index] || '😐';
          const isSelected = value === emojiValue;
          const isHovered = hoveredValue === emojiValue;
          const label = labels[emojiValue] || `Option ${emojiValue}`;

          return (
            <motion.button
              key={emojiValue}
              type="button"
              onClick={() => handleEmojiClick(emojiValue)}
              onMouseEnter={() => setHoveredValue(emojiValue)}
              onMouseLeave={() => setHoveredValue(null)}
              disabled={disabled}
              className={`
                relative p-2 md:p-3 rounded-xl transition-all duration-200 
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isSelected 
                  ? 'bg-blue-100 border-2 border-blue-500 shadow-lg' 
                  : isHovered 
                    ? 'bg-gray-100 border-2 border-gray-300'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }
              `}
              whileHover={!disabled ? { y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Emoji */}
              <div className={`${emojiSize} leading-none select-none`}>
                {emoji}
              </div>
              
              {/* Value indicator */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {emojiValue}
              </div>

              {/* Hover/Selected Label */}
              {(isSelected || isHovered) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                >
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-white'
                  }`}>
                    {label}
                  </span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Labels Row (for larger scales) */}
      {scale > 5 && (
        <div className="flex justify-between items-center text-xs text-gray-600 px-2">
          <span className="text-left">{labels[1] || 'Low'}</span>
          <span className="text-center">{labels[Math.ceil(scale/2)] || 'Medium'}</span>
          <span className="text-right">{labels[scale] || 'High'}</span>
        </div>
      )}

      {/* Current Selection Display */}
      {value && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{emojis[value - 1]}</span>
            <div className="text-left">
              <div className="font-medium text-blue-900">
                {labels[value]} ({value}/{scale})
              </div>
              <div className="text-sm text-blue-600">
                Your selection
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Question Type Info */}
      <div className="text-center text-xs text-gray-500">
        Click an emoji to rate • {scale} point scale
      </div>
    </div>
  );
};

export default EmojiQuestionRenderer;
