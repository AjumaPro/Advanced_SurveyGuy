import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploadQuestion = ({ question, value, onChange, disabled, userId }) => {
  const acceptedTypes = question.settings?.acceptedTypes || ['image/*', '.pdf', '.doc', '.docx'];
  const maxFileSize = (question.settings?.maxFileSize || 10) * 1024 * 1024; // Convert MB to bytes
  const maxFiles = question.settings?.maxFiles || 1;
  
  const [files, setFiles] = useState(value || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    for (const file of selectedFiles) {
      // Validate file size
      if (file.size > maxFileSize) {
        toast.error(`${file.name} is too large. Max size: ${question.settings?.maxFileSize || 10}MB`);
        continue;
      }

      // Validate file type
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        toast.error(`${file.name} is not an accepted file type`);
        continue;
      }

      await uploadFile(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const fileId = `${Date.now()}-${file.name}`;
    
    try {
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Upload to Supabase Storage
      const filePath = `${userId || 'anonymous'}/${fileId}`;
      
      const { data, error } = await supabase.storage
        .from('survey-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('survey-uploads')
        .getPublicUrl(filePath);

      const newFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: filePath,
        uploadedAt: new Date().toISOString()
      };

      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      if (onChange) onChange(updatedFiles);
      
      toast.success(`${file.name} uploaded successfully`);
      setUploadProgress(prev => {
        const { [fileId]: _, ...rest } = prev;
        return rest;
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (fileToRemove) => {
    try {
      // Delete from storage if it exists
      if (fileToRemove.path) {
        await supabase.storage
          .from('survey-uploads')
          .remove([fileToRemove.path]);
      }

      const updatedFiles = files.filter(f => f.id !== fileToRemove.id);
      setFiles(updatedFiles);
      if (onChange) onChange(updatedFiles);
      
      toast.success('File removed');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {files.length < maxFiles && !disabled && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            {acceptedTypes.join(', ')} (max {question.settings?.maxFileSize || 10}MB)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {maxFiles > 1 ? `Up to ${maxFiles} files` : 'Single file upload'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple={maxFiles > 1}
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg group"
              >
                <div className="flex-shrink-0 text-green-600">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="flex-shrink-0 p-1 text-red-600 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-900">Uploading...</span>
                  <span className="text-sm text-blue-700">{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Message */}
      {files.length === 0 && (
        <div className="flex items-start space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {question.settings?.required 
              ? 'File upload is required to continue'
              : 'Optional: Upload a file if you have one to share'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadQuestion;

