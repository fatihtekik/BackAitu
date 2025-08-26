import React, { useState } from 'react';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, type: 'success', message: 'Ключ успешно выдан', time: '2 мин назад', read: false },
    { id: 2, type: 'warning', message: 'Истекает срок доступа', time: '15 мин назад', read: false },
    { id: 3, type: 'info', message: 'Новый запрос на доступ', time: '1 час назад', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header-modern">
      <div className="header-content">
        {/* Search Section */}
        <div className="header-search">
          <div className="search-container">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Поиск ключей, пользователей..."
              className="search-input"
            />
            <div className="search-shortcut">
              <span>Ctrl+K</span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="header-actions">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-btn" title="Создать новый ключ">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </button>
            
            <button className="action-btn" title="Экспорт данных">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </button>
          </div>

          {/* Notifications */}
          <div className="notification-container">
            <button 
              className={`notification-btn ${unreadCount > 0 ? 'has-notifications' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Уведомления"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Уведомления</h3>
                  <button className="mark-all-read">Отметить все как прочитанные</button>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                      <div className={`notification-type ${notification.type}`}>
                        {notification.type === 'success' && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        )}
                        {notification.type === 'warning' && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        )}
                        {notification.type === 'info' && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu-container">
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar-header">
                <span>А</span>
              </div>
              <div className="user-info-header">
                <span className="user-name-header">Администратор</span>
                <span className="user-status">Онлайн</span>
              </div>
              <svg className={`chevron ${showUserMenu ? 'open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">А</div>
                  <div>
                    <p className="user-name-large">Администратор</p>
                    <p className="user-email">admin@aitu.edu.kz</p>
                  </div>
                </div>
                <div className="user-dropdown-menu">
                  <a href="#" className="menu-item">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Профиль
                  </a>
                  <a href="#" className="menu-item">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Настройки
                  </a>
                  <div className="menu-divider"></div>
                  <a href="#" className="menu-item text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Выйти
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-modern {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 12px 24px;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 100%;
        }

        .header-search {
          flex: 1;
          max-width: 500px;
          margin-right: 24px;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          width: 18px;
          height: 18px;
          color: #64748b;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          padding-right: 70px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          color: #334155;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-shortcut {
          position: absolute;
          right: 8px;
          padding: 4px 8px;
          background: rgba(226, 232, 240, 0.6);
          border-radius: 6px;
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(248, 250, 252, 0.8);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(241, 245, 249, 1);
          border-color: #cbd5e1;
          color: #475569;
          transform: translateY(-1px);
        }

        .notification-container {
          position: relative;
        }

        .notification-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(248, 250, 252, 0.8);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .notification-btn:hover {
          background: rgba(241, 245, 249, 1);
          border-color: #cbd5e1;
          color: #475569;
        }

        .notification-btn.has-notifications {
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
          background: rgba(59, 130, 246, 0.05);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.9);
        }

        .notification-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          z-index: 50;
          overflow: hidden;
        }

        .notification-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .mark-all-read {
          font-size: 12px;
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .mark-all-read:hover {
          color: #1d4ed8;
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4);
          display: flex;
          gap: 12px;
          transition: background 0.2s ease;
        }

        .notification-item:hover {
          background: rgba(248, 250, 252, 0.5);
        }

        .notification-item.unread {
          background: rgba(59, 130, 246, 0.02);
        }

        .notification-type {
          width: 24px;
          height: 24px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-type.success {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .notification-type.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .notification-type.info {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-message {
          font-size: 13px;
          color: #334155;
          margin: 0 0 4px 0;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 11px;
          color: #64748b;
        }

        .user-menu-container {
          position: relative;
        }

        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(248, 250, 252, 0.8);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-menu-btn:hover {
          background: rgba(241, 245, 249, 1);
          border-color: #cbd5e1;
        }

        .user-avatar-header {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 13px;
        }

        .user-info-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name-header {
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          line-height: 1.2;
        }

        .user-status {
          font-size: 11px;
          color: #22c55e;
          font-weight: 500;
        }

        .chevron {
          width: 16px;
          height: 16px;
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 240px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          z-index: 50;
          overflow: hidden;
        }

        .user-dropdown-header {
          padding: 16px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .user-avatar-large {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .user-name-large {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .user-email {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .user-dropdown-menu {
          padding: 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #475569;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          background: rgba(248, 250, 252, 0.8);
          color: #334155;
        }

        .menu-divider {
          height: 1px;
          background: rgba(226, 232, 240, 0.6);
          margin: 8px 12px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-search {
            display: none;
          }
          
          .user-info-header {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
