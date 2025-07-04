import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'user' | 'admin' }) => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    console.log("Waiting for auth to resolve...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center mt-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // not logged in, so go to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
