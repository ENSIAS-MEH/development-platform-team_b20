import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Calendar, UserCheck, Sparkles, MapPin,
  LogOut, ArrowRight, Mail, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    loadDashboard();
  }, [authLoading, isAuthenticated, user?.userId]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [created, joined] = await Promise.all([
        dashboardService.getEventsCreatedByUser(user.userId),
        dashboardService.getEventsJoinedByUser(user.userId),
      ]);
      setCreatedEvents(created);
      setJoinedEvents(joined);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-200">Mon Tableau de bord</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/events')}
              className="px-4 py-2 bg-dark-900 border border-slate-800 hover:border-primary-600 hover:text-primary-500 rounded-xl text-slate-300 text-sm font-semibold transition-all"
            >
              ← Retour aux événements
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-slate-800 hover:border-red-500 hover:text-red-500 rounded-xl text-slate-300 text-sm font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Section 1: Profile */}
        <ProfileSection user={user} />

        {/* Section 2: Recommendations link */}
        <RecommendationsLink onClick={() => navigate('/recommendations')} />

        {/* Section 3 + 4: Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventsSection
            title="Mes événements créés"
            icon={<Calendar className="w-5 h-5 text-primary-500" />}
            events={createdEvents}
            loading={loading}
            emptyMessage="Tu n'as pas encore créé d'événement."
            ctaLabel="Créer mon premier événement"
            ctaAction={() => navigate('/events/create')}
            onEventClick={(id) => navigate(`/events/${id}`)}
          />
          <EventsSection
            title="Événements rejoints"
            icon={<UserCheck className="w-5 h-5 text-primary-500" />}
            events={joinedEvents}
            loading={loading}
            emptyMessage="Tu n'as rejoint aucun événement pour l'instant."
            ctaLabel="Découvrir des événements"
            ctaAction={() => navigate('/events')}
            onEventClick={(id) => navigate(`/events/${id}`)}
          />
        </div>
      </main>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────────────────────────

const ProfileSection = ({ user }) => (
  <div className="glass-effect rounded-3xl p-6">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      {/* Avatar circle */}
      <div className="w-20 h-20 rounded-full bg-primary-600/20 text-primary-500 flex items-center justify-center flex-shrink-0">
        <User className="w-10 h-10" />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-slate-200 mb-3">
          {user.fullName || 'Utilisateur'}
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>
              Rôle :{' '}
              <span className={user.role === 'ADMIN' ? 'text-primary-500 font-semibold' : 'text-slate-300 font-semibold'}>
                {user.role}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RecommendationsLink = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full glass-effect rounded-3xl p-6 hover:border-primary-600/40 transition-all group text-left"
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-600/20 text-primary-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-200 mb-1">Recommandations pour toi</h3>
          <p className="text-slate-400 text-sm">Événements suggérés basés sur tes interactions.</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
    </div>
  </button>
);

const EventsSection = ({ title, icon, events, loading, emptyMessage, ctaLabel, ctaAction, onEventClick }) => (
  <div className="glass-effect rounded-3xl p-6">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-lg font-bold text-slate-200">
        {title} {!loading && `(${events.length})`}
      </h3>
    </div>

    {loading ? (
      <p className="text-slate-500 text-center py-8">Chargement...</p>
    ) : events.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-slate-400 mb-4">{emptyMessage}</p>
        <button
          onClick={ctaAction}
          className="text-primary-500 hover:text-primary-400 text-sm font-semibold transition-colors"
        >
          {ctaLabel} →
        </button>
      </div>
    ) : (
      <ul className="space-y-3">
        {events.map(event => (
          <li key={event.id}>
            <button
              onClick={() => onEventClick(event.id)}
              className="w-full text-left bg-dark-900 hover:bg-dark-900/80 border border-slate-800 hover:border-primary-600/40 rounded-xl p-4 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-200 group-hover:text-primary-500 transition-colors truncate">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.eventDate?.slice(0, 10)}
                    </span>
                  </div>
                </div>
                {event.category && (
                  <span className="px-2 py-1 bg-primary-600/10 text-primary-500 text-xs font-semibold rounded-full flex-shrink-0">
                    {event.category}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DashboardPage;