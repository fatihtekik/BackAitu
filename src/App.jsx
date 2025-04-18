import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import KeysPage from './components/KeysPage.jsx';
import Layout from './components/Layout.jsx'; // Импорт Layout

function App() {
  // NOTE: Authentication logic needs update if not using localStorage
  // This is a placeholder - implement proper state management (Context, Zustand, etc.) // Assume logged in for layout example
  const isAuthenticated = true; // Replace with actual authentication check
  return (
    <Router>
      <Routes>
        {/* Маршруты, которые НЕ используют Layout (например, логин) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Маршруты, которые ИСПОЛЬЗУЮТ Layout */}
        <Route
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/keys-history" element={<KeysPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
