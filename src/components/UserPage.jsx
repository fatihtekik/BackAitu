import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Modal from './Modal';
// Consider using a multi-select library like 'react-select' for better UX
// import Select from 'react-select'; 

const EditUserModal = ({ user, allCategories, onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        password: '',
        phone: user?.phone || '', // Add phone
    });
    // Initialize selected categories based on the user prop
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(user?.categories?.map(cat => cat.id) || []);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            password: '',
            phone: user?.phone || '', // Reset phone on user change
        });
        setSelectedCategoryIds(user?.categories?.map(cat => cat.id) || []); // Reset categories on user change
        setError('');
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for category checkbox changes
    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name) {
            setError('Имя пользователя не может быть пустым.');
            return;
        }
        if (!formData.phone) { // Validate phone
             setError('Телефон не может быть пустым.');
             return;
        }

        const updateData = { 
            name: formData.name,
            phone: formData.phone, // Include phone
            category_ids: selectedCategoryIds // Include selected category IDs
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
        <Modal onClose={onClose}>
            {/* ... existing modal header ... */}
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
                {/* Name Input */}
                <div style={{ padding: "5px" }}>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>ФИО</label>
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
                 {/* Phone Input */}
                 <div style={{ padding: "5px" }}>
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Телефон</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="+7 (xxx) xxx‑xx‑xx"
                        style={{ padding: "5px" }}
                        required
                    />
                </div>
                {/* Password Input */}
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
                {/* Category Selection */}
                <div style={{ padding: "5px" }}>
                     <label className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Категории</label>
                     <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                         {allCategories.length > 0 ? allCategories.map(cat => (
                             <div key={cat.id} className="flex items-center">
                                 <input
                                     type="checkbox"
                                     id={`cat-edit-${cat.id}`}
                                     checked={selectedCategoryIds.includes(cat.id)}
                                     onChange={() => handleCategoryChange(cat.id)}
                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                                 />
                                 <label htmlFor={`cat-edit-${cat.id}`} className="text-sm text-gray-700">{cat.name}</label>
                             </div>
                         )) : <p className="text-sm text-gray-500">Категории не загружены</p>}
                     </div>
                 </div>

                {/* ... existing form buttons ... */}
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

// ... (keep UserKeyHistoryModal and getStatusInfo as is) ...
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors shadow-sm border border-transparent"
                      style={{ padding: "8px 16px" }}
                  >
                      Закрыть
                  </button>
              </div>
          </Modal>
      );
  };
  
