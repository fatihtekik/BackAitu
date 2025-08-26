import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_URL as BASE } from "../config";
import * as XLSX from 'xlsx';

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
            const Url = BASE + '/history';
            try {
                setLoading(true);
                const response = await axios.get(Url);
                setHistoryData(response.data || []);
            } catch (err) {
                setError('Ошибка загрузки данных: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = useMemo(() => {
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
                        Найдено записей: <strong>{filteredHistory.length}</strong> из {historyData.length}
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

            <style jsx>{`
                .keys-page-modern {
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

                .filters-section {
                    margin-bottom: 24px;
                }

                .filters-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 0;
                }

                .filters-header h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .filter-summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid rgba(226, 232, 240, 0.6);
                }

                .results-count {
                    font-size: 14px;
                    color: #64748b;
                }

                .table-section {
                    overflow: hidden;
                }

                .table-container {
                    overflow-x: auto;
                }

                .modern-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .modern-table th {
                    background: rgba(248, 250, 252, 0.8);
                    color: #374151;
                    font-weight: 600;
                    padding: 12px 16px;
                    text-align: left;
                    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .modern-table td {
                    padding: 12px 16px;
                    border-bottom: 1px solid rgba(226, 232, 240, 0.4);
                    transition: background-color 0.2s ease;
                }

                .modern-table tr:hover td {
                    background: rgba(248, 250, 252, 0.5);
                }

                .modern-table tr.selected td {
                    background: rgba(59, 130, 246, 0.05);
                }

                .checkbox-container {
                    position: relative;
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                .checkbox-container input {
                    opacity: 0;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    cursor: pointer;
                }

                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border: 2px solid #cbd5e1;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }

                .checkbox-container input:checked ~ .checkmark {
                    background: #3b82f6;
                    border-color: #3b82f6;
                }

                .checkbox-container input:checked ~ .checkmark:after {
                    content: '';
                    position: absolute;
                    left: 4px;
                    top: 1px;
                    width: 4px;
                    height: 8px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .checkbox-col {
                    width: 40px;
                    text-align: center;
                }

                .id-col {
                    width: 60px;
                    font-weight: 500;
                    color: #64748b;
                }

                .key-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .key-name {
                    font-weight: 500;
                    color: #1e293b;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-avatar {
                    width: 28px;
                    height: 28px;
                    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 11px;
                    flex-shrink: 0;
                }

                .user-name {
                    font-weight: 500;
                    color: #334155;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .badge-icon {
                    font-size: 11px;
                }

                .time-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .date {
                    font-weight: 500;
                    color: #334155;
                    font-size: 13px;
                }

                .time {
                    font-size: 11px;
                    color: #64748b;
                }

                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                }

                .history-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    border-radius: 12px;
                    padding: 16px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .history-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .history-card.selected {
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.05);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .card-id {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 500;
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .card-key,
                .card-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .key-icon {
                    width: 32px;
                    height: 32px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .key-label,
                .user-label {
                    font-size: 11px;
                    color: #64748b;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }

                .card-footer {
                    padding-top: 12px;
                    border-top: 1px solid rgba(226, 232, 240, 0.4);
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
                    margin: 0;
                    font-size: 14px;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .header-content {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 16px;
                    }

                    .filters-grid {
                        grid-template-columns: 1fr;
                    }

                    .cards-grid {
                        grid-template-columns: 1fr;
                    }

                    .table-container {
                        border-radius: 8px;
                        overflow: hidden;
                    }
                }
            `}</style>
        </div>
    );
}

export default KeysPage;
