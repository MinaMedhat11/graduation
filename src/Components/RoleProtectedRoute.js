// src/routes/RoleProtectedRoute.js
import React from 'react'; // أضف هذا السطر في الأعلى
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ allowedGuard }) => {
  const { isAuthenticated, loading, guard } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;

  // اعتماد كامل على القيمة المخزنة محلياً
  const storedGuard = localStorage.getItem('guard');
  
  if (storedGuard !== allowedGuard) {
    const redirectPath = storedGuard === 'admin' ? '/admin/dashboard' 
      : storedGuard === 'instructor' ? '/instructor/dashboard' 
      : '/dashboard';
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
