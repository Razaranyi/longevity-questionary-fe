import { AppBar, Toolbar, Typography, Button, Box, Divider } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Determine if user is admin (not a client)
  const isAdmin = user && !user.isClient;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            color: 'inherit' 
          }}
        >
          Longevity Questionnaire
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAdmin ? (
              // Admin navigation
              <>
                <Button color="inherit" onClick={() => navigate('/admin/responses')}>
                  Responses
                </Button>
                <Button color="inherit" onClick={() => navigate('/admin/questions')}>
                  Questions
                </Button>
              </>
            ) : (
              // Client navigation
              <Button color="inherit" onClick={() => navigate('/questionnaire')}>
                Questionnaire
              </Button>
            )}
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.5)' }} />
            
            <Typography variant="body2" sx={{ ml: 1, mr: 2 }}>
              {user.isClient ? user.email : user.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 