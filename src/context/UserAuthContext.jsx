import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [user, setUser] = useState(null);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Failed to decode token', error);
      return true;
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`/api/users/findUser/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/users/refresh-token', { token });
      const { newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('userToken', newToken);
      const decoded = jwtDecode(newToken);
      fetchUserData(decoded.id);
    } catch (error) {
      console.error('Token refresh failed', error);
      logout();
    }
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('userToken', newToken);
    const decoded = jwtDecode(newToken);
    fetchUserData(decoded.id);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    toast.warn('You have been logged out');
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (isTokenExpired(token)) {
        refreshToken();
      } else {
        fetchUserData(decoded.id);
      }
    }
  }, [token]);

  return (
    <UserAuthContext.Provider value={{ token, user, login, logout, fetchUserData }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
