import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from '../models/JwtPayload';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
