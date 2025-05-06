import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guard, setGuard] = useState(localStorage.getItem('guard') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await authService.checkAuth();
        if (res.success) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.user);
        setGuard(credentials.guard);
        localStorage.setItem('guard', credentials.guard);
        setMessage(response.message);
        return { success: true, guard: credentials.guard };
      } else {
        setMessage(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { success, message, user } = await authService.register(userData);
      if (success) {
        setUser(user);
      }
      setMessage(message);
      return { success, message, user };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error.message);
    } finally {
      setUser(null);
      setGuard(null);
      setMessage(null);
      localStorage.removeItem('guard');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guard,
        loading,
        error,
        message,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
