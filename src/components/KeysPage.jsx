import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './KeysPage.css'; 

function KeysPage() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [actionFilter, setActionFilter] = useState('all'); // State for action filter

    // Fetch history data
    useEffect(() => {
        const fetchHistory = async () => {
            // const Url = 'http://localhost:5000/'; // Local server URL
            const Url = 'https://backaitu.onrender.com/'; // Production server URL
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(Url+'/key-history');
                if (response.data.status === 'success') {
                    const parsedData = response.data.history.map(item => {
                        const [datePart, timePart] = item.timestamp.split(' ');
                        const [day, month, year] = datePart.split('.');
                        const [hour, minute] = timePart.split(':');
                        // Note: month is 0-indexed in JS Date
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

    // Filtered data based on name, date range, and action
    const filteredHistory = useMemo(() => {
        return historyData.filter(item => {
            const nameMatch = !nameFilter || item.user_name.toLowerCase().includes(nameFilter.toLowerCase());
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;
            if (endDate) {
                endDate.setHours(23, 59, 59, 999); // Include the whole end day
            }

            const dateMatch = (!startDate || item.timestampDate >= startDate) &&
                              (!endDate || item.timestampDate <= endDate);

            // Action filter logic
            const actionMatch = actionFilter === 'all' || item.action === actionFilter;

            return nameMatch && dateMatch && actionMatch; // Include actionMatch
        });
    }, [historyData, nameFilter, startDateFilter, endDateFilter, actionFilter]); // Add actionFilter dependency

    // Handle row selction
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

    // Handle select all
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allIds = new Set(filteredHistory.map(item => item.id));
            setSelectedRows(allIds);
        } else {
            setSelectedRows(new Set());
        }
    };

    // Check if all currently filtered rows are selected
    const isAllSelected = filteredHistory.length > 0 && selectedRows.size === filteredHistory.length;

    // Handle export to Excel
    const handleExport = () => {
        if (selectedRows.size === 0) {
            alert('Пожалуйста, выберите строки для экспорта.');
            return;
        }

        const dataToExport = historyData
            .filter(item => selectedRows.has(item.id))
            .map(({ id, key_name, user_name, action, timestamp }) => ({ // Select and order columns for export
                'ID Записи': id,
                'Ключ': key_name,
                'Пользователь (ФИО)': user_name,
                'Действие': action,
                'Время': timestamp
            }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'История Ключей');

        // Set column widths (optional)
        const cols = [
            { wch: 10 }, // ID Записи
            { wch: 15 }, // Ключ
            { wch: 30 }, // Пользователь (ФИО)
            { wch: 15 }, // Действие
            { wch: 20 }  // Время
        ];
        worksheet['!cols'] = cols;

        XLSX.writeFile(workbook, 'История_Ключей_Выбранное.xlsx');
    };

    return (
        <div className="keys-page-container">
            <h2>История операций с ключами</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="filters">
                <input
                    type="text"
                    placeholder="Фильтр по ФИО"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
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
                {/* Action filter dropdown */}
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                    <option value="all">Все действия</option>
                    <option value="выдан">Выдан</option>
                    <option value="вернул">Вернул</option>
                    {/* Add other potential actions if needed */}
                </select>
                <button onClick={handleExport} disabled={selectedRows.size === 0}>
                    Экспорт выбранных ({selectedRows.size})
                </button>
            </div>

            {loading ? (
                <p>Загрузка истории...</p>
            ) : (
                <div className="history-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        disabled={filteredHistory.length === 0}
                                    />
                                </th>
                                <th>ID</th>
                                <th>Ключ</th>
                                <th>Пользователь (ФИО)</th>
                                <th>Действие</th>
                                <th>Время</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(item.id)}
                                                onChange={() => handleSelectRow(item.id)}
                                            />
                                        </td>
                                        <td>{item.id}</td>
                                        <td>{item.key_name}</td>
                                        <td>{item.user_name}</td>
                                        <td>{item.action}</td>
                                        <td>{item.timestamp}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">Нет данных для отображения</td>
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
