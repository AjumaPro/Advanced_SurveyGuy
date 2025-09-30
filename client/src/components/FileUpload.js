import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { trackFeatureUsage, FeatureGate } from '../utils/planFeatures';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  FileText,
  Loader2,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

const FileUpload = ({ 
  onFileUploaded, 
  maxFiles = 5, 
  maxFileSize = 10, // MB
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  showPreview = true 
}) => {
  const { user, userProfile } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const userPlan = userProfile?.plan || 'free';

  // Check storage limits based on plan
  const getStorageLimit = () => {
    switch (userPlan) {
      case 'free': return 2048; // 2 GB in MB
      case 'pro': return 20480; // 20 GB in MB
      case 'enterprise': return null; // Unlimited
      default: return 2048;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music className="w-8 h-8 text-green-500" />;
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };


  const validateFile = React.useCallback((file) => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type || file.name.toLowerCase().endsWith(type);
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  }, [maxFileSize, acceptedTypes]);

  const uploadFile = React.useCallback(async (file) => {
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('survey-files')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('survey-files')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('file_uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: file.type,
          public_url: urlData.publicUrl
        });

      if (dbError) throw dbError;

      // Track usage
      await trackFeatureUsage(user.id, 'file_upload', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }, [user.id]);

  const handleFiles = useCallback(async (fileList) => {
    const newFiles = Array.from(fileList);
    
    // Validate total files
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }

    setUploading(true);
    const uploadedFiles = [];

    try {
      for (const file of newFiles) {
        const result = await uploadFile(file);
        uploadedFiles.push({
          id: Date.now() + Math.random(),
          ...result,
          uploadedAt: new Date().toISOString()
        });
      }

      setFiles(prev => [...prev, ...uploadedFiles]);
      
      if (onFileUploaded) {
        uploadedFiles.forEach(file => onFileUploaded(file));
      }

      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [files.length, maxFiles, onFileUploaded, validateFile, uploadFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FeatureGate
      userPlan={userPlan}
      feature="fileUploads"
      fallback={
        <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-3">File uploads not available in your plan</p>
          <button
            onClick={() => window.location.href = '/app/subscriptions'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-3">
              {uploading ? (
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400" />
              )}
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                </p>
                <p className="text-sm text-gray-600">
                  Max {maxFiles} files, {maxFileSize}MB each
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported: {acceptedTypes.join(', ')}
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                      title="View file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadFile(file)}
                      className="p-2 text-green-600 hover:text-green-700 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Usage */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
            <span className="text-sm text-gray-600">
              {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))} / {
                getStorageLimit() ? formatFileSize(getStorageLimit() * 1024 * 1024) : 'Unlimited'
              }
            </span>
          </div>
          
          {getStorageLimit() && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (files.reduce((sum, file) => sum + file.size, 0) / (getStorageLimit() * 1024 * 1024)) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </FeatureGate>
  );
};

export default FileUpload;
