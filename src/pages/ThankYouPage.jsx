import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Thank You!
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your questionnaire has been submitted successfully.
        </Typography>
        
        <Typography paragraph>
          Thank you for completing the longevity questionnaire. Your responses have been recorded.
        </Typography>
        
        <Typography paragraph>
          An administrator will review your answers and may provide additional feedback or analysis.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default ThankYouPage; 