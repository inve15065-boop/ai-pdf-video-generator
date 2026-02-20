import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function RequirementsStep({ onNext, onBack, requirements, setRequirements }) {
  const [style, setStyle] = React.useState('professional');
  const [duration, setDuration] = React.useState('medium');
  const [tone, setTone] = React.useState('informative');

  const handleContinue = () => {
    const fullRequirements = `Style: ${style}, Duration: ${duration}, Tone: ${tone}. ${requirements}`;
    setRequirements(fullRequirements);
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Customize Your Video
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Video Style</InputLabel>
            <Select
              value={style}
              label="Video Style"
              onChange={(e) => setStyle(e.target.value)}
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="creative">Creative</MenuItem>
              <MenuItem value="minimal">Minimal</MenuItem>
              <MenuItem value="dynamic">Dynamic</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Duration</InputLabel>
            <Select
              value={duration}
              label="Duration"
              onChange={(e) => setDuration(e.target.value)}
            >
              <MenuItem value="short">Short (1-2 min)</MenuItem>
              <MenuItem value="medium">Medium (3-5 min)</MenuItem>
              <MenuItem value="long">Long (5+ min)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tone</InputLabel>
            <Select
              value={tone}
              label="Tone"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="informative">Informative</MenuItem>
              <MenuItem value="engaging">Engaging</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Requirements"
            placeholder="Describe any specific requirements for your video..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ px: 4 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 4,
            background: 'linear-gradient(45deg, #bb86fc 30%, #03dac6 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #9965f4 30%, #02b8a3 90%)',
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}

export default RequirementsStep;
