import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Switch,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider
} from '@mui/material';
import { login, clientLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClientMode, setIsClientMode] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      let userData;
      
      if (isClientMode) {
        userData = await clientLogin(data.email, marketingConsent);
        setUser(userData);
        navigate('/questionnaire');
      } else {
        userData = await login(data.username, data.password);
        setUser(userData);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto',
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Typography>Admin</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isClientMode}
              onChange={(e) => setIsClientMode(e.target.checked)}
              name="loginMode"
              color="primary"
            />
          }
          label=""
        />
        <Typography>Client</Typography>
      </Stack>
      
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        {isClientMode ? 'Client Access' : 'Admin Login'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {isClientMode ? (
        // Client email-only form
        <>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                color="primary"
              />
            }
            label="I agree to receive marketing emails"
            sx={{ mt: 2, alignSelf: 'flex-start' }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue to Questionnaire'}
          </Button>
        </>
      ) : (
        // Admin login form
        <>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </>
      )}
    </Box>
  );
};

export default LoginForm; 