import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Modal from './Modal';

const EditUserModal = ({ user, onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        password: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            password: '',
        });
        setError('');
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name) {
            setError('Имя пользователя не может быть пустым.');
            return;
        }

        const updateData = { name: formData.name };
        if (formData.password) {
            updateData.password = formData.password;
        }

        try {
            await onSave(user.id, updateData);
        } catch (err) {
            setError(err.message || 'Не удалось обновить пользователя.');
        }
    };

    if (!user) return null;

    return (
        <Modal onClose={onClose}>
            <div className="key-modal-header" style={{ padding: "5px" }}>
                <h3 className="text-lg font-semibold text-gray-900" style={{ padding: "5px" }}>Редактировать пользователя</h3>
                <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={onClose}
                    style={{ padding: "5px" }}
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4" style={{ padding: "5px" }}>
                {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded" style={{ padding: "5px" }}>{error}</p>}
                <div style={{ padding: "5px" }}>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Логин (Имя)</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        style={{ padding: "5px" }}
                        required
                    />
                </div>
                <div style={{ padding: "5px" }}>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Новый пароль (оставьте пустым, чтобы не менять)</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="******"
                        style={{ padding: "5px" }}
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4" style={{ padding: "5px" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm transition-colors"
                        disabled={isLoading}
                        style={{ padding: "5px" }}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm disabled:opacity-50 transition-colors"
                        disabled={isLoading}
                        style={{ padding: "5px" }}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </Modal>
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
      default:
        return { text: action || 'Неизвестно', className: 'bg-gray-100 text-gray-700' };
    }
  };
  
  const UserKeyHistoryModal = ({ user, history, isLoading, error, onClose }) => {
      if (!user) return null;
  
      return (
          <Modal onClose={onClose}>
              <div className="key-modal-header" style={{ padding: "12px" }}>
                  <h3 className="text-lg font-semibold" style={{ padding: "12px" }}>История ключей: {user.name}</h3>
                  <button 
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={onClose}
                      style={{ padding: "12px" }}
                  >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto" style={{ padding: "12px" }}>
                  {isLoading ? (
                      <div className="flex justify-center items-center h-20">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                  ) : error ? (
                      <p className="text-red-500 text-center p-2 bg-red-50 rounded">{error}</p>
                  ) : history && history.length > 0 ? (
                      <ul className="space-y-3">
                          {history.map((item) => {
                              const statusInfo = getStatusInfo(item.action);
                              return (
                                  <li key={item.id || item.history_id} className="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center text-sm hover:bg-gray-100 transition-colors" style={{ padding: "12px" }}>
                                      <div>
                                          <span className="font-medium text-gray-800">{item.key_name}</span>
                                          <span className={`ml-4 px-2 py-0.5 rounded text-xs ${statusInfo.className}`}>
                                              {statusInfo.text}
                                          </span>
                                      </div>
                                      <span className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                                  </li>
                              );
                          })}
                      </ul>
                  ) : (
                      <p className="text-gray-500 text-center p-4">История взаимодействий отсутствует.</p>
                  )}
              </div>
              <div className="flex justify-end mt-4 pt-2 border-t border-gray-200" style={{ padding: "12px" }}>
                  <button
                      onClick={onClose}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                      style={{ padding: "12px" }}
                  >
                      Закрыть
                  </button>
              </div>
          </Modal>
      );
  };
  
