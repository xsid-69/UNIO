import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`);
        setIsLoggedIn(true);
        setIsAuthenticated(true);
      } catch (error) {
        setIsLoggedIn(false);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };
    verifyAuth();
  }, []);

  // Listen to Redux auth state changes and sync with context state
  useEffect(() => {
    if (user && token) {
      setIsLoggedIn(true);
      setIsAuthenticated(true);
    } else {
      setIsLoggedIn(false);
      setIsAuthenticated(false);
    }
  }, [user, token]);

  const login = (token) => {
    // Do not store token in localStorage for httpOnly cookie-based auth flows.
    // Just update in-memory logged-in state; the cookie manages server-side auth.
    setIsLoggedIn(true);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear any local flags and rely on backend logout (if implemented) to clear cookie.
    setIsLoggedIn(false);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
