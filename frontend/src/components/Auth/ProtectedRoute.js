import React, { Children, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, roleType } = useContext(AuthContext);
    console.log('required role is ', requiredRole);
    console.log('role type is ', roleType);
  if (!isAuthenticated) {
    // Redirect them to the /login page if not authenticated
    return <Navigate to="/" replace />;
  }

  if (requiredRole && roleType !== requiredRole) {
    // Redirect them to the home page if they don't have the required role
    return <Navigate to="/" replace />;
  }

  console.log('returning ');
  //return <Outlet />;
  return children;
};

export default ProtectedRoute;

