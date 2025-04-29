import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import KeysPage from './components/KeysPage.jsx';
import Layout from './components/Layout.jsx';
import UserPage from './components/UserPage.jsx';

function App() {
  const isAuthenticated = true;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/user-system" element={<UserPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/keys-history" element={<KeysPage />} />
          <Route path="/users" element={isAuthenticated ? <UserPage /> : <Navigate to="/login" />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
