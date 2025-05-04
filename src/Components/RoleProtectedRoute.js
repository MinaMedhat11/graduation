// src/routes/RoleProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ allowedGuard }) => {
  const { isAuthenticated, loading, guard } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (guard !== allowedGuard) {
    // Redirect based on user's actual role
    if (guard === 'admin') return <Navigate to="/admin/dashboard" />;
    if (guard === 'instructor') return <Navigate to="/instructor/dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
