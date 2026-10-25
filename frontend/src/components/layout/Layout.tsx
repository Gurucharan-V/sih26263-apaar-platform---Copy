import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ portal: 'college' | 'admin' }> = ({ portal }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar portal={portal} />
      <div className="flex flex-1">
        <Sidebar portal={portal} />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
