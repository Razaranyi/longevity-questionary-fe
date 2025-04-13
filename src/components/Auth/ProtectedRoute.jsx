import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Component for protected routes - redirects to login if not authenticated
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // If still loading authentication state, show loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If this is an admin-only route and user is a client, redirect to questionnaire
  if (adminOnly && user.isClient) {
    return <Navigate to="/questionnaire" replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 