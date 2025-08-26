import React, { useState, useEffect } from 'react';
import { API_URL as BASE } from "../config";

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
      setCategories(data);
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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <span className="stat-value">{category.key_count || 0}</span>
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
                      {category.user_count || 0} пользователей • {category.key_count || 0} ключей
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

      <style jsx>{`
        .category-page-modern {
          min-height: 100vh;
          background: transparent;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
          text-align: center;
        }

        .error-icon {
          font-size: 48px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .header-title h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-title p {
          color: #64748b;
          margin: 0;
          font-size: 16px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .view-toggle {
          display: flex;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          padding: 4px;
        }

        .view-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn:hover {
          color: #3b82f6;
        }

        .view-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-section {
          margin-bottom: 24px;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 400px;
          margin-bottom: 12px;
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
          padding: 12px 12px 12px 40px;
          padding-right: 40px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          color: #334155;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-clear {
          position: absolute;
          right: 8px;
          padding: 4px;
          border: none;
          background: none;
          color: #64748b;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .search-clear:hover {
          color: #374151;
          background: rgba(248, 250, 252, 0.8);
        }

        .search-results {
          font-size: 14px;
          color: #64748b;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .category-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .category-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
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
        }

        .edit-btn:hover {
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
          background: rgba(59, 130, 246, 0.05);
        }

        .delete-btn:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .card-body {
          margin-bottom: 16px;
        }

        .category-name {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .category-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #334155;
        }

        .card-footer {
          padding-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.4);
        }

        .created-date {
          font-size: 12px;
          color: #64748b;
        }

        .categories-list {
          overflow: hidden;
        }

        .list-container {
          display: flex;
          flex-direction: column;
        }

        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4);
          transition: background-color 0.2s ease;
        }

        .list-item:hover {
          background: rgba(248, 250, 252, 0.5);
        }

        .list-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-icon-small {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .item-details .category-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .category-meta {
          font-size: 12px;
          color: #64748b;
        }

        .item-actions {
          display: flex;
          gap: 8px;
        }

        .empty-state {
          text-align: center;
          padding: 64px 32px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          margin: 0 0 20px 0;
          font-size: 14px;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .modal-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(248, 250, 252, 0.8);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(241, 245, 249, 1);
          border-color: #cbd5e1;
          color: #475569;
        }

        .modal-form {
          padding: 20px;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .search-container {
            max-width: 100%;
          }

          .modal-content {
            margin: 0;
            border-radius: 16px 16px 0 0;
            max-height: 80vh;
          }
        }
      `}</style>
    </div>
  );
}

export default Category;
