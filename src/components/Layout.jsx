import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet рендерит дочерние маршруты
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="main-content flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-grow"> {/* flex-grow ensures main takes remaining space */}
          <Outlet /> {/* Здесь будут рендериться HomePage, KeysPage и т.д. */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
