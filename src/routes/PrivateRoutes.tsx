import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Load } from '../components/component/Load';

export function PrivateRoutes({ allowedRoles }: { allowedRoles: string[] }) {
  const { user, isLoadAuth, role, isAuthenticated } = useAuth();

  if (isLoadAuth) {
    return <Load />;
  }

  if (!user || !isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to='/dashboard' />;
  }

  return <Outlet />;
}
