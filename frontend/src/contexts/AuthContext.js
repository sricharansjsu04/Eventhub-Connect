// src/contexts/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage
    const [authState, setAuthState] = useState({
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
      user: localStorage.getItem('user'),
      roleType: localStorage.getItem('roleType'),
    });
  
    // Function to handle login
    const login = (username, roleType) => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', username);
      localStorage.setItem('roleType', roleType);
  
      setAuthState({
        isAuthenticated: true,
        user: username,
        roleType: roleType,
      });
    };
  
    // Function to handle logout
    const logout = () => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('roleType');
  
      setAuthState({
        isAuthenticated: false,
        user: null,
        roleType: null,
      });
    };
  
    const authContextValue = {
      ...authState,
      login,
      logout,
    };
  
    return (
      <AuthContext.Provider value={authContextValue}>
        {children}
      </AuthContext.Provider>
    );
  };
  


