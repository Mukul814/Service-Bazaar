import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;