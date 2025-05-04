import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, guard } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Choose the appropriate dashboard based on user role/guard
  if (guard === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  } else if (guard === 'instructor') {
    return <Navigate to="/instructor/dashboard" />;
  } else {
    // For students (web guard)
    return <Navigate to="/dashboard" />;
  }
};

// Additional component for route guarding based on specific roles
export const RoleBasedRoute = ({ requiredGuard, children }) => {
  const { isAuthenticated, loading, guard } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (guard !== requiredGuard) {
    // Redirect to appropriate dashboard based on actual role
    if (guard === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (guard === 'instructor') {
      return <Navigate to="/instructor/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children || <Outlet />;
};