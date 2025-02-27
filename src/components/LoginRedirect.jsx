import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { useUserAuth } from '../context/UserAuthContext';

const LoginRedirect = () => {
  const { token } = useUserAuth();

  if (token) {
    return <Navigate to="/account" replace />;
  }
  return <Login />;
};

export default LoginRedirect;
