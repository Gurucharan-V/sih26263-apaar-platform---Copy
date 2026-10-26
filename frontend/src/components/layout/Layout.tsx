import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ portal: 'student' | 'college' | 'admin' | 'moderator' }> = ({ portal }) => {
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
