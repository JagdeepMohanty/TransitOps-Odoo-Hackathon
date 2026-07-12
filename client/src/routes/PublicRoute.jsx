import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

/**
 * PublicRoute — accessible only when NOT authenticated.
 * Authenticated users are redirected to /dashboard.
 */
export default function PublicRoute({ redirectTo = '/dashboard' }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
