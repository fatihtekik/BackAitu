import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-modern">
      <Sidebar />
      <div className="main-content-area">
        <Header />
        <main className="content-wrapper">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default Layout;
