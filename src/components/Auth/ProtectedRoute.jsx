import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Component for protected routes - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If still loading authentication state, show loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 