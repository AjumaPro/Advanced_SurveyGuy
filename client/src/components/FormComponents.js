import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Globe, Hash, Star, CheckSquare, Square, Minus, Plus } from 'lucide-react';

// Short Answer Component
export const ShortAnswer = ({ value, onChange, placeholder, required, disabled }) => {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Your answer"}
      required={required}
      disabled={disabled}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
    />
  );
};

// Paragraph Component
export const Paragraph = ({ value, onChange, placeholder, required, disabled }) => {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Your answer"}
      required={required}
      disabled={disabled}
      rows={4}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 resize-none"
    />
  );
};

// Multiple Choice Component
export const MultipleChoice = ({ options, value, onChange, required, disabled, allowMultiple = false }) => {
  const handleOptionChange = (optionValue) => {
    if (allowMultiple) {
      const currentValues = value || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (allowMultiple) {
      return (value || []).includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const optionValue = typeof option === 'object' ? option.value || option.label : option;
        const optionLabel = typeof option === 'object' ? option.label || option.value : option;
        
        return (
          <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
            {allowMultiple ? (
              <CheckSquare className={`h-5 w-5 ${isSelected(optionValue) ? 'text-blue-600' : 'text-gray-400'}`} />
            ) : (
              <Square className={`h-5 w-5 ${isSelected(optionValue) ? 'text-blue-600 fill-current' : 'text-gray-400'}`} />
            )}
            <span className="flex-1 text-gray-700">{optionLabel}</span>
            <input
              type={allowMultiple ? "checkbox" : "radio"}
              checked={isSelected(optionValue)}
              onChange={() => handleOptionChange(optionValue)}
              disabled={disabled}
              className="sr-only"
            />
          </label>
        );
      })}
    </div>
  );
};

