import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guard, setGuard] = useState(localStorage.getItem('guard') || null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await authService.checkAuth();
        if (res.success) {
          setUser(res.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        setGuard(credentials.guard);
        localStorage.setItem('guard', credentials.guard); // نحفظه في localStorage

        return { success: true, guard: credentials.guard };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setGuard(null);
      localStorage.removeItem('guard');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, guard, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
