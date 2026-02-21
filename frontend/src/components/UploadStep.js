import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UploadStep({ onNext, setSessionId, setPdfFile, setRequirements }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setError('File size exceeds 50MB limit. Please choose a smaller file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('requirements', 'Create an engaging video');

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      setSessionId(response.data.session_id);
      setPdfFile(file);
      setRequirements(response.data.requirements);
      onNext();
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.error 
        || err.message 
        || 'Upload failed. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '3px dashed',
          borderColor: isDragActive ? '#f093fb' : 'rgba(187, 134, 252, 0.5)',
          borderRadius: 4,
          p: 6,
          mb: 3,
          cursor: 'pointer',
          background: isDragActive 
            ? 'linear-gradient(135deg, rgba(187, 134, 252, 0.2) 0%, rgba(240, 147, 251, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(50, 50, 50, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isDragActive 
            ? '0 8px 32px rgba(240, 147, 251, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            borderColor: '#f093fb',
            background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(240, 147, 251, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon 
          sx={{ 
            fontSize: 100, 
            color: isDragActive ? '#f093fb' : '#bb86fc',
            mb: 2,
            filter: 'drop-shadow(0 4px 8px rgba(187, 134, 252, 0.4))',
            animation: isDragActive ? 'bounce 0.6s ease infinite' : 'none',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }} 
        />
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(45deg, #bb86fc, #f093fb)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {isDragActive ? '✨ Drop your PDF here' : '📄 Drag & drop your PDF here'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            mt: 1,
          }}
        >
          or click to browse files
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            mt: 2,
            display: 'block',
          }}
        >
          Supports PDF files up to 50MB
        </Typography>
      </Box>

      {file && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        size="large"
        onClick={handleUpload}
        disabled={!file || uploading}
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        sx={{
          px: 8,
          py: 2,
          fontSize: '1.2rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 3s ease infinite',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          letterSpacing: '0.5px',
          '@keyframes gradientMove': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(240, 147, 251, 0.5)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {uploading ? '⏳ Uploading...' : '🚀 Upload & Continue'}
      </Button>
    </Box>
  );
}

export default UploadStep;
