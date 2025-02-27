import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));

  // Helper function to check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      console.log(`Token Expiration Check: Token ${isExpired ? 'is expired' : 'is valid'}`);
      return isExpired;
    } catch (error) {
      console.error('Failed to decode token', error);
      return true;
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      console.log('Attempting to refresh token...');
      const response = await axios.post('/api/admin/refresh-token', { token });
      const { newToken } = response.data;

      setToken(newToken);
      localStorage.setItem('adminToken', newToken);
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh failed', error);
      logout(); // If refreshing fails, log out the user
    }
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('adminToken', newToken);
  };

  // Logout function (clear token)
  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    console.log('User has been logged out');
    toast.warn('Please log in again');
    // Optionally, redirect to login page
  };

  useEffect(() => {
    if (token) {
      console.log('Checking if token is expired...');
      if (isTokenExpired(token)) {
        refreshToken();
      } else {
        const decoded = jwtDecode(token);
        const expiresAt = decoded.exp * 1000;
        const timeUntilExpiry = expiresAt - Date.now();
        const refreshTime = timeUntilExpiry - 60000; // Refresh 1 minute before expiration

        console.log(`Token will be refreshed in ${Math.max(refreshTime / 1000, 0)} seconds`);

        const refreshTimeout = setTimeout(() => {
          refreshToken();
        }, refreshTime);

        return () => clearTimeout(refreshTimeout); // Clean up timeout if token changes
      }
    } else {
      console.log('No token found, redirecting to login');
      // Optionally redirect to login page
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
