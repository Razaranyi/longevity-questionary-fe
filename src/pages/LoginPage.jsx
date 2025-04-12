import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Box, Typography } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Longevity Questionnaire
          </Typography>
          
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 