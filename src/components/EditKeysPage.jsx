import React, { useState, useEffect } from 'react';
import { API_URL as BASE } from "../config";
import './EditKeysPage.css';

const EditKeyModal = ({ keys, allCategories, onClose, onSave, isLoading }) => {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [error, setError] = useState('');
    
    // Determine if we're editing a single key or multiple keys
    const isBulkEdit = Array.isArray(keys) && keys.length > 1;
    const singleKey = !isBulkEdit ? keys : null;
    
    useEffect(() => {
        if (isBulkEdit) {
            // In bulk mode, start with common categories across all selected keys
            const commonCategories = findCommonCategories(keys);
            setSelectedCategoryIds(commonCategories.map(cat => cat.id));
        } else if (singleKey) {
            // Single key mode - use its categories
            setSelectedCategoryIds(singleKey.categories?.map(cat => cat.id) || []);
        }
        setError('');
    }, [keys, isBulkEdit, singleKey]);

    // Find categories common to all selected keys
    const findCommonCategories = (keysArray) => {
        if (!keysArray || keysArray.length === 0) return [];
        
        // Extract category IDs from each key
        const categoryIdSets = keysArray.map(key => 
            new Set(key.categories?.map(cat => cat.id) || []));
        
        // Find intersection of all sets
        const commonIds = [...categoryIdSets[0]].filter(id => 
            categoryIdSets.every(set => set.has(id)));
            
        // Return category objects for common IDs
        return allCategories.filter(cat => commonIds.includes(cat.id));
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
        try {
            if (isBulkEdit) {
                const keyIds = keys.map(key => key.id);
                await onSave(keyIds, { category_ids: selectedCategoryIds, bulkEdit: true });
            } else if (singleKey) {
                await onSave(singleKey.id, { category_ids: selectedCategoryIds });
            }
        } catch (err) {
            setError(err.message || 'Не удалось обновить категории ключа.');
        }
    };

    if ((!isBulkEdit && !singleKey) || (isBulkEdit && (!keys || keys.length === 0))) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-key-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-info">
                        <h3>
                            {isBulkEdit 
                                ? `Редактировать категории` 
                                : `Редактировать ключ`
                            }
                        </h3>
                        <p>
                            {isBulkEdit 
                                ? `${keys.length} выбранных ключей` 
                                : singleKey.key_name
                            }
                        </p>
                    </div>
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
                    
                    {isBulkEdit && (
                        <div className="bulk-edit-info">
                            <div className="info-icon">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <h4>Групповое редактирование</h4>
                                <p>Изменения будут применены ко всем выбранным ключам. Отмеченные категории - общие для всех ключей.</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="categories-section">
                        <div className="section-header">
                            <label className="section-title">Категории доступа</label>
                            <button
                                type="button"
                                onClick={toggleSelectAll}
                                className="btn btn-ghost btn-sm"
                            >
                                {selectedCategoryIds.length === allCategories.length ? 'Снять все' : 'Выбрать все'}
                            </button>
                        </div>
                        
                        <div className="categories-grid">
                            {allCategories.map((category, index) => {
                                const colors = [
                                    { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' },
                                    { bg: '#f3e5f5', border: '#9c27b0', text: '#7b1fa2' },
                                    { bg: '#e8f5e8', border: '#4caf50', text: '#388e3c' },
                                    { bg: '#fff3e0', border: '#ff9800', text: '#f57c00' },
                                    { bg: '#fce4ec', border: '#e91e63', text: '#c2185b' }
                                ];
                                const colorScheme = colors[index % colors.length];
                                
                                return (
                                    <label key={category.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px',
                                        margin: '8px 0',
                                        border: `2px solid ${colorScheme.border}`,
                                        borderRadius: '8px',
                                        backgroundColor: colorScheme.bg,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategoryIds.includes(category.id)}
                                            onChange={() => handleCategoryChange(category.id)}
                                            style={{
                                                marginRight: '12px',
                                                width: '18px',
                                                height: '18px'
                                            }}
                                        />
                                        <div style={{
                                            marginRight: '8px',
                                            width: '20px',
                                            height: '20px',
                                            color: colorScheme.text
                                        }}>
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                            </svg>
                                        </div>
                                        <span style={{
                                            fontSize: '16px',
                                            color: colorScheme.text,
                                            fontWeight: '600',
                                            fontFamily: 'system-ui, -apple-system, sans-serif'
                                        }}>
                                            {category.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        
                        {allCategories.length === 0 && (
                            <div className="empty-categories">
                                <div className="empty-icon">📝</div>
                                <p>Категории не найдены</p>
                                <span>Создайте категории в разделе "Категории пользователей"</span>
                            </div>
                        )}
                        
                        <div className="selection-summary">
                            Выбрано категорий: <strong>{selectedCategoryIds.length}</strong> из {allCategories.length}
                        </div>
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

function EditKeysPage() {
    const [keys, setKeys] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [editingKey, setEditingKey] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [keysResponse, categoriesResponse] = await Promise.all([
                fetch(`${BASE}/keys`),
                fetch(`${BASE}/categories`)
            ]);

            if (!keysResponse.ok || !categoriesResponse.ok) {
                throw new Error('Ошибка загрузки данных');
            }

            const keysData = await keysResponse.json();
            const categoriesData = await categoriesResponse.json();

            // Извлекаем массивы из ответа сервера
            let keys = keysData;
            if (keysData && typeof keysData === 'object' && !Array.isArray(keysData)) {
                keys = keysData.keys || keysData.data || keysData;
            }
            
            let categories = categoriesData;
            if (categoriesData && typeof categoriesData === 'object' && !Array.isArray(categoriesData)) {
                categories = categoriesData.categories || categoriesData.data || categoriesData;
            }

            setKeys(Array.isArray(keys) ? keys : []);
            setCategories(Array.isArray(categories) ? categories : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveKey = async (keyId, keyData) => {
        try {
            setIsLoading(true);
            
            if (keyData.bulkEdit) {
                // Bulk update
                const response = await fetch(`${BASE}/keys/bulk-update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key_ids: keyId, // Actually an array in bulk mode
                        category_ids: keyData.category_ids
                    }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка массового обновления ключей');
                }
            } else {
                // Single update
                const response = await fetch(`${BASE}/keys/${keyId}/categories`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(keyData),
                });

                if (!response.ok) {
                    throw new Error('Ошибка обновления ключа');
                }
            }

            await fetchData();
            setEditingKey(null);
            setSelectedKeys(new Set());
        } catch (err) {
            throw new Error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectKey = (keyId) => {
        setSelectedKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(keyId)) {
                newSet.delete(keyId);
            } else {
                newSet.add(keyId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedKeys(new Set(filteredKeys.map(key => key.id)));
        } else {
            setSelectedKeys(new Set());
        }
    };

    const handleBulkEdit = () => {
        const selectedKeysArray = filteredKeys.filter(key => selectedKeys.has(key.id));
        setEditingKey(selectedKeysArray);
    };

    const filteredKeys = Array.isArray(keys) ? keys.filter(key => {
        const nameMatch = key.key_name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = categoryFilter === 'all' || 
            key.categories?.some(cat => cat.id === parseInt(categoryFilter));
        return nameMatch && categoryMatch;
    }) : [];

    const isAllSelected = filteredKeys.length > 0 && selectedKeys.size === filteredKeys.length;

    if (loading) {
        return (
            <div className="edit-keys-page-modern">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка ключей...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-keys-page-modern">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Ошибка загрузки</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchData}>
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-keys-page-modern">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>Редактор ключей</h1>
                        <p>Управление категориями доступа к ключам</p>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={handleBulkEdit}
                            disabled={selectedKeys.size === 0}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Редактировать ({selectedKeys.size})
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section card">
                <div className="filters-header">
                    <h3>Фильтры и поиск</h3>
                    <div className="filters-info">
                        Найдено: <strong>{filteredKeys.length}</strong> из {Array.isArray(keys) ? keys.length : 0} ключей
                    </div>
                </div>
                
                <div className="filters-grid">
                    <div className="filter-group">
                        <label className="label">Поиск по названию</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Введите название ключа..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label className="label">Категория</label>
                        <select
                            className="input"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Все категории</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Keys Table */}
            <div className="keys-section card">
                <div className="table-header">
                    <div className="selection-controls">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <span className="selection-text">
                            {selectedKeys.size > 0 ? `Выбрано: ${selectedKeys.size}` : 'Выбрать все'}
                        </span>
                    </div>
                    
                    {selectedKeys.size > 0 && (
                        <div className="bulk-actions">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setSelectedKeys(new Set())}
                            >
                                Отменить выбор
                            </button>
                        </div>
                    )}
                </div>

                <div className="table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col"></th>
                                <th>Название ключа</th>
                                <th>Категории</th>
                                <th>Пользователи</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKeys.map(key => {
                                const isSelected = selectedKeys.has(key.id);
                                
                                return (
                                    <tr key={key.id} className={isSelected ? 'selected' : ''}>
                                        <td className="checkbox-col">
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectKey(key.id)}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className="key-info">
                                                <div className="key-icon">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                                                    </svg>
                                                </div>
                                                <span className="key-name">{key.key_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                                {key.categories?.length > 0 ? (
                                                    key.categories.map(category => (
                                                        <span key={category.id} style={{
                                                            background: '#e3f2fd',
                                                            color: '#1976d2',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            fontWeight: '500'
                                                        }}>
                                                            {category.name || category.category || 'Без названия'}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{color: '#999', fontSize: '12px'}}>Нет категорий</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="users-count">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.847a4 4 0 11-8 0 4 4 0 018 0z"/>
                                                </svg>
                                                {key.user_count || 0}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => setEditingKey(key)}
                                                title="Редактировать"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {filteredKeys.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🔑</div>
                            <h3>Ключи не найдены</h3>
                            <p>Попробуйте изменить параметры фильтрации</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingKey && (
                <EditKeyModal
                    keys={editingKey}
                    allCategories={categories}
                    onClose={() => setEditingKey(null)}
                    onSave={handleSaveKey}
                    isLoading={isLoading}
                />
            )}

        </div>
    );
}

export default EditKeysPage;
