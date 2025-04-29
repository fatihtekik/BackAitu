import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-container w-56 bg-white p-5 shadow-md flex-shrink-0">
      <div className="flex items-center mb-10">
        <img
          src="/src/img/aitu-logo.png"
          alt="AITU Logo"
          className="h-9 w-9 mr-2"
        />
        <span className="font-bold text-xl">AITU</span>
      </div>

      <nav className="space-y-3">
        <Link
          to="/"
          className={`flex items-center p-2 rounded-lg ${
            isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg
            className="h-5 w-5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
            <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
            <path d="M3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
          </svg>
          Главная
        </Link>

        <Link
          to="/keys-history"
          className={`flex items-center p-2 rounded-lg ${
            isActive('/keys-history') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg
            className="h-5 w-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          История ключей
        </Link>

        <Link
          to="/users"
          className={`flex items-center p-2 rounded-lg ${
            isActive('/users') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg
            className="h-5 w-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A9 9 0 1118.879 6.196A9 9 0 015.121 17.804z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Пользователи
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
