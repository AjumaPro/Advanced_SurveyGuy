import React, { useEffect } from 'react';
import { 
  Keyboard, 
  Plus, 
  Save, 
  Eye, 
  Copy, 
  Trash2,
  Search
} from 'lucide-react';

const KeyboardShortcuts = ({ 
  onSave, 
  onPreview, 
  onQuickPreview, 
  onAddQuestion, 
  onDeleteQuestion, 
  onDuplicateQuestion,
  activeQuestionId 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Save: Cmd/Ctrl + S
      if (cmdKey && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      // Preview: Cmd/Ctrl + P
      if (cmdKey && e.key === 'p') {
        e.preventDefault();
        onPreview();
        return;
      }

      // Quick Preview: Cmd/Ctrl + Shift + P
      if (cmdKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        onQuickPreview();
        return;
      }

      // Add Question: Cmd/Ctrl + N
      if (cmdKey && e.key === 'n') {
        e.preventDefault();
        onAddQuestion('text'); // Default to text question
        return;
      }

      // Delete Question: Delete key (when question is selected)
      if (e.key === 'Delete' && activeQuestionId) {
        e.preventDefault();
        if (window.confirm('Delete this question?')) {
          onDeleteQuestion(activeQuestionId);
        }
        return;
      }

      // Duplicate Question: Cmd/Ctrl + D
      if (cmdKey && e.key === 'd' && activeQuestionId) {
        e.preventDefault();
        onDuplicateQuestion(activeQuestionId);
        return;
      }

      // Focus Search: Cmd/Ctrl + F
      if (cmdKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onPreview, onQuickPreview, onAddQuestion, onDeleteQuestion, onDuplicateQuestion, activeQuestionId]);

  return null; // This component only handles keyboard events
};

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp = ({ onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdSymbol = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: `${cmdSymbol} + S`, action: 'Save survey', icon: <Save className="w-4 h-4" /> },
    { keys: `${cmdSymbol} + P`, action: 'Full preview', icon: <Eye className="w-4 h-4" /> },
    { keys: `${cmdSymbol} + Shift + P`, action: 'Quick preview', icon: <Eye className="w-4 h-4" /> },
    { keys: `${cmdSymbol} + N`, action: 'Add text question', icon: <Plus className="w-4 h-4" /> },
    { keys: `${cmdSymbol} + D`, action: 'Duplicate question', icon: <Copy className="w-4 h-4" /> },
    { keys: 'Delete', action: 'Delete selected question', icon: <Trash2 className="w-4 h-4" /> },
    { keys: `${cmdSymbol} + F`, action: 'Search questions', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Keyboard className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400">
                    {shortcut.icon}
                  </div>
                  <span className="text-sm text-gray-700">{shortcut.action}</span>
                </div>
                <kbd className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded border">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Press <kbd className="bg-blue-200 px-1 rounded">?</kbd> to toggle this help panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