const CreateUserModal = ({ allCategories, onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({ name: '', password: '', phone: '' });
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for category checkbox changes
    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
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
        // Password might be optional, add validation if required
        // if (!formData.password) {
        //     setError('Пароль не может быть пустым.');
        //     return;
        // }

        const userData = {
            ...formData,
            category_ids: selectedCategoryIds // Include selected category IDs
        };

        try {
            await onSave(userData);
            // Optionally reset form fields here if modal stays open
            // setFormData({ name: '', password: '', phone: '' });
            // setSelectedCategoryIds([]);
        } catch (err) {
            setError(err.message || 'Не удалось создать пользователя.');
        }
    };

    return (
        <Modal onClose={onClose}>
            {/* ... existing modal header ... */}
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
                {/* Name Input */}
                <div style={{ padding: "5px" }}>
                    <label htmlFor="create-name" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>ФИО</label>
                    <input
                        type="text"
                        name="name"
                        id="create-name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        style={{ padding: "8px" }}
                        required
                    />
                </div>
                {/* Phone Input */}
                <div style={{ padding: "5px" }}>
                    <label htmlFor="create-phone" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Телефон</label>
                    <input
                        type="text"
                        name="phone"
                        id="create-phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        style={{ padding: "8px" }}
                        placeholder="+7 (xxx) xxx‑xx‑xx"
                        required
                    />
                </div>
                 {/* Password Input */}
                 <div style={{ padding: "5px" }}>
                    <label htmlFor="create-password" className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        id="create-password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        style={{ padding: "8px" }}
                        placeholder="******"
                        // required // Make password required if necessary
                    />
                </div>
                 {/* Category Selection */}
                 <div style={{ padding: "5px" }}>
                     <label className="text-sm font-medium text-gray-700 block mb-1" style={{ padding: "5px" }}>Категории</label>
                     <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                         {allCategories.length > 0 ? allCategories.map(cat => (
                             <div key={cat.id} className="flex items-center">
                                 <input
                                     type="checkbox"
                                     id={`cat-create-${cat.id}`}
                                     checked={selectedCategoryIds.includes(cat.id)}
                                     onChange={() => handleCategoryChange(cat.id)}
                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                                 />
                                 <label htmlFor={`cat-create-${cat.id}`} className="text-sm text-gray-700">{cat.name}</label>
                             </div>
                         )) : <p className="text-sm text-gray-500">Категории не загружены</p>}
                     </div>
                 </div>

                {/* ... existing form buttons ... */}
                 <div className="flex justify-end pt-4" style={{ padding: "5px", gap: "7px" }}>
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm transition-colors shadow-sm border border-gray-300" style={{ padding: "8px 16px" }}>Отмена</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm disabled:opacity-50 transition-colors shadow-sm border border-transparent" style={{ padding: "8px 16px" }}>
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
    
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allCategories, setAllCategories] = useState([]); // State for all categories

    // ... (existing states for modals, history, etc.) ...
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyUser, setHistoryUser] = useState(null);
    const [userKeyHistory, setUserKeyHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [modalError, setModalError] = useState(null); // Use this for modal-specific errors

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);


    const fetchUsers = async () => {
        // ... (existing fetchUsers logic is fine) ...
         setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === "success") {
                // Ensure categories are included and are arrays
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

    // Fetch all categories for dropdowns
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
            // Optionally set an error state here
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAllCategories(); // Fetch categories on component mount
    }, []);

    // ... (keep fetchUserKeyHistory as is) ...
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

    // updateUser now receives full userData including category_ids
    const updateUser = async (userId, userData) => {
        setIsUpdatingUser(true);
        // Clear previous modal errors when starting update
        // setModalError(null); // Handled inside the modal now
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), // Send all data including category_ids
            });
            const data = await response.json();
            if (!response.ok) {
                 // Throw error to be caught by the modal's handleSubmit
                 throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            if (data.status === "success") {
                setShowEditModal(false);
                setEditingUser(null);
                await fetchUsers(); // Refresh user list
            } else {
                 // Throw error to be caught by the modal's handleSubmit
                throw new Error(data.message || "Failed to update user");
            }
        } catch (err) {
            console.error("Error updating user:", err);
            // Re-throw the error so the modal can display it
            throw new Error(err.message || "Произошла ошибка при обновлении.");
        } finally {
            setIsUpdatingUser(false);
        }
    };

    // createUser now receives full userData including category_ids
    const createUser = async (userData) => {
        setIsCreatingUser(true);
        // Clear previous modal errors when starting creation
        // setModalError(null); // Handled inside the modal now
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), // Send all data including category_ids
            });
            const data = await response.json();
            if (!response.ok) {
                 // Throw error to be caught by the modal's handleSubmit
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            if (data.status === "success") {
                setShowCreateModal(false);
                await fetchUsers(); // Refresh user list
            } else {
                 // Throw error to be caught by the modal's handleSubmit
                throw new Error(data.message || "Failed to create user");
            }
        } catch (err) {
            console.error("Error creating user:", err);
             // Re-throw the error so the modal can display it
            throw new Error(err.message || "Произошла ошибка при создании.");
        } finally {
            setIsCreatingUser(false);
        }
    };

    // ... (keep selection handlers and deleteUser as is) ...
     // Add handler for selecting/deselecting all users
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    // Add handler for selecting/deselecting individual user
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
            // Delete users one by one
            for (const userId of selectedUsers) {
                const resp = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
                if (!resp.ok) {
                    const data = await resp.json().catch(() => ({}));
                    // Check for specific error related to foreign key constraints (e.g., user has history)
                    if (resp.status === 500 && data.message && data.message.includes('foreign key constraint')) {
                         throw new Error(`Не удалось удалить пользователя с ID: ${userId}. Возможно, у него есть история ключей или активные запросы.`);
                    }
                    throw new Error(data.message || `Не удалось удалить пользователя с ID: ${userId}`);
                }
            }
            // Refresh user list
            await fetchUsers();
            // Clear selection
            setSelectedUsers([]);
        } catch (err) {
            console.error(err);
            // Use modalError or a dedicated error state for delete errors
            setError(err.message); // Display error above the table
            // alert(err.message); // Avoid using alert for better UX
        } finally {
            setDeletingUserId(null);
        }
    };


    const handleEditClick = (user) => {
        setEditingUser(user);
        // setModalError(null); // Error handling is now within the modal
        setShowEditModal(true);
    };

    // ... (keep handleHistoryClick, handleCreateClick, handleCloseModal as is) ...
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
        setModalError(null); // Clear modal-specific errors on close
        setIsUpdatingUser(false);
        setShowCreateModal(false);
        setIsCreatingUser(false);
    };


    // Pass the functions directly to modals
    const handleSaveUser = async (userId, formData) => {
        await updateUser(userId, formData); // No need for intermediate function
    };

    const handleCreateUser = async (formData) => {
        await createUser(formData); // No need for intermediate function
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen" style={{ padding: "5px" }}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{ padding: "5px" }}>Пользователи</h1>
            
             {/* Display general errors above the buttons/table */}
             {error && <p className="mb-4 text-red-600 text-sm p-3 bg-red-100 rounded border border-red-300">{error}</p>}


            {/* ... (existing buttons: Delete Selected, Add User) ... */}
             <div className="mb-4 flex justify-between items-center" style={{ padding: "5px" }}>
                <button
                    onClick={deleteUser} // Changed from deleteUser to handleDeleteSelected
                    disabled={selectedUsers.length === 0 || isLoading || deletingUserId === 'bulk'}
                    className={`px-4 py-2 ${selectedUsers.length > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-md text-sm transition-colors shadow-sm border border-transparent`}
                    style={{ padding: "8px 16px" }}
                >
                    {deletingUserId === 'bulk' ? 'Удаление...' : `Удалить выбранных (${selectedUsers.length})`}
                </button>
                
                <button
                    onClick={handleCreateClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors shadow-sm border border-transparent"
                    style={{ padding: "8px 16px" }}
                >
                    Добавить пользователя
                </button>
            </div>


            <div className="card bg-white shadow rounded-lg overflow-hidden" style={{ padding: "5px" }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Checkbox column */}
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    <input 
                                        type="checkbox" 
                                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        checked={selectedUsers.length > 0 && selectedUsers.length === users.length}
                                        onChange={handleSelectAll}
                                        disabled={isLoading || users.length === 0}
                                    />
                                </th>
                                {/* User column */}
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Пользователь
                                </th>
                                {/* Status column */}
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Статус
                                </th>
                                 {/* Category column */}
                                 <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Категории
                                </th>
                                {/* Key column */}
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Ключ
                                </th>
                                {/* Phone column */}
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Телефон
                                </th>
                                {/* Actions column */}
                                <th scope="col" className="table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ padding: "12px" }}>
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10"> {/* Increased colspan */}
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            <span className="ml-3 text-gray-500">Загрузка...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? ( // Check users length after potential error display
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">Пользователи не найдены.</td> {/* Increased colspan */}
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        {/* Checkbox cell */}
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <input 
                                                type="checkbox" 
                                                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                                disabled={deletingUserId === 'bulk'}
                                            />
                                        </td>
                                        {/* User name cell */}
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        {/* Status cell */}
                                        <td className="table-cell px-6 py-4 whitespace-nowrap" style={{ padding: "12px" }}>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                user.status === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                         {/* Categories cell */}
                                         <td className="table-cell px-6 py-4 text-sm text-gray-500" style={{ padding: "12px", whiteSpace: 'normal' }}> {/* Allow wrapping */}
                                            {user.categories && user.categories.length > 0 
                                                ? user.categories.map(cat => cat.name).join(', ') 
                                                : 'Нет категорий'}
                                        </td>
                                        {/* Key cell */}
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ padding: "12px" }}>
                                            {user.key || 'Нет ключа'}
                                        </td>
                                        {/* Phone cell */}
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ padding: "12px" }}>
                                            {user.phone}
                                        </td>
                                        {/* Actions cell */}
                                        <td className="table-cell px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ padding: "12px" }}>
                                            <div className="flex" style={{ gap: "7px" }}>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    disabled={deletingUserId === 'bulk'}
                                                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors shadow-sm border border-blue-200"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() => handleHistoryClick(user)}
                                                    disabled={deletingUserId === 'bulk'}
                                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors shadow-sm border border-green-200"
                                                >
                                                    История
                                                </button>
                                                 {/* Add Delete button for single user if needed */}
                                                 {/* <button
                                                    onClick={() => deleteUser([user.id])} // Example: adapt deleteUser to handle single ID array
                                                    disabled={deletingUserId === user.id || deletingUserId === 'bulk'}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors shadow-sm border border-red-200"
                                                >
                                                    {deletingUserId === user.id ? 'Удаление...' : 'Удалить'}
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <EditUserModal
                    user={editingUser}
                    allCategories={allCategories} // Pass all categories
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    isLoading={isUpdatingUser}
                    // error={modalError} // Pass modal-specific error if needed
                />
            )}

            {/* User History Modal */}
            {showHistoryModal && historyUser && (
                <UserKeyHistoryModal
                    user={historyUser}
                    history={userKeyHistory}
                    isLoading={isHistoryLoading}
                    error={modalError} // Show history-fetch errors here
                    onClose={handleCloseModal}
                />
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    allCategories={allCategories} // Pass all categories
                    onClose={handleCloseModal}
                    onSave={handleCreateUser}
                    isLoading={isCreatingUser}
                     // error={modalError} // Pass modal-specific error if needed
                />
            )}
        </div>
    );
}

export default UserPage;