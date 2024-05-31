// src/components/AdminRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ component: Component }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return isAuthenticated && user.role === 'Admin' ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
