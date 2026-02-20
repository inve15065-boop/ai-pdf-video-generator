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
            
            <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
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
