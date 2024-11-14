// src/components/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthCookie } from '../actions/auth.action';

interface PublicRouteProps {
  element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const auth = getAuthCookie();

  // Nếu người dùng đã đăng nhập, chuyển hướng đến trang chủ
  if (auth) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PublicRoute;
