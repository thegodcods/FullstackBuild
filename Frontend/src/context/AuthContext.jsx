import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      setUser(JSON.parse(userJson));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (error) {
      return { success: false, error: { message: error.message } };
    }
  };

  const register = async (name, email, password, passwordConfirm) => {
    try {
      const result = await authService.register(name, email, password, passwordConfirm);
      return result;
    } catch (error) {
      return { success: false, error: { message: error.message } };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const username = user.username || user.email || 'User';
    return username.charAt(0).toUpperCase();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, getUserInitials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
