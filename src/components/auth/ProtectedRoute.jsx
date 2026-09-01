import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api.js';

/**
 * Enterprise Protected Route Guard
 * Redirects unauthenticated users to /login preserving target path
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
