import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC<{ portal: 'student' | 'college' | 'admin' | 'moderator' }> = ({ portal }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If user is not authenticated for the required portal, redirect to login
  if (portal === 'student' && user?.role !== 'STUDENT') {
    return <Navigate to="/login/student" state={{ from: location }} replace />;
  }

  if (portal === 'college' && user?.role !== 'COLLEGE_NODAL') {
    return <Navigate to="/login/college" state={{ from: location }} replace />;
  }

  if ((portal === 'admin' || portal === 'moderator') && user?.role !== 'MODERATOR') {
    return <Navigate to="/login/moderator" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar portal={portal} />
      <div className="flex flex-1">
        <Sidebar portal={portal} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

