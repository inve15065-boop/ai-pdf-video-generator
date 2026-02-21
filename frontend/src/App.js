import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Stepper, Step, StepLabel, Paper } from '@mui/material';
import UploadStep from './components/UploadStep';
import RequirementsStep from './components/RequirementsStep';
import ProcessingStep from './components/ProcessingStep';
import DownloadStep from './components/DownloadStep';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const steps = ['Upload PDF', 'Requirements', 'Processing', 'Download'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [requirements, setRequirements] = useState('');

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSessionId(null);
    setPdfFile(null);
    setRequirements('');
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <UploadStep
            onNext={handleNext}
            setSessionId={setSessionId}
            setPdfFile={setPdfFile}
            setRequirements={setRequirements}
          />
        );
      case 1:
        return (
          <RequirementsStep
            onNext={handleNext}
            onBack={handleBack}
            requirements={requirements}
            setRequirements={setRequirements}
          />
        );
      case 2:
        return (
          <ProcessingStep
            onNext={handleNext}
            sessionId={sessionId}
            requirements={requirements}
          />
        );
      case 3:
        return (
          <DownloadStep
            sessionId={sessionId}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="app-container">
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <h1 className="app-title">AI PDF to Video Generator</h1>
            <p className="app-subtitle">Transform your PDFs into engaging videos with AI</p>
            
            <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: 'rgba(30, 30, 30, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 4, border: '1px solid rgba(187, 134, 252, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel 
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: index <= activeStep ? '#f093fb' : 'rgba(255, 255, 255, 0.5)',
                          fontWeight: index === activeStep ? 600 : 400,
                        },
                        '& .MuiStepIcon-root': {
                          color: index < activeStep ? '#03dac6' : index === activeStep ? '#bb86fc' : 'rgba(255, 255, 255, 0.3)',
                          fontSize: '2rem',
                        },
                        '& .MuiStepIcon-root.Mui-active': {
                          color: '#f093fb',
                          filter: 'drop-shadow(0 0 8px rgba(240, 147, 251, 0.6))',
                        },
                        '& .MuiStepIcon-root.Mui-completed': {
                          color: '#03dac6',
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {renderStep()}
            </Paper>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
