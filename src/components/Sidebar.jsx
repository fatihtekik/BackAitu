import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation

const Sidebar = () => {
  const location = useLocation(); // Get current location

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-container w-56 bg-white p-5 shadow-md flex-shrink-0"> {/* Added flex-shrink-0 */}
      {/* Логотип и заголовок */}
      <div className="flex items-center mb-10">
        <img
          src="/src/img/aitu-logo.png"
          alt="AITU Logo"
          className="h-9 w-9 mr-2"
        />
        <span className="font-bold text-xl">AITU</span>
      </div>

      {/* Навигация */}
      <nav className="space-y-3">
        <Link // Use Link for navigation
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

        <Link // Use Link for navigation
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" // Clock icon for history
            ></path>
          </svg>
          История ключей
        </Link>

        {/* Add other links as needed */}
        {/* Example:
        <Link
          to="/users"
          className={`flex items-center p-2 rounded-lg ${
            isActive('/users') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Users
        </Link>
        */}
      </nav>
    </aside>
  );
};

export default Sidebar;
