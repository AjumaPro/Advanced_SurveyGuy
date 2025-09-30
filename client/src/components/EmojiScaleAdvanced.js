import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EmojiScaleAdvanced = ({ 
  question, 
  value, 
  onChange, 
  disabled = false,
  showAnimation = true,
  size = 'md',
  layout = 'horizontal'
}) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const [showFeedback, setShowFeedback] = useState(false);

  // Enhanced emoji scales with more variety
  const emojiScales = {
    satisfaction: [
      { value: 1, emoji: '😡', label: 'Very Dissatisfied', color: '#EF4444', description: 'Extremely unhappy' },
      { value: 2, emoji: '😞', label: 'Dissatisfied', color: '#F97316', description: 'Not happy' },
      { value: 3, emoji: '😐', label: 'Neutral', color: '#EAB308', description: 'Neither happy nor unhappy' },
      { value: 4, emoji: '🙂', label: 'Satisfied', color: '#84CC16', description: 'Pretty happy' },
      { value: 5, emoji: '🤩', label: 'Very Satisfied', color: '#22C55E', description: 'Extremely happy' }
    ],
    mood: [
      { value: 1, emoji: '😠', label: 'Angry', color: '#DC2626', description: 'Really upset' },
      { value: 2, emoji: '😢', label: 'Sad', color: '#F97316', description: 'Feeling down' },
      { value: 3, emoji: '😴', label: 'Tired', color: '#EAB308', description: 'Need some rest' },
      { value: 4, emoji: '😊', label: 'Happy', color: '#84CC16', description: 'Feeling good' },
      { value: 5, emoji: '🎉', label: 'Excited', color: '#22C55E', description: 'Full of energy' }
    ],
    agreement: [
      { value: 1, emoji: '👎', label: 'Strongly Disagree', color: '#EF4444', description: 'Completely disagree' },
      { value: 2, emoji: '🤔', label: 'Disagree', color: '#F97316', description: 'Mostly disagree' },
      { value: 3, emoji: '🤷', label: 'Neutral', color: '#EAB308', description: 'No strong opinion' },
      { value: 4, emoji: '👍', label: 'Agree', color: '#84CC16', description: 'Mostly agree' },
      { value: 5, emoji: '💯', label: 'Strongly Agree', color: '#22C55E', description: 'Completely agree' }
    ],
    experience: [
      { value: 1, emoji: '💀', label: 'Terrible', color: '#DC2626', description: 'Worst experience ever' },
      { value: 2, emoji: '😒', label: 'Poor', color: '#F97316', description: 'Not good at all' },
      { value: 3, emoji: '😐', label: 'Average', color: '#EAB308', description: 'Nothing special' },
      { value: 4, emoji: '😍', label: 'Good', color: '#84CC16', description: 'Really enjoyed it' },
      { value: 5, emoji: '🚀', label: 'Excellent', color: '#22C55E', description: 'Amazing experience' }
    ],
    quality: [
      { value: 1, emoji: '🗑️', label: 'Very Poor', color: '#DC2626', description: 'Unacceptable quality' },
      { value: 2, emoji: '👎', label: 'Poor', color: '#F97316', description: 'Below expectations' },
      { value: 3, emoji: '⚖️', label: 'Fair', color: '#EAB308', description: 'Meets basic expectations' },
      { value: 4, emoji: '👌', label: 'Good', color: '#84CC16', description: 'Above expectations' },
      { value: 5, emoji: '⭐', label: 'Excellent', color: '#22C55E', description: 'Outstanding quality' }
    ],
    difficulty: [
      { value: 1, emoji: '😴', label: 'Very Easy', color: '#22C55E', description: 'No effort required' },
      { value: 2, emoji: '🙂', label: 'Easy', color: '#84CC16', description: 'Simple to do' },
      { value: 3, emoji: '🤔', label: 'Moderate', color: '#EAB308', description: 'Some effort needed' },
      { value: 4, emoji: '😅', label: 'Hard', color: '#F97316', description: 'Challenging' },
      { value: 5, emoji: '🤯', label: 'Very Hard', color: '#DC2626', description: 'Extremely difficult' }
    ],
    likelihood: [
      { value: 1, emoji: '❌', label: 'Never', color: '#DC2626', description: 'Definitely not' },
      { value: 2, emoji: '🤷', label: 'Unlikely', color: '#F97316', description: 'Probably not' },
      { value: 3, emoji: '🤔', label: 'Maybe', color: '#EAB308', description: 'Not sure' },
      { value: 4, emoji: '👍', label: 'Likely', color: '#84CC16', description: 'Probably yes' },
      { value: 5, emoji: '✅', label: 'Definitely', color: '#22C55E', description: 'Absolutely yes' }
    ]
  };

  const scaleType = question.settings?.scaleType || 'satisfaction';
  const showLabels = question.settings?.showLabels !== false;
  const showDescriptions = question.settings?.showDescriptions || false;
  const allowHover = question.settings?.allowHover !== false;
  const scale = emojiScales[scaleType] || emojiScales.satisfaction;

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (emojiValue) => {
    if (disabled) return;
    
    setSelectedValue(emojiValue);
    onChange(emojiValue);
    
    if (showAnimation) {
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
  };

  const handleHover = (emojiValue) => {
    if (disabled || !allowHover) return;
    setHoveredValue(emojiValue);
  };

  const handleLeave = () => {
    if (disabled) return;
    setHoveredValue(null);
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: {
        emoji: 'text-2xl',
        container: 'p-2',
        label: 'text-xs',
        description: 'text-xs'
      },
      md: {
        emoji: 'text-4xl',
        container: 'p-3',
        label: 'text-sm',
        description: 'text-xs'
      },
      lg: {
        emoji: 'text-5xl',
        container: 'p-4',
        label: 'text-base',
        description: 'text-sm'
      }
    };
    return sizes[size] || sizes.md;
  };

  const sizeClasses = getSizeClasses();
  const currentValue = hoveredValue !== null ? hoveredValue : selectedValue;
  const currentEmoji = scale.find(s => s.value === currentValue);

  const containerClasses = layout === 'vertical' 
    ? 'flex flex-col gap-3' 
    : 'flex justify-between items-center gap-2 flex-wrap';

  return (
    <div className="space-y-4">
      {/* Main Scale */}
      <div className={containerClasses}>
        {scale.map((emoji, index) => {
          const isSelected = selectedValue === emoji.value;
          const isHovered = hoveredValue === emoji.value;
          const isActive = isSelected || isHovered;
          
          return (
            <motion.div
              key={emoji.value}
              className={`flex flex-col items-center gap-2 ${sizeClasses.container} rounded-xl cursor-pointer transition-all duration-200 ${
                disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50'
              } ${
                isActive ? 'bg-gray-50 shadow-md' : ''
              }`}
              onClick={() => handleSelect(emoji.value)}
              onMouseEnter={() => handleHover(emoji.value)}
              onMouseLeave={handleLeave}
              whileHover={showAnimation && !disabled ? { y: -3 } : {}}
              whileTap={showAnimation && !disabled ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                backgroundColor: isActive ? emoji.color + '10' : 'transparent'
              }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`${sizeClasses.emoji} select-none`}
                animate={showAnimation ? {
                  rotate: isActive ? [0, -10, 10, 0] : 0
                } : {}}
                transition={{ duration: 0.3 }}
              >
                {emoji.emoji}
              </motion.div>
              
              {showLabels && (
                <motion.span
                  className={`${sizeClasses.label} font-medium text-center text-gray-700 leading-tight`}
                  animate={{ color: isActive ? emoji.color : '#374151' }}
                >
                  {emoji.label}
                </motion.span>
              )}
              
              {showDescriptions && isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${sizeClasses.description} text-gray-500 text-center leading-tight max-w-20`}
                >
                  {emoji.description}
                </motion.span>
              )}
              
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: emoji.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Selection Display */}
      {currentEmoji && (selectedValue || hoveredValue) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{currentEmoji.emoji}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">{currentEmoji.label}</div>
              <div className="text-sm text-gray-600">{currentEmoji.description}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feedback Animation */}
      <AnimatePresence>
        {showFeedback && selectedValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-full p-6 shadow-2xl border-4" style={{ borderColor: currentEmoji?.color }}>
              <div className="text-6xl">{currentEmoji?.emoji}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scale Legend */}
      {question.settings?.showLegend && (
        <div className="flex justify-between text-xs text-gray-500 px-2">
          <span>{scale[0].label}</span>
          <span>{scale[scale.length - 1].label}</span>
        </div>
      )}

      {/* Custom Styles for Enhanced Interactions */}
      <style jsx>{`
        .emoji-scale-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .emoji-scale-item:hover {
          transform: translateY(-2px);
        }
        
        .emoji-scale-item.selected {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default EmojiScaleAdvanced;
