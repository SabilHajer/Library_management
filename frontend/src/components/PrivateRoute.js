import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, role }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return isAuthenticated && user.role === role ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
