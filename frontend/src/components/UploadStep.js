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
      });

      setSessionId(response.data.session_id);
      setPdfFile(file);
      setRequirements(response.data.requirements);
      onNext();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
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
          borderColor: isDragActive ? 'primary.main' : 'grey.500',
          borderRadius: 2,
          p: 6,
          mb: 3,
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(187, 134, 252, 0.05)',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse files
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
          px: 6,
          py: 1.5,
          fontSize: '1.1rem',
          background: 'linear-gradient(45deg, #bb86fc 30%, #03dac6 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #9965f4 30%, #02b8a3 90%)',
          },
        }}
      >
        {uploading ? 'Uploading...' : 'Upload & Continue'}
      </Button>
    </Box>
  );
}

export default UploadStep;
