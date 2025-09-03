import React, { useState, useEffect, useMemo } from 'react';
import { API_URL as BASE } from "../config";
import './UserPage.css';
import Modal from './Modal';

// Функция для корректного парсинга даты в формате "DD.MM.YYYY HH:MM"
const parseCustomDate = (dateString) => {
    if (!dateString) return new Date();
    try {
        const parts = dateString.split(' ');
        if (parts.length !== 2) return new Date();
        
        const dateParts = parts[0].split('.');
        const timeParts = parts[1].split(':');
        
        if (dateParts.length !== 3 || timeParts.length !== 2) return new Date();
        
        // Создаем дату: new Date(year, month-1, day, hour, minute)
        const date = new Date(
            parseInt(dateParts[2], 10), // year
            parseInt(dateParts[1], 10) - 1, // month (0-indexed)
            parseInt(dateParts[0], 10), // day
            parseInt(timeParts[0], 10), // hour
            parseInt(timeParts[1], 10)  // minute
        );
        
        return isNaN(date.getTime()) ? new Date() : date;
    } catch (err) {
        console.error("Error parsing date:", dateString, err);
        return new Date();
    }
};

const EditUserModal = ({ user, allCategories, onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        password: '',
        phone: user?.phone || '',
        admin: user?.admin || false
    });
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(user?.categories?.map(cat => cat.id) || []);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            password: '',
            phone: user?.phone || '',
            admin: user?.admin || false
        });
        setSelectedCategoryIds(user?.categories?.map(cat => cat.id) || []);
        setError('');
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type==='checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCategoryIds.length === allCategories.length) {
            setSelectedCategoryIds([]);
        } else {
            setSelectedCategoryIds(allCategories.map(cat => cat.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name) {
            setError('Имя пользователя не может быть пустым.');
            return;
        }
        if (!formData.phone) {
             setError('Телефон не может быть пустым.');
             return;
        }

        if (selectedCategoryIds.length === 0) {
            setError('Выберите хотя бы одну категорию.');
            return;
        }

        const updateData = { 
            name: formData.name,
            phone: formData.phone,
            admin: formData.admin,
            category_ids: selectedCategoryIds
        };
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Редактировать пользователя</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    {error && (
                        <div className="error-message">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            {error}
                        </div>
                    )}
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Имя пользователя</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Введите имя..."
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="+7 (999) 999-99-99"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Новый пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Оставьте пустым, чтобы не изменять"
                            />
                        </div>
                        
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="admin"
                                    name="admin"
                                    checked={formData.admin}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <label htmlFor="admin" className="checkbox-label">
                                    Администратор
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="categories-section">
                        <div className="categories-header">
                            <label className="form-label">Категории доступа</label>
                            <button 
                                type="button" 
                                onClick={toggleSelectAll}
                                className="toggle-all-btn"
                            >
                                {selectedCategoryIds.length === allCategories.length ? 'Снять всё' : 'Выбрать всё'}
                            </button>
                        </div>
                        
                        <div className="categories-grid">
                            {allCategories.length > 0 ? allCategories.map(cat => (
                                <div 
                                    key={cat.id} 
                                    className={`category-item ${selectedCategoryIds.includes(cat.id) ? 'selected' : ''}`}
                                    onClick={() => handleCategoryChange(cat.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.includes(cat.id)}
                                        onChange={() => {}}
                                        className="category-checkbox"
                                    />
                                    <span className="category-name">{cat.name}</span>
                                </div>
                            )) : (
                                <div className="no-history">Категории не загружены</div>
                            )}
                        </div>
                        
                        {selectedCategoryIds.length > 0 && (
                            <div className="selection-summary">
                                Выбрано категорий: <strong>{selectedCategoryIds.length}</strong> из {allCategories.length}
                            </div>
                        )}
                    </div>
                    
                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

  const UserKeyHistoryModal = ({ user, history, isLoading, error, onClose }) => {
      if (!user) return null;
      
      const getStatusInfo = (action) => {
          switch (action?.toLowerCase()) {
              case 'return':
              case 'returned':
                  return { text: 'Сдан', className: 'status-returned' };
              case 'issue':
              case 'issued':
                  return { text: 'Выдан', className: 'status-issued' };
              case 'request':
                  return { text: 'Запрошен', className: 'status-requested' };
              default:
                  return { text: action || 'Неизвестно', className: 'status-requested' };
          }
      };
  
      return (
          <div className="modal-overlay" onClick={onClose}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                      <h3>История ключей: {user.name}</h3>
                      <button className="modal-close-btn" onClick={onClose}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                      </button>
                  </div>
                  
                  <div className="history-list">
                      {isLoading ? (
                          <div className="loading-container">
                              <div className="loading-spinner"></div>
                              <p>Загрузка истории...</p>
                          </div>
                      ) : error ? (
                          <div className="error-message">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                              </svg>
                              {error}
                          </div>
                      ) : history && history.length > 0 ? (
                          <div>
                              {history.map((item) => {
                                  const statusInfo = getStatusInfo(item.action);
                                  return (
                                      <div key={item.id || item.history_id} className="history-item">
                                          <div className="history-content">
                                              <div className="history-key">{item.key_name}</div>
                                              <span className={`history-status ${statusInfo.className}`}>
                                                  {statusInfo.text}
                                              </span>
                                          </div>
                                          <div className="history-time">
                                              {parseCustomDate(item.timestamp).toLocaleString('ru-RU')}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      ) : (
                          <div className="no-history">
                              История взаимодействий отсутствует
                          </div>
                      )}
                  </div>
                  
                  <div className="modal-actions">
                      <button
                          onClick={onClose}
                          className="btn btn-primary"
                      >
                          Закрыть
                      </button>
                  </div>
              </div>
          </div>
      );
  };

// CreateUserModal Component
const CreateUserModal = ({ allCategories, onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        categories: [],
        status: 'Active'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCategoryChange = (categoryId, checked) => {
        setFormData(prev => ({
            ...prev,
            categories: checked 
                ? [...prev.categories, categoryId]
                : prev.categories.filter(id => id !== categoryId)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large-modal">
                <div className="modal-header">
                    <h2>Создать пользователя</h2>
                    <button 
                        onClick={onClose}
                        disabled={isLoading}
                        className="modal-close-btn"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">ФИО*</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="form-input"
                                required
                                disabled={isLoading}
                                placeholder="Введите ФИО"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Телефон*</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="form-input"
                                required
                                disabled={isLoading}
                                placeholder="+7 (___) ___-__-__"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Пароль</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="form-input"
                                disabled={isLoading}
                                placeholder="Оставьте пустым для автогенерации"
                                autoComplete="new-password"
                            />
                            <small style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                                Если не указан, будет сгенерирован автоматически
                            </small>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Статус</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="form-select"
                                disabled={isLoading}
                            >
                                <option value="Active">Активный</option>
                                <option value="Admin">Администратор</option>
                                <option value="Inactive">Неактивный</option>
                            </select>
                        </div>

                        {allCategories.length > 0 && (
                            <div className="form-group full-width">
                                <label className="form-label">Категории доступа</label>
                                <div className="categories-grid">
                                    {allCategories.map(category => (
                                        <label key={category.id} className="category-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={formData.categories.includes(category.id)}
                                                onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                                disabled={isLoading}
                                            />
                                            <span className="checkbox-label">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <div className="modal-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn-secondary"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.name.trim() || !formData.phone.trim()}
                        className="btn-primary"
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Создание...
                            </>
                        ) : (
                            'Создать пользователя'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL= BASE;
    
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

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
    const [deletingUserId, setDeletingUserId] = useState(null);

    const [nameFilter, setNameFilter] = useState('');
    const filteredUsers = useMemo(
      () => users.filter(u => u.name.toLowerCase().includes(nameFilter.toLowerCase())),
      [users, nameFilter]
    );

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
                const usersWithCategories = data.users.map(u => ({ ...u, categories: u.categories || [] }));
                setUsers(usersWithCategories || []);
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

    const fetchAllCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === "success") {
                setAllCategories(data.categories || []);
            } else {
                console.error("Failed to fetch categories:", data.message);
            }
        } catch (err) {
            console.error("Error fetching all categories:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAllCategories();
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

     const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId, isChecked) => {
        if (isChecked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const deleteUser = async () => {
        if (selectedUsers.length === 0) return;
        
        if (!window.confirm(`Вы действительно хотите удалить ${selectedUsers.length} пользователей?`)) return;
        
        setDeletingUserId('bulk');
        try {
            for (const userId of selectedUsers) {
                const resp = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
                if (!resp.ok) {
                    const data = await resp.json().catch(() => ({}));
                    if (resp.status === 500 && data.message && data.message.includes('foreign key constraint')) {
                         throw new Error(`Не удалось удалить пользователя с ID: ${userId}. Возможно, у него есть история ключей или активные запросы.`);
                    }
                    throw new Error(data.message || `Не удалось удалить пользователя с ID: ${userId}`);
                }
            }
            await fetchUsers();
            setSelectedUsers([]);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setDeletingUserId(null);
        }
    };


    const handleEditClick = (user) => {
        setEditingUser(user);
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
        // Преобразуем формат данных для API
        const apiData = {
            name: formData.name,
            phone: formData.phone,
            password: formData.password,
            category_ids: formData.categories,
            admin: formData.status === 'Admin'
        };
        await createUser(apiData);
    };

    const formatCategories = (categories) => {
        if (!categories || categories.length === 0) return 'Нет категорий';
        return categories.map(cat => cat.name).join(', ');
    };

    if (isLoading) {
        return (
            <div className="user-page-modern">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка пользователей...</p>
                </div>
            </div>
        );
    }

    if (error && !users.length) {
        return (
            <div className="user-page-modern">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Ошибка загрузки</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchUsers}>
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="user-page-modern">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>Управление пользователями</h1>
                        <p>Создание, редактирование и управление доступом пользователей</p>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={handleCreateClick}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Добавить пользователя
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </div>
            )}

            {/* Search Section */}
            <div className="search-section card">
                <div className="search-container">
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Поиск по имени пользователя..."
                        value={nameFilter}
                        onChange={e => setNameFilter(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {selectedUsers.length > 0 && (
                <div className="card" style={{marginBottom: '24px', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <p style={{margin: 0, color: '#92400e', fontWeight: '600'}}>
                                Выбрано пользователей: {selectedUsers.length}
                            </p>
                            <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#92400e'}}>
                                При удалении пользователей удалится вся их история ключей
                            </p>
                        </div>
                        <button
                            onClick={deleteUser}
                            disabled={deletingUserId === 'bulk'}
                            className="btn btn-danger"
                        >
                            {deletingUserId === 'bulk' ? 'Удаление...' : 'Удалить выбранных'}
                        </button>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="users-section card">
                <div className="table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th style={{width: '40px'}}>
                                    <label className="checkbox-container">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedUsers(filteredUsers.map(u => u.id));
                                                } else {
                                                    setSelectedUsers([]);
                                                }
                                            }}
                                            disabled={filteredUsers.length === 0}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                                <th>Пользователь</th>
                                <th>Статус</th>
                                <th>Категории</th>
                                <th>Телефон</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => {
                                const isSelected = selectedUsers.includes(user.id);
                                
                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="user-details">
                                                    <div className="user-name">{user.name}</div>
                                                    <div className="user-phone">{user.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {user.admin && (
                                                <span className="admin-badge">Администратор</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="categories-list">
                                                {user.categories?.length > 0 ? (
                                                    user.categories.map(category => (
                                                        <span key={category.id} className="badge badge-info">
                                                            {category.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="no-categories">Нет категорий</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{fontSize: '14px', color: '#64748b'}}>
                                                {user.phone}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => handleHistoryClick(user)}
                                                    title="Просмотр истории"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="action-btn edit-btn"
                                                    onClick={() => handleEditClick(user)}
                                                    title="Редактировать"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {filteredUsers.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <h3>Пользователи не найдены</h3>
                            <p>Попробуйте изменить параметры поиска или добавить нового пользователя</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showEditModal && editingUser && (
                <EditUserModal
                    user={editingUser}
                    allCategories={allCategories}
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
                    allCategories={allCategories}
                    onClose={handleCloseModal}
                    onSave={handleCreateUser}
                    isLoading={isCreatingUser}
                />
            )}
        </div>
    );
};

export default UserPage;
