import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailPage from './pages/EventDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import EventManagement from './pages/admin/EventManagement';
import Statistics from './pages/admin/Statistics';
import UserRecommendations from './pages/UserRecommendations';
import Moderation from './pages/admin/Moderation';
import AdminProfile from './pages/admin/AdminProfile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './components/auth/RequireAuth';
import RequireAdmin from './components/auth/RequireAdmin';
import { StatsProvider } from './context/StatsContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <StatsProvider>
        <Router>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Default landing */}
            <Route path="/" element={<Navigate to="/events" />} />

            {/* Public event browsing — anyone can see events */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Authenticated user routes — need to be logged in */}
            <Route path="/events/create" element={
              <RequireAuth><CreateEventPage /></RequireAuth>
            } />
            <Route path="/events/edit/:id" element={
              <RequireAuth><EditEventPage /></RequireAuth>
            } />
            <Route path="/recommendations" element={
              <RequireAuth><UserRecommendations /></RequireAuth>
            } />

            {/* Admin-only routes */}
            <Route path="/admin" element={
              <RequireAdmin><AdminDashboard /></RequireAdmin>
            } />
            <Route path="/admin/users" element={
              <RequireAdmin><UserManagement /></RequireAdmin>
            } />
            <Route path="/admin/events" element={
              <RequireAdmin><EventManagement /></RequireAdmin>
            } />
            <Route path="/admin/stats" element={
              <RequireAdmin><Statistics /></RequireAdmin>
            } />
            <Route path="/admin/moderation" element={
              <RequireAdmin><Moderation /></RequireAdmin>
            } />
            <Route path="/admin/profile" element={
              <RequireAdmin><AdminProfile /></RequireAdmin>
            } />
          </Routes>
        </Router>
      </StatsProvider>
    </AuthProvider>
  );
}

export default App;