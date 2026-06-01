import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailPage from './pages/EventDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/events/edit/:id" element={<EditEventPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;