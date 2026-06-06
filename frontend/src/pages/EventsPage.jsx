import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, LogIn } from 'lucide-react';
import EventList from '../components/events/EventList';
import EventSearchBar from '../components/events/EventSearchBar';
import { eventApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);

  // Charger tous les événements au démarrage
  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const data = await eventApi.getAllEvents();
      setAllEvents(data);
      setEvents(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      // Utiliser la recherche côté frontend
      const filtered = await eventApi.searchEvents(filters);
      setEvents(filtered);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/events/edit/${id}`);
  };

  const handleRefresh = () => {
    loadAllEvents();
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary-600/20 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Smart Social Event Organizer
              </h1>
              <p className="text-slate-400 text-sm mt-1">Découvrez et participez aux événements</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/events/create')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-all shadow-lg shadow-primary-600/20"
              >
                <Plus className="w-5 h-5" />
                Créer un événement
              </button>
              {isAuthenticated ? (
                <>
                  <span className="text-slate-300 text-sm hidden md:inline">
                    Bonjour, <strong>{user.fullName || user.email}</strong>
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-dark-900 border border-slate-800 hover:border-red-500 hover:text-red-500 rounded-xl text-slate-300 font-semibold transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Déconnexion</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-dark-900 border border-slate-800 hover:border-primary-600 hover:text-primary-500 rounded-xl text-slate-300 font-semibold transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventSearchBar onSearch={handleSearch} />
        <EventList 
          events={events}
          onEventDeleted={handleRefresh}
          onEdit={handleEdit}
          currentUserId={user?.userId}
        />
      </main>
    </div>
  );
};

export default EventsPage;