// Dropdown Component
export const Dropdown = ({ options, value, onChange, placeholder, required, disabled }) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
    >
      <option value="">{placeholder || "Select an option"}</option>
      {options.map((option, index) => {
        const optionValue = typeof option === 'object' ? option.value || option.label : option;
        const optionLabel = typeof option === 'object' ? option.label || option.value : option;
        
        return (
          <option key={index} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
};

// Linear Scale Component
export const LinearScale = ({ min, max, value, onChange, labels, required, disabled }) => {
  const range = max - min + 1;
  const options = Array.from({ length: range }, (_, i) => min + i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{labels?.min || min}</span>
        <span className="text-sm text-gray-600">{labels?.max || max}</span>
      </div>
      <div className="flex items-center justify-between">
        {options.map((option) => (
          <label key={option} className="flex flex-col items-center space-y-2 cursor-pointer">
            <input
              type="radio"
              name="linear-scale"
              value={option}
              checked={value === option}
              onChange={(e) => onChange(parseInt(e.target.value))}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              value === option 
                ? 'border-blue-600 bg-blue-600 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              {value === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="text-xs text-gray-600">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Date Component
export const DateInput = ({ value, onChange, required, disabled }) => {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
      />
    </div>
  );
};

// Time Component
export const TimeInput = ({ value, onChange, required, disabled }) => {
  return (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
      />
    </div>
  );
};

// Phone Component
export const PhoneInput = ({ value, onChange, required, disabled }) => {
  const [countryCode, setCountryCode] = useState('+1');
  
  return (
    <div className="flex items-center space-x-2">
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        disabled={disabled}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
      >
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+91">🇮🇳 +91</option>
        <option value="+86">🇨🇳 +86</option>
        <option value="+81">🇯🇵 +81</option>
        <option value="+49">🇩🇪 +49</option>
        <option value="+33">🇫🇷 +33</option>
        <option value="+61">🇦🇺 +61</option>
        <option value="+233">🇬🇭 +233</option>
      </select>
      <div className="relative flex-1">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="tel"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter phone number"
          required={required}
          disabled={disabled}
          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
        />
      </div>
    </div>
  );
};

// Email Component
export const EmailInput = ({ value, onChange, required, disabled }) => {
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="email"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter email address"
        required={required}
        disabled={disabled}
        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
      />
    </div>
  );
};

// URL Component
export const URLInput = ({ value, onChange, required, disabled }) => {
  return (
    <div className="relative">
      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter website URL"
        required={required}
        disabled={disabled}
        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
      />
    </div>
  );
};

// Number Component
export const NumberInput = ({ value, onChange, min, max, step, required, disabled }) => {
  return (
    <div className="relative">
      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step || 1}
        required={required}
        disabled={disabled}
        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
      />
    </div>
  );
};

// Rating Component
export const Rating = ({ value, onChange, max = 5, required, disabled }) => {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          disabled={disabled}
          className={`p-1 rounded ${
            value >= star 
              ? 'text-yellow-500' 
              : 'text-gray-300 hover:text-yellow-400'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Star className={`h-8 w-8 ${value >= star ? 'fill-current' : ''}`} />
        </button>
      ))}
      {value && (
        <span className="ml-2 text-sm text-gray-600">
          {value} out of {max}
        </span>
      )}
    </div>
  );
};

// Checkbox Grid Component
export const CheckboxGrid = ({ rows, columns, value, onChange, required, disabled }) => {
  const handleChange = (rowIndex, colIndex) => {
    const newValue = value || Array(rows.length).fill().map(() => []);
    const rowSelections = newValue[rowIndex] || [];
    
    const newRowSelections = rowSelections.includes(colIndex)
      ? rowSelections.filter(i => i !== colIndex)
      : [...rowSelections, colIndex];
    
    newValue[rowIndex] = newRowSelections;
    onChange(newValue);
  };

  const isSelected = (rowIndex, colIndex) => {
    const rowSelections = (value || [])[rowIndex] || [];
    return rowSelections.includes(colIndex);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-50"></th>
            {columns.map((col, colIndex) => (
              <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 p-2 bg-gray-50 text-sm font-medium">
                {row}
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="border border-gray-300 p-2 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected(rowIndex, colIndex)}
                    onChange={() => handleChange(rowIndex, colIndex)}
                    disabled={disabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

// Multiple Choice Grid Component
export const MultipleChoiceGrid = ({ rows, columns, value, onChange, required, disabled }) => {
  const handleChange = (rowIndex, colIndex) => {
    const newValue = value || Array(rows.length).fill(null);
    newValue[rowIndex] = colIndex;
    onChange(newValue);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-50"></th>
            {columns.map((col, colIndex) => (
              <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 p-2 bg-gray-50 text-sm font-medium">
                {row}
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="border border-gray-300 p-2 text-center">
                  <input
                    type="radio"
                    name={`row-${rowIndex}`}
                    checked={(value || [])[rowIndex] === colIndex}
                    onChange={() => handleChange(rowIndex, colIndex)}
                    disabled={disabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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

// File Upload Component
export const FileUpload = ({ value, onChange, accept, multiple, required, disabled }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      onChange(files);
    } else {
      onChange(files[0]);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        required={required}
        disabled={disabled}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div className="space-y-2">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {accept ? `Accepted formats: ${accept}` : 'All file types accepted'}
            {multiple && ' (Multiple files allowed)'}
          </p>
        </div>
      </label>
      {value && (
        <div className="mt-4 text-sm text-gray-600">
          {multiple ? `${value.length} file(s) selected` : 'File selected'}
        </div>
      )}
    </div>
  );
};

// Signature Component
export const Signature = ({ value, onChange, required, disabled }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef(null);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    onChange(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-300 rounded-lg cursor-crosshair disabled:opacity-50"
        style={{ touchAction: 'none' }}
      />
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled}
          className="btn-secondary text-sm"
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
};

export default {
  ShortAnswer,
  Paragraph,
  MultipleChoice,
  Dropdown,
  LinearScale,
  DateInput,
  TimeInput,
  PhoneInput,
  EmailInput,
  URLInput,
  NumberInput,
  Rating,
  CheckboxGrid,
  MultipleChoiceGrid,
  FileUpload,
  Signature
}; 