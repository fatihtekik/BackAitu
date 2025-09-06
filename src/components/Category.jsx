import React, { useState, useEffect } from 'react';
import { API_URL as BASE } from "../config";
import './Category.css';

const EditCategoryModal = ({ category, onClose, onSave, isLoading }) => {
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(category?.name || '');
    setError('');
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Название категории не может быть пустым');
      return;
    }

    try {
      await onSave(category.id, { name });
    } catch (err) {
      setError(err.message || 'Не удалось обновить категорию');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать категорию</h3>
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
          
          <div className="input-group">
            <label htmlFor="name" className="label">Название категории</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Введите название категории..."
              required
              autoFocus
            />
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
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateCategoryModal = ({ onClose, onSave, isLoading }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Название категории не может быть пустым');
      return;
    }

    try {
      await onSave({ name });
      setName('');
    } catch (err) {
      setError(err.message || 'Не удалось создать категорию');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Создать новую категорию</h3>
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
          
          <div className="input-group">
            <label htmlFor="name" className="label">Название категории</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Введите название категории..."
              required
              autoFocus
            />
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
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE}/categories`);
      if (!response.ok) {
        throw new Error('Ошибка загрузки категорий');
      }
      const data = await response.json();
      // Извлекаем массив из ответа сервера
      if (data && typeof data === 'object') {
        // Если данные в формате {categories: Array, status: 'success'} или подобном
        const categories = data.categories || data.data || data;
        setCategories(Array.isArray(categories) ? categories : []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryId, categoryData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления категории');
      }

      await fetchCategories();
      setEditingCategory(null);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания категории');
      }

      await fetchCategories();
      setShowCreateModal(false);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      const response = await fetch(`${BASE}/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления категории');
      }

      await fetchCategories();
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const filteredCategories = Array.isArray(categories) ? categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="category-page-modern">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page-modern">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchCategories}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page-modern">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Категории пользователей</h1>
            <p>Управление группами доступа к ключам</p>
          </div>
          <div className="header-actions">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Сетка"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Список"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </button>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Создать категорию
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск категорий..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
              title="Очистить поиск"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="search-results">
          Найдено: <strong>{filteredCategories.length}</strong> из {categories.length} категорий
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="categories-grid">
          {filteredCategories.map(category => (
            <div key={category.id} className="category-card">
              <div className="card-header">
                <div className="category-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div className="card-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => setEditingCategory(category)}
                    title="Редактировать"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="card-body">
                <h3 className="category-name">{category.name}</h3>
                <div className="category-stats">
                  <div className="stat">
                    <span className="stat-label">Пользователей</span>
                    <span className="stat-value">{category.user_count || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Ключей</span>
                    <span className="stat-value">{category.keys_count || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="created-date">
                  Создано: {new Date(category.created_at || Date.now()).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="categories-list card">
          <div className="list-container">
            {filteredCategories.map(category => (
              <div key={category.id} className="list-item">
                <div className="item-info">
                  <div className="category-icon-small">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div className="item-details">
                    <h4 className="category-name">{category.name}</h4>
                    <div className="category-meta">
                      {category.user_count || 0} пользователей • {category.keys_count || 0} ключей
                    </div>
                  </div>
                </div>
                
                <div className="item-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => setEditingCategory(category)}
                    title="Редактировать"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Категории не найдены</h3>
          <p>{searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Создайте первую категорию пользователей'}</p>
          {!searchTerm && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Создать категорию
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleSaveCategory}
          isLoading={isLoading}
        />
      )}

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCategory}
          isLoading={isLoading}
        />
      )}

    </div>
  );
}

export default Category;
