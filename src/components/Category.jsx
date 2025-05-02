import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Modal from './Modal';

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
    <Modal onClose={onClose}>
      <div className="key-modal-header" style={{ padding: "5px" }}>
        <h3 className="text-lg font-semibold" style={{ padding: "5px" }}>Редактировать категорию</h3>
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
        {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded" style={{ padding: "5px" }}>{error}</p>}
        <div style={{ padding: "5px" }}>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Название категории</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            style={{ padding: "8px" }}
            required
          />
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
    <Modal onClose={onClose}>
      <div className="key-modal-header" style={{ padding: "5px" }}>
        <h3 className="text-lg font-semibold" style={{ padding: "5px" }}>Новая категория</h3>
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
        {error && <p className="text-red-500 text-sm p-2 bg-red-50 rounded" style={{ padding: "5px" }}>{error}</p>}
        <div style={{ padding: "5px" }}>
          <label htmlFor="create-name" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Название категории</label>
          <input
            type="text"
            id="create-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            style={{ padding: "8px" }}
            required
          />
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
            {isLoading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "https://backaitu.onrender.com";
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "success") {
        setCategories(data.categories || []);
      } else {
        throw new Error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Не удалось загрузить список категорий: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateCategory = async (categoryId, categoryData) => {
    setIsUpdatingCategory(true);
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }
      if (data.status === "success") {
        setShowEditModal(false);
        setEditingCategory(null);
        await fetchCategories();
      } else {
        throw new Error(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error("Error updating category:", err);
      throw new Error(err.message || "Произошла ошибка при обновлении.");
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const createCategory = async (categoryData) => {
    setIsCreatingCategory(true);
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }
      if (data.status === "success") {
        setShowCreateModal(false);
        await fetchCategories();
      } else {
        throw new Error(data.message || "Failed to create category");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      throw new Error(err.message || "Произошла ошибка при создании.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Вы действительно хотите удалить эту категорию?')) {
      return;
    }
    
    setDeletingCategoryId(categoryId);
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }
      if (data.status === "success") {
        await fetchCategories();
        setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      } else {
        throw new Error(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Ошибка при удалении категории: " + err.message);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleSelectCategory = (categoryId, isChecked) => {
    if (isChecked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCategories(categories.map(category => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) return;
    
    if (!window.confirm(`Вы действительно хотите удалить ${selectedCategories.length} категорий?`)) {
      return;
    }
    
    setDeletingCategoryId('bulk');
    try {
      for (const categoryId of selectedCategories) {
        const response = await fetch(`${API_URL}/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || `Не удалось удалить категорию с ID: ${categoryId}`);
        }
      }
      await fetchCategories();
      setSelectedCategories([]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" style={{ padding: "5px" }}>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{ padding: "5px" }}>Категории</h1>
      
      <div className="mb-4 flex justify-between items-center" style={{ padding: "5px" }}>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedCategories.length === 0 || isLoading || deletingCategoryId === 'bulk'}
          className={`px-4 py-2 ${selectedCategories.length > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-md text-sm transition-colors shadow-sm border border-transparent`}
          style={{ padding: "8px 16px" }}
        >
          {deletingCategoryId === 'bulk' ? 'Удаление...' : `Удалить выбранные (${selectedCategories.length})`}
        </button>
        
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors shadow-sm border border-transparent"
          style={{ padding: "8px 16px" }}
        >
          Добавить категорию
        </button>
      </div>

      <div className="card bg-white shadow rounded-lg overflow-hidden" style={{ padding: "5px" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selectedCategories.length > 0 && selectedCategories.length === categories.length}
                    onChange={handleSelectAll}
                    disabled={isLoading || categories.length === 0}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                  Название
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-10">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-500">Загрузка...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-red-500 bg-red-50">{error}</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">Категории не найдены.</td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => handleSelectCategory(category.id, e.target.checked)}
                        disabled={deletingCategoryId === 'bulk'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ padding: "12px" }}>
                      {category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ padding: "12px" }}>
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ padding: "12px" }}>
                      <div className="flex" style={{ gap: "7px" }}>
                        <button
                          onClick={() => handleEditClick(category)}
                          disabled={deletingCategoryId === category.id}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors shadow-sm border border-blue-200"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          disabled={deletingCategoryId === category.id}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors shadow-sm border border-red-200"
                        >
                          {deletingCategoryId === category.id ? 'Удаление...' : 'Удалить'}
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

      {showEditModal && editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
          onSave={updateCategory}
          isLoading={isUpdatingCategory}
        />
      )}

      {showCreateModal && (
        <CreateCategoryModal
          onClose={handleCloseModal}
          onSave={createCategory}
          isLoading={isCreatingCategory}
        />
      )}
    </div>
  );
};

export default Category;