import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get('http://localhost:3000/api/auth/me');
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    };
    verifyAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token); // Store the token
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token
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
