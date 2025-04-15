import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicRoutes() {
  const { user, isAuthenticated } = useAuth();

  if (user || isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return <Outlet />;
}
