import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    toast.error("Login to continue ...");
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    toast.error("You don't have access to this page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;