import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false

  useEffect(() => {
    // Check for a token or user data in localStorage or sessionStorage
    const token = localStorage.getItem('token'); // Or check for a user object
    if (token) {
      setIsLoggedIn(true);
    }
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
