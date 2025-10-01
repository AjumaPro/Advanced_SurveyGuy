import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MatrixQuestion = ({ question, value, onChange, disabled }) => {
  const rows = question.settings?.rows || [];
  const columns = question.settings?.columns || [];
  const matrixType = question.settings?.type || 'radio';
  const allowNA = question.settings?.allowNA || false;

  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (value) {
      setSelections(value);
    }
  }, [value]);

  const handleRadioChange = (rowIndex, columnIndex) => {
    if (disabled) return;
    
    const newSelections = {
      ...selections,
      [rowIndex]: columnIndex
    };
    setSelections(newSelections);
    if (onChange) onChange(newSelections);
  };

  const handleCheckboxChange = (rowIndex, columnIndex) => {
    if (disabled) return;
    
    const currentRow = selections[rowIndex] || [];
    const newRow = currentRow.includes(columnIndex)
      ? currentRow.filter(c => c !== columnIndex)
      : [...currentRow, columnIndex];
    
    const newSelections = {
      ...selections,
      [rowIndex]: newRow
    };
    setSelections(newSelections);
    if (onChange) onChange(newSelections);
  };

  const handleNAChange = (rowIndex) => {
    if (disabled) return;
    
    const newSelections = {
      ...selections,
      [rowIndex]: 'NA'
    };
    setSelections(newSelections);
    if (onChange) onChange(newSelections);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-50 p-3 text-left font-semibold text-gray-700 min-w-[200px]">
              {/* Empty corner cell */}
            </th>
            {columns.map((column, colIndex) => (
              <th
                key={colIndex}
                className="border border-gray-300 bg-gray-50 p-3 text-center font-semibold text-gray-700 min-w-[100px]"
              >
                {column}
              </th>
            ))}
            {allowNA && (
              <th className="border border-gray-300 bg-gray-50 p-3 text-center font-semibold text-gray-700 min-w-[80px]">
                N/A
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="border border-gray-300 p-3 font-medium text-gray-900 bg-white">
                {row}
              </td>
              {columns.map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-300 p-3 text-center bg-white"
                >
                  {matrixType === 'radio' ? (
                    <input
                      type="radio"
                      name={`row-${rowIndex}`}
                      checked={selections[rowIndex] === colIndex}
                      onChange={() => handleRadioChange(rowIndex, colIndex)}
                      disabled={disabled || selections[rowIndex] === 'NA'}
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={Array.isArray(selections[rowIndex]) && selections[rowIndex].includes(colIndex)}
                      onChange={() => handleCheckboxChange(rowIndex, colIndex)}
                      disabled={disabled || selections[rowIndex] === 'NA'}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  )}
                </td>
              ))}
              {allowNA && (
                <td className="border border-gray-300 p-3 text-center bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selections[rowIndex] === 'NA'}
                    onChange={() => handleNAChange(rowIndex)}
                    disabled={disabled}
                    className="w-5 h-5 text-gray-600 rounded focus:ring-2 focus:ring-gray-500 cursor-pointer"
                  />
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
            {matrixType === 'radio' ? '○' : '☐'}
          </div>
          <span>{matrixType === 'radio' ? 'Select one per row' : 'Select multiple per row'}</span>
        </div>
        {allowNA && (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center bg-gray-50">
              ☐
            </div>
            <span>Mark as Not Applicable</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixQuestion;

