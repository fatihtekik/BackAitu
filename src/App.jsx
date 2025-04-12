import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Если пользователь переходит на корневой URL, сразу редиректим на /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Страница логина */}
        <Route path="/login" element={<LoginPage />} />
        {/* Для всех несуществующих маршрутов также делаем редирект на страницу логина */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
