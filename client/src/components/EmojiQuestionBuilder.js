import React, { useState } from 'react';
import { emojiScales } from '../utils/questionTypes';
import { Smile, Eye, Settings, Palette } from 'lucide-react';

const EmojiQuestionBuilder = ({ question, onUpdate }) => {
  const [previewScale, setPreviewScale] = useState(question.scaleType || 'satisfaction');

  const scaleTypes = Object.keys(emojiScales);
  const currentScale = emojiScales[previewScale] || emojiScales.satisfaction;

  const handleScaleTypeChange = (scaleType) => {
    setPreviewScale(scaleType);
    onUpdate({ 
      ...question, 
      scaleType,
      scaleData: emojiScales[scaleType]
    });
  };

  return (
    <div className="space-y-6">
      {/* Scale Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Palette className="w-4 h-4 inline mr-1" />
          Choose Emoji Scale Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scaleTypes.map((scaleType) => {
            const scale = emojiScales[scaleType];
            return (
              <button
                key={scaleType}
                onClick={() => handleScaleTypeChange(scaleType)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  previewScale === scaleType
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900 mb-2 capitalize">
                  {scaleType}
                </div>
                <div className="flex space-x-1 mb-2">
                  {scale.map((emoji, index) => (
                    <img
                      key={index}
                      src={emoji.emoji}
                      alt={emoji.label}
                      className="w-6 h-6"
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {scale[0].label} → {scale[scale.length - 1].label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Eye className="w-4 h-4 inline mr-1" />
          Live Preview
        </label>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.title || 'How would you rate your experience?'}
          </h3>
          {question.description && (
            <p className="text-gray-600 mb-4">{question.description}</p>
          )}
          
          <div className="flex justify-center space-x-3">
            {currentScale.map((emoji, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <img
                  src={emoji.emoji}
                  alt={emoji.label}
                  className="w-10 h-10 mb-2"
                />
                {question.showLabels !== false && (
                  <span className="text-xs text-gray-600 text-center">
                    {emoji.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Settings className="w-4 h-4 inline mr-1" />
          Display Settings
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={question.showLabels !== false}
              onChange={(e) => onUpdate({ ...question, showLabels: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Show emoji labels</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={question.required || false}
              onChange={(e) => onUpdate({ ...question, required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Required question</span>
          </label>
        </div>
      </div>

      {/* Emoji Scale Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Emoji Scale Details</h4>
        <div className="space-y-2">
          {currentScale.map((emoji, index) => (
            <div key={index} className="flex items-center space-x-3">
              <img src={emoji.emoji} alt={emoji.label} className="w-5 h-5" />
              <span className="text-sm text-gray-700">
                Value {emoji.value}: {emoji.label}
              </span>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: emoji.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiQuestionBuilder;
