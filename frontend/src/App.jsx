import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // Assure-toi que ce fichier existe

function App() {
  return (
    <Router>
      <Routes>
        {/* La route racine (/) affiche la Landing Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Les autres routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* L'espace utilisateur (à développer plus tard) */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;