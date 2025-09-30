// SVG Emoji Configuration for Custom Emoji Scales
export const SVG_EMOJIS = {
  // Map SVG files to emoji scale values
  satisfaction: [
    { value: 1, label: 'Very Sad', svg: '/emojis/red-very-sad.svg', color: '#ef4444' },
    { value: 2, label: 'Sad', svg: '/emojis/red-sad.svg', color: '#f97316' },
    { value: 3, label: 'Neutral', svg: '/emojis/yellow-neutral.svg', color: '#eab308' },
    { value: 4, label: 'Happy', svg: '/emojis/green-happy.svg', color: '#22c55e' },
    { value: 5, label: 'Very Happy', svg: '/emojis/green-very-happy.svg', color: '#16a34a' }
  ],
  
  mood: [
    { value: 1, label: 'Angry', svg: '/emojis/red-angry.svg', color: '#dc2626' },
    { value: 2, label: 'Sad', svg: '/emojis/red-sad.svg', color: '#ef4444' },
    { value: 3, label: 'Neutral', svg: '/emojis/yellow-neutral.svg', color: '#eab308' },
    { value: 4, label: 'Slightly Happy', svg: '/emojis/yellow-slightly-happy.svg', color: '#f59e0b' },
    { value: 5, label: 'Very Happy', svg: '/emojis/green-very-happy.svg', color: '#16a34a' }
  ],
  
  quality: [
    { value: 1, label: 'Poor', svg: '/emojis/red-angry.svg', color: '#dc2626' },
    { value: 2, label: 'Fair', svg: '/emojis/yellow-neutral.svg', color: '#eab308' },
    { value: 3, label: 'Good', svg: '/emojis/yellow-slightly-happy.svg', color: '#f59e0b' },
    { value: 4, label: 'Excellent', svg: '/emojis/green-very-happy.svg', color: '#16a34a' }
  ],
  
  agreement: [
    { value: 1, label: 'Strongly Disagree', svg: '/emojis/red-angry.svg', color: '#dc2626' },
    { value: 2, label: 'Disagree', svg: '/emojis/red-sad.svg', color: '#ef4444' },
    { value: 3, label: 'Neutral', svg: '/emojis/yellow-neutral.svg', color: '#eab308' },
    { value: 4, label: 'Agree', svg: '/emojis/green-happy.svg', color: '#22c55e' },
    { value: 5, label: 'Strongly Agree', svg: '/emojis/green-very-happy.svg', color: '#16a34a' }
  ],
  
  difficulty: [
    { value: 1, label: 'Very Easy', svg: '/emojis/green-very-happy.svg', color: '#16a34a' },
    { value: 2, label: 'Easy', svg: '/emojis/green-happy.svg', color: '#22c55e' },
    { value: 3, label: 'Hard', svg: '/emojis/yellow-neutral.svg', color: '#eab308' },
    { value: 4, label: 'Very Hard', svg: '/emojis/red-angry.svg', color: '#dc2626' }
  ],
  
  likelihood: [
    { value: 1, label: 'Never', svg: '/emojis/red-angry.svg', color: '#dc2626' },
    { value: 2, label: 'Unlikely', svg: '/emojis/red-sad.svg', color: '#ef4444' },
    { value: 3, label: 'Maybe', svg: '/emojis/yellow-neutral.svg', color: '#eab308' },
    { value: 4, label: 'Likely', svg: '/emojis/green-happy.svg', color: '#22c55e' },
    { value: 5, label: 'Definitely', svg: '/emojis/green-very-happy.svg', color: '#16a34a' }
  ]
};

// Get SVG emoji scale by type
export const getSVGEmojiScale = (type) => {
  return SVG_EMOJIS[type] || SVG_EMOJIS.satisfaction;
};

// Get all available SVG emoji scale types
export const getSVGEmojiTypes = () => {
  return Object.keys(SVG_EMOJIS);
};

// SVG Emoji Component
export const SVGEmoji = ({ src, alt, className = "", size = "w-8 h-8" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`${size} ${className}`}
      style={{ 
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
        transition: 'all 0.2s ease'
      }}
    />
  );
};

// Enhanced SVG Emoji Scale Component
export const SVGEmojiScale = ({ 
  question, 
  value, 
  onChange, 
  preview = false,
  scaleType = 'satisfaction',
  showLabels = true,
  size = 'md'
}) => {
  const scale = getSVGEmojiScale(scaleType);
  const currentValue = parseInt(value) || 0;
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const handleEmojiClick = (emojiValue) => {
    if (!preview && onChange) {
      onChange(emojiValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-3 flex-wrap">
        {scale.map((emoji) => (
          <button
            key={emoji.value}
            type="button"
            onClick={() => handleEmojiClick(emoji.value)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
              currentValue === emoji.value
                ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:shadow-sm'
            } ${preview ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={preview}
            style={{
              borderColor: currentValue === emoji.value ? emoji.color : 'transparent'
            }}
          >
            <SVGEmoji 
              src={emoji.svg} 
              alt={emoji.label}
              size={sizeClasses[size]}
              className={currentValue === emoji.value ? 'scale-110' : ''}
            />
            {showLabels && (
              <span className="text-xs text-gray-600 text-center mt-2 max-w-16">
                {emoji.label}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {currentValue > 0 && (
        <div className="text-center">
          <span className="text-sm text-gray-600">
            {scale.find(e => e.value === currentValue)?.label}
          </span>
        </div>
      )}
    </div>
  );
};
