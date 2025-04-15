import React, { useState, useEffect } from "react";
import "../styles/HomePage.css"; // Импортируем созданный CSS файл

const HomePage = () => {
  const [keyStats, setKeyStats] = useState({
    total: 0,
    available: 0,
    issued: 0
  });
  const [keysList, setKeysList] = useState([]);
  const [keyHistory, setKeyHistory] = useState([]);
  const [keyRequests, setKeyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyStatsError, setKeyStatsError] = useState(null);
  const [keysListError, setKeysListError] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [requestsError, setRequestsError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('all'); 
  const [confirmationComment, setConfirmationComment] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmationStatus, setConfirmationStatus] = useState("");

  // Базовый URL API
  const API_URL = "http://localhost:5000";
//   const API_URL= "https://backaitu.onrender.com";

  useEffect(() => {
    // Функция для загрузки статистики ключей
    const fetchKeyStats = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${API_URL}/key-stats`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Key stats data:", data);  // Debug: log the data
          
          if (data.status === "success") {
            setKeyStats({
              total: data.total || 0,
              available: data.available || 0,
              issued: data.issued || 0
            });
            setKeyStatsError(null);
          } else {
            throw new Error(data.message || "Failed to fetch key statistics");
          }
        } catch (err) {
          console.error("Error fetching key statistics:", err);
          setKeyStatsError("Не удалось загрузить статистику ключей");
        } finally {
          setIsLoading(false);
        }
      };
    
    const fetchKeysList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/keys`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Keys list data:", data);  // Debug: log the keys data
        
        if (data.status === "success") {
          console.log("Setting keys:", data.keys || []);  // Log keys being set
          setKeysList(data.keys || []);
          setKeysListError(null);
        } else {
          throw new Error(data.message || "Failed to fetch keys list");
        }
      } catch (err) {
        console.error("Error fetching keys list:", err);
        setKeysListError("Не удалось загрузить список ключей");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Функция для загрузки истории ключей
    const fetchKeyHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const response = await fetch(`${API_URL}/key-history`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
          setKeyHistory(data.history || []);
          setHistoryError(null);
        } else {
          throw new Error(data.message || "Failed to fetch key history");
        }
      } catch (err) {
        console.error("Error fetching key history:", err);
        setHistoryError("Не удалось загрузить историю ключей");
      } finally {
        setIsHistoryLoading(false);
      }
    };
    
    // Функция для загрузки заявок на ключи
    const fetchKeyRequests = async () => {
      try {
        setIsRequestsLoading(true);
        const response = await fetch(`${API_URL}/key-requests`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
          setKeyRequests(data.requests || []);
          setRequestsError(null);
        } else {
          throw new Error(data.message || "Failed to fetch key requests");
        }
      } catch (err) {
        console.error("Error fetching key requests:", err);
        setRequestsError("Не удалось загрузить заявки на ключи");
      } finally {
        setIsRequestsLoading(false);
      }
    };

    // Вызов функций загрузки данных
    fetchKeyStats();
    fetchKeysList();
    fetchKeyHistory();
    fetchKeyRequests();
  }, []); // Пустой массив зависимостей означает, что эффект запускается только при монтировании

  // Функция для открытия модального окна с ключами
  const openKeysModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Фильтрация ключей в зависимости от выбранного типа
  const filteredKeys = () => {
    console.log("Filtering keys, current list:", keysList);  // Debug: log current keys list
    console.log("Modal type:", modalType);  // Debug: log modal type
    
    if (!keysList || !Array.isArray(keysList) || keysList.length === 0) {
      console.log("No keys to filter");
      return [];
    }
    
    try {
      switch (modalType) {
        case 'available':
          return keysList.filter(key => key && key.available === true);
        case 'issued':
          return keysList.filter(key => key && key.available === false);
        case 'all':
        default:
          return keysList;
      }
    } catch (err) {
      console.error("Error filtering keys:", err);
      return [];
    }
  };

  // Модальное окно со списком ключей
  const KeysModal = () => {
    if (!showModal) return null;
    
    const keys = filteredKeys();
    console.log("Displaying keys in modal:", keys);  // Debug: log keys in modal
    
    const titleMap = {
      'all': 'Все ключи',
      'available': 'Доступные ключи',
      'issued': 'Выданные ключи'
    };
    
    return (
      <div className="key-modal-overlay" onClick={() => setShowModal(false)}>
        <div className="key-modal" onClick={e => e.stopPropagation()}>
          <div className="key-modal-header">
            <h3 className="text-lg font-semibold">{titleMap[modalType]} ({keys ? keys.length : 0})</h3>
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowModal(false)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : keys && keys.length > 0 ? (
            <div className="key-list">
              {keys.map(key => (
                <div 
                  key={key.id || key.key_id || Math.random().toString()}
                  className={`key-item ${key.available ? 'key-item-available' : 'key-item-issued'}`}
                >
                  <div className="key-item-icon">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                  </div>
                  <div className="key-item-content">
                    <div className="key-item-name">{key.key_name || key.name || `Ключ ${key.id || key.key_id || 'без имени'}`}</div>
                    <div className={`key-item-status ${key.available ? 'key-item-status-available' : 'key-item-status-issued'}`}>
                      {key.available ? 'Доступен' : 'Выдан'}
                    </div>
                    {!key.available && key.last_user && (
                      <div className="key-item-user">У: {key.last_user}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              {error ? `Ошибка: ${error}` : 'Ключи не найдены'}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Функция для обработки заявок на ключи (подтверждение/отклонение)
  const handleKeyRequest = async (requestId, status, comment = "") => {
    try {
      // Предполагаем, что у нас есть ID администратора, который обрабатывает запрос
      // В реальном приложении это может быть получено из контекста авторизации
      const adminId = 1; // Пример ID администратора
      
      const response = await fetch(`${API_URL}/approve-key-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status, // 'approved', 'rejected', 'pending_verification' or 'on_hold'
          admin_id: adminId,
          comment: comment
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "success") {
        // Reset confirmation states
        setSelectedRequest(null);
        setConfirmationComment("");
        setConfirmationStatus("");
        
        // Обновляем списки после успешного обновления статуса
        setKeyRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
        
        // Также обновляем статистику и список ключей
        const fetchKeyStats = async () => {
          const response = await fetch(`${API_URL}/key-stats`);
          const data = await response.json();
          
          if (data.status === "success") {
            setKeyStats({
              total: data.total || 0,
              available: data.available || 0,
              issued: data.issued || 0
            });
          }
        };
        
        const fetchKeysList = async () => {
          const response = await fetch(`${API_URL}/keys`);
          const data = await response.json();
          
          if (data.status === "success") {
            setKeysList(data.keys || []);
          }
        };
        
        const fetchKeyHistory = async () => {
          const response = await fetch(`${API_URL}/key-history`);
          const data = await response.json();
          
          if (data.status === "success") {
            setKeyHistory(data.history || []);
          }
        };
        
        await Promise.all([fetchKeyStats(), fetchKeysList(), fetchKeyHistory()]);
        
        alert(`Заявка успешно ${
          status === 'approved' ? 'подтверждена' : 
          status === 'rejected' ? 'отклонена' : 
          status === 'pending_verification' ? 'отправлена на проверку' : 
          'поставлена на удержание'
        }`);
      } else {
        throw new Error(data.message || "Failed to process key request");
      }
    } catch (err) {
      console.error("Error processing key request:", err);
      alert(`Ошибка при обработке заявки: ${err.message}`);
    }
  };

  // New component for detailed key confirmation
  const KeyConfirmationForm = ({ request }) => {
    if (!request) return null;
    
    return (
      <div className="key-approval-item mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="key-approval-details">
          <div>
            <h4 className="font-medium">Подтверждение выдачи ключа: {request.key_name}</h4>
            <p className="text-sm text-gray-600">Пользователь: {request.user_name}</p>
            <p className="text-sm text-gray-600">Запрос от: {request.request_time}</p>
          </div>
          <div className="status-badge badge-pending">Ожидает</div>
        </div>
        
        <div className="mt-3">
          <textarea 
            className="comment-field"
            placeholder="Добавьте комментарий (опционально)..."
            value={confirmationComment}
            onChange={(e) => setConfirmationComment(e.target.value)}
          ></textarea>
        </div>
        
        <div className="key-approval-actions mt-3">
          <button 
            className="approval-button hold-button"
            onClick={() => handleKeyRequest(request.id, 'on_hold', confirmationComment)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            На удержание
          </button>
          <button 
            className="approval-button verify-button"
            onClick={() => handleKeyRequest(request.id, 'pending_verification', confirmationComment)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            На проверку
          </button>
          <button 
            className="approval-button reject-button"
            onClick={() => handleKeyRequest(request.id, 'rejected', confirmationComment)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Отказать
          </button>
          <button 
            className="approval-button approve-button"
            onClick={() => handleKeyRequest(request.id, 'approved', confirmationComment)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Подтвердить
          </button>
        </div>
      </div>
    );
  };

  // Модифицированный блок "История ключей"
  const renderKeyHistoryBlock = () => {
    return (
      <div className="key-history-container">
        <h2 className="text-lg font-medium mb-6">История ключей</h2>
        
        <div className="key-history-header">
          <div className="text-sm font-medium text-gray-500">Ключ</div>
          <div className="text-sm font-medium text-gray-500">Действие</div>
        </div>
        
        {isHistoryLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : keyHistory.length > 0 ? (
          <div className="key-history-list">
            {keyHistory.map(item => (
              <div className="key-history-item" key={item.id}>
                <div className="key-history-key-info">
                  <div className="key-history-key-name">Key {item.key_name}</div>
                </div>
                <div className="key-history-user-info">
                  <div className="key-history-username">{item.user_name}</div>
                  <button 
                    className={`key-history-status ${
                      item.action === "выдан" ? "status-confirmed" : "status-cancelled"
                    }`}
                  >
                    {item.action} • {item.timestamp}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">История отсутствует</div>
        )}
      </div>
    );
  };

  // Модифицированный блок "Подтверждение" для отображения реальных заявок
  const renderKeyRequestsBlock = () => {
    return (
      <div className="card bg-white p-7 rounded-lg shadow flex-1 min-h-[100px] flex flex-col">
        <h2 className="text-lg font-medium mb-6">Подтверждение</h2>
        
        {isRequestsLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : keyRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="table-header py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ключ
                  </th>
                  <th className="table-header py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="table-header py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Время запроса
                  </th>
                  <th className="table-header py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keyRequests.map(request => (
                  <tr key={request.id}>
                    <td className="table-cell py-2 whitespace-nowrap">{request.key_name}</td>
                    <td className="table-cell py-2 whitespace-nowrap">{request.user_name}</td>
                    <td className="table-cell py-2 whitespace-nowrap">{request.request_time}</td>
                    <td className="table-cell py-2 whitespace-nowrap flex space-x-2">
                      <button 
                        className="button-confirm px-3 py-1 bg-green-500 text-xs text-white rounded-md hover:bg-green-600"
                        onClick={() => setSelectedRequest(request)}
                      >
                        Обработать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {selectedRequest && (
              <KeyConfirmationForm request={selectedRequest} />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">Нет активных заявок на ключи</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ЛЕВАЯ БОКОВАЯ ПАНЕЛЬ */}
      <aside className="sidebar-container w-56 bg-white p-5 shadow-md">
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
          <a
            href="#"
            className="flex items-center p-2 rounded-lg text-blue-600 bg-blue-50"
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
            Dashboard 1
          </a>
          
          <a
            href="#"
            className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Users
          </a>
          
          <a
            href="#"
            className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              ></path>
            </svg>
            Keys
          </a>
        </nav>
      </aside>
      
      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="main-content flex-1 flex flex-col">
        {/* Шапка */}
        <header className="header bg-white shadow-sm p-5">
          <div className="flex justify-between items-center">
            {/* Кнопка "гамбургер" (можно убрать, если не нужна) */}
            <button className="p-2 rounded-md hover:bg-gray-100">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            {/* Заголовок с выразительным оформлением */}
            <h1 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-600">Aitu</span>Keys 
            </h1>
            
            {/* Иконки справа и профиль */}
            <div className="flex items-center space-x-4">
              {/* Оставляем только иконку уведомлений */}
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
                {/* Индикатор уведомлений */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Улучшенный блок профиля */}
              <div className="flex items-center border-l pl-4 ml-2">
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-700">Администратор</p>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Основная рабочая область */}
        <main className="p-8 grid grid-cols-1 gap-0 md:grid-cols-1 lg:gap-6">
          
          {/* Верхняя часть, где идут два блока (Keys и Подтверждение) рядом */}
          <div className="flex flex-row space-x-10"> {/* Увеличиваем расстояние между блоками */}
            {/* Блок с информацией о ключах */}
            <div className="card bg-white p-7 rounded-lg shadow flex-1 min-h-[200px] flex flex-col">
              <h2 className="text-lg font-medium mb-6">Keys</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : (
                <div className="flex flex-col flex-grow justify-between">
                  <div className="space-y-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                      onClick={() => openKeysModal('available')}
                    >
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{keyStats.available} Keys</div>
                        <div className="font-medium">В наличии</div>
                      </div>
                      <div className="ml-8 stat-icon p-4 bg-yellow-100 rounded-full">
                        <svg 
                          className="h-7 w-7 text-yellow-500" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                      onClick={() => openKeysModal('issued')}
                    >
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{keyStats.issued} Keys</div>
                        <div className="font-medium">Выданы</div>
                      </div>
                      <div className="ml-8 stat-icon p-4 bg-blue-100 rounded-full">
                        <svg
                          className="h-7 w-7 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                      onClick={() => openKeysModal('all')}
                    >
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{keyStats.total} Keys</div>
                        <div className="font-medium">Всего</div>
                      </div>
                      <div className="ml-8 stat-icon p-4 bg-green-100 rounded-full">
                        <svg 
                          className="h-7 w-7 text-green-500" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Используем новый блок для отображения заявок на ключи */}
            {renderKeyRequestsBlock()}
          </div>
          
          {/* Блок "История ключей" с реальными данными */}
          {renderKeyHistoryBlock()}
        </main>
      </div>
      
      {/* Модальное окно со списком ключей */}
      <KeysModal />
    </div>
  );
};

export default HomePage;
