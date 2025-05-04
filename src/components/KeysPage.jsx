import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './KeysPage.css';
import '../styles/HomePage.css';

const getStatusInfo = (action) => {
    const normalizedAction = action?.toLowerCase();
    switch (normalizedAction) {
        case 'request':
        case 'запрос':
            return { text: 'Запрос', className: 'bg-yellow-100 text-yellow-700' };
        case 'return':
        case 'returned':
        case 'сдан':
        case 'вернул':
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
        case 'transfer':
            return { text: 'Передан', className: 'bg-blue-100 text-blue-700' };
        default:
            return { text: action || 'Неизвестно', className: 'bg-gray-100 text-gray-700' };
    }
};

function KeysPage() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [keyFilter, setKeyFilter] = useState(''); // Add the missing keyFilter state
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [actionFilter, setActionFilter] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            const Url = 'https://backaitu.onrender.com/';
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(Url+'/key-history');
                if (response.data.status === 'success') {
                    const parsedData = response.data.history.map(item => {
                        const [datePart, timePart] = item.timestamp.split(' ');
                        const [day, month, year] = datePart.split('.');
                        const [hour, minute] = timePart.split(':');
                        return { ...item, timestampDate: new Date(year, month - 1, day, hour, minute) };
                    });
                    setHistoryData(parsedData);
                } else {
                    setError('Не удалось загрузить историю');
                }
            } catch (err) {
                setError(`Ошибка при загрузке истории: ${err.message}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = useMemo(() => {
        return historyData.filter(item => {
            const nameMatch = !nameFilter || item.user_name.toLowerCase().includes(nameFilter.toLowerCase());
            const keyMatch = !keyFilter || item.key_name.toLowerCase().includes(keyFilter.toLowerCase());
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
            }

            const dateMatch = (!startDate || item.timestampDate >= startDate) &&
                              (!endDate || item.timestampDate <= endDate);

            let actionMatch = actionFilter === 'all';
            if (!actionMatch) {
                const itemStatusInfo = getStatusInfo(item.action);
                actionMatch = (itemStatusInfo.text.toLowerCase() === actionFilter.toLowerCase());
            }

            return nameMatch && keyMatch && dateMatch && actionMatch;
        });
    }, [historyData, nameFilter, keyFilter, startDateFilter, endDateFilter, actionFilter]);

    const handleSelectRow = (id) => {
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

        XLSX.writeFile(workbook, 'История_Ключей_Выбранное.xlsx');
    };

    const actionOptions = useMemo(() => {
        const uniqueActions = new Set();
        historyData.forEach(item => {
            const statusInfo = getStatusInfo(item.action);
            uniqueActions.add(statusInfo.text);
        });
        return Array.from(uniqueActions).sort();
    }, [historyData]);

    return (
        <div className="keys-page-container" style={{ padding: "12px" }}>
            <h2 style={{ padding: "12px" }}>История операций с ключами</h2>

            {error && <p className="error-message" style={{ padding: "12px" }}>{error}</p>}

            <div className="filters" style={{ padding: "12px" }}>
                <input
                    type="text"
                    placeholder="Фильтр по ФИО"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Фильтр по ключу"
                    value={keyFilter}
                    onChange={(e) => setKeyFilter(e.target.value)}
                />
                <label>
                    С:
                    <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                    />
                </label>
                <label>
                    По:
                    <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                    />
                </label>
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                    <option value="all">Все действия</option>
                    {actionOptions.map(action => (
                        <option key={action} value={action}>{action}</option>
                    ))}
                </select>
                <button onClick={handleExport} disabled={selectedRows.size === 0}>
                    Экспорт выбранных ({selectedRows.size})
                </button>
            </div>

            {loading ? (
                <p style={{ padding: "12px" }}>Загрузка истории...</p>
            ) : (
                <div className="history-table-container" style={{ padding: "12px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ padding: "12px" }}>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        disabled={filteredHistory.length === 0}
                                    />
                                </th>
                                <th style={{ padding: "12px" }}>№</th>
                                <th style={{ padding: "12px" }}>Ключ</th>
                                <th style={{ padding: "12px" }}>Пользователь (ФИО)</th>
                                <th style={{ padding: "12px" }}>Статус</th>
                                <th style={{ padding: "12px" }}>Время</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map(item => {
                                    const statusInfo = getStatusInfo(item.action);
                                    return (
                                        <tr key={item.id}>
                                            <td style={{ padding: "12px" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.has(item.id)}
                                                    onChange={() => handleSelectRow(item.id)}
                                                />
                                            </td>
                                            <td style={{ padding: "12px" }}>{item.id}</td>
                                            <td style={{ padding: "12px" }}>{item.key_name}</td>
                                            <td style={{ padding: "12px" }}>{item.user_name}</td>
                                            <td style={{ padding: "12px" }}>
                                                <span className={`status-badge ${statusInfo.className}`} style={{ padding: "2px 8px", borderRadius: "9999px", marginLeft: "12px" }}>
                                                    {statusInfo.text}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px" }}>{item.timestamp}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: "12px" }}>Нет данных для отображения</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default KeysPage;
