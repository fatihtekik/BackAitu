import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
// Убедимся, что импорты Sidebar и Header удалены или закомментированы правильно
// import Sidebar from './Sidebar'; // Не нужен здесь при использовании Layout
// import Header from './Header';   // Не нужен здесь при использовании Layout

const HomePage = () => {
  const [keyStats, setKeyStats] = useState({
    total: 0,
    available: 0,
    issued: 0
  });
  const [keysList, setKeysList] = useState([]);
  const [keyHistory, setKeyHistory] = useState([]);
  const [keyRequests, setKeyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Общее состояние загрузки для статистики и списка ключей
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [error, setError] = useState(null); // Общее состояние ошибки
  // Удалены отдельные состояния ошибок (keyStatsError, keysListError и т.д.), используем общее `error`
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('all');
  const [confirmationComment, setConfirmationComment] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  // const [confirmationStatus, setConfirmationStatus] = useState(""); // Можно удалить, если не используется

  const API_URL = "http://localhost:5000";
  // const API_URL= "https://backaitu.onrender.com";

  useEffect(() => {
    // Функция для загрузки статистики ключей
    const fetchKeyStats = async () => {
      try {
        // setIsLoading(true); // Управляется общим isLoading в начале useEffect
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
        setError(prev => prev || "Не удалось загрузить статистику ключей"); // Устанавливаем ошибку, если еще не установлена
      } finally {
        // setIsLoading(false); // Управляется общим isLoading в конце useEffect
      }
    };

    // Функция для загрузки списка ключей
    const fetchKeysList = async () => {
      try {
        // setIsLoading(true);
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
      } finally {
        // setIsLoading(false);
      }
    };

    // Функция для загрузки истории ключей
    const fetchKeyHistory = async () => {
      try {
        setIsHistoryLoading(true);
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
        setIsHistoryLoading(false);
      }
    };

    // Функция для загрузки заявок на ключи
    const fetchKeyRequests = async () => {
      try {
        setIsRequestsLoading(true);
        const response = await fetch(`${API_URL}/key-requests`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.status === "success") {
          setKeyRequests(data.requests || []);
        } else {
          throw new Error(data.message || "Failed to fetch key requests");
        }
      } catch (err) {
        console.error("Error fetching key requests:", err);
        setError(prev => prev || "Не удалось загрузить заявки на ключи");
      } finally {
        setIsRequestsLoading(false);
      }
    };

    // Запускаем все загрузки параллельно и управляем общим состоянием загрузки
    const loadInitialData = async () => {
        setIsLoading(true);
        setError(null); // Сбрасываем ошибки перед загрузкой
        try {
            await Promise.all([
                fetchKeyStats(),
                fetchKeysList(),
                fetchKeyHistory(),
                fetchKeyRequests()
            ]);
        } catch (err) {
            // Ошибки уже обрабатываются в individual fetch функциях
            console.error("Error during initial data load:", err);
        } finally {
            setIsLoading(false); // Устанавливаем false после завершения всех запросов
        }
    };

    loadInitialData();

  }, []); // Пустой массив зависимостей

  const openKeysModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const filteredKeys = () => {
    if (!keysList || !Array.isArray(keysList)) return [];
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
          {/* Используем общий isLoading для модального окна тоже, т.к. оно зависит от keysList */}
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
              {/* Показываем ошибку, если она есть, иначе "Ключи не найдены" */}
              {error ? `Ошибка загрузки: ${error}` : 'Ключи не найдены'}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Компонент для формы подтверждения
  const KeyConfirmationForm = ({ request }) => {
    if (!request) return null;

    // TODO: Реализовать логику отправки запроса на бэкенд
    const handleKeyRequest = async (id, status, comment) => {
      console.log(`Handling request ${id}: status=${status}, comment=${comment}`);
      setConfirmationStatus("processing"); // Показываем индикатор обработки
      try {
        const response = await fetch(`${API_URL}/process-key-request/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, comment }) // Отправляем статус и комментарий
        });
        const data = await response.json();
        if (!response.ok || data.status !== 'success') {
          throw new Error(data.message || `Failed to process request ${id}`);
        }
        // Успешно обработано
        console.log("Request processed successfully:", data);
        setSelectedRequest(null); // Закрываем форму
        setConfirmationComment(''); // Очищаем комментарий
        // Обновляем список заявок, чтобы убрать обработанную
        setKeyRequests(prev => prev.filter(req => req.id !== id));
        // TODO: Возможно, нужно обновить и историю, и статистику ключей
        // fetchKeyHistory();
        // fetchKeyStats();
        // fetchKeysList();
      } catch (err) {
        console.error("Error processing key request:", err);
        setError(`Ошибка обработки заявки: ${err.message}`); // Показываем ошибку
      } finally {
        setConfirmationStatus(""); // Убираем индикатор обработки
      }
    };


    return (
      <div className="key-approval-item mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="key-approval-details flex justify-between items-start">
          <div>
            <h4 className="font-medium">Подтверждение: {request.key_name}</h4>
            <p className="text-sm text-gray-600">Пользователь: {request.user_name}</p>
            <p className="text-sm text-gray-600">Запрос от: {request.request_time}</p>
          </div>
          <div className="status-badge badge-pending px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Ожидает</div>
        </div>

        <div className="mt-3">
          <textarea
            className="comment-field w-full p-2 border rounded text-sm"
            placeholder="Комментарий (опционально)..."
            value={confirmationComment}
            onChange={(e) => setConfirmationComment(e.target.value)}
            rows="2"
          ></textarea>
        </div>

        <div className="key-approval-actions mt-3 flex flex-wrap gap-2"> {/* Используем flex-wrap и gap */}
          {/* Кнопки действий */}
          <button
            className="approval-button hold-button flex items-center px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 disabled:opacity-50"
            onClick={() => handleKeyRequest(request.id, 'on_hold', confirmationComment)}
            disabled={confirmationStatus === "processing"}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            На удержание
          </button>
          <button
            className="approval-button verify-button flex items-center px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => handleKeyRequest(request.id, 'pending_verification', confirmationComment)}
            disabled={confirmationStatus === "processing"}
          >
             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            На проверку
          </button>
          <button
            className="approval-button reject-button flex items-center px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
            onClick={() => handleKeyRequest(request.id, 'rejected', confirmationComment)}
            disabled={confirmationStatus === "processing"}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            Отказать
          </button>
          <button
            className="approval-button approve-button flex items-center px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
            onClick={() => handleKeyRequest(request.id, 'approved', confirmationComment)}
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


  // Блок истории ключей
  const renderKeyHistoryBlock = () => {
    return (
      <div className="key-history-container mt-6 bg-white p-7 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-6">История ключей</h2>
        <div className="key-history-header grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm font-medium text-gray-500">Ключ / Пользователь</div>
          <div className="text-sm font-medium text-gray-500 text-right">Действие / Время</div>
        </div>
        {isHistoryLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : keyHistory.length > 0 ? (
          <div className="key-history-list space-y-3">
            {keyHistory.map(item => (
              <div className="key-history-item grid grid-cols-2 gap-4 items-center border-b pb-3 last:border-b-0" key={item.id}> {/* Убрали границу у последнего элемента */}
                <div className="key-history-key-info">
                  <div className="key-history-key-name font-medium">{item.key_name}</div>
                  <div className="key-history-username text-sm text-gray-600">{item.user_name}</div>
                </div>
                <div className="key-history-user-info text-right">
                  <span className={`key-history-status px-2 py-1 rounded text-xs ${
                      item.action === "выдан" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700" // Пример стилизации
                    }`}>
                    {item.action}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{item.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            {error && error.includes("историю") ? `Ошибка: ${error}` : 'История отсутствует'}
          </div>
        )}
      </div>
    );
  };

  // Блок заявок на ключи
  const renderKeyRequestsBlock = () => {
    return (
      <div className="card bg-white p-7 rounded-lg shadow flex-1 min-h-[200px] flex flex-col"> {/* Увеличил min-h */}
        <h2 className="text-lg font-medium mb-6">Подтверждение заявок</h2>
        {isRequestsLoading ? (
          <div className="flex justify-center items-center flex-grow"> {/* Центрирование загрузчика */}
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : keyRequests.length > 0 ? (
          <div className="overflow-x-auto flex-grow flex flex-col"> {/* Заполнение доступного пространства */}
             <div className="flex-grow"> {/* Контейнер для таблицы */}
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
                        <td className="table-cell px-4 py-2 whitespace-nowrap text-sm">{request.request_time}</td>
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
            {/* Форма подтверждения появляется под таблицей */}
            {selectedRequest && (
              <div className="mt-4"> {/* Отступ сверху для формы */}
                 <KeyConfirmationForm request={selectedRequest} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4 flex-grow flex items-center justify-center"> {/* Центрирование текста */}
            {error && error.includes("заявки") ? `Ошибка: ${error}` : 'Нет активных заявок'}
          </div>
        )}
      </div>
    );
  };


  // Основной рендер компонента HomePage (без Sidebar и Header)
  return (
    <>
      {/* Верхняя часть: Статистика и Заявки */}
      {/* Changed flex-col lg:flex-row lg:space-x-10 to flex space-x-6 */}
      <div className="flex space-x-6 mb-6">
        {/* Блок статистики */}
        {/* Removed mb-6 lg:mb-0 */}
        <div className="card bg-white p-7 rounded-lg shadow flex-1 min-h-[200px] flex flex-col">
          <h2 className="text-lg font-medium mb-6">Статистика ключей</h2>
          {isLoading ? (
            <div className="flex justify-center items-center flex-grow">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error && (error.includes("статистику") || error.includes("список")) ? ( // Показываем ошибку, если она связана со статистикой или списком
             <div className="text-center text-red-500 py-4 flex-grow flex items-center justify-center">{error}</div>
          ) : (
            <div className="flex flex-col flex-grow justify-between">
              <div className="space-y-4">
                {/* Available */}
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
                {/* Issued */}
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => openKeysModal('issued')}
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{keyStats.issued} Keys</div>
                    <div className="font-medium">Выданы</div>
                  </div>
                  <div className="ml-4 stat-icon p-3 bg-blue-100 rounded-full">
                    <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"></path></svg>
                  </div>
                </div>
                {/* Total */}
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => openKeysModal('all')}
                >
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">{keyStats.total} Keys</div>
                    <div className="font-medium">Всего</div>
                  </div>
                  <div className="ml-4 stat-icon p-3 bg-green-100 rounded-full">
                    <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Блок заявок */}
        {renderKeyRequestsBlock()}
      </div>

      {/* Нижняя часть: История */}
      {renderKeyHistoryBlock()}

      {/* Модальное окно */}
      <KeysModal />
    </>
  );
};

export default HomePage;