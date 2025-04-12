import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.fullName || user?.username}
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Longevity Questionnaire helps assess factors that may affect your longevity and overall health.
        Complete the questionnaire to receive a personalized analysis of potential health indicators and longevity factors.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Take Questionnaire
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Answer a series of questions about your health, lifestyle, and habits to receive a personalized assessment.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/questionnaire')}
                sx={{ mt: 1 }}
              >
                Start Questionnaire
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                View Results
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Review your previous questionnaire results and longevity analyses.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/results')}
                sx={{ mt: 1 }}
              >
                See Results
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          About Longevity Analysis
        </Typography>
        <Typography variant="body2" paragraph>
          Our questionnaire uses advanced analysis to provide insights into factors that may influence your longevity.
          The assessment is based on current research and statistical models related to lifestyle, health indicators,
          and demographic factors.
        </Typography>
        <Typography variant="body2">
          Note: This tool provides general information and is not a substitute for professional medical advice.
          Always consult healthcare professionals for personalized health guidance.
        </Typography>
      </Paper>
    </Box>
  );
};

export default HomePage; 