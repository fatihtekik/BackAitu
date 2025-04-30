import React, { useState, useEffect, useMemo } from "react";
import "../styles/HomePage.css";
import Modal from './Modal';

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
  const [isInitialRequestsLoad, setIsInitialRequestsLoad] = useState(true); // Add this state
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmationStatus, setConfirmationStatus] = useState("");
  const [homeNameFilter, setHomeNameFilter] = useState(''); // Filter for user name on home page history
  const [homeKeyNameFilter, setHomeKeyNameFilter] = useState(''); // Filter for key name on home page history
  const [corpusFilter, setCorpusFilter] = useState('all'); // State for corpus filter
  const [floorFilter, setFloorFilter] = useState('all'); // State for floor filter

  const API_URL= "https://backaitu.onrender.com";

  const refetchAllData = async () => {
    setIsLoading(true);
    setIsHistoryLoading(true);
    setIsRequestsLoading(true);
    setError(null);
    try {
      await Promise.allSettled([
        fetchKeyStats(),
        fetchKeysList(),
        fetchKeyHistory(),
        fetchKeyRequests()
      ]);
    } catch (err) {
      console.error("Error refetching data:", err);
    } finally {
      setIsLoading(false);
      setIsHistoryLoading(false);
      setIsRequestsLoading(false);
    }
  };

  const fetchKeyStats = async () => {
    try {
      const response = await fetch(`${API_URL}/key-stats`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.status === "success") {
        setKeyStats({
          total: data.total || 0,
          available: data.available || 0,
          issued: data.issued || 0
        });
      } else {
        throw new Error(data.message || "Failed to fetch key statistics");
      }
    } catch (err) {
      console.error("Error fetching key statistics:", err);
      setError(prev => prev || "Не удалось загрузить статистику ключей");
    }
  };

  const fetchKeysList = async () => {
    try {
      const response = await fetch(`${API_URL}/keys`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.status === "success") {
        setKeysList(data.keys || []);
      } else {
        throw new Error(data.message || "Failed to fetch keys list");
      }
    } catch (err) {
      console.error("Error fetching keys list:", err);
      setError(prev => prev || "Не удалось загрузить список ключей");
    }
  };

  const fetchKeyHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/key-history`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.status === "success") {
        setKeyHistory(data.history || []);
      } else {
        throw new Error(data.message || "Failed to fetch key history");
      }
    } catch (err) {
      console.error("Error fetching key history:", err);
      setError(prev => prev || "Не удалось загрузить историю ключей");
    } finally {
    }
  };

  const fetchKeyRequests = async () => {
    try {
      console.log("Starting fetchKeyRequests");
      // Only set loading to true on the very first load
      if (isInitialRequestsLoad) {
        setIsRequestsLoading(true);
      }
      const response = await fetch(`${API_URL}/pending-requests`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Received requests data:", data);
      if (data.status === "success") {
        const mappedRequests = (data.requests || []).map(req => ({
          id: req.history_id,
          key_name: req.key_name,
          user_name: req.user_name,
          request_time: req.timestamp,
        }));
        console.log("Mapped requests:", mappedRequests);
        setKeyRequests(mappedRequests);
      } else {
        throw new Error(data.message || "Failed to fetch key requests");
      }
    } catch (err) {
      console.error("Error fetching key requests:", err);
      setError(prev => prev || "Не удалось загрузить заявки на ключи");
    } finally {
      console.log("Ending fetchKeyRequests, setting loading to false");
      // Always set loading to false after fetch attempt
      setIsRequestsLoading(false);
      // If this was the initial load, mark it as complete
      if (isInitialRequestsLoad) {
        setIsInitialRequestsLoad(false);
      }
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        setIsHistoryLoading(true);
        // Initial requests load is handled by fetchKeyRequests now
        // setIsRequestsLoading(true);
        setError(null);
        try {
            // Fetch all initial data including requests
            await Promise.allSettled([
                fetchKeyStats(),
                fetchKeysList(),
                fetchKeyHistory(),
                fetchKeyRequests(), // Add initial requests fetch here
            ]);
        } catch (err) {
            console.error("Error during initial data load:", err);
        } finally {
            setIsLoading(false);
            setIsHistoryLoading(false);
            // Requests loading state is managed within fetchKeyRequests
            // setIsRequestsLoading(false);
        }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencies remain empty for initial load

  useEffect(() => {
    // Polling starts after initial load completes
    console.log("Setting up request polling");
    // Remove initial fetch from here, it's done in the first useEffect
    // fetchKeyRequests().then(() => console.log("Initial request fetch complete"));
    const interval = setInterval(() => {
      console.log("Polling for requests");
      // Subsequent fetches won't trigger the main loading state
      fetchKeyRequests().then(() => console.log("Polling request fetch complete"));
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencies remain empty for polling setup

  const openKeysModal = (type) => {
    setModalType(type);
    setCorpusFilter('all'); // Reset filters when opening modal
    setFloorFilter('all'); // Reset filters when opening modal
    setShowModal(true);
  };

  // Кнопка-переключатель для фильтров с CSS-переменными и улучшенным ховер-эффектом
  const FilterButton = ({ label, value, currentFilter, setFilter }) => {
    // Проверяем типы кнопок для разного стиля
    const isNumeric = !isNaN(parseInt(label));
    const isCorpus = /^C[1-3]$/.test(label); // Проверка на C1, C2, C3
    const isActive = currentFilter === value;
    
    // Переключатель фильтра: если нажатая кнопка уже активна, сбрасываем фильтр на 'all'
    const toggleFilter = () => {
      setFilter(isActive ? 'all' : value);
    };
    
    // Стили для активного состояния и ховера, использующие CSS-переменные
    const activeStyle = {
      backgroundColor: 'var(--color-blue-600, #2563eb)',
      color: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out'
    };

    const buttonClass = `
      ${isNumeric || isCorpus ? 'w-8 h-8' : 'px-3'} py-1.5 text-sm font-semibold rounded-full 
      transition-all duration-300 ease-in-out focus:outline-none flex items-center justify-center
      ${!isActive 
        ? 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm' 
        : 'hover:bg-blue-500 hover:shadow-md'}
    `;
    
    return (
      <button
        className={buttonClass}
        style={isActive ? activeStyle : {}}
        onClick={toggleFilter}
      >
        {label}
      </button>
    );
  };

  const KeysModal = () => {
    if (!showModal) return null;

    const parseCorpus = (keyName) => {
      if (!keyName) return null;
      const match = keyName.match(/^C([1-3])/i);
      return match ? `C${match[1]}` : null;
    };

    const parseFloor = (keyName) => {
        if (!keyName) return null;
        
        // Обновленный регулярный паттерн для поиска этажа
        // Например, из C1.3.225 извлекает 2 (первую цифру номера кабинета)
        const match = keyName.match(/^C[1-3]\.\d+\.(\d)/i);
        
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        
        // Если не нашли по основному паттерну, попробуем запасной вариант
        // для случаев, когда формат ключа может быть иным
        const fallbackMatch = keyName.match(/^C[1-3]\.(\d)/i);
        return fallbackMatch ? parseInt(fallbackMatch[1], 10) : null;
    };


    const getFilteredKeys = () => {
        if (!keysList || !Array.isArray(keysList)) return [];
        try {
            let baseFiltered = [];
            switch (modalType) {
                case 'available':
                    baseFiltered = keysList.filter(key => key && key.available === true);
                    break;
                case 'issued':
                    baseFiltered = keysList.filter(key => key && key.available === false);
                    break;
                case 'all':
                default:
                    baseFiltered = keysList;
            }

            return baseFiltered.filter(key => {
                const keyName = key.key_name || key.name || '';
                const corpus = parseCorpus(keyName);
                const floor = parseFloor(keyName);

                const corpusMatch = corpusFilter === 'all' || (corpus && corpus.toUpperCase() === corpusFilter.toUpperCase());
                const floorMatch = floorFilter === 'all' || (floor && floor === parseInt(floorFilter, 10));

                return corpusMatch && floorMatch;
            });

        } catch (err) {
            console.error("Error filtering keys:", err);
            return [];
        }
    };


    const keys = getFilteredKeys();
    const titleMap = {
      'all': 'Все ключи',
      'available': 'Доступные ключи',
      'issued': 'Выданные ключи'
    };

    return (
      <Modal onClose={() => setShowModal(false)}>
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

        {/* Все фильтры в одном ряду - увеличен отступ снизу */}
        <div className="mb-12 p-4 pb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Корпусы */}
            <div className="flex flex-col items-start mr-6">
              <span className="text-xs font-medium text-gray-600 mb-2">Корпус:</span>
              <div className="flex gap-2">
                <FilterButton label="C1" value="C1" currentFilter={corpusFilter} setFilter={setCorpusFilter} />
                <FilterButton label="C2" value="C2" currentFilter={corpusFilter} setFilter={setCorpusFilter} />
                <FilterButton label="C3" value="C3" currentFilter={corpusFilter} setFilter={setCorpusFilter} />
              </div>
            </div>
            
            {/* Этажи */}
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium text-gray-600 mb-2">Этаж:</span>
              <div className="flex gap-2">
                <FilterButton label="1" value="1" currentFilter={floorFilter} setFilter={setFloorFilter} />
                <FilterButton label="2" value="2" currentFilter={floorFilter} setFilter={setFloorFilter} />
                <FilterButton label="3" value="3" currentFilter={floorFilter} setFilter={setFloorFilter} />
              </div>
            </div>
          </div>
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
            {error ? `Ошибка загрузки: ${error}` : (corpusFilter !== 'all' || floorFilter !== 'all' ? 'Нет ключей, соответствующих фильтрам' : 'Ключи не найдены')}
          </div>
        )}
      </Modal>
    );
  };

  const KeyConfirmationForm = ({ request }) => {
    if (!request) return null;

    const handleKeyRequest = async (id, status) => {
      console.log(`Handling request ${id}: status=${status}`);
      setConfirmationStatus("processing");
      
      try {
        const url = `${API_URL}/${status === 'approved' ? 'approve-request' : 'deny-request'}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history_id: id })
        });
        const data = await response.json();
        console.log("Request processing response:", data);
        
        if (!response.ok || data.status !== 'success') throw new Error(data.message);
        
        setSelectedRequest(null);
        
        await Promise.all([
          fetchKeyStats(),
          fetchKeyHistory(),
          fetchKeyRequests()
        ]);
        
      } catch (err) {
        console.error("Error processing key request:", err);
        setError(`Ошибка обработки заявки: ${err.message}`);
      } finally {
        setConfirmationStatus("");
      }
    };

    return (
      <div className="key-approval-item mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg" style={{ padding: "12px" }}>
         <div className="key-approval-details flex justify-between items-start">
          <div>
            <h4 className="font-medium">{request.key_name}</h4>
            <p className="text-sm text-gray-600">Пользователь: {request.user_name}</p>
            <p className="text-sm text-gray-600">Запрос от: {new Date(request.request_time).toLocaleString()}</p>
          </div>
          <div className="status-badge badge-pending px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800" style={{ marginLeft: "12px" }}>Ожидает</div>
        </div>

        <div className="key-approval-actions mt-3 flex flex-wrap gap-2" style={{ padding: "12px" }}>
          <button
            className="approval-button reject-button flex items-center px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
            onClick={() => handleKeyRequest(request.id, 'denied')}
            disabled={confirmationStatus === "processing"}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            Отказать
          </button>
          <button
            className="approval-button approve-button flex items-center px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
            onClick={() => handleKeyRequest(request.id, 'approved')}
            disabled={confirmationStatus === "processing"}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Подтвердить
          </button>
           {confirmationStatus === "processing" && <span className="text-xs text-gray-500 ml-2">Обработка...</span>}
        </div>
      </div>
    );
  };

  const getStatusInfo = (action) => {
    const normalizedAction = action?.toLowerCase();
    
    switch (normalizedAction) {
      case 'request':
      case 'запрос':
        return { text: 'Запрос', className: 'bg-yellow-100 text-yellow-700' };
      case 'return':
      case 'returned':
      case 'сдан':
        return { text: 'Сдан', className: 'bg-green-100 text-green-700' };
      case 'issue':
      case 'issued':
      case 'approved':
      case 'выдан':
        return { text: 'Выдан', className: 'bg-red-100 text-red-700' };
      case 'denied':
      case 'отказано':
        return { text: 'Отказано', className: 'bg-red-100 text-red-700' };
      case 'pending':
      case 'ожидает':
        return { text: 'Ожидает', className: 'bg-yellow-100 text-yellow-700' };
      case 'transfer':
        return { text: 'Передан', className: 'bg-blue-100 text-blue-700' };
      default:
        return { text: action || 'Неизвестно', className: 'bg-gray-100 text-gray-700' };
    }
  };

  const renderKeyHistoryBlock = () => {
    // Filter history for today's entries and apply filters
    const todaysHistory = useMemo(() => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      return keyHistory.filter(item => {
        // Date check
        let isToday = false;
        try {
          const parts = item.timestamp.split(' ');
          const dateParts = parts[0].split('.');
          const timeParts = parts[1].split(':');
          const itemDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);
          isToday = itemDate >= todayStart;
        } catch (e) {
          console.error("Error parsing history timestamp:", item.timestamp, e);
          return false;
        }

        if (!isToday) return false;

        // Filter checks
        const nameMatch = !homeNameFilter || (item.user_name && item.user_name.toLowerCase().includes(homeNameFilter.toLowerCase()));
        const keyNameMatch = !homeKeyNameFilter || (item.key_name && item.key_name.toLowerCase().includes(homeKeyNameFilter.toLowerCase()));

        return nameMatch && keyNameMatch;
      });
    }, [keyHistory, homeNameFilter, homeKeyNameFilter]); // Add filters to dependency array

    // Style for small, miniature input fields with equal padding
    const miniInputStyle = {
      height: "28px",
      fontSize: "12px",
      padding: "4px 8px",
      margin: "4px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginBottom: "12px",
    };

    return (
      <div className="key-history-container mt-6 bg-white p-7 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">История ключей за Сегодня</h2>
        {/* Add Filter Inputs */}
        <div className="flex space-x-4 mb-6">
           <input
              type="text"
              placeholder="Искать по ФИО"
              value={homeNameFilter}
              onChange={(e) => setHomeNameFilter(e.target.value)}
              style={miniInputStyle}
              className="flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-150 ease-in-out"
           />
           <input
              type="text"
              placeholder="Искать по ключу"
              value={homeKeyNameFilter}
              onChange={(e) => setHomeKeyNameFilter(e.target.value)}
              style={miniInputStyle}
              className="flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-150 ease-in-out"
           />
        </div>
        {isHistoryLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && error.includes("историю") ? (
          <div className="text-center text-red-500 py-4">Ошибка: {error}</div>
        ) : (
          <div className="history-table-container overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                  <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ключ</th>
                  <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                  <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todaysHistory.length > 0 ? (
                  todaysHistory.map(item => {
                    const statusInfo = getStatusInfo(item.action);
                    return (
                      <tr key={item.id}>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{item.id}</td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{item.key_name}</td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{item.user_name}</td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`status-badge px-2 py-1 rounded-full text-xs ${statusInfo.className}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{item.timestamp}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      {homeNameFilter || homeKeyNameFilter ? 'Нет совпадающих записей за сегодня' : 'Нет записей за сегодня'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  const renderKeyRequestsBlock = () => {
    console.log("Rendering key requests block. Loading:", isRequestsLoading, "Request count:", keyRequests.length);

    // Use isRequestsLoading for the spinner, which is now only true on initial load
    return (
      <div className="card bg-white p-7 rounded-lg shadow flex-1 min-h-[200px] flex flex-col">
        <h2 className="text-lg font-medium mb-6">Подтверждение заявок</h2>
        {isRequestsLoading ? ( // This condition now only true on initial load
          <div className="flex justify-center items-center flex-grow">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : keyRequests.length > 0 ? (
          <div className="overflow-x-auto flex-grow flex flex-col">
             <div className="flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                    <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ключ</th>
                    <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                    <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время</th>
                    <th className="table-header px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {keyRequests.map(request => (
                    <tr key={request.id}>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{request.key_name}</td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{request.user_name}</td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{new Date(request.request_time).toLocaleString()}</td>
                        <td className="table-cell px-4 py-2 whitespace-nowrap">
                        <button
                            className="button-confirm px-3 py-1 bg-blue-500 text-xs text-white rounded-md hover:bg-blue-600"
                            onClick={() => setSelectedRequest(request)}
                        >
                            Обработать
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {selectedRequest && (
              <div className="mt-4">
                 <KeyConfirmationForm request={selectedRequest} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4 flex-grow flex items-center justify-center">
            {error && error.includes("заявки") ? `Ошибка: ${error}` : 'Нет активных заявок'}
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <div className="flex space-x-6 mb-6">
        <div className="card bg-white p-7 rounded-lg shadow flex-1 min-h-[200px] flex flex-col">
          <h2 className="text-lg font-medium mb-6">Статистика ключей</h2>
          {isLoading ? (
            <div className="flex justify-center items-center flex-grow">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error && (error.includes("статистику") || error.includes("список")) ? (
             <div className="text-center text-red-500 py-4 flex-grow flex items-center justify-center">{error}</div>
          ) : (
            <div className="flex flex-col flex-grow justify-between">
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => openKeysModal('available')}
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{keyStats.available} Keys</div>
                    <div className="font-medium">В наличии</div>
                  </div>
                  <div className="ml-4 stat-icon p-3 bg-yellow-100 rounded-full">
                    <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"></path></svg>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => openKeysModal('issued')}
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{keyStats.issued} Keys</div>
                    <div className="font-medium">Выданы</div>
                  </div>
                  <div className="ml-4 stat-icon p-3 bg-blue-100 rounded-full">
                    <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 3.5 a1.5 1.5 0 0 1 3 0 v.5 a1 1 0 0 1 1 1 h3 a1 1 0 0 1 1 1 v3 a1 1 0 0 1 -1 1 h-.5 a1.5 1.5 0 0 0 0 3 h.5 a1 1 0 0 1 1 1 v3 a1 1 0 0 1 -1 1 h-3 a1 1 0 0 1 -1 -1 v-.5 a1.5 1.5 0 0 0 -3 0 v.5 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 v-3 a1 1 0 0 0 -1 -1 h-.5 a1.5 1.5 0 0 1 0 -3 H4 a1 1 0 0 1 -1 -1 V6 a1 1 0 0 1 1 -1 h3 a1 1 0 0 1 1 -1 v-.5 z"/>
                    </svg>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => openKeysModal('all')}
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{keyStats.total} Keys</div>
                    <div className="font-medium">Всего</div>
                  </div>
                  <div className="ml-4 stat-icon p-3 bg-green-100 rounded-full">
                    <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 18 a8 8 0 1 0 0 -16 8 8 0 0 0 0 16 zm3.707 -9.293 a1 1 0 0 0 -1.414 -1.414 L9 10.586 l-1.293 -1.293 a1 1 0 0 0 -1.414 1.414 l2 2 a1 1 0 0 0 1.414 0 l4 -4 z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {renderKeyRequestsBlock()}
      </div>
      {renderKeyHistoryBlock()}
      <KeysModal />
    </>
  );
};

export default HomePage;