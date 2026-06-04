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
import { StatsProvider } from './context/StatsContext';
import Moderation from './pages/admin/Moderation';
import AdminProfile from "./pages/admin/AdminProfile";


function App() {
  return (
    <StatsProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/events/edit/:id" element={<EditEventPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/admin/users" element={<UserManagement />} />
         <Route path="/admin/events" element={<EventManagement />} />
         <Route path="/admin/stats" element={<Statistics />} />
         <Route path="/recommendations" element={<UserRecommendations />} />
        <Route path="/admin/moderation" element={<Moderation />} />
        <Route path="/admin/profile" element={<AdminProfile />} />



      </Routes>
    </Router>
    </StatsProvider>
  );
}

export default App;