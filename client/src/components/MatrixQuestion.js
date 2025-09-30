import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Plus,
  Minus,
  Move,
  Edit3,
  Trash2,
  Settings
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MatrixQuestion = ({ 
  question, 
  value = {}, 
  onChange, 
  disabled = false,
  isEditing = false,
  onUpdateQuestion
}) => {
  const [responses, setResponses] = useState(value);
  const [editingRows, setEditingRows] = useState(false);
  const [editingColumns, setEditingColumns] = useState(false);

  const settings = question.settings || {};
  const rows = settings.rows || ['Row 1', 'Row 2'];
  const columns = settings.columns || ['Column 1', 'Column 2'];
  const scaleType = settings.scaleType || 'radio'; // radio, checkbox, rating, thumbs, text
  const isRequired = question.required || false;
  const allowNA = settings.allowNA || false;
  const randomizeRows = settings.randomizeRows || false;
  const randomizeColumns = settings.randomizeColumns || false;

  useEffect(() => {
    setResponses(value);
  }, [value]);

  const handleResponseChange = (rowIndex, columnIndex, responseValue) => {
    if (disabled) return;

    const newResponses = { ...responses };
    
    if (scaleType === 'checkbox') {
      // Handle multiple selections for checkbox type
      if (!newResponses[rowIndex]) {
        newResponses[rowIndex] = [];
      }
      const currentSelections = [...(newResponses[rowIndex] || [])];
      const selectionIndex = currentSelections.indexOf(columnIndex);
      
      if (selectionIndex > -1) {
        currentSelections.splice(selectionIndex, 1);
      } else {
        currentSelections.push(columnIndex);
      }
      
      newResponses[rowIndex] = currentSelections;
    } else {
      // Handle single selection for radio, rating, etc.
      newResponses[rowIndex] = responseValue;
    }

    setResponses(newResponses);
    onChange(newResponses);
  };

  const addRow = () => {
    const newRows = [...rows, `Row ${rows.length + 1}`];
    updateSettings({ rows: newRows });
  };

  const addColumn = () => {
    const newColumns = [...columns, `Column ${columns.length + 1}`];
    updateSettings({ columns: newColumns });
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== index);
    updateSettings({ rows: newRows });
    
    // Clean up responses
    const newResponses = { ...responses };
    delete newResponses[index];
    setResponses(newResponses);
    onChange(newResponses);
  };

  const removeColumn = (index) => {
    if (columns.length <= 1) return;
    const newColumns = columns.filter((_, i) => i !== index);
    updateSettings({ columns: newColumns });
  };

  const updateRowText = (index, text) => {
    const newRows = [...rows];
    newRows[index] = text;
    updateSettings({ rows: newRows });
  };

  const updateColumnText = (index, text) => {
    const newColumns = [...columns];
    newColumns[index] = text;
    updateSettings({ columns: newColumns });
  };

  const updateSettings = (newSettings) => {
    if (onUpdateQuestion) {
      onUpdateQuestion({
        ...question,
        settings: { ...settings, ...newSettings }
      });
    }
  };

  const reorderRows = (result) => {
    if (!result.destination) return;
    const newRows = Array.from(rows);
    const [reorderedRow] = newRows.splice(result.source.index, 1);
    newRows.splice(result.destination.index, 0, reorderedRow);
    updateSettings({ rows: newRows });
  };

  const reorderColumns = (result) => {
    if (!result.destination) return;
    const newColumns = Array.from(columns);
    const [reorderedColumn] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, reorderedColumn);
    updateSettings({ columns: newColumns });
  };

  const renderCell = (rowIndex, columnIndex, row, column) => {
    const cellValue = responses[rowIndex];
    const isSelected = scaleType === 'checkbox' 
      ? Array.isArray(cellValue) && cellValue.includes(columnIndex)
      : cellValue === columnIndex;

    switch (scaleType) {
      case 'radio':
        return (
          <td key={columnIndex} className="p-3 border-b border-gray-200 text-center">
            <input
              type="radio"
              name={`matrix_${rowIndex}`}
              checked={isSelected}
              onChange={() => handleResponseChange(rowIndex, columnIndex, columnIndex)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
          </td>
        );

      case 'checkbox':
        return (
          <td key={columnIndex} className="p-3 border-b border-gray-200 text-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleResponseChange(rowIndex, columnIndex, columnIndex)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
          </td>
        );

      case 'rating':
        const maxRating = settings.maxRating || 5;
        return (
          <td key={columnIndex} className="p-3 border-b border-gray-200 text-center">
            <div className="flex justify-center gap-1">
              {Array.from({ length: maxRating }).map((_, starIndex) => (
                <button
                  key={starIndex}
                  onClick={() => handleResponseChange(rowIndex, columnIndex, starIndex + 1)}
                  disabled={disabled}
                  className={`w-5 h-5 ${
                    (cellValue?.[columnIndex] || 0) > starIndex
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>
          </td>
        );

      case 'thumbs':
        return (
          <td key={columnIndex} className="p-3 border-b border-gray-200 text-center">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleResponseChange(rowIndex, columnIndex, 'up')}
                disabled={disabled}
                className={`p-1 rounded ${
                  cellValue?.[columnIndex] === 'up'
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-400 hover:text-green-600'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleResponseChange(rowIndex, columnIndex, 'down')}
                disabled={disabled}
                className={`p-1 rounded ${
                  cellValue?.[columnIndex] === 'down'
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </td>
        );

      case 'text':
        return (
          <td key={columnIndex} className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={cellValue?.[columnIndex] || ''}
              onChange={(e) => {
                const newCellValue = { ...(cellValue || {}), [columnIndex]: e.target.value };
                handleResponseChange(rowIndex, columnIndex, newCellValue);
              }}
              disabled={disabled}
              className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter text..."
            />
          </td>
        );

      default:
        return (
          <td key={columnIndex} className="p-3 border-b border-gray-200 text-center">
            <input
              type="radio"
              name={`matrix_${rowIndex}`}
              checked={isSelected}
              onChange={() => handleResponseChange(rowIndex, columnIndex, columnIndex)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
          </td>
        );
    }
  };

  const renderEditableRow = (row, index) => (
    <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
      <Move className="w-4 h-4 text-gray-400 cursor-move" />
      <input
        type="text"
        value={row}
        onChange={(e) => updateRowText(index, e.target.value)}
        className="flex-1 p-1 border-0 focus:ring-0 focus:outline-none"
        placeholder={`Row ${index + 1}`}
      />
      <button
        onClick={() => removeRow(index)}
        disabled={rows.length <= 1}
        className="text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const renderEditableColumn = (column, index) => (
    <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
      <Move className="w-4 h-4 text-gray-400 cursor-move" />
      <input
        type="text"
        value={column}
        onChange={(e) => updateColumnText(index, e.target.value)}
        className="flex-1 p-1 border-0 focus:ring-0 focus:outline-none"
        placeholder={`Column ${index + 1}`}
      />
      <button
        onClick={() => removeColumn(index)}
        disabled={columns.length <= 1}
        className="text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  if (isEditing) {
    return (
      <div className="space-y-6">
        {/* Scale Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Response Type</label>
          <select
            value={scaleType}
            onChange={(e) => updateSettings({ scaleType: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="radio">Single Choice (Radio)</option>
            <option value="checkbox">Multiple Choice (Checkbox)</option>
            <option value="rating">Star Rating</option>
            <option value="thumbs">Thumbs Up/Down</option>
            <option value="text">Text Input</option>
          </select>
        </div>

        {/* Row Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Rows (Questions)</label>
            <button
              onClick={addRow}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
            >
              <Plus className="w-3 h-3" />
              Add Row
            </button>
          </div>
          
          <DragDropContext onDragEnd={reorderRows}>
            <Droppable droppableId="rows">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {rows.map((row, index) => (
                    <Draggable key={index} draggableId={`row-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderEditableRow(row, index)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Column Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Columns (Options)</label>
            <button
              onClick={addColumn}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
            >
              <Plus className="w-3 h-3" />
              Add Column
            </button>
          </div>
          
          <DragDropContext onDragEnd={reorderColumns}>
            <Droppable droppableId="columns">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {columns.map((column, index) => (
                    <Draggable key={index} draggableId={`column-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderEditableColumn(column, index)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Additional Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Additional Settings</h4>
          
          {scaleType === 'rating' && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maximum Rating</label>
              <select
                value={settings.maxRating || 5}
                onChange={(e) => updateSettings({ maxRating: parseInt(e.target.value) })}
                className="w-32 p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
              >
                {[3, 4, 5, 7, 10].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowNA}
              onChange={(e) => updateSettings({ allowNA: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">Allow "N/A" option</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={randomizeRows}
              onChange={(e) => updateSettings({ randomizeRows: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">Randomize row order</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={randomizeColumns}
              onChange={(e) => updateSettings({ randomizeColumns: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">Randomize column order</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left font-medium text-gray-900 border-b border-gray-200 min-w-48">
                {/* Empty header cell for row labels */}
              </th>
              {columns.map((column, index) => (
                <th key={index} className="p-4 text-center font-medium text-gray-900 border-b border-gray-200 min-w-32">
                  {column}
                </th>
              ))}
              {allowNA && (
                <th className="p-4 text-center font-medium text-gray-900 border-b border-gray-200 min-w-20">
                  N/A
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                  {row}
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </td>
                {columns.map((column, columnIndex) => 
                  renderCell(rowIndex, columnIndex, row, column)
                )}
                {allowNA && (
                  <td className="p-3 border-b border-gray-200 text-center">
                    <input
                      type="radio"
                      name={`matrix_${rowIndex}`}
                      checked={responses[rowIndex] === 'na'}
                      onChange={() => handleResponseChange(rowIndex, 'na', 'na')}
                      disabled={disabled}
                      className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                    />
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Summary (for development/testing) */}
      {process.env.NODE_ENV === 'development' && Object.keys(responses).length > 0 && (
        <div className="p-3 bg-gray-100 rounded-lg text-xs">
          <strong>Responses:</strong> {JSON.stringify(responses)}
        </div>
      )}
    </div>
  );
};

export default MatrixQuestion;