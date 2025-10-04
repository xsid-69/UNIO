import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    };
    verifyAuth();
  }, []);

  const login = (token) => {
    // Do not store token in localStorage for httpOnly cookie-based auth flows.
    // Just update in-memory logged-in state; the cookie manages server-side auth.
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Clear any local flags and rely on backend logout (if implemented) to clear cookie.
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
