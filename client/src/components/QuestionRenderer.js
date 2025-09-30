import React from 'react';
import { emojiScales } from '../utils/questionTypes';
import { SVGEmojiScale, getSVGEmojiScale } from '../utils/svgEmojis';
import { Star, ThumbsUp, ThumbsDown, Upload } from 'lucide-react';

const QuestionRenderer = ({ question, value, onChange, preview = false }) => {

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderTextInput = () => (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={question.placeholder || 'Your answer...'}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={preview}
      maxLength={question.maxLength}
    />
  );

  const renderTextarea = () => (
    <textarea
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={question.placeholder || 'Your detailed answer...'}
      rows={question.rows || 4}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      disabled={preview}
      maxLength={question.maxLength}
    />
  );

  const renderMultipleChoice = () => (
    <div className="space-y-2">
      {(question.options || []).map((option, index) => (
        <label key={index} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={value === option}
            onChange={(e) => handleChange(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            disabled={preview}
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
      {question.allowOther && (
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name={`question-${question.id}`}
            value="other"
            checked={value && !question.options?.includes(value)}
            onChange={() => handleChange('other')}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            disabled={preview}
          />
          <input
            type="text"
            placeholder="Other (please specify)"
            value={value && !question.options?.includes(value) ? value : ''}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            disabled={preview}
          />
        </label>
      )}
    </div>
  );

  const renderCheckbox = () => {
    const selectedValues = Array.isArray(value) ? value : [];
    
    const toggleOption = (option) => {
      const newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
      handleChange(newValues);
    };

    return (
      <div className="space-y-2">
        {(question.options || []).map((option, index) => (
          <label key={index} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => toggleOption(option)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={preview}
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderDropdown = () => (
    <select
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={preview}
    >
      <option value="">Select an option...</option>
      {(question.options || []).map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  const renderRating = () => {
    const maxRating = question.maxRating || 5;
    const currentRating = parseInt(value) || 0;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(maxRating)].map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => !preview && handleChange(index + 1)}
            className={`text-2xl transition-colors ${
              index < currentRating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-300'
            } ${preview ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={preview}
          >
            <Star className={`w-6 h-6 ${index < currentRating ? 'fill-current' : ''}`} />
          </button>
        ))}
        {currentRating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {currentRating} of {maxRating}
          </span>
        )}
      </div>
    );
  };

  const renderScale = () => {
    const min = question.minScale || 1;
    const max = question.maxScale || 10;
    const step = question.step || 1;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 min-w-0">{min}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value || min}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            disabled={preview}
          />
          <span className="text-sm text-gray-500 min-w-0">{max}</span>
        </div>
        <div className="text-center">
          <span className="text-lg font-medium text-gray-900">
            {value || min}
          </span>
        </div>
      </div>
    );
  };

  const renderEmojiScale = () => {
    // Check if this should use SVG emojis (custom emoji scales)
    const useSVGEmojis = question.settings?.useSVGEmojis || question.type === 'emoji_custom';
    
    if (useSVGEmojis) {
      // Determine which SVG emoji scale to use
      let scaleType = 'satisfaction'; // default
      
      if (question.settings?.svgEmojiType) {
        scaleType = question.settings.svgEmojiType;
      } else {
        // Auto-detect based on question type
        switch (question.type) {
          case 'emoji_satisfaction':
            scaleType = 'satisfaction';
            break;
          case 'emoji_agreement':
            scaleType = 'agreement';
            break;
          case 'emoji_quality':
            scaleType = 'quality';
            break;
          case 'emoji_mood':
            scaleType = 'mood';
            break;
          case 'emoji_likelihood':
            scaleType = 'likelihood';
            break;
          default:
            scaleType = 'satisfaction';
        }
      }
      
      return (
        <SVGEmojiScale
          question={question}
          value={value}
          onChange={handleChange}
          preview={preview}
          scaleType={scaleType}
          showLabels={question.settings?.showLabels !== false}
          size={question.settings?.emojiSize || 'md'}
        />
      );
    }

    // Fallback to regular emoji implementation
    let emojis, labels;
    
    if (question.settings?.emojis && question.settings?.labels) {
      emojis = question.settings.emojis;
      labels = question.settings.labels;
    } else {
      // Use default emojis based on question type
      switch (question.type) {
        case 'emoji_satisfaction':
          emojis = ['😞', '😐', '🙂', '😊', '😍'];
          labels = { 1: 'Very Dissatisfied', 2: 'Dissatisfied', 3: 'Neutral', 4: 'Satisfied', 5: 'Very Satisfied' };
          break;
        case 'emoji_agreement':
          emojis = ['👎', '😕', '😐', '👍', '💯'];
          labels = { 1: 'Strongly Disagree', 2: 'Disagree', 3: 'Neutral', 4: 'Agree', 5: 'Strongly Agree' };
          break;
        case 'emoji_quality':
          emojis = ['💩', '👎', '👍', '⭐'];
          labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Excellent' };
          break;
        case 'emoji_mood':
          emojis = ['😭', '😢', '😔', '😐', '🙂', '😊', '😄'];
          labels = { 1: 'Very Sad', 2: 'Sad', 3: 'Disappointed', 4: 'Neutral', 5: 'Happy', 6: 'Very Happy', 7: 'Ecstatic' };
          break;
        case 'emoji_difficulty':
          emojis = ['😴', '😌', '😰', '🤯'];
          labels = { 1: 'Very Easy', 2: 'Easy', 3: 'Hard', 4: 'Very Hard' };
          break;
        case 'emoji_likelihood':
          emojis = ['❌', '🤔', '✅', '💯'];
          labels = { 1: 'Never', 2: 'Maybe', 3: 'Likely', 4: 'Definitely' };
          break;
        default:
          emojis = ['😞', '😐', '🙂', '😊', '😍'];
          labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
      }
    }

    const currentValue = parseInt(value) || 0;
    const scale = question.settings?.scale || emojis.length;

    return (
      <div className="space-y-4">
        <div className="flex justify-center space-x-2 flex-wrap">
          {emojis.slice(0, scale).map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => !preview && handleChange(index + 1)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                currentValue === (index + 1)
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              } ${preview ? 'cursor-default' : 'cursor-pointer'}`}
              disabled={preview}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              {(question.settings?.showLabels !== false) && (
                <span className="text-xs text-gray-600 text-center">
                  {labels[index + 1] || `Option ${index + 1}`}
                </span>
              )}
            </button>
          ))}
        </div>
        {currentValue > 0 && (
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {labels[currentValue] || `Selected: ${currentValue}`}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderDate = () => (
    <div className="relative">
    <input
      type="date"
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
        min={question.settings?.minDate}
        max={question.settings?.maxDate}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      disabled={preview}
        placeholder="Select a date"
    />
    </div>
  );

  const renderTime = () => (
    <div className="relative">
    <input
      type="time"
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
        step={question.settings?.step ? question.settings.step * 60 : undefined}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      disabled={preview}
        placeholder="Select a time"
    />
    </div>
  );

  const renderNumber = () => (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={question.placeholder || 'Enter a number'}
      min={question.min}
      max={question.max}
      step={question.step || 1}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={preview}
    />
  );

  const renderEmail = () => (
    <input
      type="email"
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={question.placeholder || 'your@email.com'}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={preview}
    />
  );

  const renderPhone = () => (
    <input
      type="tel"
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={question.placeholder || '+1 (555) 123-4567'}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={preview}
    />
  );

  const renderFile = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
      <div className="text-sm text-gray-600 mb-2">
        {preview ? 'File upload area' : 'Click to upload or drag and drop'}
      </div>
      {!preview && (
        <input
          type="file"
          multiple={question.maxFiles !== 1}
          accept={question.fileTypes?.map(type => `.${type}`).join(',')}
          onChange={(e) => handleChange(e.target.files)}
          className="hidden"
        />
      )}
      {question.fileTypes && (
        <div className="text-xs text-gray-500">
          Supported: {question.fileTypes.join(', ')}
        </div>
      )}
    </div>
  );

  const renderThumbsUpDown = () => {
    const upLabel = question.labels?.up || 'Yes';
    const downLabel = question.labels?.down || 'No';

    return (
      <div className="flex justify-center space-x-6">
        <button
          type="button"
          onClick={() => !preview && handleChange('up')}
          className={`flex flex-col items-center p-4 rounded-lg transition-all ${
            value === 'up'
              ? 'bg-green-100 border-2 border-green-500 text-green-700'
              : 'bg-gray-50 border-2 border-transparent text-gray-500 hover:bg-green-50'
          } ${preview ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={preview}
        >
          <ThumbsUp className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">{upLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => !preview && handleChange('down')}
          className={`flex flex-col items-center p-4 rounded-lg transition-all ${
            value === 'down'
              ? 'bg-red-100 border-2 border-red-500 text-red-700'
              : 'bg-gray-50 border-2 border-transparent text-gray-500 hover:bg-red-50'
          } ${preview ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={preview}
        >
          <ThumbsDown className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">{downLabel}</span>
        </button>
      </div>
    );
  };

  const renderDateTime = () => (
    <div className="relative">
      <input
        type="datetime-local"
        value={value || ''}
        onChange={(e) => handleChange(e.target.value)}
        min={question.settings?.minDate}
        max={question.settings?.maxDate}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        disabled={preview}
        placeholder="Select date and time"
      />
    </div>
  );

  const renderNPS = () => {
    const currentValue = parseInt(value) || null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{question.settings?.minLabel || 'Not at all likely'}</span>
          <span>{question.settings?.maxLabel || 'Extremely likely'}</span>
        </div>
        <div className="flex justify-center space-x-1">
          {[...Array(11)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => !preview && handleChange(index)}
              className={`w-8 h-8 text-sm font-medium rounded transition-all ${
                currentValue === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
              } ${preview ? 'cursor-default' : 'cursor-pointer'}`}
              disabled={preview}
            >
              {index}
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          {question.settings?.question || 'How likely are you to recommend this to a friend?'}
        </div>
      </div>
    );
  };

  const renderSlider = () => {
    const min = question.settings?.min || 0;
    const max = question.settings?.max || 100;
    const step = question.settings?.step || 1;
    const currentValue = value || min;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{question.settings?.minLabel || 'Minimum'}</span>
          <span>{question.settings?.maxLabel || 'Maximum'}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            disabled={preview}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
        {question.settings?.showValue && (
          <div className="text-center">
            <span className="text-lg font-medium text-gray-900">
              {currentValue}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderMatrix = () => {
    const rows = question.settings?.rows || [];
    const columns = question.settings?.columns || [];
    const matrixValue = value || {};

    const handleMatrixChange = (rowIndex, columnValue) => {
      const newValue = { ...matrixValue };
      newValue[rowIndex] = columnValue;
      handleChange(newValue);
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b"></th>
              {columns.map((column, index) => (
                <th key={index} className="text-center p-2 border-b text-sm font-medium text-gray-700">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                <td className="p-2 text-sm text-gray-700 font-medium">{row}</td>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex} className="text-center p-2">
                    <input
                      type="radio"
                      name={`matrix-${rowIndex}`}
                      value={column}
                      checked={matrixValue[rowIndex] === column}
                      onChange={() => handleMatrixChange(rowIndex, column)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      disabled={preview}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRanking = () => {
    const options = question.settings?.options || [];
    const rankedItems = Array.isArray(value) ? value : [];

    const handleRankingChange = (item, newRank) => {
      const newRanking = [...rankedItems];
      const existingIndex = newRanking.findIndex(ranked => ranked.item === item);
      
      if (existingIndex >= 0) {
        newRanking[existingIndex].rank = newRank;
      } else {
        newRanking.push({ item, rank: newRank });
      }
      
      newRanking.sort((a, b) => a.rank - b.rank);
      handleChange(newRanking);
    };

    const getRankForItem = (item) => {
      const ranked = rankedItems.find(r => r.item === item);
      return ranked ? ranked.rank : '';
    };

    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-3">
          Rank these items in order of preference (1 = most preferred)
        </div>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="number"
              min="1"
              max={options.length}
              value={getRankForItem(option)}
              onChange={(e) => handleRankingChange(option, parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
              disabled={preview}
              placeholder="Rank"
            />
            <span className="flex-1 text-gray-700">{option}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderDefault = () => (
    <div className="p-4 bg-gray-100 rounded-lg text-center">
      <div className="text-sm text-gray-600">
        Question type "{question.type}" preview not available
      </div>
    </div>
  );

  // Render appropriate input based on question type
  const renderInput = () => {
    switch (question.type) {
      // Text Input Types
      case 'text': return renderTextInput();
      case 'textarea': return renderTextarea();
      case 'email': return renderEmail();
      case 'number': return renderNumber();
      case 'phone': return renderPhone();
      
      // Choice Types
      case 'radio': return renderMultipleChoice(); // Maps radio to multiple choice
      case 'multiple_choice': return renderMultipleChoice();
      case 'checkbox': return renderCheckbox();
      case 'dropdown': return renderDropdown();
      
      // Rating & Scale Types
      case 'rating': return renderRating();
      case 'scale': return renderScale();
      case 'nps': return renderNPS();
      
      // Emoji Types
      case 'emoji_scale': return renderEmojiScale();
      case 'emoji_satisfaction': return renderEmojiScale();
      case 'emoji_agreement': return renderEmojiScale();
      case 'emoji_quality': return renderEmojiScale();
      case 'emoji_mood': return renderEmojiScale();
      case 'emoji_difficulty': return renderEmojiScale();
      case 'emoji_likelihood': return renderEmojiScale();
      case 'emoji_custom': return renderEmojiScale();
      
      // SVG Emoji Types
      case 'svg_emoji_satisfaction': return renderEmojiScale();
      case 'svg_emoji_mood': return renderEmojiScale();
      
      // Date & Time Types
      case 'date': return renderDate();
      case 'time': return renderTime();
      case 'datetime': return renderDateTime();
      
      // Advanced Types
      case 'matrix': return renderMatrix();
      case 'ranking': return renderRanking();
      case 'slider': return renderSlider();
      case 'file': return renderFile();
      
      // Other Types
      case 'thumbs': return renderThumbsUpDown();
      case 'yes_no': return renderThumbsUpDown(); // Maps yes_no to thumbs
      
      default: return renderDefault();
    }
  };

  return (
    <div className="space-y-3">
      {renderInput()}
      {question.required && (
        <div className="text-xs text-red-500">
          * This field is required
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
