import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_URL as BASE } from "../config";
import * as XLSX from 'xlsx';
import './KeysPage.css';

const getStatusInfo = (action) => {
    const normalizedAction = action?.toLowerCase();
    switch (normalizedAction) {
        case 'request':
        case 'запрос':
            return { text: 'Запрос', variant: 'warning', icon: '⏳' };
        case 'return':
        case 'returned':
        case 'сдан':
        case 'вернул':
            return { text: 'Сдан', variant: 'success', icon: '✅' };
        case 'issue':
        case 'issued':
        case 'approved':
        case 'выдан':
            return { text: 'Выдан', variant: 'info', icon: '🔑' };
        case 'denied':
        case 'отказано':
            return { text: 'Отказано', variant: 'error', icon: '❌' };
        case 'pending':
        case 'ожидает':
            return { text: 'Ожидает', variant: 'warning', icon: '⏳' };
        case 'transfer':
            return { text: 'Передан', variant: 'info', icon: '🔄' };
        default:
            return { text: action || 'Неизвестно', variant: 'neutral', icon: '❓' };
    }
};

function KeysPage() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [keyFilter, setKeyFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [actionFilter, setActionFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

    useEffect(() => {
        const fetchHistory = async () => {
            const Url = BASE + '/key-history';
            try {
                setLoading(true);
                const response = await axios.get(Url);
                // Извлекаем массив из ответа сервера
                const data = response.data;
                if (data && typeof data === 'object') {
                    // Если данные в формате {history: Array, status: 'success'}
                    setHistoryData(Array.isArray(data.history) ? data.history : (Array.isArray(data) ? data : []));
                } else {
                    setHistoryData([]);
                }
            } catch (err) {
                setError('Ошибка загрузки данных: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = useMemo(() => {
        if (!Array.isArray(historyData)) {
            console.warn('historyData is not an array:', historyData);
            return [];
        }
        
        return historyData.filter(item => {
            const userName = item.user_name?.toLowerCase() || '';
            const keyName = item.key_name?.toLowerCase() || '';
            const nameMatch = nameFilter === '' || userName.includes(nameFilter.toLowerCase());
            const keyMatch = keyFilter === '' || keyName.includes(keyFilter.toLowerCase());
            
            let dateMatch = true;
            if (startDateFilter || endDateFilter) {
                const itemDate = new Date(item.timestamp);
                if (startDateFilter) {
                    const startDate = new Date(startDateFilter);
                    if (itemDate < startDate) dateMatch = false;
                }
                if (endDateFilter) {
                    const endDate = new Date(endDateFilter);
                    endDate.setHours(23, 59, 59, 999);
                    if (itemDate > endDate) dateMatch = false;
                }
            }

            const actionMatch = actionFilter === 'all' || 
                (item.action && item.action.toLowerCase().includes(actionFilter.toLowerCase()));

            return nameMatch && keyMatch && dateMatch && actionMatch;
        });
    }, [historyData, nameFilter, keyFilter, startDateFilter, endDateFilter, actionFilter]);

    const handleRowSelect = (id) => {
        setSelectedRows(prevSelectedRows => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(id)) {
                newSelectedRows.delete(id);
            } else {
                newSelectedRows.add(id);
            }
            return newSelectedRows;
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allIds = new Set(filteredHistory.map(item => item.id));
            setSelectedRows(allIds);
        } else {
            setSelectedRows(new Set());
        }
    };

    const isAllSelected = filteredHistory.length > 0 && selectedRows.size === filteredHistory.length;

    const handleExport = () => {
        if (selectedRows.size === 0) {
            alert('Пожалуйста, выберите строки для экспорта.');
            return;
        }

        if (!Array.isArray(historyData)) {
            alert('Ошибка: данные не загружены.');
            return;
        }

        const dataToExport = historyData
            .filter(item => selectedRows.has(item.id))
            .map(({ id, key_name, user_name, action, timestamp }) => ({
                '№ Записи': id,
                'Ключ': key_name,
                'Пользователь (ФИО)': user_name,
                'Статус': action,
                'Время': timestamp
            }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'История Ключей');

        const cols = [
            { wch: 10 },
            { wch: 15 },
            { wch: 30 },
            { wch: 15 },
            { wch: 20 }
        ];
        worksheet['!cols'] = cols;

        const filename = `история_ключей_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, filename);
    };

    const clearFilters = () => {
        setNameFilter('');
        setKeyFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
        setActionFilter('all');
        setSelectedRows(new Set());
    };

    if (loading) {
        return (
            <div className="keys-page-modern">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка истории ключей...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="keys-page-modern">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Ошибка загрузки</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="keys-page-modern">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>История ключей</h1>
                        <p>Журнал всех операций с ключами в системе</p>
                    </div>
                    <div className="header-actions">
                        <div className="view-toggle">
                            <button 
                                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                                title="Табличный вид"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 6h18m-9 8h9"/>
                                </svg>
                            </button>
                            <button 
                                className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                                onClick={() => setViewMode('cards')}
                                title="Карточный вид"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <button 
                            className="btn btn-primary"
                            onClick={handleExport}
                            disabled={selectedRows.size === 0}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            Экспорт ({selectedRows.size})
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section card">
                <div className="filters-header">
                    <h3>Фильтры</h3>
                    <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                        Очистить все
                    </button>
                </div>
                
                <div className="filters-grid">
                    <div className="filter-group">
                        <label className="label">Пользователь</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Поиск по имени..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label className="label">Ключ</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Поиск по ключу..."
                            value={keyFilter}
                            onChange={(e) => setKeyFilter(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label className="label">Статус</label>
                        <select
                            className="input"
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                        >
                            <option value="all">Все статусы</option>
                            <option value="запрос">Запрос</option>
                            <option value="выдан">Выдан</option>
                            <option value="сдан">Сдан</option>
                            <option value="отказано">Отказано</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label className="label">Дата с</label>
                        <input
                            type="date"
                            className="input"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label className="label">Дата по</label>
                        <input
                            type="date"
                            className="input"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="filter-summary">
                    <div className="results-count">
                        Найдено записей: <strong>{filteredHistory.length}</strong> из {Array.isArray(historyData) ? historyData.length : 0}
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'table' ? (
                <div className="table-section card">
                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th className="checkbox-col">
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </th>
                                    <th>№</th>
                                    <th>Ключ</th>
                                    <th>Пользователь</th>
                                    <th>Статус</th>
                                    <th>Время</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((item) => {
                                    const statusInfo = getStatusInfo(item.action);
                                    const isSelected = selectedRows.has(item.id);
                                    
                                    return (
                                        <tr key={item.id} className={isSelected ? 'selected' : ''}>
                                            <td className="checkbox-col">
                                                <label className="checkbox-container">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleRowSelect(item.id)}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="id-col">{item.id}</td>
                                            <td className="key-col">
                                                <div className="key-info">
                                                    <span className="key-name">{item.key_name}</span>
                                                </div>
                                            </td>
                                            <td className="user-col">
                                                <div className="user-info">
                                                    <div className="user-avatar">
                                                        {item.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                    <span className="user-name">{item.user_name}</span>
                                                </div>
                                            </td>
                                            <td className="status-col">
                                                <span className={`badge badge-${statusInfo.variant}`}>
                                                    <span className="badge-icon">{statusInfo.icon}</span>
                                                    {statusInfo.text}
                                                </span>
                                            </td>
                                            <td className="time-col">
                                                <div className="time-info">
                                                    <span className="date">
                                                        {new Date(item.timestamp).toLocaleDateString('ru-RU')}
                                                    </span>
                                                    <span className="time">
                                                        {new Date(item.timestamp).toLocaleTimeString('ru-RU', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {filteredHistory.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>Записи не найдены</h3>
                                <p>Попробуйте изменить параметры фильтрации</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="cards-section">
                    <div className="cards-grid">
                        {filteredHistory.map((item) => {
                            const statusInfo = getStatusInfo(item.action);
                            const isSelected = selectedRows.has(item.id);
                            
                            return (
                                <div key={item.id} className={`history-card ${isSelected ? 'selected' : ''}`}>
                                    <div className="card-header">
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleRowSelect(item.id)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <span className="card-id">#{item.id}</span>
                                        <span className={`badge badge-${statusInfo.variant}`}>
                                            <span className="badge-icon">{statusInfo.icon}</span>
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                    
                                    <div className="card-body">
                                        <div className="card-key">
                                            <div className="key-icon">🔑</div>
                                            <div>
                                                <div className="key-label">Ключ</div>
                                                <div className="key-name">{item.key_name}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="card-user">
                                            <div className="user-avatar">
                                                {item.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="user-label">Пользователь</div>
                                                <div className="user-name">{item.user_name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="card-footer">
                                        <div className="time-info">
                                            <div className="date">
                                                {new Date(item.timestamp).toLocaleDateString('ru-RU')}
                                            </div>
                                            <div className="time">
                                                {new Date(item.timestamp).toLocaleTimeString('ru-RU', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {filteredHistory.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>Записи не найдены</h3>
                            <p>Попробуйте изменить параметры фильтрации</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default KeysPage;
