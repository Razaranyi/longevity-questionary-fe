import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage from './pages/ResultsPage';
import ThankYouPage from './pages/ThankYouPage';
import AdminResponsesPage from './pages/AdminResponsesPage';
import AdminResponseDetailPage from './pages/AdminResponseDetailPage';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

// Component to handle routing to home page or questionnaire based on user type
const HomeRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  // Client users go to questionnaire, admin users go to dashboard
  return user.isClient ? 
    <Navigate to="/questionnaire" /> : 
    <Navigate to="/admin/responses" />;
};

// Routes component wrapped in AuthProvider
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      
      {/* Client routes */}
      <Route path="/questionnaire" element={<QuestionnairePage />} />
      
      {/* Home redirects based on user type */}
      <Route path="/" element={<HomeRedirect />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="results" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        <Route path="results/:responseId" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="admin/responses" element={
          <ProtectedRoute adminOnly={true}>
            <AdminResponsesPage />
          </ProtectedRoute>
        } />
        <Route path="admin/responses/:responseId" element={
          <ProtectedRoute adminOnly={true}>
            <AdminResponseDetailPage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 