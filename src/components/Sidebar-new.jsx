import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M8 21l4-7 4 7M3 7l9-4 9 4"/>
        </svg>
      ),
      label: 'Главная',
      description: 'Обзор системы'
    },
    {
      path: '/keys-history',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      label: 'История ключей',
      description: 'Журнал операций'
    },
    {
      path: '/category',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
      label: 'Категории пользователей',
      description: 'Управление группами'
    },
    {
      path: '/edit-key',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      ),
      label: 'Редактор ключей',
      description: 'Настройка доступа'
    }
  ];

  return (
    <aside className={`sidebar-modern ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-container">
            <div className="logo-icon">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="logo-title">AITU</span>
                <span className="logo-subtitle">Key Management</span>
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="collapse-btn"
          title={isCollapsed ? 'Развернуть' : 'Свернуть'}
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!isCollapsed && <div className="section-title">Основные</div>}
          
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="nav-item-icon">
                {item.icon}
              </div>
              
              {!isCollapsed && (
                <div className="nav-item-content">
                  <span className="nav-item-label">{item.label}</span>
                  <span className="nav-item-description">{item.description}</span>
                </div>
              )}
              
              {isActive(item.path) && <div className="nav-item-indicator" />}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div className="user-details">
              <span className="user-name">Администратор</span>
              <span className="user-role">Системный доступ</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sidebar-modern {
          width: 280px;
          min-height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 10;
        }

        .sidebar-modern.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          position: relative;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .logo-subtitle {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          margin-top: 2px;
        }

        .collapse-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: rgba(248, 250, 252, 0.8);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .collapse-btn:hover {
          background: rgba(241, 245, 249, 1);
          border-color: #cbd5e1;
          color: #475569;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 12px;
          overflow-y: auto;
        }

        .nav-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 12px;
          padding: 0 8px;
          letter-spacing: 0.05em;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 8px;
          margin-bottom: 4px;
          border-radius: 12px;
          text-decoration: none;
          color: #64748b;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-item:hover {
          background: rgba(248, 250, 252, 0.8);
          color: #475569;
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
          color: #1d4ed8;
          font-weight: 500;
        }

        .nav-item.active:hover {
          transform: translateX(4px);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.15) 100%);
        }

        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-item-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .nav-item-label {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.2;
        }

        .nav-item-description {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
          line-height: 1.2;
        }

        .nav-item.active .nav-item-description {
          color: rgba(29, 78, 216, 0.7);
        }

        .nav-item-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 2px 0 0 2px;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(248, 250, 252, 0.5);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          line-height: 1.2;
        }

        .user-role {
          font-size: 11px;
          color: #64748b;
          margin-top: 1px;
        }

        /* Scrollbar styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.5);
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(203, 213, 225, 0.8);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .sidebar-modern {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 50;
            transform: translateX(-100%);
          }

          .sidebar-modern.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
