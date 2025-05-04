import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Modal from './Modal';

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

    // Add a "select all" toggle function
    const toggleSelectAll = () => {
        if (selectedCategoryIds.length === allCategories.length) {
            // If all selected, deselect all
            setSelectedCategoryIds([]);
        } else {
            // Otherwise select all
            setSelectedCategoryIds(allCategories.map(cat => cat.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isBulkEdit) {
                // Bulk update mode
                const keyIds = keys.map(key => key.id);
                await onSave(keyIds, { category_ids: selectedCategoryIds, bulkEdit: true });
            } else if (singleKey) {
                // Single key update mode
                await onSave(singleKey.id, { category_ids: selectedCategoryIds });
            }
        } catch (err) {
            setError(err.message || 'Не удалось обновить категории ключа.');
        }
    };

    // Ensure we have a valid key or keys before rendering
    if ((!isBulkEdit && !singleKey) || (isBulkEdit && (!keys || keys.length === 0))) {
        return null;
    }

    return (
        <Modal onClose={onClose}>
            <div className="key-modal-header" style={{ padding: "5px" }}>
                <h3 className="text-lg font-semibold text-gray-900" style={{ padding: "5px" }}>
                    {isBulkEdit 
                        ? `Редактировать категории для ${keys.length} ключей` 
                        : `Редактировать категории ключа: ${singleKey.key_name}`
                    }
                </h3>
                <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={onClose}
                    style={{ padding: "5px" }}
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4" style={{ padding: "5px" }}>
                {error && (
                    <p className="text-red-500 text-sm p-2 bg-red-50 rounded" style={{ padding: "5px" }}>
                        {error}
                    </p>
                )}
                
                {/* Enhanced Category Selection with better spacing */}
                <div style={{ padding: "10px" }}>
                    <div className="flex justify-between items-center mb-2" style={{ padding: "5px" }}>
                        <label className="text-sm font-medium text-gray-700">Категории</label>
                        <button 
                            type="button" 
                            onClick={toggleSelectAll}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            {selectedCategoryIds.length === allCategories.length ? 'Снять всё' : 'Выбрать всё'}
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                        {allCategories.length > 0 ? allCategories.map(cat => (
                            <div 
                                key={cat.id} 
                                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                                    selectedCategoryIds.includes(cat.id) 
                                        ? 'bg-blue-50 border border-blue-200' 
                                        : 'hover:bg-gray-50 border border-transparent'
                                }`}
                                onClick={() => handleCategoryChange(cat.id)}
                            >
                                <input
                                    type="checkbox"
                                    id={`cat-key-${cat.id}`}
                                    checked={selectedCategoryIds.includes(cat.id)}
                                    onChange={() => {}} // Handling in the onClick of the parent div
                                    className="h-5 w-5 text-blue-600 border-gray-300 rounded mr-3"
                                    style={{ cursor: 'pointer' }}
                                />
                                <label 
                                    htmlFor={`cat-key-${cat.id}`} 
                                    className="text-sm text-gray-700 cursor-pointer w-full"
                                >
                                    {cat.name}
                                </label>
                            </div>
                        )) : <p className="text-sm text-gray-500 p-2">Категории не загружены</p>}
                    </div>
                    <div className="mt-3 text-xs text-gray-500 px-2">
                        Выбрано категорий: {selectedCategoryIds.length} из {allCategories.length}
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4" style={{ padding: "5px" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm transition-colors shadow-sm border border-gray-300"
                        disabled={isLoading}
                        style={{ padding: "8px 16px" }}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm disabled:opacity-50 transition-colors shadow-sm border border-transparent"
                        disabled={isLoading}
                        style={{ padding: "8px 16px" }}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const EditKeysPage = () => {
    const [keys, setKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const API_URL = "https://backaitu.onrender.com";

    // States for keys selection
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [isUpdatingKey, setIsUpdatingKey] = useState(false);

    // Fetch keys with categories
    const fetchKeys = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/keys-with-categories`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === "success") {
                // Ensure categories are included and are arrays
                const keysWithCategories = data.keys.map(k => {
                    // Set default "user" category if none exists
                    const categories = k.categories || [];
                    const hasUserCategory = categories.some(cat => cat.name === "user");
                    if (categories.length === 0 && !hasUserCategory) {
                        // Add "user" category by default (this will be handled on the backend)
                        // For display purposes, we'll show it here
                        categories.push({ id: -1, name: "user" });
                    }
                    return { ...k, categories };
                });
                setKeys(keysWithCategories || []);
            } else {
                throw new Error(data.message || "Failed to fetch keys");
            }
        } catch (err) {
            console.error("Error fetching keys:", err);
            setError("Не удалось загрузить список ключей: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all categories
    const fetchAllCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === "success") {
                // Check if "user" category exists
                const userCategory = data.categories.find(cat => cat.name === "user");
                let categoriesList = data.categories || [];
                
                // If no "user" category exists, we'll consider adding it
                if (!userCategory) {
                    console.log("User category not found, may need to create it");
                }
                
                setAllCategories(categoriesList);
            } else {
                console.error("Failed to fetch categories:", data.message);
            }
        } catch (err) {
            console.error("Error fetching all categories:", err);
            // Optionally set an error state here
        }
    };

    useEffect(() => {
        fetchKeys();
        fetchAllCategories();
    }, []);

    // Handle key selection
    const toggleKeySelection = (keyId) => {
        setSelectedKeys(prev => {
            if (prev.includes(keyId)) {
                return prev.filter(id => id !== keyId);
            } else {
                return [...prev, keyId];
            }
        });
    };

    // Handle select all keys
    const toggleSelectAllKeys = () => {
        if (selectAll || selectedKeys.length === filteredKeys.length) {
            // Deselect all
            setSelectedKeys([]);
            setSelectAll(false);
        } else {
            // Select all filtered keys
            setSelectedKeys(filteredKeys.map(key => key.id));
            setSelectAll(true);
        }
    };

    // Update key categories - now handles both single and bulk operations
    const updateKeyCategories = async (keyId, categoryData) => {
        setIsUpdatingKey(true);
        try {
            if (categoryData.bulkEdit) {
                // Bulk update mode
                const keyIds = Array.isArray(keyId) ? keyId : [keyId];
                
                // Make multiple calls to update each key
                const updatePromises = keyIds.map(id => 
                    fetch(`${API_URL}/keys/${id}/categories`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ category_ids: categoryData.category_ids })
                    })
                );
                
                const responses = await Promise.all(updatePromises);
                
                // Check if any request failed
                const failedRequests = responses.filter(res => !res.ok);
                if (failedRequests.length > 0) {
                    throw new Error(`${failedRequests.length} из ${responses.length} обновлений не удались`);
                }
                
                setShowEditModal(false);
                setEditingKey(null);
                setSelectedKeys([]);
                setSelectAll(false);
                await fetchKeys(); // Refresh key list
            } else {
                // Single key update mode
                const response = await fetch(`${API_URL}/keys/${keyId}/categories`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ category_ids: categoryData.category_ids }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || `HTTP error! Status: ${response.status}`);
                }
                
                if (data.status === "success") {
                    setShowEditModal(false);
                    setEditingKey(null);
                    await fetchKeys(); // Refresh key list
                } else {
                    throw new Error(data.message || "Failed to update key categories");
                }
            }
        } catch (err) {
            console.error("Error updating key categories:", err);
            throw new Error(err.message || "Произошла ошибка при обновлении категорий.");
        } finally {
            setIsUpdatingKey(false);
        }
    };

    const handleEditClick = (key) => {
        setEditingKey(key);
        setShowEditModal(true);
    };
    
    const handleBulkEditClick = () => {
        // Get the selected keys objects
        const keysToEdit = keys.filter(key => selectedKeys.includes(key.id));
        setEditingKey(keysToEdit);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditingKey(null);
        setIsUpdatingKey(false);
    };

    // Filtering logic
    const filteredKeys = keys.filter(key => {
        let matchesSearch = true;
        let matchesCategory = true;
        
        if (searchQuery) {
            matchesSearch = key.key_name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        if (selectedCategoryFilter !== 'all') {
            matchesCategory = key.categories.some(cat => cat.id === parseInt(selectedCategoryFilter));
        }
        
        return matchesSearch && matchesCategory;
    });

    // Format categories for display
    const formatCategories = (categories) => {
        if (!categories || categories.length === 0) return 'Нет категорий';
        return categories.map(cat => cat.name).join(', ');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen" style={{ padding: "5px" }}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{ padding: "5px" }}>
                Управление категориями ключей
            </h1>
            
            {/* Display general errors */}
            {error && <p className="mb-4 text-red-600 text-sm p-3 bg-red-100 rounded border border-red-300">{error}</p>}
            
            {/* Search, filter controls and bulk action button */}
            <div className="mb-6 flex flex-wrap gap-4 items-end justify-between" style={{ padding: "5px" }}>
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="min-w-[200px]">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Поиск ключа
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Введите номер ключа..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="min-w-[200px]">
                        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Фильтр по категории
                        </label>
                        <select
                            id="category-filter"
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="all">Все категории</option>
                            {allCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Bulk edit button */}
                {selectedKeys.length > 0 && (
                    <button
                        onClick={handleBulkEditClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none text-sm transition-colors shadow-sm border border-transparent"
                    >
                        Редактировать выбранные ({selectedKeys.length})
                    </button>
                )}
            </div>

            {/* Keys table */}
            <div className="card bg-white shadow rounded-lg overflow-hidden" style={{ padding: "5px" }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="table-header px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px", width: "40px" }}>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        checked={selectAll || (filteredKeys.length > 0 && selectedKeys.length === filteredKeys.length)}
                                        onChange={toggleSelectAllKeys}
                                        disabled={isLoading || filteredKeys.length === 0}
                                    />
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Ключ
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Статус
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Категории
                                </th>
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            <span className="ml-3 text-gray-500">Загрузка...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredKeys.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">
                                        {searchQuery || selectedCategoryFilter !== 'all' 
                                            ? 'Ключи не найдены по заданным критериям.' 
                                            : 'Ключи не найдены.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredKeys.map(key => (
                                    <tr 
                                        key={key.id}
                                        className={selectedKeys.includes(key.id) ? "bg-blue-50" : ""}
                                    >
                                        <td className="table-cell px-6 py-4 text-center" style={{ padding: "12px" }}>
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                checked={selectedKeys.includes(key.id)}
                                                onChange={() => toggleKeySelection(key.id)}
                                            />
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <div className="text-sm font-medium text-gray-900">
                                                {key.key_name}
                                            </div>
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                key.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {key.available ? 'Доступен' : 'Выдан'}
                                            </span>
                                        </td>
                                        <td className="table-cell px-6 py-4 text-sm text-gray-500" style={{ padding: "12px", whiteSpace: 'normal' }}>
                                            {formatCategories(key.categories)}
                                        </td>
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ padding: "12px" }}>
                                            <button
                                                onClick={() => handleEditClick(key)}
                                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors shadow-sm border border-blue-200"
                                            >
                                                Редактировать
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Key Categories Modal */}
            {showEditModal && editingKey && (
                <EditKeyModal
                    keys={editingKey}
                    allCategories={allCategories}
                    onClose={handleCloseModal}
                    onSave={updateKeyCategories}
                    isLoading={isUpdatingKey}
                />
            )}
        </div>
    );
};

export default EditKeysPage;
