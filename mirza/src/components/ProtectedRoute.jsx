import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, fundsOnly }) => {
  const isAuthenticated = sessionStorage.getItem("user");
  const isMutualFundUser = sessionStorage.getItem("isMutualFundUser") === "true";
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (fundsOnly && !isMutualFundUser) {
    return <Navigate to="/dashboard" state={{ unauthorizedFromFunds: true }} replace />;
  }

  if (!fundsOnly && isMutualFundUser) {
    return <Navigate to="/funds-dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
