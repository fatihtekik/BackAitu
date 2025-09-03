// Функция для корректного парсинга даты в формате "DD.MM.YYYY HH:MM"
export const parseCustomDate = (dateString) => {
    if (!dateString) return new Date();
    try {
        const parts = dateString.split(' ');
        if (parts.length !== 2) return new Date();
        
        const dateParts = parts[0].split('.');
        const timeParts = parts[1].split(':');
        
        if (dateParts.length !== 3 || timeParts.length !== 2) return new Date();
        
        // Создаем дату: new Date(year, month-1, day, hour, minute)
        const date = new Date(
            parseInt(dateParts[2], 10), // year
            parseInt(dateParts[1], 10) - 1, // month (0-indexed)
            parseInt(dateParts[0], 10), // day
            parseInt(timeParts[0], 10), // hour
            parseInt(timeParts[1], 10)  // minute
        );
        
        return isNaN(date.getTime()) ? new Date() : date;
    } catch (err) {
        console.error("Error parsing date:", dateString, err);
        return new Date();
    }
};

// Функция для форматирования даты в локальный формат
export const formatCustomDate = (dateString) => {
    return parseCustomDate(dateString).toLocaleString('ru-RU');
};

// Функция для форматирования только даты
export const formatCustomDateOnly = (dateString) => {
    return parseCustomDate(dateString).toLocaleDateString('ru-RU');
};

// Функция для форматирования только времени
export const formatCustomTimeOnly = (dateString) => {
    return parseCustomDate(dateString).toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};
