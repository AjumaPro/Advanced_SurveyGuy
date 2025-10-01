import React, { useState, useEffect } from 'react';
import { GripVertical, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const RankingQuestion = ({ question, value, onChange, disabled }) => {
  const options = question.settings?.options || [];
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setItems(value);
    } else {
      setItems(options.map((opt, i) => ({ 
        id: `item-${i}`, 
        text: opt, 
        rank: i + 1 
      })));
    }
  }, []);

  const handleReorder = (newOrder) => {
    const ranked = newOrder.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
    setItems(ranked);
    if (onChange) {
      onChange(ranked);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    handleReorder(newItems);
  };

  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    handleReorder(newItems);
  };

  const reset = () => {
    const resetItems = options.map((opt, i) => ({ 
      id: `item-${i}`, 
      text: opt, 
      rank: i + 1 
    }));
    setItems(resetItems);
    if (onChange) onChange(resetItems);
  };

  if (disabled) {
    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </span>
            <span className="flex-1 text-gray-900">{item.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Drag to reorder or use arrow buttons. Rank from most to least important.
        </p>
        <button
          type="button"
          onClick={reset}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-2">
        {items.map((item, index) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="bg-white"
          >
            <motion.div
              layout
              className="flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                {index + 1}
              </span>
              
              <span className="flex-1 text-gray-900 font-medium">{item.text}</span>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default RankingQuestion;

