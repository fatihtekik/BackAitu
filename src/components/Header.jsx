import React from 'react';

const Header = () => {
  return (
    <header className="header bg-white shadow-sm p-5">
      <div className="relative flex items-center h-full">
        <button className="p-2 rounded-md hover:bg-gray-100 md:hidden">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-gray-800">
          <span className="text-blue-600">Aitu</span>Keys
        </h1>
        <div className="ml-auto flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:outline-none relative">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center border-l pl-4 ml-2">
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-700">Администратор</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
