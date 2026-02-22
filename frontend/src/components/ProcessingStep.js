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
  Button,
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
        console.log('Starting video processing for session:', sessionId);
        
        // Simulate step progression
        const stepInterval = setInterval(() => {
          setCurrentStep((prev) => {
            if (prev < processingSteps.length - 1) {
              return prev + 1;
            }
            return prev;
          });
        }, 3000); // Slower progression

        // Update progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) { // Stop at 95% until API responds
              return 95;
            }
            return prev + 1;
          });
        }, 300);

        // Call backend API with longer timeout
        const response = await axios.post(
          `${API_URL}/process/${sessionId}`,
          { requirements },
          { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 180000, // 3 minute timeout for processing
          }
        );

        console.log('Processing response:', response.data);

        // Clear intervals
        clearInterval(stepInterval);
        clearInterval(progressInterval);

        // Complete progress
        setProgress(100);
        setCurrentStep(processingSteps.length - 1);

        if (response.data.status === 'completed') {
          setTimeout(() => {
            onNext();
          }, 1000);
        } else {
          setError('Processing completed but status is unclear. Please check the download page.');
          setTimeout(() => {
            onNext();
          }, 2000);
        }
      } catch (err) {
        console.error('Processing error:', err);
        
        let errorMessage = 'Processing failed. ';
        
        if (err.code === 'ECONNABORTED') {
          errorMessage += 'Request timeout. The video processing is taking longer than expected. This might be due to a large PDF or complex content.';
        } else if (err.response) {
          errorMessage += err.response.data?.error || `Server error: ${err.response.status}`;
        } else if (err.request) {
          errorMessage += 'No response from server. The backend may be processing your request.';
        } else {
          errorMessage += err.message;
        }
        
        setError(errorMessage);
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
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Common issues:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
            • Backend may be processing (free tier can be slow)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
            • Large PDFs take longer to process
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
            • OpenAI API may be rate limited
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              background: 'linear-gradient(45deg, #bb86fc 30%, #03dac6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #9965f4 30%, #02b8a3 90%)',
              },
            }}
          >
            Retry
          </Button>
        </Box>
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
