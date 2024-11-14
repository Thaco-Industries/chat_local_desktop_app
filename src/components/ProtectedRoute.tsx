// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFetchApi } from '../context/ApiContext';
import { getAuthCookie } from '../actions/auth.action';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const auth = getAuthCookie();

  // Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
