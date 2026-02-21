import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pdf-video-backend.onrender.com';

const processingSteps = [
  'Extracting content from PDF',
  'Analyzing content with AI',
  'Generating video script',
  'Creating visual elements',
  'Rendering final video',
];

function ProcessingStep({ onNext, sessionId, requirements }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const processVideo = async () => {
      try {
        // Simulate step progression
        const stepInterval = setInterval(() => {
          setCurrentStep((prev) => {
            if (prev < processingSteps.length - 1) {
              return prev + 1;
            }
            clearInterval(stepInterval);
            return prev;
          });
        }, 2000);

        // Update progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 2;
          });
        }, 200);

        // Call backend API
        const response = await axios.post(
          `${API_URL}/process/${sessionId}`,
          { requirements },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.status === 'completed') {
          setTimeout(() => {
            onNext();
          }, 1000);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Processing failed. Please try again.');
        setProgress(0);
      }
    };

    if (sessionId) {
      processVideo();
    }
  }, [sessionId, requirements, onNext]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Processing Your Video
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress size={80} thickness={4} />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 4,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(187, 134, 252, 0.2)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #bb86fc 30%, #03dac6 90%)',
              },
            }}
          />

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {Math.round(progress)}% Complete
          </Typography>

          <List sx={{ maxWidth: 600, mx: 'auto' }}>
            {processingSteps.map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {index < currentStep ? (
                    <CheckCircleIcon color="success" />
                  ) : index === currentStep ? (
                    <HourglassEmptyIcon color="primary" />
                  ) : (
                    <HourglassEmptyIcon color="disabled" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={step}
                  primaryTypographyProps={{
                    color: index <= currentStep ? 'text.primary' : 'text.disabled',
                    fontWeight: index === currentStep ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}

export default ProcessingStep;