const CreateUserModal = ({ onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name) {
            setError('Имя пользователя не может быть пустым.');
            return;
        }
        try {
            await onSave(formData);
        } catch (err) {
            setError(err.message || 'Не удалось создать пользователя.');
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="key-modal-header" style={{ padding: "5px" }}>
                <h3 className="text-lg font-semibold" style={{ padding: "5px" }}>Новый пользователь</h3>
                <button className="p-1 rounded-full hover:bg-gray-100" onClick={onClose} style={{ padding: "5px" }}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4" style={{ padding: "5px" }}>
                {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded" style={{ padding: "5px" }}>{error}</p>}
                <div style={{ padding: "5px" }}>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Логин</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        style={{ padding: "12px" }}
                        required
                    />
                </div>
                <div style={{ padding: "5px" }}>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="******"
                        style={{ padding: "12px" }}
                    />
                </div>
                <div className="flex justify-end pt-4" style={{ padding: "5px", gap: "7px" }}>
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm transition-colors">Отмена</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm disabled:opacity-50 transition-colors">
                        {isLoading ? 'Создание...' : 'Создать'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL= "https://backaitu.onrender.com";

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyUser, setHistoryUser] = useState(null);
    const [userKeyHistory, setUserKeyHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === "success") {
                setUsers(data.users || []);
            } else {
                throw new Error(data.message || "Failed to fetch users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Не удалось загрузить список пользователей: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUserKeyHistory = async (userId) => {
        setIsHistoryLoading(true);
        setModalError(null);
        setUserKeyHistory([]);
        try {
            const response = await fetch(`${API_URL}/users/${userId}/key-history?limit=5`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === "success") {
                setUserKeyHistory(data.history || []);
            } else {
                throw new Error(data.message || "Failed to fetch user key history");
            }
        } catch (err) {
            console.error("Error fetching user key history:", err);
            setModalError("Не удалось загрузить историю ключей: " + err.message);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    const updateUser = async (userId, userData) => {
        setIsUpdatingUser(true);
        setModalError(null);
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                 throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            if (data.status === "success") {
                setShowEditModal(false);
                setEditingUser(null);
                await fetchUsers();
            } else {
                throw new Error(data.message || "Failed to update user");
            }
        } catch (err) {
            console.error("Error updating user:", err);
            throw new Error(err.message || "Произошла ошибка при обновлении.");
        } finally {
            setIsUpdatingUser(false);
        }
    };

    const createUser = async (userData) => {
        setIsCreatingUser(true);
        setModalError(null);
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            if (data.status === "success") {
                setShowCreateModal(false);
                await fetchUsers();
            } else {
                throw new Error(data.message || "Failed to create user");
            }
        } catch (err) {
            console.error("Error creating user:", err);
            throw new Error(err.message || "Произошла ошибка при создании.");
        } finally {
            setIsCreatingUser(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setModalError(null);
        setShowEditModal(true);
    };

    const handleHistoryClick = (user) => {
        setHistoryUser(user);
        setShowHistoryModal(true);
        fetchUserKeyHistory(user.id);
    };

    const handleCreateClick = () => {
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditingUser(null);
        setShowHistoryModal(false);
        setHistoryUser(null);
        setUserKeyHistory([]);
        setModalError(null);
        setIsUpdatingUser(false);
        setShowCreateModal(false);
        setIsCreatingUser(false);
    };

    const handleSaveUser = async (userId, formData) => {
        await updateUser(userId, formData);
    };

    const handleCreateUser = async (formData) => {
        await createUser(formData);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen" style={{ padding: "5px" }}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{ padding: "5px" }}>Пользователи</h1>

            <div className="mb-4 text-right" style={{ padding: "5px" }}>
                <button
                    onClick={handleCreateClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                    style={{ padding: "5px" }}
                >
                    Добавить пользователя
                </button>
            </div>

            <div className="card bg-white shadow rounded-lg overflow-hidden" style={{ padding: "5px" }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Пользователь
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Статус
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Ключ
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Телефон
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            <span className="ml-3 text-gray-500">Загрузка...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-red-500 bg-red-50">{error}</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">Пользователи не найдены.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                user.status === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ padding: "12px" }}>
                                            {user.key || 'Нет ключа'}
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ padding: "12px" }}>
                                            {user.phone}
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ padding: "12px" }}>
                                            <div className="flex" style={{ gap: "7px" }}>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="text-blue-600 hover:text-blue-900 hover:underline transition-colors"
                                                    title="Редактировать"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() => handleHistoryClick(user)}
                                                    className="text-green-600 hover:text-green-900 hover:underline transition-colors"
                                                    title="История ключей"
                                                >
                                                    История
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showEditModal && editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    isLoading={isUpdatingUser}
                />
            )}

            {showHistoryModal && historyUser && (
                <UserKeyHistoryModal
                    user={historyUser}
                    history={userKeyHistory}
                    isLoading={isHistoryLoading}
                    error={modalError}
                    onClose={handleCloseModal}
                />
            )}

            {showCreateModal && (
                <CreateUserModal
                    onClose={handleCloseModal}
                    onSave={handleCreateUser}
                    isLoading={isCreatingUser}
                />
            )}
        </div>
    );
}

export default UserPage;