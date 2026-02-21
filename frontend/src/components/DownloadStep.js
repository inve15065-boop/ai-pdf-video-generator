import React from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_URL = process.env.REACT_APP_API_URL || 'https://pdf-video-backend.onrender.com';

function DownloadStep({ sessionId, onReset }) {
  const handleDownload = () => {
    window.open(`${API_URL}/download/${sessionId}`, '_blank');
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <CheckCircleIcon
        sx={{
          fontSize: 100,
          color: 'success.main',
          mb: 2,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      />

      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Video Ready!
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your video has been generated successfully. Click below to download.
      </Typography>

      <Alert severity="success" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        Session ID: {sessionId}
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
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
          Download Video
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onReset}
          startIcon={<RestartAltIcon />}
          sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
        >
          Create Another
        </Button>
      </Box>
    </Box>
  );
}

export default DownloadStep;
